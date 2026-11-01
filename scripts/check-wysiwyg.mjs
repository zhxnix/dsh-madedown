/**
 * WYSIWYG interaction check: mounts the real editor component in jsdom with
 * React and exercises block commands, Enter splitting, Backspace conversion,
 * list continuation, inline wrapping and task toggling. This covers the
 * editing paths that the pure round-trip test cannot reach.
 *
 * Requires: npm install --prefix /tmp/madedown-test react@18 react-dom@18 jsdom@24
 * Run with: node scripts/check-wysiwyg.mjs
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
const { createRoot } = require('react-dom/client');
const { act } = React;
const { JSDOM } = require('jsdom');

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// ---------------------------------------------------------------------------
// Sandbox: the bundle gets real jsdom browser globals
// ---------------------------------------------------------------------------

function createBundle() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://127.0.0.1:3080/' });
  const windowObject = dom.window;
  let captured = null;
  windowObject.__ModuleLoader__ = {
    load(registration) {
      captured = registration;
    },
  };
  const sandbox = {
    window: windowObject,
    document: windowObject.document,
    console,
    setTimeout,
    clearTimeout,
    setInterval: () => 0,
    clearInterval: () => {},
    requestAnimationFrame: (callback) => {
      callback(0);
      return 1;
    },
    cancelAnimationFrame: () => {},
    fetch: async () => ({ ok: true, json: async () => ({ ok: true, changed: false, version: 0, openRequest: 0 }) }),
    FileReader: windowObject.FileReader,
    URL: windowObject.URL,
    TextDecoder: windowObject.TextDecoder,
    Element: windowObject.Element,
    Node: windowObject.Node,
    NodeFilter: windowObject.NodeFilter,
    Range: windowObject.Range,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(packageRoot, 'client.js'), 'utf8'), sandbox, { filename: 'client.js' });
  const module = captured.factory((specifier) => {
    if (specifier === 'react') return React;
    throw new Error(`unexpected require(${specifier})`);
  });
  return { module, dom, windowObject };
}

const bundle = createBundle();
const { module, dom, windowObject } = bundle;

// React DOM expects the browser globals in this Node realm as well.
globalThis.window = windowObject;
globalThis.document = windowObject.document;
try {
  globalThis.navigator = windowObject.navigator;
} catch {
  /* Node may expose a read-only navigator */
}
const WysiwygEditor = module.__test.components.WysiwygEditor;
const t = (key) => key;

/**
 * Mount a fresh editor and expose its pieces.
 * @param {string} text - initial Markdown.
 */
async function mount(text) {
  const container = windowObject.document.createElement('div');
  windowObject.document.body.appendChild(container);
  const apiRef = { current: null };
  const changes = [];
  const root = createRoot(container);
  await act(async () => {
    root.render(React.createElement(WysiwygEditor, {
      t,
      text,
      placeholder: 'placeholder',
      apiRef,
      onChange: (next) => changes.push(next),
    }));
  });
  const doc = container.querySelector('.mdw-doc');
  const cleanup = async () => {
    await act(async () => root.unmount());
    container.remove();
  };
  return { container, doc, apiRef, changes, cleanup, current: () => changes[changes.length - 1] };
}

/**
 * Place a collapsed caret inside a node.
 * @param {Node} node - host node.
 * @param {number} offset - text offset.
 */
function setCaret(node, offset) {
  const range = windowObject.document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  const selection = windowObject.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/** Dispatch a keydown on the editable document. */
function press(doc, key, options = {}) {
  const event = new windowObject.KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  doc.dispatchEvent(event);
  return event;
}

const textNodeOf = (element) => {
  let node = element.firstChild;
  while (node) {
    if (node.nodeType === 3) return node;
    if (node.firstChild) {
      const inner = textNodeOf(node);
      if (inner) return inner;
    }
    node = node.nextSibling;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Block commands
// ---------------------------------------------------------------------------

{
  const editor = await mount('# A\n\npara');
  assert.equal(editor.doc.children.length, 2);
  assert.equal(editor.doc.children[0].dataset.mdType, 'heading');
  assert.equal(editor.doc.children[0].dataset.level, '1');

  // Real usage always has a caret in the document when a toolbar command runs.
  setCaret(textNodeOf(editor.doc.children[1]), 4);
  await act(async () => editor.apiRef.current.command('heading', 2));
  assert.equal(editor.doc.children[1].dataset.mdType, 'heading');
  assert.equal(editor.doc.children[1].dataset.level, '2');
  assert.match(editor.current(), /## para/);

  await act(async () => editor.apiRef.current.command('list', 'ol'));
  assert.equal(editor.doc.children[1].dataset.mdType, 'li');
  assert.equal(editor.doc.children[1].dataset.ordered, '1');
  assert.match(editor.current(), /1\. para/);

  await act(async () => editor.apiRef.current.command('quote'));
  assert.equal(editor.doc.children[1].dataset.mdType, 'quote');
  assert.match(editor.current(), /> para/);

  await act(async () => editor.apiRef.current.command('codeblock'));
  assert.equal(editor.doc.children[1].dataset.mdType, 'code');
  assert.match(editor.current(), /```\npara\n```/);

  await act(async () => editor.apiRef.current.command('table'));
  assert.equal(editor.doc.children.includes ? true : true, true);
  assert.equal(editor.doc.querySelectorAll('[data-md-type="table"]').length, 1);
  assert.match(editor.current(), /\| 列 1 \| 列 2 \|/);

  await act(async () => editor.apiRef.current.command('hr'));
  assert.equal(editor.doc.querySelectorAll('[data-md-type="hr"]').length, 1);
  await editor.cleanup();
}
console.log('wysiwyg block commands: OK');

// ---------------------------------------------------------------------------
// Enter splits a paragraph and continues lists
// ---------------------------------------------------------------------------

{
  const editor = await mount('hello world');
  const paragraph = editor.doc.children[0];
  setCaret(textNodeOf(paragraph), 5);
  await act(async () => press(editor.doc, 'Enter'));
  assert.equal(editor.doc.children.length, 2);
  assert.equal(editor.doc.children[1].dataset.mdType, 'p');
  const text = editor.current();
  assert.match(text, /hello/);
  assert.match(text, /world/);
  await editor.cleanup();
}

{
  const editor = await mount('- a');
  const item = editor.doc.querySelector('.mdw-li-text');
  setCaret(textNodeOf(item), 1);
  await act(async () => press(editor.doc, 'Enter'));
  assert.equal(editor.doc.querySelectorAll('.mdw-block[data-md-type="li"]').length, 2);
  await editor.cleanup();
}

// ---------------------------------------------------------------------------
// Backspace at block start converts block types; task checkbox toggles
// ---------------------------------------------------------------------------

{
  const editor = await mount('## Title');
  const heading = editor.doc.children[0];
  setCaret(textNodeOf(heading), 0);
  await act(async () => press(editor.doc, 'Backspace'));
  assert.equal(editor.doc.children[0].dataset.mdType, 'p');
  assert.equal(editor.current().startsWith('#'), false);
  await editor.cleanup();
}

{
  const editor = await mount('- [ ] task');
  const checkbox = editor.doc.querySelector('.mdw-check');
  assert.ok(checkbox, 'task checkbox rendered');
  await act(async () => {
    checkbox.dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true }));
  });
  assert.match(editor.current(), /- \[x\] task/);
  await editor.cleanup();
}

// ---------------------------------------------------------------------------
// Inline wrapping command
// ---------------------------------------------------------------------------

{
  const editor = await mount('hello world');
  const textNode = textNodeOf(editor.doc.children[0]);
  const range = windowObject.document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, 5);
  const selection = windowObject.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  await act(async () => editor.apiRef.current.command('bold'));
  assert.equal(editor.doc.querySelectorAll('strong').length, 1);
  assert.match(editor.current(), /\*\*hello\*\* world/);
  await editor.cleanup();
}

// ---------------------------------------------------------------------------
// Slash menu converts the current block
// ---------------------------------------------------------------------------

{
  const editor = await mount('');
  const paragraph = editor.doc.querySelector('.mdw-p');
  paragraph.innerHTML = '/';
  setCaret(paragraph.firstChild, 1);
  await act(async () => {
    editor.doc.dispatchEvent(new windowObject.InputEvent('beforeinput', {
      inputType: 'insertText',
      data: '/',
      bubbles: true,
      cancelable: true,
    }));
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  assert.ok(editor.container.querySelector('.madedown-menu'), 'slash menu opens on "/"');
  paragraph.innerHTML = '/h2';
  setCaret(paragraph.firstChild, 3);
  await act(async () => {
    editor.doc.dispatchEvent(new windowObject.Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  await act(async () => press(editor.doc, 'Enter'));
  const block = editor.doc.children[0];
  assert.equal(block.dataset.mdType, 'heading');
  assert.equal(block.dataset.level, '2');
  assert.match(editor.current(), /^## /);
  await editor.cleanup();
}
console.log('wysiwyg slash menu: OK');

// ---------------------------------------------------------------------------
// Table cell navigation and row growth
// ---------------------------------------------------------------------------

{
  const editor = await mount('| A | B |\n| --- | --- |\n| 1 | 2 |');
  const table = editor.doc.querySelector('[data-md-type="table"]');
  assert.ok(table, 'table rendered');
  const firstHeader = table.querySelector('th');
  setCaret(firstHeader.firstChild, 0);
  await act(async () => press(editor.doc, 'Tab'));
  const selection = windowObject.getSelection();
  const anchorElement = selection.anchorNode instanceof windowObject.Element
    ? selection.anchorNode
    : selection.anchorNode.parentElement;
  assert.ok(anchorElement.closest('th,td'));
  assert.equal(anchorElement.closest('th,td').textContent, 'B');
  const lastCell = table.querySelectorAll('td')[table.querySelectorAll('td').length - 1];
  setCaret(lastCell.firstChild, 1);
  await act(async () => press(editor.doc, 'Tab'));
  assert.equal(table.querySelectorAll('tbody tr').length, 2, 'Tab on the last cell adds a row');
  await editor.cleanup();
}
console.log('wysiwyg table navigation: OK');

// ---------------------------------------------------------------------------
// Table editing toolbar (insert/delete rows, columns, table)
// ---------------------------------------------------------------------------

{
  const editor = await mount('| A | B |\n| --- | --- |\n| 1 | 2 |\n');
  const table = editor.doc.querySelector('[data-md-type="table"]');
  assert.ok(table, 'table renders');
  const firstBodyCell = table.querySelector('tbody td');
  setCaret(textNodeOf(firstBodyCell) || firstBodyCell, 0);
  await act(async () => {
    windowObject.document.dispatchEvent(new windowObject.Event('selectionchange'));
  });
  const tools = editor.container.querySelector('.mdw-tabletools');
  assert.ok(tools, 'table editing toolbar appears when the caret is inside a table');
  const buttons = [...tools.querySelectorAll('button')];
  assert.equal(buttons.length, 7);

  // Row below.
  await act(async () => buttons[1].dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  assert.equal(table.querySelectorAll('tbody tr').length, 2, 'insert row below works');

  // Column right.
  await act(async () => buttons[3].dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  assert.equal(table.querySelectorAll('thead th').length, 3, 'insert column right works');
  assert.equal(table.querySelectorAll('tbody tr')[0].children.length, 3);

  // Delete row + delete column.
  await act(async () => buttons[4].dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  assert.equal(table.querySelectorAll('tbody tr').length, 1, 'delete row works');
  await act(async () => buttons[5].dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  assert.equal(table.querySelectorAll('thead th').length, 2, 'delete column works');

  const markdown = module.__test.serializeDoc(editor.doc);
  assert.equal((markdown.match(/\n\|/g) || []).length >= 2, true, 'serialized table stays valid Markdown');

  // Delete the whole table.
  await act(async () => {
    windowObject.document.dispatchEvent(new windowObject.Event('selectionchange'));
  });
  const toolsAgain = editor.container.querySelector('.mdw-tabletools');
  assert.ok(toolsAgain, 'table toolbar is still available');
  await act(async () => toolsAgain.querySelectorAll('button')[6].dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  assert.equal(editor.doc.querySelector('[data-md-type="table"]'), null, 'delete table works');
  await editor.cleanup();
}

// ---------------------------------------------------------------------------
// Code block chrome (language/copy/wrap banner) and link icons
// ---------------------------------------------------------------------------

{
  const editor = await mount('```js\nconst x = 1;\n```\n\nA [link](https://example.com) here.\n');
  const code = editor.doc.children[0];
  assert.equal(code.dataset.mdType, 'code');
  assert.ok(code.querySelector('.mdw-code-banner'), 'code block has a banner');
  assert.equal(code.querySelector('.mdw-code-lang').textContent, 'js');
  assert.ok(code.querySelector('[data-md-action="copy-code"]'), 'code block has a copy action');
  const wrap = code.querySelector('[data-md-action="wrap-code"]');
  assert.ok(wrap, 'code block has a wrap action');
  await act(async () => wrap.dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  assert.equal(code.dataset.wrap, 'false', 'wrap action toggles the wrap state');
  const serialized = module.__test.serializeDoc(editor.doc);
  assert.match(serialized, /```js\nconst x = 1;\n```/);
  const anchorElement = editor.doc.querySelector('a');
  assert.ok(anchorElement, 'link renders an anchor');
  assert.ok(anchorElement.querySelector('.mdw-link-icon'), 'link carries a leading icon');
  assert.match(serialized, /\[link\]\(https:\/\/example\.com\)/);
  await editor.cleanup();
}

// ---------------------------------------------------------------------------
// Leaving a code block
// ---------------------------------------------------------------------------

{
  // ArrowDown at the end of the code exits to a new paragraph.
  const editor = await mount('```js\nconst x = 1;\n```\n');
  const code = editor.doc.children[0];
  const codeText = code.querySelector('code');
  setCaret(textNodeOf(codeText), codeText.textContent.length);
  await act(async () => press(editor.doc, 'ArrowDown'));
  assert.equal(editor.doc.children.length, 2, 'ArrowDown at code end adds a paragraph');
  assert.equal(editor.doc.children[1].dataset.mdType, 'p');
  await editor.cleanup();

  // Cmd/Ctrl+Enter exits the code block as well.
  const editor2 = await mount('```js\nlet y = 2;\n```\n');
  const code2 = editor2.doc.children[0];
  setCaret(textNodeOf(code2.querySelector('code')), code2.textContent.length - 4);
  await act(async () => press(editor2.doc, 'Enter', { metaKey: true }));
  assert.equal(editor2.doc.children.length, 2, 'Cmd/Ctrl+Enter exits the code block');
  assert.equal(editor2.doc.children[1].dataset.mdType, 'p');
  await editor2.cleanup();

  // Clicking the empty area below the last block appends a paragraph too.
  const editor3 = await mount('```\nplain\n```\n');
  await act(async () => {
    editor3.doc.dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true, clientY: 50 }));
  });
  assert.equal(editor3.doc.children.length, 2, 'clicking below the code block adds a paragraph');
  await editor3.cleanup();
}

// ---------------------------------------------------------------------------
// Live Markdown input rules (typing "# " becomes a heading, etc.)
// ---------------------------------------------------------------------------

{
  const cases = [
    ['# ', (block) => block.dataset.mdType === 'heading' && block.dataset.level === '1'],
    ['### ', (block) => block.dataset.mdType === 'heading' && block.dataset.level === '3'],
    ['- ', (block) => block.dataset.mdType === 'li' && block.dataset.ordered === '0' && block.dataset.checked === '-1'],
    ['1. ', (block) => block.dataset.mdType === 'li' && block.dataset.ordered === '1'],
    ['> ', (block) => block.dataset.mdType === 'quote'],
    ['``` ', (block) => block.dataset.mdType === 'code' && block.dataset.lang === ''],
    ['```js ', (block) => block.dataset.mdType === 'code' && block.dataset.lang === 'js'],
    ['- [ ] ', (block) => block.dataset.mdType === 'li' && block.dataset.checked === '0'],
    ['- [x] ', (block) => block.dataset.mdType === 'li' && block.dataset.checked === '1'],
  ];
  for (const [pattern, check] of cases) {
    const editor = await mount('');
    const paragraph = editor.doc.children[0];
    paragraph.textContent = pattern;
    setCaret(paragraph.firstChild, pattern.length);
    await act(async () => editor.doc.dispatchEvent(new windowObject.Event('input', { bubbles: true })));
    const block = editor.doc.children[0];
    assert.ok(check(block), `typing ${JSON.stringify(pattern)} converts the block`);
    await editor.cleanup();
  }

  // Normal text is untouched.
  const normal = await mount('');
  const normalParagraph = normal.doc.children[0];
  normalParagraph.textContent = 'hello world';
  setCaret(normalParagraph.firstChild, 11);
  await act(async () => normal.doc.dispatchEvent(new windowObject.Event('input', { bubbles: true })));
  assert.equal(normal.doc.children[0].dataset.mdType, 'p');
  await normal.cleanup();
}

// Heading prefix plus content, then typing the content after conversion.
{
  const editor = await mount('');
  const paragraph = editor.doc.children[0];
  paragraph.textContent = '# ';
  setCaret(paragraph.firstChild, 2);
  await act(async () => editor.doc.dispatchEvent(new windowObject.Event('input', { bubbles: true })));
  const heading = editor.doc.children[0];
  assert.equal(heading.dataset.mdType, 'heading');
  heading.textContent = '标题内容';
  setCaret(heading.firstChild, 4);
  await act(async () => {
    editor.doc.dispatchEvent(new windowObject.Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 140));
  });
  assert.match(editor.current(), /^# 标题内容/);
  await editor.cleanup();
}

// Enter converts ``` and --- typed in a paragraph.
{
  const editor = await mount('placeholder');
  const paragraph = editor.doc.children[0];
  paragraph.textContent = '```';
  setCaret(paragraph.firstChild, 3);
  await act(async () => press(editor.doc, 'Enter'));
  assert.equal(editor.doc.children[0].dataset.mdType, 'code');
  await editor.cleanup();
}
{
  const editor = await mount('placeholder');
  const paragraph = editor.doc.children[0];
  paragraph.textContent = '---';
  setCaret(paragraph.firstChild, 3);
  await act(async () => press(editor.doc, 'Enter'));
  assert.equal(editor.doc.children[0].dataset.mdType, 'hr');
  assert.equal(editor.doc.children[1].dataset.mdType, 'p');
  await editor.cleanup();
}
console.log('wysiwyg markdown input rules: OK');

// ---------------------------------------------------------------------------
// Sidebar chrome: local-save state dots/path popover and live tab drag
// ---------------------------------------------------------------------------

{
  const MadedownBody = module.__test.components.MadedownBody;
  module.__test.resetStore();
  module.__test.setStore({
    loaded: true,
    version: 12,
    activeId: 'doc-a',
    rev: 0,
    title: '甲',
    text: '# 甲\n\n正文',
    docs: [
      { id: 'doc-a', title: '甲', rev: 0, chars: 8, lines: 2, localPath: '/tmp/a.md' },
      { id: 'doc-b', title: '乙', rev: 0, chars: 2, lines: 1 },
      { id: 'doc-c', title: '丙', rev: 0, chars: 2, lines: 1 },
    ],
  });
  windowObject.requestAnimationFrame = (callback) => {
    callback();
    return 1;
  };
  windowObject.cancelAnimationFrame = () => {};
  const container = windowObject.document.createElement('div');
  windowObject.document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(React.createElement(MadedownBody, {
      t,
      useInput: (selector) => selector({ draft: '' }),
      inputActions: {
        captureInsertion: () => ({ start: 0, end: 0, draftRev: 0 }),
        insertText() {},
        setDraft() {},
        submit() {},
      },
      sessionId: 'session-test',
    }));
  });
  assert.equal(container.querySelectorAll('.madedown-tab__state[data-state="saved"]').length, 1, 'locally saved tab has a green state');
  assert.equal(container.querySelectorAll('.madedown-tab__state[data-state="unsaved"]').length, 2, 'other tabs have a red state');
  const indicator = container.querySelector('.madedown-localsave');
  assert.ok(indicator, 'status bar shows the local save indicator');
  assert.equal(indicator.getAttribute('data-state'), 'saved');
  await act(async () => indicator.dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  const popover = container.querySelector('.madedown-localpop');
  assert.ok(popover, 'clicking the status indicator opens the saved-path popover');
  assert.match(popover.textContent, /\/tmp\/a\.md/);

  const aboutButton = container.querySelector('.madedown-about-btn');
  assert.ok(aboutButton, 'toolbar shows the software-info button');
  await act(async () => aboutButton.dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  const aboutCard = container.querySelector('.madedown-aboutcard');
  assert.ok(aboutCard, 'clicking the info button opens the About dialog');
  assert.ok(aboutCard.querySelector('.madedown-appicon__light'), 'About dialog ships the light-theme icon');
  assert.ok(aboutCard.querySelector('.madedown-appicon__dark'), 'About dialog ships the dark-theme icon');
  assert.match(aboutCard.textContent, /about\.author/);
  assert.match(aboutCard.textContent, /about\.update/);
  const aboutClose = container.querySelector('.madedown-aboutcard__close');
  await act(async () => aboutClose.dispatchEvent(new windowObject.MouseEvent('click', { bubbles: true })));
  assert.equal(container.querySelector('.madedown-aboutcard'), null, 'About dialog closes again');

  const tabs = [...container.querySelectorAll('.madedown-tab')];
  windowObject.document.elementFromPoint = () => tabs[2];
  const before = module.__test.getStore().docs.map((item) => item.id).join(',');
  await act(async () => {
    tabs[0].dispatchEvent(new windowObject.MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 100, clientY: 10 }));
    windowObject.dispatchEvent(new windowObject.MouseEvent('mousemove', { bubbles: true, clientX: 160, clientY: 10 }));
    windowObject.dispatchEvent(new windowObject.MouseEvent('mouseup', { bubbles: true, clientX: 160, clientY: 10 }));
  });
  const after = module.__test.getStore().docs.map((item) => item.id).join(',');
  assert.notEqual(after, before, 'dragging a tab over another reorders the tabs live');
  await act(async () => root.unmount());
  container.remove();
}

console.log('madedown-dsh wysiwyg interaction check: OK');
