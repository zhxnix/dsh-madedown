/**
 * Host-half check: applies the plugin against a mock Cordis context and
 * exercises the multi-tab document service, every tool action and every HTTP
 * route (including local file export).
 *
 * Run with: node scripts/check-host.mjs
 */
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';

const home = mkdtempSync(join(tmpdir(), 'madedown-dsh-check-'));
process.env.MADEDOWN_DSH_HOME = home;

// Legacy single-document file: the new store must migrate it into one tab.
const legacy = {
  version: 5,
  title: 'Legacy notes',
  text: '# Legacy\n\nMigrated body\n',
  updatedAt: '2026-01-01T00:00:00.000Z',
  updatedBy: 'user',
};
writeFileSync(join(home, 'document.json'), `${JSON.stringify(legacy, null, 2)}\n`);

const { apply, createMadedownService, measureText, normalizeVersion, compareVersions } = await import('../impl.js');

const tools = [];
const routes = [];
const sections = [];
const ctx = {
  effect(fn) {
    const dispose = fn();
    return typeof dispose === 'function' ? dispose : () => {};
  },
  tools: {
    register(definition) {
      tools.push(definition);
      return () => {};
    },
  },
  webServer: {
    register(entry) {
      routes.push(entry);
      return () => {};
    },
  },
  systemPrompt: {
    getSectionOrder() {
      return 2900;
    },
    section(section) {
      sections.push(section);
      return () => {};
    },
  },
};

apply(ctx);

assert.equal(tools.length, 1, 'registers exactly one tool');
assert.equal(tools[0].name, 'madedown');
assert.deepEqual(tools[0].parameters.properties.action.enum, ['read', 'write', 'append', 'replace', 'open', 'list', 'select', 'create', 'close']);
assert.equal(routes.length, 12, 'registers twelve HTTP routes');
assert.ok(routes.some((entry) => entry.path === '/madedown-dsh/save-dialog'), 'registers the native save dialog route');
assert.ok(routes.some((entry) => entry.path === '/madedown-dsh/update-check'), 'registers the update check route');
assert.ok(routes.some((entry) => entry.path === '/madedown-dsh/update-plugin'), 'registers the update plugin route');
assert.equal(sections.length, 1, 'registers one prompt section');
const prompt = sections[0].text();
assert.match(prompt, /Madedown sidebar editor/);
assert.match(prompt, /Tabs \(1\)/);
assert.match(prompt, /Legacy notes/);
assert.match(prompt, /Migrated body/);

assert.equal(normalizeVersion('v0.6.2').text, '0.6.2');
assert.equal(compareVersions('v0.6.2', '0.6.1'), 1);
assert.equal(compareVersions('0.6.2', 'v0.6.2'), 0);
assert.equal(compareVersions('0.6.1', '0.7.0'), -1);
assert.equal(compareVersions('1.0.0-rc.1', '1.0.0'), -1);

const tool = tools[0];
const call = (args) => tool.execute(args, {});

// Migration: one legacy tab, active.
const initial = await call({ action: 'read' });
assert.equal(initial.ok, true);
assert.equal(initial.title, 'Legacy notes');
assert.match(initial.text, /Migrated body/);
assert.equal(initial.tabs.length, 1);
assert.equal(initial.rev, 0);

// New tab.
const created = await call({ action: 'create', title: 'Scratch' });
assert.equal(created.ok, true);
assert.equal(created.document.title, 'Scratch');
assert.equal(created.state.docs.length, 2);
assert.equal(created.state.activeId, created.document.id);

// Write on the active tab.
const written = await call({ action: 'write', title: 'Scratch', text: '# Scratch\n\nline one\n' });
assert.equal(written.ok, true);
assert.equal(written.state.active.title, 'Scratch');
assert.equal(written.state.active.rev, 1);

// Append keeps the blank-line boundary.
const appended = await call({ action: 'append', text: '- [ ] todo' });
assert.match(appended.state.active.text, /line one\n\n- \[ \] todo/);

// Replace first occurrence.
const replaced = await call({ action: 'replace', find: 'line one', replaceWith: 'line 1' });
assert.equal(replaced.ok, true);
assert.equal(replaced.replacements, 1);
assert.match(replaced.state.active.text, /line 1/);

// Target another tab by title.
const legacyRead = await call({ action: 'read', document: 'Legacy notes' });
assert.equal(legacyRead.ok, true);
assert.equal(legacyRead.documentId, initial.documentId);
const legacyAppend = await call({ action: 'append', document: 'Legacy notes', text: 'agent appended' });
assert.match(legacyAppend.document.text, /Migrated body/);
assert.match(legacyAppend.document.text, /agent appended/);
assert.equal(legacyAppend.state.active.title, 'Scratch', 'targeting another tab does not switch the active tab');
const legacyAfter = await call({ action: 'read', document: 'Legacy notes' });
assert.match(legacyAfter.text, /agent appended/);

// List and select.
const listed = await call({ action: 'list' });
assert.equal(listed.ok, true);
assert.equal(listed.docs.length, 2);
const selected = await call({ action: 'select', document: 'Scratch' });
assert.equal(selected.ok, true);
assert.equal(selected.state.active.title, 'Scratch');

// Close a tab through the tool; the remaining tab becomes active.
const scratchId = selected.state.active.id;
const legacyTabs = await call({ action: 'list' });
const legacyId = legacyTabs.docs.find((document) => document.title === 'Legacy notes').id;
const closedByTool = await call({ action: 'close', document: scratchId });
assert.equal(closedByTool.ok, true);
assert.equal(closedByTool.state.docs.length, 1);
assert.equal(closedByTool.state.activeId, legacyId);
const reopened = await call({ action: 'create', title: 'Scratch' });
assert.equal(reopened.ok, true);
assert.equal(reopened.state.activeId, reopened.document.id);

// HTTP state route, pagination via `since`.
const stateRoute = routes.find((entry) => entry.path === '/madedown-dsh/state');
const first = await request(stateRoute, 'GET', '/madedown-dsh/state?since=-1');
assert.equal(first.status, 200);
assert.equal(first.body.changed, true);
assert.equal(first.body.state.docs.length, 2);
const unchanged = await request(stateRoute, 'GET', `/madedown-dsh/state?since=${first.body.state.version}`);
assert.equal(unchanged.body.changed, false);
assert.equal(typeof unchanged.body.activeId, 'string');

// HTTP doc route.
const docRoute = routes.find((entry) => entry.path === '/madedown-dsh/doc');
const legacyDoc = await request(docRoute, 'GET', `/madedown-dsh/doc?id=${initial.documentId}`);
assert.equal(legacyDoc.body.ok, true);
assert.equal(legacyDoc.body.title, 'Legacy notes');

// HTTP update route honours baseRev and appends selections.
const updateRoute = routes.find((entry) => entry.path === '/madedown-dsh/update');
const active = first.body.state.active;
const stale = await request(updateRoute, 'POST', '/madedown-dsh/update', {
  op: 'replace',
  docId: active.id,
  baseRev: active.rev - 1,
  text: 'stale',
});
assert.equal(stale.body.conflict, true);
const fresh = await request(updateRoute, 'POST', '/madedown-dsh/update', {
  op: 'replace',
  docId: active.id,
  baseRev: active.rev,
  text: '# Scratch\n\nline 1\n',
  title: 'Scratch',
});
assert.equal(fresh.body.ok, true);
const selection = await request(updateRoute, 'POST', '/madedown-dsh/update', {
  op: 'append',
  docId: active.id,
  source: 'selection',
  text: '> selected line',
});
assert.equal(selection.body.ok, true);
assert.match(selection.body.state.active.text, /> selected line/);

// HTTP tabs route: create, select, close.
const tabsRoute = routes.find((entry) => entry.path === '/madedown-dsh/tabs');
const createdByRoute = await request(tabsRoute, 'POST', '/madedown-dsh/tabs', { action: 'create', title: 'Route tab' });
assert.equal(createdByRoute.body.ok, true);
assert.equal(createdByRoute.body.state.docs.length, 3);
const selectedByRoute = await request(tabsRoute, 'POST', '/madedown-dsh/tabs', { action: 'select', id: initial.documentId });
assert.equal(selectedByRoute.body.ok, true);
assert.equal(selectedByRoute.body.state.activeId, initial.documentId);
const closedByRoute = await request(tabsRoute, 'POST', '/madedown-dsh/tabs', { action: 'close', id: createdByRoute.body.document.id });
assert.equal(closedByRoute.body.ok, true);
assert.equal(closedByRoute.body.state.docs.length, 2);

// Tab reorder persists the requested order.
const reorderIds = closedByRoute.body.state.docs.map((document) => document.id).reverse();
const reordered = await request(tabsRoute, 'POST', '/madedown-dsh/tabs', { action: 'reorder', ids: reorderIds });
assert.equal(reordered.body.ok, true);
assert.deepEqual(reordered.body.state.docs.map((document) => document.id), reorderIds);
const reorderedAgain = await request(tabsRoute, 'POST', '/madedown-dsh/tabs', { action: 'reorder', ids: reorderIds.slice().reverse() });
assert.equal(reorderedAgain.body.ok, true);

// HTTP export route: dry run + real write to a temp path.
const exportRoute = routes.find((entry) => entry.path === '/madedown-dsh/export');
const dry = await request(exportRoute, 'POST', '/madedown-dsh/export', { docId: initial.documentId, dryRun: true });
assert.equal(dry.body.ok, true);
assert.match(dry.body.path, /Legacy notes\.md$/);
const outDir = join(home, 'exports');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'legacy.md');
const exported = await request(exportRoute, 'POST', '/madedown-dsh/export', { docId: initial.documentId, path: outPath });
assert.equal(exported.body.ok, true);
assert.equal(exported.body.path, outPath);
assert.equal(exported.body.localPath, outPath);
const localList = await call({ action: 'list' });
const localActive = (localList.docs || []).find((entry) => entry.id === initial.documentId);
assert.equal(localActive.localPath, outPath, 'export records the local save path on the document');
assert.equal(typeof localActive.localSavedAt, 'string', 'export records the local save timestamp');
const localPayload = await call({ action: 'read', document: initial.documentId });
assert.equal(localPayload.localPath, outPath, 'document payload exposes the local save path');

// Reloading the service from disk must keep the local-save metadata.
const dataFile = localList.dataFile;
assert.equal(typeof dataFile, 'string');
const reloadedService = createMadedownService(dataFile);
const reloadedDoc = reloadedService.snapshot().docs.find((entry) => entry.id === initial.documentId);
assert.equal(reloadedDoc.localPath, outPath, 'local save path survives a host restart');
assert.equal(existsSync(outPath), true);
assert.match(readFileSync(outPath, 'utf8'), /# Legacy/);
assert.match(readFileSync(outPath, 'utf8'), /agent appended/);
const exportedAgain = await request(exportRoute, 'POST', '/madedown-dsh/export', { docId: initial.documentId, path: outPath });
assert.equal(exportedAgain.body.overwrote, true);
const badExport = await request(exportRoute, 'POST', '/madedown-dsh/export', { docId: 'missing-doc' });
assert.equal(badExport.body.ok, false);

// HTTP image upload + asset serving.
const uploadRoute = routes.find((entry) => entry.path === '/madedown-dsh/upload-image');
const png = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63fcff1f0005fe02fea735d1eb0000000049454e44ae426082', 'hex');
const uploadRequest = Readable.from([png]);
uploadRequest.method = 'POST';
uploadRequest.url = '/madedown-dsh/upload-image';
uploadRequest.headers = { 'content-type': 'image/png' };
let uploadStatus = 0;
let uploadPayload = '';
const uploadResponse = {
  writeHead(code) { uploadStatus = code; },
  end(text) { uploadPayload = String(text ?? ''); },
};
await uploadRoute.handler(uploadRequest, uploadResponse);
const upload = JSON.parse(uploadPayload);
assert.equal(uploadStatus, 200);
assert.equal(upload.ok, true);
assert.match(upload.url, /^\/madedown-dsh\/asset\/[a-f0-9]{64}\.png$/);
const assetRoute = routes.find((entry) => entry.path === '/madedown-dsh/asset');
const assetName = upload.url.slice('/madedown-dsh/asset/'.length);
const assetRequest = Readable.from([]);
assetRequest.method = 'GET';
assetRequest.url = `/madedown-dsh/asset/${assetName}`;
let assetStatus = 0;
let assetBuffer = Buffer.alloc(0);
const assetResponse = {
  writeHead(code) { assetStatus = code; },
  end(data) { assetBuffer = Buffer.isBuffer(data) ? data : Buffer.from(String(data ?? '')); },
};
await assetRoute.handler(assetRequest, assetResponse);
assert.equal(assetStatus, 200);
assert.deepEqual(assetBuffer, png);
const missingAssetRequest = Readable.from([]);
missingAssetRequest.method = 'GET';
missingAssetRequest.url = `/madedown-dsh/asset/${'0'.repeat(64)}.png`;
let missingStatus = 0;
const missingResponse = {
  writeHead(code) { missingStatus = code; },
  end() {},
};
await assetRoute.handler(missingAssetRequest, missingResponse);
assert.equal(missingStatus, 404);

// HTTP open + diagnostics.
const openRoute = routes.find((entry) => entry.path === '/madedown-dsh/open');
const opened = await request(openRoute, 'POST', '/madedown-dsh/open');
assert.equal(opened.body.ok, true);
assert.ok(opened.body.openRequest >= 1);
const diagRoute = routes.find((entry) => entry.path === '/madedown-dsh/diag');
await request(diagRoute, 'POST', '/madedown-dsh/diag', { mounted: true, mode: 'wysiwyg' });
const diag = await request(diagRoute, 'GET', '/madedown-dsh/diag');
assert.equal(diag.body.diag.client.mounted, true);

// Everything survives a service restart (tabs + active id + revisions).
const persisted = JSON.parse(readFileSync(join(home, 'documents.json'), 'utf8'));
assert.equal(persisted.documents.length, 2);
const restarted = createMadedownService(join(home, 'documents.json'));
const restartedState = restarted.snapshot();
assert.equal(restartedState.docs.length, 2);
assert.equal(restartedState.activeId, persisted.activeId);
assert.equal(restartedState.version, persisted.version);

// Closing the last tab opens a fresh blank tab instead of an empty editor.
const freshService = createMadedownService(join(home, 'blank-store.json'));
const one = freshService.list();
assert.equal(one.docs.length, 1);
const closedOne = freshService.close(one.docs[0].id);
assert.equal(closedOne.ok, true);
assert.equal(closedOne.state.docs.length, 1);
assert.equal(closedOne.state.active.text, '');

// Prompt reflects the current tab list.
const currentPrompt = sections[0].text();
assert.match(currentPrompt, /Tabs \(2\)/);
assert.match(currentPrompt, /\* \d+\./);

const measured = measureText('# a\n\n中文测试 hello world\n');
assert.equal(measured.lines, 4);
assert.ok(measured.words >= 4);

rmSync(home, { recursive: true, force: true });
console.log('madedown-dsh host check: OK');

/**
 * Invoke one registered web route with a synthetic request.
 * @param entry - route definition.
 * @param method - HTTP method.
 * @param url - request URL.
 * @param body - optional JSON body.
 * @returns captured status and parsed body.
 */
async function request(entry, method, url, body) {
  const request = Readable.from(body === undefined ? [] : [Buffer.from(JSON.stringify(body))]);
  request.method = method;
  request.url = url;
  let status = 0;
  let payload = '';
  const response = {
    writeHead(code) {
      status = code;
    },
    end(text) {
      payload = String(text ?? '');
    },
  };
  await entry.handler(request, response);
  return { status, body: payload.length > 0 ? JSON.parse(payload) : null };
}
