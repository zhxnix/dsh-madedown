/**
 * Client-half check: loads the browser bundle in a sandbox with real React and
 * jsdom, verifies the Markdown <-> WYSIWYG block round-trip, server-renders the
 * editor shell, and applies the plugin against a mock Cordis client context to
 * inspect every registration.
 *
 * Requires a test dependency installation, for example:
 *   npm install --prefix /tmp/madedown-test react@18 react-dom@18 jsdom@24
 * and MADEDOWN_TEST_DEPS=/tmp/madedown-test when it is not that path.
 *
 * Run with: node scripts/check-client.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = dirname(here);
const depsRoot = process.env.MADEDOWN_TEST_DEPS || '/tmp/madedown-test';
const require = createRequire(join(depsRoot, 'package.json'));
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { JSDOM } = require('jsdom');

// ---------------------------------------------------------------------------
// Browser sandbox
// ---------------------------------------------------------------------------

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://127.0.0.1:3080/' });
const jsdomDocument = dom.window.document;
const styleNodes = [];
const documentStub = {
  visibilityState: 'visible',
  head: { appendChild: (node) => styleNodes.push(node) },
  body: { appendChild: () => {}, removeChild: () => {} },
  createElement: (tag) => {
    const node = jsdomDocument.createElement(tag);
    node.remove = () => {
      const index = styleNodes.indexOf(node);
      if (index >= 0) styleNodes.splice(index, 1);
    };
    return node;
  },
  querySelector: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
};
const timers = new Map();
let timerSeq = 0;
const windowStub = {
  localStorage: {
    store: new Map(),
    getItem(key) { return this.store.has(key) ? this.store.get(key) : null; },
    setItem(key, value) { this.store.set(key, String(value)); },
  },
  getSelection: () => null,
  innerWidth: 1280,
  innerHeight: 800,
  addEventListener: () => {},
  removeEventListener: () => {},
};

let captured = null;
windowStub.__ModuleLoader__ = {
  load(registration) {
    captured = registration;
  },
};

const sandbox = {
  window: windowStub,
  document: documentStub,
  console,
  setTimeout: (fn, delay) => {
    const id = `timeout-${timerSeq++}`;
    timers.set(id, { fn, delay });
    return id;
  },
  clearTimeout: (id) => timers.delete(id),
  setInterval: (fn, delay) => {
    const id = `interval-${timerSeq++}`;
    timers.set(id, { fn, delay });
    return id;
  },
  clearInterval: (id) => timers.delete(id),
  fetch: async () => ({ ok: true, json: async () => ({ ok: true, changed: false, version: 0, openRequest: 0 }) }),
  FileReader: class {
    readAsDataURL() {}
  },
  URL,
  TextDecoder,
  // Round-trip functions run on real DOM nodes; expose jsdom's globals.
  Element: dom.window.Element,
  Node: dom.window.Node,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(packageRoot, 'client.js'), 'utf8'), sandbox, { filename: 'client.js' });

assert.equal(captured.id, 'dsh-madedown', 'bundle registers its package id');
const module = captured.factory((specifier) => {
  if (specifier === 'react') return React;
  throw new Error(`unexpected require(${specifier})`);
});
assert.equal(module.inject.includes('slots'), true);
assert.equal(typeof module.apply, 'function');
const test = module.__test;

// Markdown block parsing.
const sample = [
  '# Title',
  '',
  'A **bold** and *italic* and ~~struck~~ and `code` line with [link](https://example.com).',
  '',
  '## Section',
  '',
  '> quoted line one',
  '> quoted line two',
  '',
  '- bullet one',
  '- [x] done task',
  '- [ ] open task',
  '',
  '1. first',
  '2. second',
  '',
  '| A | B |',
  '| --- | :---: |',
  '| 1 | 2 |',
  '',
  '```js',
  'const x = 1;',
  '```',
  '',
  '---',
].join('\n');

const blocks = test.blocksFromMarkdown(sample);
assert.equal(blocks.map((block) => block.type).join(','), 'heading,p,heading,quote,li,li,li,li,li,table,code,hr');
assert.equal(test.extractHeadings(sample).map((heading) => heading.level).join(','), '1,2');
assert.equal(test.safeUrl('javascript:alert(1)'), '#');

// Inline Markdown <-> HTML.
const inlineHtml = test.inlineHtml('**b** *i* ~~s~~ `c` [l](https://x.test)');
assert.match(inlineHtml, /<strong>b<\/strong>/);
assert.match(inlineHtml, /<em>i<\/em>/);
assert.match(inlineHtml, /<del>s<\/del>/);
assert.match(inlineHtml, /<code>c<\/code>/);
assert.match(inlineHtml, /<a href="https:\/\/x.test"/);

const paragraph = jsdomDocument.createElement('p');
paragraph.innerHTML = inlineHtml;
assert.equal(test.inlineMarkdown(paragraph), '**b** *i* ~~s~~ `c` [l](https://x.test)');

// Full document round-trip through the WYSIWYG HTML representation.
assert.equal(test.roundTripCheck(sample), true, 'sample round-trips through WYSIWYG HTML');
assert.equal(test.roundTripCheck(''), true, 'empty document round-trips');
assert.equal(test.roundTripCheck('# Only heading\n\n- [ ] task\n'), true, 'simple document round-trips');

const renderedHtml = test.blocksFromMarkdown(sample).map(test.blockHtml).join('');
const holder = jsdomDocument.createElement('div');
holder.innerHTML = renderedHtml;
const serialized = test.serializeDoc(holder);
assert.match(serialized, /^# Title/);
assert.match(serialized, /\| --- \| :---: \|/);
assert.match(serialized, /```js\nconst x = 1;\n```/);
assert.match(serialized, /- \[x\] done task/);

// Editor -> chat insertion never submits, only updates the draft.
let draft = '';
let submitted = false;
const inputActions = {
  setDraft(next) { draft = next; },
  submit() { submitted = true; },
};
assert.equal(test.appendSelectionToChat(inputActions, '', 'hello'), true);
assert.equal(draft, 'hello');
assert.equal(submitted, false);
draft = 'existing draft';
assert.equal(test.appendSelectionToChat(inputActions, draft, 'from editor'), true);
assert.equal(draft, 'existing draft\n\nfrom editor');
assert.equal(submitted, false);
assert.equal(test.appendSelectionToChat(null, '', 'x'), false);
assert.equal(test.appendSelectionToChat(inputActions, '', '   '), false);

// Chat selection -> editor Markdown reconstruction (tables keep their format).
const tableHtml = '<p>下面数据：</p><table><thead><tr><th>指标</th><th>人数</th></tr></thead><tbody><tr><td>项目 A</td><td>123</td></tr><tr><td>项目 B</td><td>456</td></tr></tbody></table>';
const tableMd = test.markdownFromHtml(tableHtml);
assert.match(tableMd, /下面数据：/);
assert.match(tableMd, /\| 指标 \| 人数 \|/);
assert.match(tableMd, /\| --- \| --- \|/);
assert.match(tableMd, /\| 项目 A \| 123 \|/);
assert.match(tableMd, /\| 项目 B \| 456 \|/);

const richMd = test.markdownFromHtml('<h2>标题</h2><ul><li>a</li><li><input type="checkbox" checked> b</li></ul><pre><code class="language-js">const x = 1;</code></pre><p>a|b</p>');
assert.match(richMd, /## 标题/);
assert.match(richMd, /- a/);
assert.match(richMd, /- \[x\] b/);
assert.match(richMd, /```js\nconst x = 1;\n```/);
assert.match(richMd, /a\\\|b/);

assert.equal(test.tsvTableToMarkdown('指标\t人数\n项目 A\t123'), '| 指标 | 人数 |\n| --- | --- |\n| 项目 A | 123 |');
assert.equal(test.tsvTableToMarkdown('普通文本'), '');

const selectionHolder = jsdomDocument.createElement('div');
selectionHolder.innerHTML = tableHtml;
const tableRange = jsdomDocument.createRange();
tableRange.selectNodeContents(selectionHolder);
assert.equal(test.selectionHasRichBlocks(tableRange), true);
assert.match(test.selectionToMarkdown(tableRange), /\| 指标 \| 人数 \|/);
const plainHolder = jsdomDocument.createElement('div');
plainHolder.textContent = '普通一段话';
const plainRange = jsdomDocument.createRange();
plainRange.selectNodeContents(plainHolder);
assert.equal(test.selectionHasRichBlocks(plainRange), false);

// Rich selections append as Markdown blocks; plain text keeps the quote style.
test.resetStore();
test.setStore({ loaded: false, text: '', title: 'Doc', docs: test.getStore().docs });
await test.sendSelection(tableMd, { asMarkdown: true });
assert.match(test.getStore().text, /下面数据：\n\n\| 指标 \| 人数 \|/);
assert.equal(test.getStore().text.includes('> |'), false);
test.resetStore();
test.setStore({ loaded: false, text: '', title: 'Doc', docs: test.getStore().docs });
await test.sendSelection('普通的一段话');
assert.match(test.getStore().text, /^普通的一段话/);
assert.equal(test.getStore().text.includes('> '), false, 'plain selections are no longer quote-wrapped');

// Tab-separated table text is repaired into a GFM table even without rich DOM.
test.resetStore();
test.setStore({ loaded: false, text: '', title: 'Doc', docs: test.getStore().docs });
await test.sendSelection('指标\t人数\n项目 A\t123\n项目 B\t456');
assert.match(test.getStore().text, /^\| 指标 \| 人数 \|/);
assert.match(test.getStore().text, /\| 项目 A \| 123 \|/);
assert.equal(test.getStore().text.includes('\t'), false);
test.resetStore();

// Quick ask composes a quote block and submits the chat message.
test.resetStore();
let quickDraft = '';
let quickSubmits = 0;
const quickActions = {
  setDraft(value) { quickDraft = value; },
  submit() { quickSubmits += 1; },
  captureInsertion() { return { start: 0, end: 0, draftRev: 0 }; },
};
const quickOk = test.sendQuickAsk(quickActions, '示例', '| A | B |\n| --- | --- |\n| 1 | 2 |', '这个表格说明什么？', '');
assert.equal(quickOk, true);
for (const [id, timer] of [...timers.entries()]) {
  if (timer.delay <= 200) {
    timers.delete(id);
    timer.fn();
  }
}
assert.match(quickDraft, /引用自 Madedown《示例》/);
assert.match(quickDraft, /\| A \| B \|/);
assert.match(quickDraft, /这个表格说明什么？/);
assert.equal(quickSubmits, 1);

// Component rendering.
const t = (key) => key;
test.resetStore();
const body = renderToStaticMarkup(React.createElement(test.components.MadedownBody, {
  t,
  useInput: (selector) => selector({ draft: '' }),
  inputActions,
}));
assert.match(body, /madedown-root/);
assert.match(body, /mdw-doc/);
assert.match(body, /madedown-toolbar/);
assert.match(body, /madedown-tabs/);
assert.match(body, /madedown-tab-new/);
assert.match(body, /madedown-toolbar-row/);
assert.match(body, /madedown-toolbar-row[\s\S]*madedown-mode/);
assert.match(body, /madedown-tabbar-row/);
assert.match(body, /madedown-tab__state/);
assert.match(body, /data-state="unsaved"/, 'tabs without a local file show the red state');
assert.match(body, /madedown-localsave/, 'status bar shows the local-save indicator');
assert.equal(body.includes('madedown-sync'), false, 'the saved text indicator was removed');
assert.match(body, /madedown-about-btn/, 'toolbar has the software-info button');
assert.equal(body.includes('stats.lines'), false, 'line count was removed from the status bar');
assert.equal(body.includes('by.system'), false, 'editor attribution was removed from the status bar');
assert.equal(body.includes('status.version'), false, 'internal version was removed from the status bar');
assert.equal(body.includes('tab.count'), false, 'tab count was removed from the status bar');
assert.match(body, /madedown-save-btn[\s\S]*madedown-mode/, 'mode switch is the right-most toolbar control');
assert.equal(body.includes('madedown-outline-toggle'), false, 'outline toolbar toggle was removed');
assert.equal(body.includes('madedown-title-input'), false, 'no separate title row');

// Source mode renders the raw-Markdown textarea.
windowStub.localStorage.setItem('madedown-dsh.mode.v2', 'source');
const sourceBody = renderToStaticMarkup(React.createElement(test.components.MadedownBody, {
  t,
  useInput: (selector) => selector({ draft: '' }),
  inputActions,
}));
assert.match(sourceBody, /madedown-source/);
windowStub.localStorage.setItem('madedown-dsh.mode.v2', 'wysiwyg');

// Server snapshots drive tab switches and remote edits.
test.resetStore();
test.setStore({
  loaded: true,
  activeId: 'doc-a',
  rev: 2,
  title: 'A',
  text: 'alpha',
  dirty: false,
  docs: [
    { id: 'doc-a', title: 'A', rev: 2, chars: 5, lines: 1, updatedBy: 'user', updatedAt: '' },
    { id: 'doc-b', title: 'B', rev: 0, chars: 4, lines: 1, updatedBy: 'user', updatedAt: '' },
  ],
});
const adopted = test.adoptServerSnapshot({
  version: 7,
  activeId: 'doc-b',
  docs: [
    { id: 'doc-a', title: 'A', rev: 2, chars: 5, lines: 1, updatedBy: 'user', updatedAt: '' },
    { id: 'doc-b', title: 'B', rev: 0, chars: 4, lines: 1, updatedBy: 'user', updatedAt: '' },
  ],
  active: { id: 'doc-b', title: 'B', text: 'beta', rev: 0, updatedBy: 'user', updatedAt: '' },
  openRequest: 0,
});
assert.equal(adopted, true);
assert.equal(test.getStore().activeId, 'doc-b');
assert.equal(test.getStore().text, 'beta');
assert.equal(test.getStore().docs.length, 2);

// A remote tab switch does not steal unsaved local edits.
test.setStore({ activeId: 'doc-a', title: 'A', text: 'alpha local', rev: 2, dirty: true });
const stolen = test.adoptServerSnapshot({
  version: 8,
  activeId: 'doc-b',
  docs: test.getStore().docs,
  active: { id: 'doc-b', title: 'B', text: 'beta', rev: 0, updatedBy: 'user', updatedAt: '' },
  openRequest: 0,
});
assert.equal(stolen, false);
assert.equal(test.getStore().activeId, 'doc-a');
assert.equal(test.getStore().text, 'alpha local');

// Same-tab remote edit while clean is adopted.
test.setStore({ dirty: false, activeId: 'doc-a', text: 'alpha', rev: 2, docs: test.getStore().docs });
const remote = test.adoptServerSnapshot({
  version: 9,
  activeId: 'doc-a',
  docs: test.getStore().docs,
  active: { id: 'doc-a', title: 'A', text: 'alpha remote', rev: 3, updatedBy: 'assistant', updatedAt: '' },
  openRequest: 0,
});
assert.equal(remote, true);
assert.equal(test.getStore().text, 'alpha remote');
assert.equal(test.getStore().rev, 3);

test.resetStore();
test.setStore({ text: '# Live\n\n- [ ] item', title: 'Doc', version: 3 });
const title = renderToStaticMarkup(React.createElement(test.components.MadedownTitle, { t }));
assert.match(title, /data:image\/webp;base64,/, 'sidebar tab title shows the full wordmark logo');
assert.equal(title.includes('madedown-chip__text'), false, 'sidebar tab title has no document title text');
assert.match(title, /madedown-wordmark__light/);
assert.match(title, /madedown-wordmark__dark/);
const header = renderToStaticMarkup(React.createElement(test.components.MadedownHeaderButton, { t, open: () => true }));
assert.match(header, /madedown-appicon__light/);
assert.match(header, /madedown-appicon__dark/);
assert.match(header, /<button/);
test.setStore({ referenceEditor: { id: 'ref-test', title: 'Doc', markdown: 'content', sessionId: 'session-test' } });
const refEditor = renderToStaticMarkup(React.createElement(test.components.Overlay, { t, open: () => true, sendSelection: () => {} }));
assert.match(refEditor, /madedown-refcard/);
assert.match(refEditor, /aria-label="ref.close"/);
assert.match(refEditor, /ref\.delete/);
test.setStore({ referenceEditor: null });

test.setStore({ toast: { id: 1, text: 'sent', action: null } });
const overlay = renderToStaticMarkup(React.createElement(test.components.Overlay, { t, open: () => true, sendSelection: () => {} }));
assert.match(overlay, /madedown-toast/);

// ---------------------------------------------------------------------------
// Cordis registration surface
// ---------------------------------------------------------------------------

const effects = [];
const calls = { tabTypes: [], slotInjections: [], registrations: [], locales: [] };
const openTabs = [];
const ctx = {
  effect(fn) {
    const dispose = fn();
    effects.push(typeof dispose === 'function' ? dispose : () => {});
    return () => {};
  },
  on: () => () => {},
  get: (name) => (name === 'sidebarRight' ? ctx.sidebarRight : undefined),
  locale: {
    bind: () => (key) => test.dicts.en[key] || key,
    register: (namespace, dicts) => {
      calls.locales.push({ namespace, dicts });
      return () => {};
    },
  },
  slots: {
    inject: (name, callback) => {
      calls.slotInjections.push(name);
      return callback();
    },
    register: (options, component) => {
      calls.registrations.push({ options, component });
      return () => {};
    },
  },
  sidebarRightTabs: {
    register: (definition) => {
      calls.tabTypes.push(definition);
      return () => {};
    },
  },
  sidebarRight: {
    mounted: { getSnapshot: () => 'session-1' },
    active: () => undefined,
    focus: () => {},
    openTab: (kind) => openTabs.push(kind),
  },
};

module.apply(ctx);
await new Promise((resolve) => setTimeout(resolve, 0));

assert.equal(calls.locales.length, 1);
assert.equal(calls.locales[0].namespace, 'madedown');
assert.ok(calls.locales[0].dicts.zh);
assert.equal(calls.tabTypes.length, 1);
assert.equal(calls.tabTypes[0].id, 'madedown-dsh');
assert.equal(calls.tabTypes[0].kind, 'madedown');
assert.equal(calls.tabTypes[0].guide.length, 1);
assert.equal(typeof calls.tabTypes[0].guide[0].title(), 'string');
assert.equal(calls.slotInjections.slice().sort().join(','), [
  'conversation.session.header.utilities',
  'shell.overlay',
  'sidebar.right.pane.tab',
  'sidebar.right.pane.tab.title',
].sort().join(','));
assert.equal(calls.registrations.length, 4);
for (const registration of calls.registrations) {
  assert.equal(typeof registration.component, 'function', `${registration.options.name} has a component`);
  if (registration.options.name.startsWith('sidebar.right.pane.tab')) {
    assert.equal(registration.options.key, 'madedown-dsh');
    assert.equal(registration.options.locale, 'madedown');
  }
}
const bodyRegistration = calls.registrations.find((entry) => entry.options.name === 'sidebar.right.pane.tab');
const injected = bodyRegistration.options.inject('session-1');
assert.equal(typeof injected.open, 'function');
injected.open();
assert.equal(openTabs.join(','), 'madedown');
assert.equal(styleNodes.length, 1);

for (const dispose of effects.reverse()) {
  try {
    dispose();
  } catch (error) {
    assert.fail(`dispose failed: ${error.message}`);
  }
}
console.log('madedown-dsh client check: OK');
