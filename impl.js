/**
 * Madedown DSH — Host half.
 *
 * Owns the Markdown documents shown by the right-sidebar Madedown editor:
 * a list of document tabs (like Madedown's multi-tab notes), one active tab,
 * each persisted under `$DSH_HOME/madedown-dsh/documents.json`.
 *
 * The same service is exposed through three faces:
 * - the `madedown` agent tool (read / write / append / replace / list / select /
 *   create / open);
 * - same-origin HTTP routes for the browser editor (`/state`, `/doc`,
 *   `/update`, `/tabs`, `/export`, `/save-dialog`, `/update-check`, `/update-plugin`, `/open`, `/diag`);
 * - a system-prompt section listing the tabs and inlining the active document.
 *
 * `POST /export` is the user-facing "save to a local file" action: it writes
 * the active (or named) document as UTF-8 Markdown anywhere the user points it.
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const name = 'dsh-madedown';
export const inject = ['tools', 'webServer', 'systemPrompt'];

/** Route prefix owned by this plugin. */
const API = '/madedown-dsh';
/** Largest JSON body accepted from the browser editor (bytes). */
const MAX_BODY_BYTES = 8 * 1024 * 1024;
/** Largest image accepted from the browser editor (bytes). */
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
/** Accepted inline image MIME types and their stored extensions. */
const IMAGE_TYPES = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/svg+xml', 'svg'],
]);
/** How much of the active document is inlined into the system prompt. */
const MAX_PROMPT_CHARS = 6000;
const TOOL_NAME = 'madedown';
const TITLE_LIMIT = 200;

/**
 * Resolve the persisted documents path.
 * @returns absolute path of `documents.json`.
 */
function resolveDataFile() {
  const base = process.env.MADEDOWN_DSH_HOME;
  if (typeof base === 'string' && base.length > 0) return join(base, 'documents.json');
  const home = process.env.DSH_HOME;
  const root = typeof home === 'string' && home.length > 0 ? home : join(homedir(), '.dsh');
  return join(root, 'madedown-dsh', 'documents.json');
}

/** @returns a new document id. */
function newDocumentId() {
  return `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** @returns ISO timestamp. */
function now() {
  return new Date().toISOString();
}

/**
 * Clamp a title into a usable tab name.
 * @param value - candidate title.
 * @param fallback - title when the candidate is empty.
 * @returns trimmed title.
 */
function sanitizeTitle(value, fallback) {
  const title = typeof value === 'string' ? value.trim() : '';
  return (title.length > 0 ? title : fallback).slice(0, TITLE_LIMIT);
}

/**
 * Normalize one stored document.
 * @param value - parsed document object.
 * @param index - fallback title suffix.
 * @returns sanitized document.
 */
function sanitizeDocument(value, index) {
  const source = typeof value === 'object' && value !== null ? value : {};
  const timestamp = typeof source.updatedAt === 'string' ? source.updatedAt : now();
  return {
    id: typeof source.id === 'string' && source.id.length > 0 ? source.id : newDocumentId(),
    title: sanitizeTitle(source.title, `未命名笔记 ${index + 1}`),
    text: typeof source.text === 'string' ? source.text : '',
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : timestamp,
    updatedAt: timestamp,
    updatedBy: typeof source.updatedBy === 'string' ? source.updatedBy : 'system',
    rev: Number.isSafeInteger(source.rev) && source.rev >= 0 ? source.rev : 0,
    localPath: typeof source.localPath === 'string' && source.localPath.length > 0 ? source.localPath : null,
    localSavedAt: typeof source.localSavedAt === 'string' ? source.localSavedAt : null,
  };
}

/** @returns a fresh empty document. */
function emptyDocument(title) {
  const timestamp = now();
  return {
    id: newDocumentId(),
    title: sanitizeTitle(title, 'Madedown'),
    text: '',
    createdAt: timestamp,
    updatedAt: timestamp,
    updatedBy: 'system',
    rev: 0,
    localPath: null,
    localSavedAt: null,
  };
}

/**
 * Join `next` after `current` so appended blocks keep a blank-line boundary.
 * @param current - existing document text.
 * @param next - text to append.
 * @returns the combined text.
 */
function appendText(current, next) {
  const addition = String(next === undefined || next === null ? '' : next);
  if (addition.length === 0) return current;
  if (current.length === 0) return addition.endsWith('\n') ? addition : `${addition}\n`;
  let separator = '';
  if (!current.endsWith('\n')) separator = '\n\n';
  else if (!current.endsWith('\n\n')) separator = '\n';
  const tail = addition.endsWith('\n') ? addition : `${addition}\n`;
  return current + separator + tail;
}

/** @returns character/line/word counters for a document text. */
export function measureText(text) {
  const value = typeof text === 'string' ? text : '';
  const lines = value.length === 0 ? 0 : value.split('\n').length;
  const cjk = (value.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  const latin = (value.match(/[A-Za-z0-9_]+(?:['’-][A-Za-z0-9_]+)*/g) || []).length;
  return { chars: value.length, lines, words: cjk + latin };
}

/**
 * Build the initial store from disk, migrating the single-document format when
 * it is the only thing present.
 * @param filePath - `documents.json` path.
 * @param legacyPath - `document.json` path of the previous plugin version.
 * @returns store state.
 */
function loadState(filePath, legacyPath) {
  try {
    const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
    const documents = Array.isArray(parsed.documents) ? parsed.documents.map(sanitizeDocument) : [];
    const version = Number.isSafeInteger(parsed.version) && parsed.version >= 0 ? parsed.version : 0;
    if (documents.length === 0) documents.push(emptyDocument('Madedown'));
    const activeId = documents.some((document) => document.id === parsed.activeId) ? parsed.activeId : documents[0].id;
    return { version, activeId, documents };
  } catch {
    /* fall through to migration */
  }
  try {
    const legacy = JSON.parse(readFileSync(legacyPath, 'utf8'));
    const document = sanitizeDocument({
      title: typeof legacy.title === 'string' ? legacy.title : 'Madedown',
      text: typeof legacy.text === 'string' ? legacy.text : '',
      updatedAt: typeof legacy.updatedAt === 'string' ? legacy.updatedAt : now(),
      updatedBy: typeof legacy.updatedBy === 'string' ? legacy.updatedBy : 'system',
      rev: 0,
    }, 0);
    const version = Number.isSafeInteger(legacy.version) && legacy.version >= 0 ? legacy.version : 0;
    return { version, activeId: document.id, documents: [document] };
  } catch {
    const document = emptyDocument('Madedown');
    return { version: 0, activeId: document.id, documents: [document] };
  }
}

/**
 * Create the document-store service. Exported for tests and reuse.
 * @param filePath - absolute path of the backing JSON file.
 * @param legacyPath - optional path of the previous single-document file.
 * @returns the service face used by the tool and HTTP routes.
 */
export function createMadedownService(filePath, legacyPath = join(dirname(filePath), 'document.json')) {
  const state = loadState(filePath, legacyPath);
  const initialRevision = state.version;
  let openRequest = 0;
  let lastDiag = null;

  persist();

  function persist() {
    try {
      mkdirSync(dirname(filePath), { recursive: true });
      const payload = { version: state.version, activeId: state.activeId, documents: state.documents };
      const temporary = `${filePath}.tmp-${process.pid}`;
      writeFileSync(temporary, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
      renameSync(temporary, filePath);
      return true;
    } catch (error) {
      console.error(`madedown-dsh: could not persist ${filePath}:`, error);
      return false;
    }
  }

  function activeDocument() {
    return state.documents.find((document) => document.id === state.activeId) || state.documents[0];
  }

  /**
   * Find one document by id, exact/unique title, or unique title prefix.
   * @param reference - document id or title; omitted selects the active tab.
   * @returns the document, or undefined when absent.
   */
  function findDocument(reference) {
    if (reference === undefined || reference === null || (typeof reference === 'string' && reference.trim().length === 0)) {
      return activeDocument();
    }
    const value = String(reference).trim();
    const byId = state.documents.find((document) => document.id === value);
    if (byId) return byId;
    const lower = value.toLowerCase();
    const exact = state.documents.filter((document) => document.title.toLowerCase() === lower);
    if (exact.length === 1) return exact[0];
    const prefix = state.documents.filter((document) => document.title.toLowerCase().startsWith(lower));
    if (prefix.length === 1) return prefix[0];
    return undefined;
  }

  /** @returns one document as a tab summary. */
  function summarize(document) {
    const counters = measureText(document.text);
    return {
      id: document.id,
      title: document.title,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
      rev: document.rev,
      chars: counters.chars,
      lines: counters.lines,
      localPath: typeof document.localPath === 'string' ? document.localPath : null,
      localSavedAt: typeof document.localSavedAt === 'string' ? document.localSavedAt : null,
    };
  }

  /** @returns one document with full text, for the editor or the agent. */
  function documentPayload(document) {
    return {
      id: document.id,
      title: document.title,
      text: document.text,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
      rev: document.rev,
      ...measureText(document.text),
      localPath: typeof document.localPath === 'string' ? document.localPath : null,
      localSavedAt: typeof document.localSavedAt === 'string' ? document.localSavedAt : null,
    };
  }

  /** @returns the complete store snapshot the browser polls. */
  function snapshot() {
    const document = activeDocument();
    return {
      version: state.version,
      activeId: document.id,
      docs: state.documents.map(summarize),
      active: documentPayload(document),
      openRequest,
      dataFile: filePath,
    };
  }

  /**
   * Bump the global change counter and one document's revision, then persist.
   * @param document - document being written, when the write changes content.
   * @param updatedBy - attribution stored with the document.
   */
  function touch(document, updatedBy) {
    if (document) {
      document.rev = (Number.isSafeInteger(document.rev) ? document.rev : 0) + 1;
      document.updatedAt = now();
      document.updatedBy = updatedBy;
    }
    state.version = (Number.isSafeInteger(state.version) ? state.version : 0) + 1;
    persist();
  }

  /**
   * Write text into one document.
   * @param document - target document.
   * @param text - new text.
   * @param title - optional new title.
   * @param updatedBy - attribution.
   * @returns mutation result carrying the full snapshot.
   */
  function setDocumentContent(document, text, title, updatedBy) {
    const nextTitle = typeof title === 'string' && title.trim().length > 0
      ? sanitizeTitle(title, document.title)
      : document.title;
    const nextText = String(text === undefined || text === null ? '' : text);
    if (nextText === document.text && nextTitle === document.title) {
      return { ok: true, unchanged: true, document: documentPayload(document), state: snapshot() };
    }
    document.text = nextText;
    document.title = nextTitle;
    touch(document, updatedBy);
    return { ok: true, document: documentPayload(document), state: snapshot() };
  }

  /**
   * Apply one browser-side update. `replace` honours `baseRev` so a stale
   * editor cannot overwrite a concurrent tab change from the assistant.
   * @param input - docId, op, text, title, baseRev, force, source.
   * @returns result with the current snapshot.
   */
  function update(input) {
    const value = typeof input === 'object' && input !== null ? input : {};
    const document = findDocument(value.docId);
    if (!document) return { ok: false, error: 'document not found', state: snapshot() };
    const op = value.op === 'append' || value.op === 'prepend' ? value.op : 'replace';
    const text = typeof value.text === 'string' ? value.text : '';
    const title = typeof value.title === 'string' ? value.title : undefined;
    const source = value.source === 'selection' ? 'selection' : 'user';
    if (op === 'replace' && value.force !== true
      && Number.isSafeInteger(value.baseRev) && value.baseRev !== document.rev) {
      return { ok: false, conflict: true, docId: document.id, document: documentPayload(document), state: snapshot() };
    }
    if (text.length > MAX_BODY_BYTES) return { ok: false, error: 'document is too large', state: snapshot() };
    let nextText = text;
    if (op === 'append') nextText = appendText(document.text, text);
    else if (op === 'prepend') nextText = appendText(text, document.text);
    return setDocumentContent(document, nextText, title, source === 'selection' ? 'selection' : 'user');
  }

  /** Agent-side full write with a document reference. */
  function write(reference, text, title) {
    const document = findDocument(reference);
    if (!document) return { ok: false, error: 'document not found' };
    return { ...setDocumentContent(document, text, title, 'assistant'), documentId: document.id };
  }

  /** Agent-side append. */
  function append(reference, text, title) {
    const document = findDocument(reference);
    if (!document) return { ok: false, error: 'document not found' };
    return { ...setDocumentContent(document, appendText(document.text, text), title, 'assistant'), documentId: document.id };
  }

  /** Agent-side find/replace. */
  function replace(reference, find, replacement, all) {
    const document = findDocument(reference);
    if (!document) return { ok: false, error: 'document not found' };
    const needle = typeof find === 'string' ? find : '';
    if (needle.length === 0) return { ok: false, error: '`find` must be a non-empty string' };
    if (!document.text.includes(needle)) return { ok: false, error: '`find` does not occur in the document', documentId: document.id };
    const replacements = all === true ? document.text.split(needle).length - 1 : 1;
    const next = all === true
      ? document.text.split(needle).join(String(replacement === undefined || replacement === null ? '' : replacement))
      : document.text.replace(needle, String(replacement === undefined || replacement === null ? '' : replacement));
    return { ...setDocumentContent(document, next, undefined, 'assistant'), documentId: document.id, replacements };
  }

  /**
   * Read one document for the agent, with counters and the tab list.
   * @param reference - document id or title; omitted = active tab.
   */
  function read(reference) {
    const document = findDocument(reference);
    if (!document) return { ok: false, error: 'document not found', tabs: state.documents.map(summarize), activeId: state.activeId };
    const counters = measureText(document.text);
    return {
      ok: true,
      documentId: document.id,
      title: document.title,
      text: document.text,
      rev: document.rev,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
      chars: counters.chars,
      lines: counters.lines,
      words: counters.words,
      activeId: state.activeId,
      localPath: typeof document.localPath === 'string' ? document.localPath : null,
      localSavedAt: typeof document.localSavedAt === 'string' ? document.localSavedAt : null,
      tabs: state.documents.map(summarize),
      dataFile: filePath,
    };
  }

  /** @returns the tab list without document bodies. */
  function list() {
    return { ok: true, activeId: state.activeId, docs: state.documents.map(summarize), dataFile: filePath };
  }

  /**
   * Switch the visible tab.
   * @param reference - document id or title.
   */
  function select(reference) {
    const document = findDocument(reference);
    if (!document) return { ok: false, error: 'document not found', docs: state.documents.map(summarize) };
    if (document.id !== state.activeId) {
      state.activeId = document.id;
      state.version += 1;
      persist();
    }
    return { ok: true, document: documentPayload(document), state: snapshot() };
  }

  /**
   * Create a new tab and make it active.
   * @param input - optional title/text.
   */
  function create(input) {
    const value = typeof input === 'object' && input !== null ? input : {};
    const requested = sanitizeTitle(value.title, '');
    let index = state.documents.length + 1;
    let title = requested.length > 0 ? requested : `未命名笔记 ${index}`;
    while (state.documents.some((document) => document.title === title)) {
      index += 1;
      title = requested.length > 0 ? `${requested} ${index}` : `未命名笔记 ${index}`;
    }
    const document = emptyDocument(title);
    if (typeof value.text === 'string' && value.text.length > 0) {
      document.text = value.text;
      document.updatedBy = 'user';
    }
    state.documents.push(document);
    state.activeId = document.id;
    state.version += 1;
    persist();
    return { ok: true, document: documentPayload(document), state: snapshot() };
  }

  /**
   * Close one tab. Closing the last tab opens a fresh empty one.
   * @param reference - document id or title.
   */
  function close(reference) {
    const document = findDocument(reference);
    if (!document) return { ok: false, error: 'document not found', state: snapshot() };
    const index = state.documents.findIndex((entry) => entry.id === document.id);
    state.documents.splice(index, 1);
    if (state.documents.length === 0) state.documents.push(emptyDocument('Madedown'));
    const next = state.documents[Math.min(index, state.documents.length - 1)];
    state.activeId = next.id;
    state.version += 1;
    persist();
    return { ok: true, state: snapshot(), document: documentPayload(next) };
  }

  /** Ask the browser editor to reveal itself on its next poll. */
  function requestOpen() {
    openRequest += 1;
    return { ok: true, openRequest, state: snapshot() };
  }

  /** Remember the browser editor's latest self-report. */
  function recordDiag(payload) {
    lastDiag = {
      at: now(),
      client: typeof payload === 'object' && payload !== null ? payload : null,
    };
    return { ok: true };
  }

  /**
   * Resolve where a document should be exported.
   * @param inputPath - user path (`~` expanded) or empty for the default.
   * @param title - document title used for the default file name.
   * @returns absolute path ending in `.md`.
   */
  function resolveExportPath(inputPath, title) {
    const trimmed = typeof inputPath === 'string' ? inputPath.trim() : '';
    let target;
    if (trimmed.length === 0) {
      const safe = String(title || 'Madedown').replace(/[\\/:*?"<>|]/g, '-').trim() || 'Madedown';
      target = join(homedir(), 'Documents', `${safe}.md`);
    } else if (trimmed === '~' || /^~[\\/]/.test(trimmed)) {
      target = join(homedir(), trimmed.replace(/^~[\\/]?/, ''));
    } else {
      target = trimmed;
    }
    if (/[\\/]$/.test(target)) {
      const safe = String(title || 'Madedown').replace(/[\\/:*?"<>|]/g, '-').trim() || 'Madedown';
      target = join(target, `${safe}.md`);
    }
    if (extname(target).length === 0) target = `${target}.md`;
    return target;
  }

  /**
   * Save one document to a real local file. This is the user's "save to disk"
   * action from the editor header.
   * @param input - docId, path, dryRun.
   * @returns written path and bytes, or a dry-run path preview.
   */
  function exportDocument(input) {
    const value = typeof input === 'object' && input !== null ? input : {};
    const document = findDocument(value.docId);
    if (!document) return { ok: false, error: 'document not found' };
    const target = resolveExportPath(value.path, document.title);
    if (value.dryRun === true) {
      return { ok: true, dryRun: true, path: target, exists: existsSync(target), title: document.title };
    }
    try {
      mkdirSync(dirname(target), { recursive: true });
      const text = document.text.endsWith('\n') ? document.text : `${document.text}\n`;
      const existed = existsSync(target);
      writeFileSync(target, text, 'utf8');
      document.localPath = target;
      document.localSavedAt = now();
      state.version += 1;
      persist();
      return {
        ok: true,
        path: target,
        bytes: Buffer.byteLength(text),
        chars: text.length,
        overwrote: existed,
        title: document.title,
        documentId: document.id,
        localPath: target,
        localSavedAt: document.localSavedAt,
      };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error), path: target };
    }
  }

  const assetDir = join(dirname(filePath), 'assets');

  /**
   * Persist one image and return the URL the editor can render.
   * @param buffer - image bytes.
   * @param mediaType - declared image MIME type.
   * @returns `{url, name, bytes}` or `{ok:false, error}`.
   */
  function saveAsset(buffer, mediaType) {
    const type = String(mediaType || '').split(';')[0].trim().toLowerCase();
    const extension = IMAGE_TYPES.get(type);
    if (extension === undefined) return { ok: false, error: 'unsupported image type' };
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) return { ok: false, error: 'empty image' };
    if (buffer.length > MAX_IMAGE_BYTES) return { ok: false, error: 'image is too large' };
    try {
      mkdirSync(assetDir, { recursive: true });
      const name = `${createHash('sha256').update(buffer).digest('hex')}.${extension}`;
      const target = join(assetDir, name);
      if (!existsSync(target)) writeFileSync(target, buffer, { mode: 0o600 });
      return { ok: true, url: `${API}/asset/${name}`, name, bytes: buffer.length };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Read one stored image for the asset route.
   * @param name - stored asset file name.
   * @returns `{buffer, type}` or null.
   */
  function readAsset(name) {
    const value = String(name || '');
    const match = /^([a-f0-9]{64})\.(png|jpe?g|webp|gif|svg)$/.exec(value);
    if (match === null) return null;
    const type = [...IMAGE_TYPES.entries()].find(([, extension]) => extension === match[2].replace('jpeg', 'jpg'))?.[0];
    if (type === undefined) return null;
    try {
      const buffer = readFileSync(join(assetDir, value));
      return { buffer, type };
    } catch {
      return null;
    }
  }

  /**
   * Move tabs into the exact order given by ids; missing ids are appended.
   * @param ids - ordered document ids.
   * @returns result with the new snapshot.
   */
  function reorder(ids) {
    if (!Array.isArray(ids)) return { ok: false, error: 'ids must be an array', state: snapshot() };
    const byId = new Map(state.documents.map((document) => [document.id, document]));
    const ordered = [];
    for (const id of ids) {
      const document = byId.get(String(id));
      if (document !== undefined && !ordered.includes(document)) ordered.push(document);
    }
    for (const document of state.documents) if (!ordered.includes(document)) ordered.push(document);
    if (ordered.length !== state.documents.length) return { ok: false, error: 'invalid tab order', state: snapshot() };
    const unchanged = ordered.every((document, index) => document.id === state.documents[index].id);
    if (!unchanged) {
      state.documents = ordered;
      state.version += 1;
      persist();
    }
    return { ok: true, state: snapshot() };
  }

  return {
    snapshot,
    update,
    write,
    append,
    replace,
    read,
    list,
    select,
    create,
    close,
    reorder,
    saveAsset,
    readAsset,
    requestOpen,
    recordDiag,
    exportDocument,
    lastDiag: () => lastDiag,
    dataFile: () => filePath,
    initialRevision,
  };
}

/**
 * Build the model-facing tool definition.
 * @param service - document service.
 * @returns tool definition accepted by `ctx.tools.register`.
 */
function toolDefinition(service) {
  return {
    name: TOOL_NAME,
    description: [
      'Read or edit the Markdown documents in the user-visible "Madedown" editor in the right sidebar.',
      'The editor has document tabs; one tab is active. Actions target the active tab unless `document` names another tab (id or title).',
      'Use "list" to see the tabs, "create" to open a new tab, "select" to switch tabs, "close" to close a tab, and "open" to reveal the editor.',
      'The documents are shared across conversations and mirrored live into the UI.',
      'Use action "read" first, then "append" or "replace" for focused edits; "write" replaces the whole document.',
    ].join(' '),
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['read', 'write', 'append', 'replace', 'open', 'list', 'select', 'create', 'close'],
          description: 'read=return a document; write=replace it; append=add a block at the end; replace=literal find/replace; open=reveal the editor; list=show tabs; select=switch the active tab; create=open a new tab; close=close a tab.',
        },
        document: {
          type: 'string',
          description: 'Optional tab id or title. Defaults to the active tab (required by "select").',
        },
        text: {
          type: 'string',
          description: 'New document body for "write", the block to add for "append", or the initial body for "create".',
        },
        title: {
          type: 'string',
          description: 'Document title (used by "write", "append", and "create").',
        },
        find: {
          type: 'string',
          description: 'Literal text to find when action is "replace".',
        },
        replaceWith: {
          type: 'string',
          description: 'Replacement text when action is "replace".',
        },
        all: {
          type: 'boolean',
          description: 'When true, "replace" replaces every occurrence; default replaces only the first.',
        },
      },
      required: ['action'],
      additionalProperties: false,
    },
    output: {
      schema: { type: 'object' },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    isConcurrencySafe: () => false,
    async execute(args) {
      const value = typeof args === 'object' && args !== null ? args : {};
      switch (value.action) {
        case 'read':
          return service.read(value.document);
        case 'write':
          return service.write(value.document, value.text, value.title);
        case 'append':
          return service.append(value.document, value.text, value.title);
        case 'replace':
          return service.replace(value.document, value.find, value.replaceWith, value.all);
        case 'open':
          return service.requestOpen();
        case 'list':
          return service.list();
        case 'select':
          return service.select(value.document);
        case 'create':
          return service.create({ title: value.title, text: value.text });
        case 'close':
          return service.close(value.document);
        default:
          throw new Error(`madedown: unsupported action ${JSON.stringify(value.action)}`);
      }
    },
  };
}

/**
 * Compose the prompt section. Re-evaluated on every assembly so the model sees
 * the current tabs and active document.
 * @param service - document service.
 * @returns prompt section text.
 */
function promptText(service) {
  const state = service.snapshot();
  const active = state.active;
  const stats = measureText(active.text);
  let body = active.text;
  let truncated = false;
  if (body.length > MAX_PROMPT_CHARS) {
    body = body.slice(0, MAX_PROMPT_CHARS);
    truncated = true;
  }
  if (body.length === 0) body = '(empty document)';
  const author = active.updatedBy === 'assistant'
    ? 'assistant'
    : active.updatedBy === 'selection'
      ? 'user (sent from a chat selection)'
      : active.updatedBy === 'system'
        ? 'system'
        : 'user';
  const tabLines = state.docs.map((document, index) => {
    const marker = document.id === state.activeId ? '*' : '-';
    return `${marker} ${index + 1}. "${document.title}" (id ${document.id}, ${document.chars} chars, rev ${document.rev})${document.id === state.activeId ? ' ← active' : ''}`;
  });
  const lines = [
    '## Madedown sidebar editor',
    'The user has a visible Markdown editor ("Madedown") in the right sidebar, backed by the same documents as the `madedown` tool.',
    'It is a WYSIWYG editor by default: the user types directly into the rendered document, and can switch to Markdown source mode.',
    'The editor has document tabs like a notes app: each tab is an independent Markdown document. The documents are global across conversations; your edits appear in the UI immediately, and user edits appear here.',
    '- Tab operations use the `madedown` tool: `list`, `create`, `select`, `close`. `read`/`write`/`append`/`replace`/`close` target the active tab unless the `document` parameter names another tab by id or title.',
    '- When the user asks to open, show, or look at Madedown/the right editor, call `madedown` with action `open`.',
    '- Read before editing. Prefer `append`/`replace` for focused edits; use `write` only when the user asks for a rewrite.',
    '- User selections sent from the chat are appended to the active document as Markdown blocks without quote wrapping; structured selections (tables, code blocks, lists, headings) keep their Markdown structure; do not duplicate them.',
    '- The user can also select text in the editor and insert it into the chat composer; that text is not sent until the user submits.',
    `Tabs (${state.docs.length}):`,
    ...tabLines,
    `Active document: "${active.title}" (id ${active.id}, rev ${active.rev}) — ${stats.chars} chars, ${stats.lines} lines; last edited by ${author}.`,
    truncated
      ? `Active document content (first ${MAX_PROMPT_CHARS} chars; call \`madedown read\` for the rest):`
      : 'Active document content:',
    '````markdown',
    body,
    '````',
  ];
  return lines.join('\n');
}

/**
 * Read and parse a JSON request body.
 * @param request - incoming Node request.
 * @returns parsed JSON value (`null` for an empty body).
 */
function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('request body too large'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (raw.length === 0) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

/**
 * Read a raw request body with a byte cap.
 * @param request - incoming Node request.
 * @param limit - maximum bytes.
 * @returns request body buffer.
 */
function readRawBody(request, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('request body too large'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

/** Send one binary response. */
function sendBinary(response, status, buffer, type) {
  response.writeHead(status, {
    'content-type': type,
    'content-length': String(buffer.length),
    'cache-control': 'public, max-age=31536000, immutable',
    'x-content-type-options': 'nosniff',
  });
  response.end(buffer);
}

/**
 * Write one JSON response.
 * @param response - Node response.
 * @param status - HTTP status.
 * @param value - JSON-serializable payload.
 */
function sendJson(response, status, value) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': String(Buffer.byteLength(body)),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(body);
}

/**
 * Build one exact route.
 * @param path - route path.
 * @param handler - `(request, response, url)` handler.
 * @returns web route.
 */
function route(path, handler, kind = 'exact') {
  return {
    kind,
    path,
    handler: async (request, response) => {
      try {
        const url = new URL(request.url || path, 'http://madedown-dsh.local');
        await handler(request, response, url);
      } catch (error) {
        sendJson(response, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
      }
    },
  };
}

/** GitHub repository that publishes this plugin. */
const PLUGIN_REPO = 'zhxnix/dsh-madedown';
/** Host package root (also the bundle directory). */
const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
/** Local package.json path. */
const PLUGIN_PACKAGE_PATH = join(PLUGIN_ROOT, 'package.json');
/** How long a GitHub release lookup is reused. */
const UPDATE_CACHE_MS = 10 * 60 * 1000;
/** Latest release lookup cache. */
let updateCache = null;

/** @returns the locally installed plugin version, or null when unknown. */
function pluginVersion() {
  try {
    const parsed = JSON.parse(readFileSync(PLUGIN_PACKAGE_PATH, 'utf8'));
    return typeof parsed.version === 'string' ? parsed.version : null;
  } catch {
    return null;
  }
}

/**
 * Normalize a semver-like version string.
 * @param value - version or release tag.
 * @returns `{text, core, pre}` or null.
 */
export function normalizeVersion(value) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(String(value || '').trim());
  if (match === null) return null;
  return {
    text: `${match[1]}.${match[2]}.${match[3]}${match[4] ? `-${match[4]}` : ''}`,
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    pre: match[4] || null,
  };
}

/**
 * Compare two versions numerically.
 * @returns -1, 0 or 1, or null when either version is invalid.
 */
export function compareVersions(left, right) {
  const a = normalizeVersion(left);
  const b = normalizeVersion(right);
  if (a === null || b === null) return null;
  for (let index = 0; index < 3; index += 1) {
    if (a.core[index] > b.core[index]) return 1;
    if (a.core[index] < b.core[index]) return -1;
  }
  if (a.pre === null && b.pre === null) return 0;
  if (a.pre === null) return 1;
  if (b.pre === null) return -1;
  if (a.pre === b.pre) return 0;
  return a.pre > b.pre ? 1 : -1;
}

/**
 * Fetch the latest GitHub release for this plugin.
 * @param force - bypass the in-memory cache.
 * @returns release facts or `{ok:false,error}`.
 */
async function fetchLatestRelease(force) {
  if (force !== true && updateCache !== null && Date.now() - updateCache.at < UPDATE_CACHE_MS) {
    return { ok: true, ...updateCache.value, cached: true };
  }
  const headers = {
    'user-agent': 'dsh-madedown-update-check',
    accept: 'application/vnd.github+json',
  };
  try {
    const response = await fetch(`https://api.github.com/repos/${PLUGIN_REPO}/releases/latest`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      if (response.status === 404) return { ok: false, error: 'no published release yet' };
      return { ok: false, error: `GitHub responded ${response.status}` };
    }
    const data = await response.json();
    const tag = typeof data.tag_name === 'string' ? data.tag_name : '';
    const normalized = normalizeVersion(tag);
    if (normalized === null) return { ok: false, error: 'latest release has no readable version' };
    const value = {
      latest: normalized.text,
      releaseUrl: typeof data.html_url === 'string' ? data.html_url : `https://github.com/${PLUGIN_REPO}/releases`,
      publishedAt: typeof data.published_at === 'string' ? data.published_at : null,
      notes: typeof data.body === 'string' ? data.body.slice(0, 600) : '',
    };
    updateCache = { at: Date.now(), value };
    return { ok: true, ...value };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** @returns update status for the editor's status bar and About dialog. */
async function checkForUpdate(force) {
  const current = pluginVersion();
  const release = await fetchLatestRelease(force);
  if (!release.ok) return { ok: false, current, error: release.error };
  const comparison = current === null ? null : compareVersions(release.latest, current);
  return {
    ok: true,
    current,
    latest: release.latest,
    hasUpdate: comparison === 1,
    releaseUrl: release.releaseUrl,
    publishedAt: release.publishedAt,
    notes: release.notes,
  };
}

/**
 * Run one fixed local command for the self-update flow.
 * @returns stdout text or throws.
 */
function runCommand(file, args, timeout = 90000) {
  return new Promise((resolve, reject) => {
    execFile(file, args, { timeout, maxBuffer: 2 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        const detail = String(stderr || stdout || error.message || '').trim();
        reject(new Error(detail || 'command failed'));
        return;
      }
      resolve(String(stdout || '').trim());
    });
  });
}

/**
 * Apply the latest release: `git pull --ff-only` for a checkout, otherwise a
 * best-effort DSH plugin add for npm installs. The caller must restart DSH.
 * @returns `{ok, method, version, needsRestart, output}` or error.
 */
async function updatePlugin() {
  const status = await checkForUpdate(true);
  if (!status.ok) return status;
  if (status.hasUpdate !== true) return { ok: true, upToDate: true, current: status.current, needsRestart: false };
  try {
    const inside = await runCommand('git', ['-C', PLUGIN_ROOT, 'rev-parse', '--is-inside-work-tree'], 20000);
    if (inside === 'true') {
      const dirty = await runCommand('git', ['-C', PLUGIN_ROOT, 'status', '--porcelain'], 20000);
      if (dirty.length > 0) return { ok: false, error: '本地有未提交的改动，无法自动更新' };
      const output = await runCommand('git', ['-C', PLUGIN_ROOT, 'pull', '--ff-only'], 120000);
      return { ok: true, method: 'git', version: status.latest, needsRestart: true, output };
    }
  } catch {
    /* not a git checkout; fall back to npm */
  }
  const profile = process.env.DSH_PROFILE;
  const dshEntry = process.argv[1];
  if (profile && dshEntry) {
    try {
      const output = await runCommand(process.execPath, [dshEntry, 'plugin', '--profile', profile, 'add', `dsh-madedown@${status.latest}`], 180000);
      return { ok: true, method: 'npm', version: status.latest, needsRestart: true, output };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
  return { ok: false, error: '当前安装方式不支持自动更新，请手动更新插件' };
}

/**
 * Show the native macOS save panel and resolve the chosen file path.
 * Falls back to `{ok:false, unsupported:true}` on non-macOS hosts so the editor
 * can use its in-page path prompt instead.
 * @param defaultName - suggested file name shown in the panel.
 * @returns `{ok:true,path}` | `{ok:false,canceled:true}` | `{ok:false,error}`.
 */
function chooseSavePath(defaultName) {
  return new Promise((resolve) => {
    if (process.platform !== 'darwin') {
      resolve({ ok: false, unsupported: true });
      return;
    }
    const name = String(defaultName || 'Madedown.md')
      .replace(/['"\\/:*?<>|\n\r]/g, '-')
      .trim() || 'Madedown.md';
    const script = [
      'try',
      `  set targetFile to choose file name with prompt "保存到本地" default name "${name}" default location (path to documents folder)`,
      '  return POSIX path of targetFile',
      'on error number -128',
      '  return ""',
      'end try',
    ].join('\n');
    execFile('/usr/bin/osascript', ['-e', script], { timeout: 300000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      const output = String(stdout || '').trim();
      if (output.length > 0) {
        resolve({ ok: true, path: output });
        return;
      }
      if (error) {
        const text = `${stderr || ''}\n${error.message || ''}`.trim();
        if (/User canceled|取消|-128/i.test(text)) resolve({ ok: false, canceled: true });
        else resolve({ ok: false, error: text || 'save dialog failed' });
        return;
      }
      resolve({ ok: false, canceled: true });
    });
  });
}

/**
 * Host plugin body.
 * @param ctx - host Cordis context.
 */
export function apply(ctx) {
  const service = createMadedownService(resolveDataFile());

  ctx.effect(() => ctx.tools.register(toolDefinition(service)), 'madedown-dsh: tool');

  ctx.effect(() => ctx.systemPrompt.section({
    name: 'madedown-dsh',
    order: (() => {
      try {
        return ctx.systemPrompt.getSectionOrder('TOOL_REPORT') + 10;
      } catch {
        return 2910;
      }
    })(),
    text: () => promptText(service),
  }), 'madedown-dsh: prompt');

  ctx.effect(() => {
    const disposers = [
      route(`${API}/state`, (request, response, url) => {
        if (request.method !== 'GET') {
          sendJson(response, 405, { ok: false, error: 'use GET' });
          return;
        }
        const since = Number(url.searchParams.get('since'));
        const state = service.snapshot();
        const changed = Number.isFinite(since) ? since !== state.version : true;
        sendJson(response, 200, changed
          ? { ok: true, changed: true, openRequest: state.openRequest, state }
          : { ok: true, changed: false, version: state.version, openRequest: state.openRequest, activeId: state.activeId });
      }),
      route(`${API}/doc`, (request, response, url) => {
        if (request.method !== 'GET') {
          sendJson(response, 405, { ok: false, error: 'use GET' });
          return;
        }
        sendJson(response, 200, service.read(url.searchParams.get('id')));
      }),
      route(`${API}/update`, async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { ok: false, error: 'use POST' });
          return;
        }
        const body = await readJsonBody(request);
        sendJson(response, 200, service.update(body));
      }),
      route(`${API}/tabs`, async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { ok: false, error: 'use POST' });
          return;
        }
        const body = await readJsonBody(request);
        const value = typeof body === 'object' && body !== null ? body : {};
        let result;
        if (value.action === 'create') result = service.create({ title: value.title, text: value.text });
        else if (value.action === 'select') result = service.select(value.id);
        else if (value.action === 'close') result = service.close(value.id);
        else if (value.action === 'reorder') result = service.reorder(value.ids);
        else result = { ok: false, error: 'unsupported tabs action' };
        sendJson(response, 200, result);
      }),
      route(`${API}/upload-image`, async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { ok: false, error: 'use POST' });
          return;
        }
        const buffer = await readRawBody(request, MAX_IMAGE_BYTES);
        sendJson(response, 200, service.saveAsset(buffer, request.headers['content-type']));
      }),
      route(`${API}/asset`, (request, response) => {
        if (request.method !== 'GET') {
          sendJson(response, 405, { ok: false, error: 'use GET' });
          return;
        }
        const name = (request.url || '').split('?')[0].slice(`${API}/asset/`.length);
        const asset = service.readAsset(decodeURIComponent(name));
        if (asset === null) {
          sendJson(response, 404, { ok: false, error: 'asset not found' });
          return;
        }
        sendBinary(response, 200, asset.buffer, asset.type);
      }, 'prefix'),
      route(`${API}/export`, async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { ok: false, error: 'use POST' });
          return;
        }
        const body = await readJsonBody(request);
        sendJson(response, 200, service.exportDocument(body));
      }),
      route(`${API}/save-dialog`, async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { ok: false, error: 'use POST' });
          return;
        }
        const body = await readJsonBody(request);
        const value = typeof body === 'object' && body !== null ? body : {};
        const target = service.read(value.docId);
        if (!target || target.ok !== true) {
          sendJson(response, 200, { ok: false, error: 'document not found' });
          return;
        }
        const chosen = await chooseSavePath(value.defaultName || `${target.title}.md`);
        if (!chosen || chosen.ok !== true) {
          sendJson(response, 200, chosen || { ok: false, canceled: true });
          return;
        }
        const saved = service.exportDocument({ docId: target.documentId, path: chosen.path });
        if (saved && saved.ok === true) saved.chosenPath = chosen.path;
        sendJson(response, 200, saved);
      }),
      route(`${API}/update-check`, async (request, response) => {
        if (request.method !== 'GET') {
          sendJson(response, 405, { ok: false, error: 'use GET' });
          return;
        }
        const url = new URL(request.url || `${API}/update-check`, 'http://madedown-dsh.local');
        sendJson(response, 200, await checkForUpdate(url.searchParams.get('force') === '1'));
      }),
      route(`${API}/update-plugin`, async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { ok: false, error: 'use POST' });
          return;
        }
        sendJson(response, 200, await updatePlugin());
      }),
      route(`${API}/open`, (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { ok: false, error: 'use POST' });
          return;
        }
        sendJson(response, 200, service.requestOpen());
      }),
      route(`${API}/diag`, async (request, response) => {
        if (request.method === 'POST') {
          const body = await readJsonBody(request);
          sendJson(response, 200, service.recordDiag(body));
          return;
        }
        sendJson(response, 200, { ok: true, diag: service.lastDiag() });
      }),
    ].map((entry) => ctx.webServer.register(entry));
    return () => {
      for (const dispose of disposers) {
        try {
          dispose();
        } catch {
          /* already gone */
        }
      }
    };
  }, 'madedown-dsh: routes');
}
