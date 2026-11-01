window.__ModuleLoader__.load({
  id: 'dsh-madedown',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } = React;

    // ---------------------------------------------------------------------
    // Constants
    // ---------------------------------------------------------------------

    const NS = 'madedown';
    const KIND = 'madedown';
    const TYPE_ID = 'madedown-dsh';
    const API = '/madedown-dsh';
    const CSS_TAG = 'madedown-dsh/styles';
    const MODE_KEY = 'madedown-dsh.mode.v2';
    const COMPOSER_SEPARATOR = '\n\n';

    // ---------------------------------------------------------------------
    // Copy
    // ---------------------------------------------------------------------

    const zh = {
      title: 'Madedown',
      'guide.title': 'Madedown 编辑器',
      'guide.description': '所见即所得的实时 Markdown 编辑器，和对话双向联动',
      openHint: '打开 Madedown 编辑器',
      'mode.wysiwyg': '所见即所得',
      'mode.wysiwygShort': '渲染',
      'mode.source': 'Markdown 源码',
      'mode.sourceShort': '源码',
      'outline.toggle': '标题目录',
      'outline.title': '目录',
      'status.loading': '正在载入…',
      'status.saving': '保存中…',
      'status.saved': '已保存',
      'status.unsaved': '未保存',
      'local.savedShort': '已本地保存',
      'local.unsavedShort': '未本地保存',
      'local.savedTitle': '已保存到本地文件',
      'local.unsavedTitle': '尚未保存到本地文件',
      'local.savedHint': '点击查看本地保存路径',
      'local.unsavedHint': '点击保存到本地文件',
      'local.path': '本地文件路径',
      'local.copyPath': '复制路径',
      'local.copiedPath': '路径已复制',
      'status.conflict': '有冲突',
      'status.offline': '未连接',
      'status.version': 'v{version}',
      'by.user': '由你修改',
      'by.assistant': '由对话修改',
      'by.selection': '来自对话选区',
      'by.system': '新文档',
      'stats.chars': '{count} 个字',
      'table.rowAbove': '＋上行',
      'table.rowBelow': '＋下行',
      'table.colLeft': '＋左列',
      'table.colRight': '＋右列',
      'table.rowDelete': '删行',
      'table.colDelete': '删列',
      'table.delete': '删表格',
      'banner.conflict': '对话刚刚修改了文档，你的本地编辑尚未保存。',
      'banner.loadRemote': '载入对话版本',
      'banner.keepMine': '保留我的版本',
      'toast.sent': '已发送到 Madedown',
      'toast.sendFailed': '发送失败，请稍后重试',
      'toast.agentEdit': '对话更新了 Madedown 文档',
      'toast.open': '查看',
      'toast.insertedToChat': '已插入对话输入框（未发送）',
      'toast.insertFailed': '插入失败：当前会话输入框不可用',
      'toolbar.bold': '粗体 (⌘B)',
      'toolbar.italic': '斜体 (⌘I)',
      'toolbar.strike': '删除线 (⇧⌘X)',
      'toolbar.code': '行内代码 (⌘E)',
      'toolbar.link': '链接 (⌘K)',
      'toolbar.heading': '标题',
      'toolbar.list': '列表',
      'toolbar.task': '任务列表',
      'toolbar.quote': '引用',
      'toolbar.codeblock': '代码块',
      'toolbar.table': '表格',
      'toolbar.image': '图片',
      'toolbar.hr': '分割线',
      'slash.title': '插入 Markdown',
      'slash.paragraph': '正文',
      'slash.h1': '一级标题',
      'slash.h2': '二级标题',
      'slash.h3': '三级标题',
      'slash.h4': '四级标题',
      'slash.h5': '五级标题',
      'slash.h6': '六级标题',
      'slash.bold': '粗体',
      'slash.italic': '斜体',
      'slash.strike': '删除线',
      'slash.code': '行内代码',
      'slash.link': '链接',
      'slash.ul': '无序列表',
      'slash.ol': '有序列表',
      'slash.task': '任务列表',
      'slash.quote': '引用',
      'slash.codeblock': '代码块',
      'slash.table': '表格',
      'slash.hr': '分割线',
      'slash.image': '图片',
      'slash.empty': '没有匹配的格式',
      'slash.sample.bold': '粗体文本',
      'slash.sample.italic': '斜体文本',
      'slash.sample.strike': '删除文本',
      'slash.sample.code': '代码',
      'slash.sample.link': '链接文字',
      'placeholder': '开始写 Markdown… 输入「# + 空格」变标题、「- + 空格」变列表，或行首 / 打开格式菜单',
      'title.placeholder': '文档标题',
      'heading.paragraph': '正文',
      'error.title': 'Madedown 渲染出错',
      'selection.toChat': '插入到对话',
      'selection.toChatHint': '把编辑器中的选中内容插入对话输入框（不会发送）',
      'selection.send': '发送到 Madedown',
      'selection.hint': '把选中的对话内容追加到右侧编辑器',
      'action.close': '关闭',
      'block.delete': '删除此块',
      'url.title.link': '链接地址',
      'url.title.image': '图片地址',
      'url.placeholder': 'https://…',
      'url.confirm': '插入',
      'url.cancel': '取消',
      'tab.new': '新建标签',
      'tab.close': '关闭标签',
      'tab.rename': '重命名标签',
      'tab.untitled': '未命名笔记',
      'tab.count': '{count} 个标签',
      'about.open': '软件信息',
      'about.name': 'Madedown',
      'about.intro': '所见即所得的 Markdown 笔记编辑器：实时渲染、多标签、与对话双向联动，支持保存到本地。',
      'about.authorLabel': '作者',
      'about.author': 'zhxnix',
      'about.updateLabel': '最新更新',
      'about.update': 'v0.6.0：表格工具栏（插行/插列/删行/删列/删表格）、代码块退出快捷键、标签栏与主题细节优化。',
      'about.repoLabel': '代码仓库',
      'tab.closeConfirm': '关闭标签「{title}」？内容会从编辑器中删除。',
      'ref.title': '引用内容',
      'ref.hint': '点击引用标签可修改发送给模型的内容；右侧 × 可移除。',
      'ref.save': '保存',
      'ref.delete': '删除引用',
      'ref.close': '关闭',
      'ref.saved': '引用内容已更新',
      'ref.removed': '已删除引用',
      'ref.unavailable': '引用内容不可用',
      'code.label': '代码块',
      'code.copy': '复制',
      'code.copied': '已复制',
      'code.wrap': '自动换行',
      'code.unwrap': '不换行',
      'tip.insertToChat': '插入到对话',
      'tip.quickAsk': '快速提问',
      'ask.title': '针对选中内容快速提问',
      'ask.placeholder': '输入问题，回车发送到对话…',
      'ask.send': '发送',
      'ask.cancel': '取消',
      'toast.askSent': '已发送到对话',
      'toast.askFailed': '发送失败',
      'toast.refInserted': '已作为引用标签插入对话输入框',
      'toast.refFallback': '已插入对话输入框（引用模式不可用）',
      'tabs.overflow': '全部标签',
      'toast.imageUploading': '正在上传图片…',
      'toast.imageFailed': '图片插入失败',
      'toast.imageInserted': '图片已插入',

      'tab.closeAction': '关闭',
      'tab.cancel': '取消',
      'save.hint': '保存当前标签为本地 .md 文件 (⌘S)',
      'save.title': '保存到本地文件',
      'save.pathLabel': '文件路径',
      'save.placeholder': '~/Documents/笔记.md',
      'save.confirm': '保存',
      'save.cancel': '取消',
      'save.defaultHint': '留空则保存到 ~/Documents；路径支持 ~ 与绝对路径',
      'toast.tabRemoteSwitch': '对话切换了标签页（已保留你的编辑）',
      'toast.tabSwitchFailed': '切换标签失败',
      'toast.tabCreateFailed': '新建标签失败',
      'toast.tabCloseFailed': '关闭标签失败',
      'toast.savedFile': '已保存到 {path}',
      'toast.overwroteFile': '已覆盖保存到 {path}',
      'toast.saveFailed': '保存失败：{message}',
      'save.flushFailed': '当前内容尚未保存，请先解决冲突或稍后重试',
    };

    const en = {
      title: 'Madedown',
      'guide.title': 'Madedown editor',
      'guide.description': 'Live rendered Markdown editor linked to the conversation',
      openHint: 'Open the Madedown editor',
      'mode.wysiwyg': 'Live editing',
      'mode.wysiwygShort': 'Live',
      'mode.source': 'Markdown source',
      'mode.sourceShort': 'Source',
      'outline.toggle': 'Outline',
      'outline.title': 'Outline',
      'status.loading': 'Loading…',
      'status.saving': 'Saving…',
      'status.saved': 'Saved',
      'status.unsaved': 'Unsaved',
      'local.savedShort': 'Saved locally',
      'local.unsavedShort': 'Not saved locally',
      'local.savedTitle': 'Saved to a local file',
      'local.unsavedTitle': 'Not saved to a local file',
      'local.savedHint': 'Click to view the local file path',
      'local.unsavedHint': 'Click to save to a local file',
      'local.path': 'Local file path',
      'local.copyPath': 'Copy path',
      'local.copiedPath': 'Path copied',
      'status.conflict': 'Conflict',
      'status.offline': 'Offline',
      'status.version': 'v{version}',
      'by.user': 'Edited by you',
      'by.assistant': 'Edited by assistant',
      'by.selection': 'From a chat selection',
      'by.system': 'New document',
      'stats.chars': '{count} characters',
      'table.rowAbove': '＋Row ↑',
      'table.rowBelow': '＋Row ↓',
      'table.colLeft': '＋Col ←',
      'table.colRight': '＋Col →',
      'table.rowDelete': 'Del row',
      'table.colDelete': 'Del col',
      'table.delete': 'Del table',
      'banner.conflict': 'The assistant just changed the document while your local edits were unsaved.',
      'banner.loadRemote': 'Load the assistant version',
      'banner.keepMine': 'Keep my version',
      'toast.sent': 'Sent to Madedown',
      'toast.sendFailed': 'Could not send, please retry',
      'toast.agentEdit': 'The assistant updated the Madedown document',
      'toast.open': 'View',
      'toast.insertedToChat': 'Inserted into the chat input (not sent)',
      'toast.insertFailed': 'Could not insert: this session has no composer',
      'toolbar.bold': 'Bold (⌘B)',
      'toolbar.italic': 'Italic (⌘I)',
      'toolbar.strike': 'Strikethrough (⇧⌘X)',
      'toolbar.code': 'Inline code (⌘E)',
      'toolbar.link': 'Link (⌘K)',
      'toolbar.heading': 'Heading',
      'toolbar.list': 'List',
      'toolbar.task': 'Task list',
      'toolbar.quote': 'Quote',
      'toolbar.codeblock': 'Code block',
      'toolbar.table': 'Table',
      'toolbar.image': 'Image',
      'toolbar.hr': 'Divider',
      'slash.title': 'Insert Markdown',
      'slash.paragraph': 'Text',
      'slash.h1': 'Heading 1',
      'slash.h2': 'Heading 2',
      'slash.h3': 'Heading 3',
      'slash.h4': 'Heading 4',
      'slash.h5': 'Heading 5',
      'slash.h6': 'Heading 6',
      'slash.bold': 'Bold',
      'slash.italic': 'Italic',
      'slash.strike': 'Strikethrough',
      'slash.code': 'Inline code',
      'slash.link': 'Link',
      'slash.ul': 'Bullet list',
      'slash.ol': 'Numbered list',
      'slash.task': 'Task list',
      'slash.quote': 'Quote',
      'slash.codeblock': 'Code block',
      'slash.table': 'Table',
      'slash.hr': 'Divider',
      'slash.image': 'Image',
      'slash.empty': 'No matching format',
      'slash.sample.bold': 'bold text',
      'slash.sample.italic': 'italic text',
      'slash.sample.strike': 'struck text',
      'slash.sample.code': 'code',
      'slash.sample.link': 'link text',
      'placeholder': 'Write Markdown… type "# " for a heading, "- " for a list, or / at a line start for formats',
      'title.placeholder': 'Document title',
      'heading.paragraph': 'Text',
      'error.title': 'Madedown failed to render',
      'selection.toChat': 'Insert to chat',
      'selection.toChatHint': 'Insert the selected editor text into the chat input (does not send)',
      'selection.send': 'Send to Madedown',
      'selection.hint': 'Append the selected conversation text to the right editor',
      'action.close': 'Close',
      'block.delete': 'Delete this block',
      'url.title.link': 'Link URL',
      'url.title.image': 'Image URL',
      'url.placeholder': 'https://…',
      'url.confirm': 'Insert',
      'url.cancel': 'Cancel',
      'tab.new': 'New tab',
      'tab.close': 'Close tab',
      'tab.rename': 'Rename tab',
      'tab.untitled': 'Untitled note',
      'tab.count': '{count} tabs',
      'about.open': 'About',
      'about.name': 'Madedown',
      'about.intro': 'A live WYSIWYG Markdown notes editor with tabs, chat integration, and save-to-disk support.',
      'about.authorLabel': 'Author',
      'about.author': 'zhxnix',
      'about.updateLabel': 'Latest changes',
      'about.update': 'v0.6.0: table toolbar (insert/delete rows and columns), code-block exit shortcuts, and tab/theme polish.',
      'about.repoLabel': 'Repository',
      'tab.closeConfirm': 'Close tab "{title}"? Its content is removed from the editor.',
      'ref.title': 'Referenced content',
      'ref.hint': 'Edit what the model receives; use × to remove this reference.',
      'ref.save': 'Save',
      'ref.delete': 'Remove reference',
      'ref.close': 'Close',
      'ref.saved': 'Reference updated',
      'ref.removed': 'Reference removed',
      'ref.unavailable': 'Reference content unavailable',
      'code.label': 'Code',
      'code.copy': 'Copy',
      'code.copied': 'Copied',
      'code.wrap': 'Wrap lines',
      'code.unwrap': 'No wrap',
      'tip.insertToChat': 'Insert into chat',
      'tip.quickAsk': 'Quick ask',
      'ask.title': 'Ask about the selected content',
      'ask.placeholder': 'Type a question; Enter sends it to the chat…',
      'ask.send': 'Send',
      'ask.cancel': 'Cancel',
      'toast.askSent': 'Sent to chat',
      'toast.askFailed': 'Could not send',
      'toast.refInserted': 'Inserted as a reference chip in the chat input',
      'toast.refFallback': 'Inserted into the chat input (reference mode unavailable)',
      'tabs.overflow': 'All tabs',
      'toast.imageUploading': 'Uploading image…',
      'toast.imageFailed': 'Could not insert image',
      'toast.imageInserted': 'Image inserted',

      'tab.closeAction': 'Close',
      'tab.cancel': 'Cancel',
      'save.hint': 'Save the current tab as a local .md file (⌘S)',
      'save.title': 'Save to a local file',
      'save.pathLabel': 'File path',
      'save.placeholder': '~/Documents/note.md',
      'save.confirm': 'Save',
      'save.cancel': 'Cancel',
      'save.defaultHint': 'Empty saves under ~/Documents; ~ and absolute paths are supported',
      'toast.tabRemoteSwitch': 'The assistant switched tabs (your local edits were kept)',
      'toast.tabSwitchFailed': 'Could not switch tabs',
      'toast.tabCreateFailed': 'Could not create a tab',
      'toast.tabCloseFailed': 'Could not close the tab',
      'toast.savedFile': 'Saved to {path}',
      'toast.overwroteFile': 'Overwrote {path}',
      'toast.saveFailed': 'Save failed: {message}',
      'save.flushFailed': 'Current edits are not saved yet; resolve the conflict first',
    };

    // ---------------------------------------------------------------------
    // Styles
    // ---------------------------------------------------------------------

    const CSS = [
      '.madedown-root{display:flex;flex-direction:column;min-height:0;height:100%;width:100%;box-sizing:border-box;background:var(--dsw-specific-sidebar-fill);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5;overflow:hidden;position:relative}',
      '.madedown-head{flex:none;display:flex;flex-direction:column;gap:2px;padding:6px 8px 4px;border-bottom:1px solid var(--dsw-alias-border-l1)}',
      '.madedown-tabbar-row{display:flex;align-items:stretch;gap:6px;min-width:0;min-height:30px;margin:0 -8px;padding:0 8px 0 0;border-top:1px solid var(--dsw-alias-border-l1);border-bottom:1px solid var(--dsw-alias-border-l1)}',
      '.madedown-tab__rename{width:120px;min-width:40px;font:inherit;font-size:12px;color:inherit;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-brand-primary);border-radius:4px;padding:0 3px;outline:none}',
      '.madedown-title-input:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.madedown-title-input:focus{background:var(--dsw-alias-bg-layer-2)}',
      '.madedown-ibtn{display:inline-grid;place-items:center;width:26px;height:26px;padding:0;flex:none;color:var(--dsw-alias-label-secondary);background:transparent;border:none;border-radius:6px;cursor:pointer;font:inherit;position:relative}',
      '.madedown-ibtn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.madedown-ibtn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      '.madedown-ibtn:disabled{opacity:.4;cursor:default}',
      '.madedown-ibtn[data-active="true"]{color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-1)}',
      '.madedown-glyph-bg{fill:var(--dsw-alias-brand-primary)}',
      '.madedown-glyph-fg{fill:var(--dsw-alias-bg-base)}',
      '.madedown-glyph-line{stroke:var(--dsw-alias-bg-base);stroke-width:1;stroke-linecap:round;stroke-linejoin:round;fill:none}',
      '.madedown-glyph-text{font-size:12px;font-weight:700;line-height:1}',
      '.madedown-glyph-italic{font-style:italic}',
      '.madedown-glyph-strike{text-decoration:line-through}',
      '.madedown-glyph-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;font-weight:600}',
      '.madedown-toolbar-row{display:flex;align-items:center;gap:4px;min-width:0;padding-top:4px}',
      '.madedown-toolbar-row > .madedown-toolbar{flex:1;min-width:0}',
      '.madedown-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:1px}',
      '.madedown-toolbar-sep{width:1px;height:16px;background:var(--dsw-alias-border-l1);margin:0 3px;flex:none}',
      '.madedown-mode{display:flex;gap:1px;padding:1px;border-radius:7px;background:var(--dsw-alias-bg-layer-1);flex:none}',
      '.madedown-mode-btn{display:grid;place-items:center;width:24px;height:22px;padding:0;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit}',
      '.madedown-mode-btn:hover{color:var(--dsw-alias-label-primary)}',
      '.madedown-mode-btn[data-active="true"]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-border-l1)}',
      '.madedown-sync{display:inline-flex;align-items:center;gap:5px;flex:none;color:var(--dsw-alias-label-secondary);font-size:11px;padding:0 2px;max-width:86px;overflow:hidden}',
      '.madedown-dot{width:7px;height:7px;border-radius:999px;flex:none;background:var(--dsw-alias-state-idle-primary)}',
      '.madedown-dot[data-state="saved"]{background:var(--dsw-alias-state-success-primary)}',
      '.madedown-dot[data-state="saving"]{background:var(--dsw-alias-state-warn-primary)}',
      '.madedown-dot[data-state="conflict"]{background:var(--dsw-alias-state-error-primary)}',
      '.madedown-dot[data-state="offline"]{background:var(--dsw-alias-state-idle-primary)}',
      '.madedown-banner{flex:none;display:flex;align-items:center;gap:6px;padding:6px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);font-size:12px;color:var(--dsw-alias-label-primary)}',
      '.madedown-banner__text{flex:1;min-width:0}',
      '.madedown-banner__btn{flex:none;border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary);border-radius:6px;padding:2px 8px;font:inherit;font-size:12px;cursor:pointer}',
      '.madedown-banner__btn:hover{background:var(--dsw-alias-bg-base)}',
      '.madedown-body{flex:1;min-height:0;display:flex;flex-direction:column;position:relative}',
      '.madedown-source-wrap{flex:1;min-height:0;display:flex;position:relative}',
      '.madedown-source{flex:1;min-width:0;min-height:0;width:100%;box-sizing:border-box;resize:none;border:none;outline:none;background:transparent;color:var(--dsw-alias-label-primary);padding:10px 12px 16px;margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.7;tab-size:2;overflow:auto;white-space:pre-wrap;word-break:break-word}',
      '.madedown-source::placeholder{color:var(--dsw-alias-label-secondary);opacity:.75}',
      '.madedown-outline__head{display:flex;align-items:center;justify-content:space-between;padding:2px 4px 4px 8px;font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.madedown-outline__item{display:block;width:100%;text-align:left;border:none;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;line-height:1.35;padding:3px 6px;border-radius:5px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.madedown-outline__item:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.madedown-statusbar{flex:none;display:flex;align-items:center;gap:10px;padding:4px 10px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden}',
      '.madedown-statusbar__spacer{flex:1}',
      '.madedown-menu{position:fixed;z-index:2147483000;min-width:180px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;padding:4px;box-shadow:0 10px 28px rgba(0,0,0,.2);max-height:320px;overflow:auto}',
      '.madedown-menu__title{padding:4px 8px 5px;font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.madedown-menu__grid{display:grid;grid-template-columns:1fr 1fr;gap:1px}',
      '.madedown-menu__item{display:flex;align-items:center;gap:7px;width:100%;border:none;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;text-align:left;padding:5px 8px;border-radius:6px;cursor:pointer;white-space:nowrap}',
      '.madedown-menu__item:hover,.madedown-menu__item[data-active="true"]{background:var(--dsw-alias-bg-layer-2)}',
      '.madedown-menu__item[data-active="true"]{color:var(--dsw-alias-brand-primary)}',
      '.madedown-menu__empty{padding:6px 8px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.madedown-sel-toolbar{position:fixed;z-index:2147483001;display:flex;align-items:center;gap:2px;padding:4px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.24);pointer-events:auto}',
      '.madedown-sel-btn{display:inline-flex;align-items:center;gap:6px;border:none;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;padding:5px 10px 5px 8px;border-radius:999px;cursor:pointer;white-space:nowrap}',
      '.madedown-sel-btn:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.madedown-sel-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}',
      '.madedown-urlpop{position:fixed;z-index:2147483002;display:flex;align-items:center;gap:4px;width:280px;padding:6px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;box-shadow:0 10px 28px rgba(0,0,0,.22)}',
      '.madedown-urlpop__input{flex:1;min-width:0;font:inherit;font-size:12px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:4px 7px;outline:none}',
      '.madedown-urlpop__btn{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;border-radius:6px;padding:4px 7px;cursor:pointer}',
      '.madedown-urlpop__btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.madedown-urlpop__btn[data-primary="true"]{color:var(--dsw-alias-brand-primary)}',
      '.madedown-toast{position:fixed;right:18px;bottom:18px;z-index:2147483002;display:flex;align-items:center;gap:10px;max-width:340px;padding:9px 12px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.24);font-size:12px;color:var(--dsw-alias-label-primary);pointer-events:auto}',
      '.madedown-toast__text{flex:1;min-width:0}',
      '.madedown-toast__btn{border:none;background:transparent;color:var(--dsw-alias-brand-primary);font:inherit;font-size:12px;cursor:pointer;padding:2px 4px;border-radius:5px;flex:none}',
      '.madedown-toast__btn:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.madedown-chip{display:inline-flex;align-items:center;gap:5px;min-width:0;max-width:100%}',
      '.madedown-chip--icon{gap:0}',
      '.madedown-chip--logo{gap:0;padding:1px 30px 1px 2px;max-width:100%;overflow:visible}',
      '.madedown-chip--logo .madedown-wordmark{flex:none;width:62px;height:auto}',
      '.madedown-chip--logo .madedown-wordmark__img{height:auto;max-height:100%}',
      '.madedown-chip__text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.madedown-chip__dirty{width:6px;height:6px;border-radius:999px;background:var(--dsw-alias-state-warn-primary);flex:none}',
      '.madedown-error{padding:14px;color:var(--dsw-alias-state-error-primary);font-size:12px;white-space:pre-wrap;word-break:break-word}',
      '.mdw-root{flex:1;min-height:0;display:flex;flex-direction:column;position:relative}',
      '.mdw-scroll{flex:1;min-height:0;overflow:auto;padding:10px 14px 28px;cursor:text;background:var(--dsw-alias-bg-base)}',
      '.mdw-doc{outline:none;min-height:100%;font:var(--dsw-font-markdown-base);color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}',
      '.mdw-doc > .mdw-block:first-child{margin-top:0}',
      '.mdw-doc > .mdw-block:last-child{margin-bottom:0}',
      '.mdw-block{position:relative;margin:0;border-radius:5px;outline:none;min-height:1em}',
      '.mdw-block[data-placeholder]::before{content:attr(data-placeholder);position:absolute;left:0;top:0;color:var(--dsw-alias-label-secondary);opacity:.7;pointer-events:none;white-space:pre}',
      '.mdw-block[data-md-type="p"]{margin:16px 0}',
      '.mdw-h1{font:var(--dsw-font-markdown-h1);margin:32px 0 16px}',
      '.mdw-h2{font:var(--dsw-font-markdown-h2);margin:32px 0 16px}',
      '.mdw-h3{font:var(--dsw-font-markdown-h3);margin:32px 0 16px}',
      '.mdw-h4{font:var(--dsw-font-markdown-h4);margin:16px 0}',
      '.mdw-h5,.mdw-h6{font:var(--dsw-font-markdown-base-strong);margin:16px 0}',
      '.mdw-block[data-md-type="quote"]{border-left:2px solid var(--dsw-alias-label-caption);border-radius:0;margin:16px 0 0;padding:0 0 0 14px;color:color-mix(in srgb, var(--dsw-alias-label-primary) 70%, var(--dsw-alias-label-secondary) 30%)}',
      '.mdw-block[data-md-type="code"]{background:var(--dsw-alias-markdown-code-block);color:var(--dsw-alias-label-primary);border-radius:var(--dsw-radius-lg);margin:16px 0;overflow:hidden}',
      '.mdw-code-banner{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 18px 8px 22px;color:var(--dsw-alias-label-secondary);font:11px/18px var(--dsw-font-family);border-top-left-radius:inherit;border-top-right-radius:inherit}',
      '.mdw-code-lang{flex:none;color:var(--dsw-alias-label-tertiary);font-family:var(--ds-font-family-code)}',
      '.mdw-code-actions{display:flex;align-items:center;gap:4px;flex:none}',
      '.mdw-code-action{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.mdw-code-action:hover{background:var(--dsw-alias-interactive-bg-hover,var(--dsw-alias-bg-layer-2))}',
      '.mdw-code-icon{display:block}',
      '.mdw-code-icon--check,.mdw-code-icon--wrap{display:none}',
      '.mdw-code-action--copy[data-copied="true"] .mdw-code-icon--copy{display:none}',
      '.mdw-code-action--copy[data-copied="true"] .mdw-code-icon--check{display:block}',
      '.mdw-block[data-md-type="code"][data-wrap="true"] .mdw-code-icon--nowrap{display:block}',
      '.mdw-block[data-md-type="code"][data-wrap="true"] .mdw-code-icon--wrap{display:none}',
      '.mdw-block[data-md-type="code"][data-wrap="false"] .mdw-code-icon--nowrap{display:none}',
      '.mdw-block[data-md-type="code"][data-wrap="false"] .mdw-code-icon--wrap{display:block}',
      '.mdw-code-pre{font:var(--dsw-font-markdown-code-block);padding:6px 22px 20px;margin:0;overflow-x:auto;white-space:pre-wrap;word-break:break-all;tab-size:2;background:transparent;border-radius:0}',
      '.mdw-block[data-md-type="code"][data-wrap="false"] .mdw-code-pre{white-space:pre;word-break:normal;overflow-wrap:normal}',
      '.mdw-code-pre code{font:inherit;background:none;border:none;border-radius:0;padding:0;white-space:inherit}',
      '.mdw-block[data-md-type="table"]{margin:16px 0;max-width:100%;overflow-x:auto}',
      '.mdw-block[data-md-type="table"] table{border-collapse:collapse;font:var(--dsw-font-markdown-table);width:100%;max-width:100%}',
      '.mdw-block[data-md-type="table"]:has(th:nth-child(4),td:nth-child(4)) table{width:max-content;max-width:none}',
      '.mdw-block[data-md-type="table"] th,.mdw-block[data-md-type="table"] td{border:none;border-bottom:.5px solid var(--dsw-alias-border-l2);padding:10px 16px;min-width:100px;max-width:min(30vw,320px);text-align:start;vertical-align:top}',
      '.mdw-block[data-md-type="table"] th{border-bottom-color:var(--dsw-alias-border-l3);font:var(--dsw-font-markdown-table-head);font-weight:500}',
      '.mdw-block[data-md-type="table"] th:first-child,.mdw-block[data-md-type="table"] td:first-child{padding-left:0}',
      '.mdw-block[data-md-type="table"] td:last-child{padding-right:0}',
      '.mdw-block[data-md-type="hr"]{padding:6px 0;margin:26px 0;cursor:default}',
      '.mdw-hr-line{display:block;height:.5px;background:var(--dsw-alias-border-l2);pointer-events:none}',
      '.mdw-li{display:flex;align-items:flex-start;gap:4px;margin:0;min-height:1.5em}',
      '.mdw-li[data-ordered="0"][data-checked="-1"]{display:list-item;list-style:disc outside;margin-left:18px}',
      '.mdw-li[data-ordered="0"][data-checked="-1"] .mdw-marker-holder{display:none}',
      '.mdw-li[data-ordered="0"][data-checked="-1"][data-indent="1"]{margin-left:36px}',
      '.mdw-li[data-ordered="0"][data-checked="-1"][data-indent="2"]{margin-left:54px}',
      '.mdw-li[data-ordered="0"][data-checked="-1"][data-indent="3"]{margin-left:72px}',
      '.mdw-li[data-checked="-1"]::marker{color:var(--dsw-alias-label-secondary);line-height:24px}',
      '.mdw-li[data-checked="0"],.mdw-li[data-checked="1"]{padding-left:18px;gap:8px}',
      '.mdw-li + .mdw-li{margin-top:6px}',
      '.mdw-block:not(.mdw-li) + .mdw-li{margin-top:16px}',
      '.mdw-li:has(+ .mdw-block:not(.mdw-li)),.mdw-doc > .mdw-li:last-child{margin-bottom:16px}',
      '.mdw-li[data-indent="1"]{margin-left:18px}',
      '.mdw-li[data-indent="2"]{margin-left:36px}',
      '.mdw-li[data-indent="3"]{margin-left:54px}',
      '.mdw-marker-holder{flex:none;min-width:14px;text-align:right;color:var(--dsw-alias-label-secondary);user-select:none;font-variant-numeric:tabular-nums;line-height:24px}',
      '.mdw-li-text{flex:1;min-width:0}',
      '.mdw-check{flex:none;margin:4px 0 0;width:14px;height:14px;accent-color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.mdw-doc a{color:var(--dsw-alias-link);font-weight:500;text-decoration:none;cursor:pointer}',
      '.mdw-doc a:hover{text-decoration:underline dotted var(--dsw-alias-link);text-underline-offset:3px}',
      '.mdw-doc img{max-width:100%;border-radius:var(--dsw-radius-md);vertical-align:bottom}',
      '.mdw-doc code{display:inline-flex;align-items:center;box-sizing:border-box;font:var(--dsw-font-markdown-code);font-family:var(--ds-font-family-code);font-size:.875em;background-color:var(--dsw-alias-markdown-inline-code);border:.5px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-sm);padding:0 5px}',
      '.mdw-doc strong{font-weight:600}',
      '.mdw-block-tools{position:absolute;top:-7px;right:2px;display:flex;gap:2px;opacity:0;pointer-events:none;transition:opacity .12s}',
      '.mdw-block:hover > .mdw-block-tools,.mdw-block:focus-within > .mdw-block-tools{opacity:1;pointer-events:auto}',
      '.mdw-block-tools button{display:grid;place-items:center;width:20px;height:20px;padding:0;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:1;cursor:pointer}',
      '.mdw-block-tools button:hover{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}',
      '.madedown-tabs{flex:1;min-width:0;display:flex;align-items:stretch;gap:2px;align-self:stretch;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}',
      '.madedown-tabs::-webkit-scrollbar{display:none}',
      '.madedown-tab{position:relative;display:flex;align-items:center;gap:2px;flex:none;max-width:180px;min-width:0;padding:4px 3px 4px 8px;border-radius:7px 7px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5;background:transparent;border:1px solid transparent;align-self:stretch;cursor:pointer}',
      '.madedown-tab:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}',
      '.madedown-tab:hover{background:color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent);color:var(--dsw-alias-label-primary);border-radius:0}',
      '.madedown-tab[data-active="true"]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-color:transparent;border-radius:0}',
      '.madedown-tab[data-active="true"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:#0b49d9}',
      '.madedown-tab__label{display:flex;align-items:center;gap:4px;min-width:0;border:none;background:transparent;color:inherit;font:inherit;cursor:pointer;padding:0}',
      '.madedown-tab__title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}',
      '.madedown-tab__state{width:6px;height:6px;border-radius:999px;flex:none;margin-left:1px}',
      '.madedown-tab__state[data-state="saved"]{background:var(--dsw-alias-state-success-primary)}',
      '.madedown-tab__state[data-state="unsaved"],.madedown-tab__state[data-state="dirty"]{background:var(--dsw-alias-state-error-primary)}',
      '.madedown-tab{cursor:grab;user-select:none}',
      '.madedown-tab:active{cursor:grabbing}',
      '.madedown-tab[data-dragging="true"]{opacity:.6}',
      '.madedown-localsave{display:inline-flex;align-items:center;gap:5px;flex:none;max-width:200px;padding:1px 5px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:1.5;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.madedown-localsave:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.madedown-localsave__dot{width:6px;height:6px;border-radius:999px;flex:none;background:var(--dsw-alias-state-error-primary)}',
      '.madedown-localsave[data-state="saved"] .madedown-localsave__dot{background:var(--dsw-alias-state-success-primary)}',
      '.madedown-localpop{position:fixed;z-index:2147483002;display:flex;flex-direction:column;gap:6px;width:360px;max-width:calc(100vw - 16px);padding:10px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;box-shadow:0 10px 28px rgba(0,0,0,.22)}',
      '.madedown-localpop__label{color:var(--dsw-alias-label-caption);font-size:11px}',
      '.madedown-localpop__path{color:var(--dsw-alias-label-primary);font-size:12px;line-height:1.5;word-break:break-all;user-select:text}',
      '.madedown-localpop__actions{display:flex;justify-content:flex-end;gap:6px}',
      '.madedown-localpop__btn{padding:3px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;cursor:pointer}',
      '.madedown-tab__close{display:grid;place-items:center;width:16px;height:16px;flex:none;padding:0;border:none;border-radius:4px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:12px;line-height:1;opacity:0}',
      '.madedown-tab:hover .madedown-tab__close,.madedown-tab[data-active="true"] .madedown-tab__close{opacity:1}',
      '.madedown-tab__close:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.madedown-tab-new{display:grid;place-items:center;flex:none;align-self:center;width:24px;height:22px;margin-left:2px;padding:0;border:none;border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);cursor:pointer;font:inherit;font-size:16px;line-height:1}',
      '.madedown-tab-new:hover{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary)}',
      '.madedown-savepop{position:fixed;z-index:2147483002;display:flex;flex-direction:column;gap:6px;width:340px;padding:8px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:9px;box-shadow:0 10px 28px rgba(0,0,0,.22)}',
      '.madedown-savepop__label{font-size:11px;color:var(--dsw-alias-label-secondary);padding:0 2px}',
      '.madedown-savepop__input{width:100%;box-sizing:border-box;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:5px 7px;outline:none}',
      '.madedown-savepop__hint{font-size:10px;color:var(--dsw-alias-label-secondary);padding:0 2px;line-height:1.4}',
      '.madedown-savepop__actions{display:flex;justify-content:flex-end;gap:4px}',
      '.madedown-savepop__btn{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:4px 9px;border-radius:6px;cursor:pointer}',
      '.madedown-savepop__btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.madedown-savepop__btn[data-primary="true"]{color:var(--dsw-alias-brand-primary)}',
      '.madedown-menu__text{padding:6px 8px 8px;font-size:12px;line-height:1.5;white-space:normal;color:var(--dsw-alias-label-primary)}',
      '.madedown-menu__actions{display:flex;justify-content:flex-end;gap:4px;padding:0 4px 4px}',
      '.madedown-menu__btn{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:4px 9px;border-radius:6px;cursor:pointer}',
      '.madedown-menu__btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.madedown-menu__btn[data-primary="true"]{color:var(--dsw-alias-state-error-primary)}',
      '.madedown-mode{display:inline-flex;align-items:center;gap:2px;padding:2px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);flex:none}',
      '.madedown-mode-btn{display:inline-flex;align-items:center;gap:3px;width:auto;height:20px;min-width:0;padding:0 6px;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:1;cursor:pointer;white-space:nowrap}',
      '.madedown-mode-btn:hover{color:var(--dsw-alias-label-primary)}',
      '.madedown-mode-btn[data-active="true"]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:0 1px 2px rgba(0,0,0,.08),0 0 0 1px var(--dsw-alias-border-l1)}',
      '.madedown-outline{position:absolute;top:8px;right:26px;width:180px;max-height:min(52%,400px);overflow:auto;background:#0f2744;backdrop-filter:blur(8px);border:1px solid rgba(122,169,255,.30);border-radius:9px;padding:5px;z-index:6;box-shadow:0 8px 24px rgba(0,0,0,.28);transition:opacity .15s ease;opacity:.8;color:#e7efff}',
      '.madedown-outline[data-transient="true"]{opacity:.8}',
      '.madedown-outline__head{color:rgba(231,239,255,.72)}',
      '.madedown-outline__head .madedown-ibtn{color:rgba(231,239,255,.75)}',
      '.madedown-outline__head .madedown-ibtn:hover{background:rgba(255,255,255,.14);color:#ffffff}',
      '.madedown-outline__item{color:#e7efff}',
      '.madedown-outline__item:hover{background:rgba(255,255,255,.14);color:#ffffff}',
      '.madedown-outline-handle{position:absolute;top:8px;right:4px;z-index:5;display:flex;align-items:center;justify-content:center;width:22px;height:44px;padding:0;border:1px solid rgba(122,169,255,.30);border-radius:8px;background:#0f2744;color:#dbe7ff;font:inherit;font-size:10px;line-height:1.1;letter-spacing:.08em;writing-mode:vertical-rl;cursor:pointer;opacity:.6;transition:opacity .15s}',
      '.madedown-outline-handle:hover{opacity:1;color:#ffffff}',
      '.mdw-tabletools{position:fixed;z-index:2147483002;display:flex;align-items:center;flex-wrap:wrap;gap:2px;max-width:calc(100vw - 16px);padding:3px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.18)}',
      '.mdw-tabletools__btn{padding:3px 7px;border:none;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:1.5;white-space:nowrap;cursor:pointer}',
      '.mdw-tabletools__btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.mdw-tabletools__btn[data-danger="true"]{color:var(--dsw-alias-state-error-primary)}',
      '.mdw-tabletools__btn[data-danger="true"]:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.madedown-tooltip{position:fixed;z-index:2147483003;padding:3px 7px;border-radius:6px;background:color-mix(in srgb,var(--dsw-alias-bg-overlay) 86%,transparent);backdrop-filter:blur(6px);border:1px solid var(--dsw-alias-border-l1);box-shadow:0 4px 14px rgba(0,0,0,.14);color:var(--dsw-alias-label-primary);font:inherit;font-size:11px;line-height:1.45;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.92}',
      '.madedown-tabfooter{display:none}',
      '.madedown-taboverflow-btn{flex:none;align-self:center;display:inline-flex;align-items:center;justify-content:center;width:26px;height:22px;padding:0;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.madedown-taboverflow-btn:hover{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary)}',
      '.madedown-taboverflow-glyph{display:block;font-size:0;line-height:0}',
      '.madedown-tab[data-dragging="true"]{opacity:.55}',
      '.madedown-tabmenu{max-height:min(340px,60vh);overflow:auto}',
      '.madedown-tabmenu__item[data-active="true"]{color:var(--dsw-alias-brand-primary);font-weight:500}',
      '.madedown-askpop{position:fixed;z-index:2147483002;display:flex;flex-direction:column;gap:6px;padding:9px;border-radius:10px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);box-shadow:0 10px 28px rgba(0,0,0,.22)}',
      '.madedown-askpop__title{font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.madedown-askpop__input{width:100%;box-sizing:border-box;min-height:84px;resize:vertical;font:inherit;font-size:12px;line-height:1.5;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;padding:6px 8px;outline:none}',
      '.madedown-askpop__actions{display:flex;justify-content:flex-end;gap:4px}',
      '.madedown-askpop__btn{border:none;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:4px 9px;border-radius:6px;cursor:pointer}',
      '.madedown-askpop__btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.madedown-askpop__btn[data-primary="true"]{color:var(--dsw-alias-brand-primary)}',
      '.madedown-sel-btn--ask{border-left:1px solid var(--dsw-alias-border-l1);margin-left:2px;padding-left:8px}',
      '.mdw-block[data-md-type="p"] img{display:block;max-width:100%;border-radius:var(--dsw-radius-md);margin:0}',
      '.madedown-refmask{position:fixed;inset:0;z-index:2147483004;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.24)}',
      '.madedown-refcard{display:flex;flex-direction:column;gap:8px;width:min(560px,calc(100vw - 48px));max-height:min(70vh,560px);padding:14px;border-radius:12px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);box-shadow:0 18px 48px rgba(0,0,0,.28)}',
      '.madedown-refcard__head{display:flex;align-items:center;justify-content:space-between;gap:8px}',
      '.madedown-refcard__title{font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.madedown-refcard__hint{font-size:11px;line-height:1.5;color:var(--dsw-alias-label-secondary)}',
      '.madedown-refcard__text{flex:1;min-height:180px;box-sizing:border-box;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 10px;outline:none}',
      '.madedown-refcard__actions{display:flex;justify-content:flex-end;gap:6px}',
      '.madedown-refcard__btn{border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;padding:5px 12px;border-radius:7px;cursor:pointer}',
      '.madedown-refcard__btn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}',
      '.madedown-refcard__btn[data-primary="true"]{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}',
      '.madedown-refcard__btn[data-danger="true"]{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}',
      '.madedown-about-btn{width:26px;height:24px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;color:var(--dsw-alias-label-primary)}',
      '.madedown-about-btn:hover{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary)}',
      '.madedown-save-btn{width:26px;height:24px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;color:var(--dsw-alias-label-primary)}',
      '.madedown-save-btn:hover{background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary)}',
      '.madedown-appicon{display:inline-flex;flex:none;align-items:center;justify-content:center;border-radius:4px;overflow:hidden}',
      '.madedown-appicon__img{display:block;width:100%;height:100%;object-fit:contain}',
      '.madedown-appicon__dark{display:none}',
      '.madedown-wordmark{display:inline-flex;align-items:center;flex:none;max-width:100%;overflow:hidden}',
      '.madedown-wordmark__img{display:block;height:100%;width:auto;max-width:100%;object-fit:contain}',
      '.madedown-wordmark__dark{display:none}',
      '[data-ds-dark-theme] .madedown-appicon__light{display:none}',
      '[data-ds-dark-theme] .madedown-appicon__dark{display:block}',
      '[data-ds-dark-theme] .madedown-wordmark__light{display:none}',
      '[data-ds-dark-theme] .madedown-wordmark__dark{display:block}',
      '.madedown-chip__wordmark{display:block;max-width:96px}',
      '.madedown-aboutmask{position:fixed;inset:0;z-index:2147483003;display:grid;place-items:center;padding:16px;background:rgba(0,0,0,.38);backdrop-filter:blur(2px)}',
      '.madedown-aboutcard{position:relative;display:flex;flex-direction:column;gap:12px;width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 64px);overflow:auto;padding:18px 18px 14px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;box-shadow:0 18px 48px rgba(0,0,0,.32);color:var(--dsw-alias-label-primary)}',
      '.madedown-aboutcard__close{position:absolute;top:10px;right:10px}',
      '.madedown-aboutcard__head{display:flex;align-items:center;gap:12px;padding-right:24px}',
      '.madedown-aboutcard__icon{display:inline-flex;width:52px;height:52px;border-radius:12px;flex:none;box-shadow:0 2px 8px rgba(0,0,0,.18);overflow:hidden}',
      '.madedown-aboutcard__names{display:flex;flex-direction:column;gap:4px;min-width:0}',
      '.madedown-aboutcard__wordmark{display:inline-flex;height:24px;max-width:100%}',
      '.madedown-aboutcard__version{color:var(--dsw-alias-label-caption);font-size:11px}',
      '.madedown-aboutcard__intro{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.65}',
      '.madedown-aboutcard__meta{display:flex;flex-direction:column;gap:7px;padding-top:6px;border-top:1px solid var(--dsw-alias-border-l1);font-size:12px;line-height:1.6}',
      '.madedown-aboutcard__row{display:flex;gap:10px}',
      '.madedown-aboutcard__label{flex:none;min-width:64px;color:var(--dsw-alias-label-caption)}',
      '.madedown-aboutcard__value{color:var(--dsw-alias-label-primary);word-break:break-word}',
      '.madedown-aboutcard__muted{color:var(--dsw-alias-label-secondary)}',
      '.madedown-aboutcard__link{color:var(--dsw-alias-link);text-decoration:none}',
      '.madedown-aboutcard__link:hover{text-decoration:underline}',
      '.madedown-aboutcard__actions{display:flex;justify-content:flex-end;gap:8px}',
      '.mdw-link-icon{display:inline-flex;align-items:center;justify-content:center;width:1.1em;height:1.1em;flex:none;vertical-align:-0.25em;margin-right:5px;color:currentColor}',
      '.mdw-link-icon svg{display:block;width:100%;height:100%}',
    ].join('');

    // ---------------------------------------------------------------------
    // Icons
    // ---------------------------------------------------------------------

    function svgIcon(paths, viewBox) {
      const Icon = function MdIcon({ size = 16, className }) {
        return h('svg', {
          width: size,
          height: size,
          viewBox: viewBox || '0 0 16 16',
          fill: 'none',
          'aria-hidden': 'true',
          className,
        }, paths.map((entry, index) => h(entry.tag || 'path', { key: index, ...entry.attrs })));
      };
      return Icon;
    }

    const MarkdownGlyph = function MarkdownGlyph({ size = 16 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': 'true' },
        h('rect', { x: 1.5, y: 2, width: 13, height: 12, rx: 2.5, className: 'madedown-glyph-bg' }),
        h('path', { d: 'M4 11V5h1.5l1.9 2.8L9.3 5H11v6H9.7V7.8L7.9 10.4h-.7L5.3 7.8V11z', className: 'madedown-glyph-fg' }),
        h('path', { d: 'M12.2 5v4.1m0 0 1-1m-1 1-1-1', className: 'madedown-glyph-line' }));
    };

    const MADEDOWN_ICON_LIGHT = 'data:image/webp;base64,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';
    const MADEDOWN_ICON_DARK = 'data:image/webp;base64,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';
    const MADEDOWN_WORDMARK_LIGHT = 'data:image/webp;base64,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';
    const MADEDOWN_WORDMARK_DARK = 'data:image/webp;base64,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';

    const MADEDOWN_APP_VERSION = '0.6.0';
    const MADEDOWN_REPO_URL = 'https://github.com/zhxnix/dsh-madedown';

    const MadedownIcon = function MadedownIcon({ size = 16, className }) {
      return h('span', {
        className: className ? `madedown-appicon ${className}` : 'madedown-appicon',
        style: { width: `${size}px`, height: `${size}px` },
      },
      h('img', { className: 'madedown-appicon__img madedown-appicon__light', src: MADEDOWN_ICON_LIGHT, alt: '', draggable: false }),
      h('img', { className: 'madedown-appicon__img madedown-appicon__dark', src: MADEDOWN_ICON_DARK, alt: '', draggable: false }));
    };

    const MadedownWordmark = function MadedownWordmark({ height = 14, className }) {
      return h('span', {
        className: className ? `madedown-wordmark ${className}` : 'madedown-wordmark',
        style: { height: `${height}px` },
        role: 'img',
        'aria-label': 'Madedown',
      },
      h('img', { className: 'madedown-wordmark__img madedown-wordmark__light', src: MADEDOWN_WORDMARK_LIGHT, alt: '', draggable: false }),
      h('img', { className: 'madedown-wordmark__img madedown-wordmark__dark', src: MADEDOWN_WORDMARK_DARK, alt: '', draggable: false }));
    };

    const IconInfo = svgIcon([
      { tag: 'circle', attrs: { cx: 8, cy: 8, r: 6.2, stroke: 'currentColor', strokeWidth: 0.7, fill: 'none' } },
      { attrs: { d: 'M8 4.8v4.4', stroke: 'currentColor', strokeWidth: 0.85, strokeLinecap: 'round' } },
      { tag: 'circle', attrs: { cx: 8, cy: 11.5, r: 0.58, fill: 'currentColor' } },
    ]);

    const IconLink = svgIcon([
      { attrs: { d: 'M6.4 9.6 9.6 6.4M7.1 5.2l1.2-1.2a2.8 2.8 0 0 1 4 4L11 9.2M8.9 10.8l-1.2 1.2a2.8 2.8 0 0 1-4-4L5 6.8', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } },
    ]);
    const IconBullets = svgIcon([
      { attrs: { d: 'M6 4.5h7M6 8h7M6 11.5h7', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' } },
      { tag: 'circle', attrs: { cx: 3, cy: 4.5, r: 1, fill: 'currentColor' } },
      { tag: 'circle', attrs: { cx: 3, cy: 8, r: 1, fill: 'currentColor' } },
      { tag: 'circle', attrs: { cx: 3, cy: 11.5, r: 1, fill: 'currentColor' } },
    ]);
    const IconTask = svgIcon([
      { attrs: { d: 'M2.5 4.2h2.2v2.2H2.5zM2.5 9.6h2.2v2.2H2.5z', stroke: 'currentColor', strokeWidth: 1.2 } },
      { attrs: { d: 'm2.9 5 .55.55 1-1.1', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', strokeLinejoin: 'round' } },
      { attrs: { d: 'M7 5.3h6.5M7 10.7h6.5', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' } },
    ]);
    const IconQuote = svgIcon([
      { attrs: { d: 'M3 3v10', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' } },
      { attrs: { d: 'M6 4.5h7M6 8h7M6 11.5h5', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' } },
    ]);
    const IconCodeBlock = svgIcon([
      { tag: 'rect', attrs: { x: 2, y: 3, width: 12, height: 10, rx: 2, stroke: 'currentColor', strokeWidth: 1.3 } },
      { attrs: { d: 'm6.2 6.4-1.7 1.6 1.7 1.6M9.8 6.4l1.7 1.6-1.7 1.6', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' } },
    ]);
    const IconTable = svgIcon([
      { tag: 'rect', attrs: { x: 2, y: 3, width: 12, height: 10, rx: 1.5, stroke: 'currentColor', strokeWidth: 1.3 } },
      { attrs: { d: 'M2 6.5h12M2 9.5h12M6 3v10M10 3v10', stroke: 'currentColor', strokeWidth: 1.1 } },
    ]);
    const IconImage = svgIcon([
      { tag: 'rect', attrs: { x: 2, y: 3, width: 12, height: 10, rx: 1.5, stroke: 'currentColor', strokeWidth: 1.3 } },
      { tag: 'circle', attrs: { cx: 5.6, cy: 6.2, r: 1.1, fill: 'currentColor' } },
      { attrs: { d: 'm3.2 11.6 3.2-3 2.2 2 1.7-1.6 2.5 2.6', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' } },
    ]);
    const IconHr = svgIcon([{ attrs: { d: 'M2.5 8h11', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeDasharray: '2.6 2.2' } }]);
    const IconPencil = svgIcon([
      { attrs: { d: 'M2.8 13.2 3.4 10l7.3-7.3a1.5 1.5 0 0 1 2.1 2.1L5.5 12l-2.7.7z', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' } },
    ]);
    const IconOutline = svgIcon([
      { attrs: { d: 'M3 4h10M5 8h8M7 12h6', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' } },
    ]);
    const IconClose = svgIcon([
      { attrs: { d: 'm4 4 8 8M12 4l-8 8', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' } },
    ]);
    const IconSend = svgIcon([
      { attrs: { d: 'M2.5 8 13.5 2.8 9.2 13.5 7.3 9.1z', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' } },
      { attrs: { d: 'M7.3 9.1 13.5 2.8', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round' } },
    ]);
    const IconChevronDown = svgIcon([
      { attrs: { d: 'M3.4 6.1 8 10.7l4.6-4.6', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } },
    ]);
    const IconDownload = svgIcon([
      { attrs: { d: 'M8 2.5v7.2m0 0 2.8-2.8M8 9.7 5.2 6.9', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } },
      { attrs: { d: 'M2.8 11.2v1.3c0 .6.4 1 1 1h8.4c.6 0 1-.4 1-1v-1.3', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' } },
    ]);

    // ---------------------------------------------------------------------
    // Client store
    // ---------------------------------------------------------------------

    let store = {
      loaded: false,
      version: 0,
      activeId: '',
      rev: 0,
      docs: [],
      title: 'Madedown',
      text: '',
      updatedAt: '',
      updatedBy: 'system',
      dirty: false,
      status: 'loading',
      conflict: null,
      error: null,
      toast: null,
      seenOpenRequest: 0,
      lastSyncedAt: 0,
      referenceEditor: null,
    };
    const listeners = new Set();

    function getStore() {
      return store;
    }

    function patchStore(patch) {
      store = { ...store, ...patch };
      for (const listener of [...listeners]) {
        try {
          listener();
        } catch (error) {
          console.error('madedown-dsh: store listener failed', error);
        }
      }
    }

    function subscribeStore(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }

    function useStore() {
      return useSyncExternalStore(subscribeStore, getStore, getStore);
    }

    let toastSeq = 0;
    let toastTimer = null;

    function showToast(text, action) {
      toastSeq += 1;
      const id = toastSeq;
      patchStore({ toast: { id, text, action: action || null } });
      if (toastTimer !== null) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastTimer = null;
        if (store.toast !== null && store.toast.id === id) patchStore({ toast: null });
      }, 4200);
    }

    function dismissToast() {
      if (toastTimer !== null) {
        clearTimeout(toastTimer);
        toastTimer = null;
      }
      patchStore({ toast: null });
    }

    // ---------------------------------------------------------------------
    // Sync engine
    // ---------------------------------------------------------------------

    const runtime = {
      disposed: false,
      bodyMounted: false,
      pollTimer: null,
      pollBusy: false,
      pushTimer: null,
      pushBusy: false,
      pushAgain: false,
      open: () => false,
      ctx: null,
      referenceSourceRegistered: false,
      referenceSourceDispose: null,
    };

    let boundTranslate = (key) => key;

    function translate(key, params) {
      let text = boundTranslate(key);
      if (typeof text !== 'string') text = key;
      if (params !== undefined) {
        for (const [name, value] of Object.entries(params)) {
          text = text.split(`{${name}}`).join(String(value));
        }
      }
      return text;
    }

    function reportDiag(payload) {
      try {
        void fetch(`${API}/diag`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ at: new Date().toISOString(), ...payload }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* diagnostics are best effort */
      }
    }

    function docStats(text) {
      const value = typeof text === 'string' ? text : '';
      const cjk = (value.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
      const latin = (value.match(/[A-Za-z0-9_]+(?:['’-][A-Za-z0-9_]+)*/g) || []).length;
      return { chars: value.length, lines: value.length === 0 ? 0 : value.split('\n').length, words: cjk + latin };
    }

    /**
     * Adopt one server snapshot (poll result or tab action result).
     * @param server - {version, activeId, docs, active, openRequest}.
     * @param options - `{force:true}` adopts the active tab even while dirty.
     * @returns whether the active document was adopted.
     */
    function adoptServerSnapshot(server, options = {}) {
      if (!server || typeof server !== 'object' || !server.active) return false;
      const version = Number.isSafeInteger(server.version) ? server.version : store.version;
      const docs = Array.isArray(server.docs) ? server.docs : store.docs;
      const active = server.active;
      const current = store;
      const serverOpenRequest = Number(server.openRequest) || 0;
      if (!current.loaded) {
        patchStore({
          loaded: true,
          version,
          activeId: active.id,
          rev: Number.isSafeInteger(active.rev) ? active.rev : 0,
          title: typeof active.title === 'string' ? active.title : 'Madedown',
          text: typeof active.text === 'string' ? active.text : '',
          updatedAt: typeof active.updatedAt === 'string' ? active.updatedAt : '',
          updatedBy: typeof active.updatedBy === 'string' ? active.updatedBy : 'system',
          docs,
          dirty: false,
          status: 'ready',
          conflict: null,
          lastSyncedAt: Date.now(),
          seenOpenRequest: Math.max(current.seenOpenRequest, serverOpenRequest),
        });
        return true;
      }
      const switched = options.force === true || server.activeId !== current.activeId;
      if (switched) {
        if (current.dirty && options.force !== true) {
          patchStore({ docs, version: Math.max(version, current.version) });
          showToast(translate('toast.tabRemoteSwitch'));
          return false;
        }
        patchStore({
          version,
          activeId: active.id,
          rev: Number.isSafeInteger(active.rev) ? active.rev : 0,
          title: typeof active.title === 'string' ? active.title : 'Madedown',
          text: typeof active.text === 'string' ? active.text : '',
          updatedAt: typeof active.updatedAt === 'string' ? active.updatedAt : '',
          updatedBy: typeof active.updatedBy === 'string' ? active.updatedBy : 'system',
          docs,
          dirty: false,
          status: 'ready',
          conflict: null,
          lastSyncedAt: Date.now(),
          error: null,
        });
        reportDiag({ event: 'tab-switched', activeId: active.id, tabs: docs.length, forced: options.force === true });
        return true;
      }
      const incomingText = typeof active.text === 'string' ? active.text : current.text;
      const incomingTitle = typeof active.title === 'string' ? active.title : current.title;
      const incomingRev = Number.isSafeInteger(active.rev) ? active.rev : current.rev;
      if (current.dirty) {
        if (incomingRev !== current.rev && (incomingText !== current.text || incomingTitle !== current.title)) {
          patchStore({
            conflict: {
              id: active.id,
              rev: incomingRev,
              title: incomingTitle,
              text: incomingText,
              updatedAt: active.updatedAt,
              updatedBy: active.updatedBy,
            },
            status: 'conflict',
            docs,
            version,
          });
          reportDiag({ event: 'remote-conflict', docId: active.id, rev: incomingRev, updatedBy: active.updatedBy, chars: incomingText.length });
          return false;
        }
        patchStore({ docs, version, rev: incomingRev });
        return false;
      }
      const previousVersion = current.version;
      patchStore({
        version,
        rev: incomingRev,
        title: incomingTitle,
        text: incomingText,
        updatedAt: typeof active.updatedAt === 'string' ? active.updatedAt : '',
        updatedBy: typeof active.updatedBy === 'string' ? active.updatedBy : 'system',
        docs,
        dirty: false,
        status: 'ready',
        conflict: null,
        lastSyncedAt: Date.now(),
        error: null,
      });
      reportDiag({ event: 'remote-applied', version, docId: active.id, updatedBy: active.updatedBy, chars: incomingText.length, mounted: runtime.bodyMounted });
      if (active.updatedBy === 'assistant' && version !== previousVersion && !runtime.bodyMounted) {
        showToast(translate('toast.agentEdit'), { label: translate('toast.open'), run: () => runtime.open() });
      }
      return true;
    }

    async function pollOnce(force) {
      if (runtime.disposed || runtime.pollBusy) return;
      if (!force && typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      runtime.pollBusy = true;
      try {
        const since = store.loaded ? store.version : -1;
        const response = await fetch(`${API}/state?since=${since}`, { cache: 'no-store', credentials: 'same-origin' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (runtime.disposed || data === null || typeof data !== 'object') return;
        const openRequest = Number(data.openRequest) || 0;
        const shouldOpen = openRequest > store.seenOpenRequest;
        if (data.changed && data.state && store.tabDragging !== true) adoptServerSnapshot(data.state);
        if (shouldOpen) {
          patchStore({ seenOpenRequest: openRequest });
          if (runtime.bodyMounted !== true) runtime.open();
        }
        if (store.status === 'offline') patchStore({ status: store.dirty ? 'saving' : 'ready' });
      } catch (error) {
        if (!runtime.disposed && store.status !== 'offline') {
          patchStore({ status: 'offline', error: String(error && error.message ? error.message : error) });
        }
      } finally {
        runtime.pollBusy = false;
        if (!runtime.disposed && store.dirty && runtime.pushTimer === null) schedulePush(900);
      }
    }

    function startSync(ctx) {
      runtime.ctx = ctx;
      runtime.disposed = false;
      void pollOnce(true);
      runtime.pollTimer = setInterval(() => {
        void pollOnce(false);
      }, 2000);
      const onVisible = () => {
        if (document.visibilityState === 'visible') void pollOnce(true);
      };
      document.addEventListener('visibilitychange', onVisible);
      return () => {
        runtime.disposed = true;
        if (runtime.pollTimer !== null) clearInterval(runtime.pollTimer);
        runtime.pollTimer = null;
        if (runtime.pushTimer !== null) clearTimeout(runtime.pushTimer);
        runtime.pushTimer = null;
        document.removeEventListener('visibilitychange', onVisible);
      };
    }

    function schedulePush(delay) {
      if (runtime.disposed) return;
      if (runtime.pushTimer !== null) clearTimeout(runtime.pushTimer);
      runtime.pushTimer = setTimeout(() => {
        runtime.pushTimer = null;
        void pushDocument(false);
      }, typeof delay === 'number' ? delay : 650);
    }

    /**
     * Push the active document's content.
     * @param force - overwrite even when baseRev is stale (conflict resolution).
     * @returns whether the document is now clean.
     */
    async function pushDocument(force) {
      if (runtime.disposed) return true;
      const snapshot = store;
      if (!snapshot.loaded || (!snapshot.dirty && force !== true)) return true;
      if (runtime.pushBusy) {
        runtime.pushAgain = true;
        return false;
      }
      runtime.pushBusy = true;
      const sentText = snapshot.text;
      const sentTitle = snapshot.title;
      const sentDocId = snapshot.activeId;
      const sentRev = snapshot.rev;
      if (force !== true) patchStore({ status: 'saving' });
      try {
        const response = await fetch(`${API}/update`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            op: 'replace',
            docId: sentDocId,
            baseRev: sentRev,
            text: sentText,
            title: sentTitle,
            source: 'user',
            force: force === true,
          }),
        });
        const data = await response.json();
        if (data && data.ok && data.state) {
          const latest = store;
          const serverActive = data.state.active;
          patchStore({
            version: data.state.version,
            docs: Array.isArray(data.state.docs) ? data.state.docs : latest.docs,
            rev: serverActive && serverActive.id === sentDocId && Number.isSafeInteger(serverActive.rev) ? serverActive.rev : latest.rev,
            updatedAt: serverActive ? serverActive.updatedAt : latest.updatedAt,
            updatedBy: serverActive ? serverActive.updatedBy : latest.updatedBy,
            conflict: null,
            lastSyncedAt: Date.now(),
            status: 'ready',
            error: null,
          });
          if (latest.activeId === sentDocId && latest.text === sentText && latest.title === sentTitle) {
            patchStore({ dirty: false });
            reportDiag({ event: 'saved', version: data.state.version, docId: sentDocId, chars: sentText.length });
            return true;
          }
          schedulePush(150);
          return true;
        }
        if (data && data.conflict) {
          const document = data.document || (data.state && data.state.active) || {};
          patchStore({
            status: 'conflict',
            conflict: {
              id: data.docId || sentDocId,
              rev: document.rev,
              title: document.title === undefined ? sentTitle : document.title,
              text: typeof document.text === 'string' ? document.text : '',
              updatedAt: document.updatedAt,
              updatedBy: document.updatedBy,
            },
            docs: data.state && Array.isArray(data.state.docs) ? data.state.docs : store.docs,
          });
          return false;
        }
        patchStore({ status: 'error', error: (data && data.error) || 'write failed' });
        return false;
      } catch (error) {
        patchStore({ status: 'offline', error: String(error && error.message ? error.message : error) });
        schedulePush(2500);
        return false;
      } finally {
        runtime.pushBusy = false;
        if (runtime.pushAgain) {
          runtime.pushAgain = false;
          schedulePush(120);
        }
      }
    }

    function updateLocalText(text, title) {
      patchStore({
        text,
        title: typeof title === 'string' ? title : store.title,
        dirty: true,
        status: store.status === 'conflict' ? 'conflict' : 'saving',
      });
      schedulePush(700);
    }

    function resolveConflictLoadRemote() {
      const remote = store.conflict;
      if (!remote) return;
      patchStore({
        title: typeof remote.title === 'string' ? remote.title : store.title,
        text: typeof remote.text === 'string' ? remote.text : store.text,
        rev: Number.isSafeInteger(remote.rev) ? remote.rev : store.rev,
        updatedAt: remote.updatedAt || store.updatedAt,
        updatedBy: remote.updatedBy || store.updatedBy,
        conflict: null,
        dirty: false,
        status: 'ready',
      });
    }

    function resolveConflictKeepMine() {
      if (!store.conflict) return;
      patchStore({ conflict: null });
      void pushDocument(true);
    }

    function requestOpen() {
      return runtime.open();
    }

    function quoted(text) {
      return String(text)
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => (line.length === 0 ? '>' : `> ${line}`))
        .join('\n');
    }

    async function sendSelection(rawText, options = {}) {
      const asMarkdown = options === true || Boolean(options && options.asMarkdown === true);
      let text = typeof rawText === 'string' ? rawText.replace(/\r\n?/g, '\n').trim() : '';
      if (text.length === 0) return false;
      if (text.length > 200000) return false;
      text = await localizeMarkdownImages(text);
      // No quote wrapping any more: a selected table should stay a table. When
      // the browser stringified it as tab-separated rows, rebuild the table.
      if (!asMarkdown) {
        const table = tsvTableToMarkdown(text);
        if (table.length > 0) text = table;
      }
      const block = text;
      if (!store.loaded || store.dirty) {
        const current = store.text;
        const separator = current.length === 0 ? '' : current.endsWith('\n\n') ? '' : current.endsWith('\n') ? '\n' : '\n\n';
        updateLocalText(`${current}${separator}${block}\n`);
        showToast(translate('toast.sent'));
        requestOpen();
        return true;
      }
      try {
        const response = await fetch(`${API}/update`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ op: 'append', docId: store.activeId, source: 'selection', text: block }),
        });
        const data = await response.json();
        if (data && data.ok && data.state) {
          adoptServerSnapshot(data.state);
          patchStore({ dirty: false, status: 'ready' });
          showToast(translate('toast.sent'));
          requestOpen();
          return true;
        }
        showToast(translate('toast.sendFailed'));
        return false;
      } catch {
        showToast(translate('toast.sendFailed'));
        return false;
      }
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Wait until the active document has no unsaved local edits.
     * @returns whether the document is clean (false on conflict/offline timeout).
     */
    async function flushActiveDocument() {
      if (!store.dirty) return true;
      const deadline = Date.now() + 5000;
      while (store.dirty && Date.now() < deadline) {
        if (store.status === 'conflict') return false;
        if (!runtime.pushBusy) await pushDocument(false);
        else await sleep(60);
        if (store.dirty) await sleep(80);
      }
      return !store.dirty;
    }

    /**
     * POST one JSON body to a plugin route.
     * @param path - route path after the API prefix.
     * @param body - JSON body.
     * @returns parsed JSON response.
     */
    async function postJson(path, body) {
      const response = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body === undefined || body === null ? {} : body),
      });
      return response.json();
    }

    async function tabsAction(action, payload) {
      return postJson('/tabs', { action, ...(payload || {}) });
    }

    async function switchTab(id) {
      if (!store.loaded || store.activeId === id) return;
      if (store.status === 'conflict') {
        showToast(translate('toast.tabSwitchFailed'));
        return;
      }
      try {
        if (!(await flushActiveDocument())) {
          showToast(translate('toast.tabSwitchFailed'));
          return;
        }
        const data = await tabsAction('select', { id });
        if (data && data.ok && data.state) adoptServerSnapshot(data.state, { force: true });
        else showToast(translate('toast.tabSwitchFailed'));
      } catch {
        showToast(translate('toast.tabSwitchFailed'));
      }
    }

    async function createTab() {
      if (store.status === 'conflict') {
        showToast(translate('toast.tabCreateFailed'));
        return false;
      }
      try {
        if (!(await flushActiveDocument())) {
          showToast(translate('toast.tabCreateFailed'));
          return false;
        }
        const data = await tabsAction('create', {});
        if (data && data.ok && data.state) {
          adoptServerSnapshot(data.state, { force: true });
          return true;
        }
        showToast(translate('toast.tabCreateFailed'));
        return false;
      } catch {
        showToast(translate('toast.tabCreateFailed'));
        return false;
      }
    }

    async function closeTab(id) {
      if (store.status === 'conflict') {
        showToast(translate('toast.tabCloseFailed'));
        return;
      }
      try {
        if (id === store.activeId && !(await flushActiveDocument())) {
          showToast(translate('toast.tabCloseFailed'));
          return;
        }
        const data = await tabsAction('close', { id });
        if (data && data.ok && data.state) adoptServerSnapshot(data.state, { force: true });
        else showToast(translate('toast.tabCloseFailed'));
      } catch {
        showToast(translate('toast.tabCloseFailed'));
      }
    }

    async function requestExport(options) {
      return postJson('/export', { docId: store.activeId, ...(options || {}) });
    }

    /**
     * Flush local edits, then resolve the save dialog's default path.
     * @returns `{path, exists, title}` or null when the current state is unsavable.
     */
    async function prepareSaveDialog() {
      if (!store.loaded) return null;
      if (!(await flushActiveDocument())) {
        showToast(translate('save.flushFailed'));
        return null;
      }
      try {
        const data = await requestExport({ dryRun: true });
        if (data && data.ok) return data;
        showToast(translate('toast.saveFailed', { message: (data && data.error) || '' }));
        return null;
      } catch (error) {
        showToast(translate('toast.saveFailed', { message: String(error && error.message ? error.message : error) }));
        return null;
      }
    }

    async function saveDocumentToPath(path) {
      try {
        return await requestExport({ path });
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) };
      }
    }

    // ---------------------------------------------------------------------
    // Image assets, quick ask, and composer reference chips
    // ---------------------------------------------------------------------

    const IMAGE_MARKDOWN_RE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    const REFERENCE_STORE_KEY = 'madedown-dsh.references.v1';
    const references = new Map();
    let referencesLoaded = false;

    function loadReferences() {
      if (referencesLoaded) return;
      referencesLoaded = true;
      try {
        const raw = window.localStorage.getItem(REFERENCE_STORE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list)) {
          for (const entry of list) {
            if (entry && typeof entry.id === 'string' && typeof entry.markdown === 'string') references.set(entry.id, entry);
          }
        }
      } catch {
        /* storage unavailable */
      }
    }

    function persistReferences() {
      try {
        const list = [...references.values()].slice(-100);
        window.localStorage.setItem(REFERENCE_STORE_KEY, JSON.stringify(list));
      } catch {
        /* storage unavailable */
      }
    }

    function newReferenceId() {
      return `mdref-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function registerReference(entry) {
      loadReferences();
      const reference = {
        id: newReferenceId(),
        title: entry.title || 'Madedown',
        markdown: entry.markdown || '',
        sessionId: entry.sessionId || '',
        createdAt: new Date().toISOString(),
      };
      references.set(reference.id, reference);
      persistReferences();
      return reference;
    }

    function getReference(id) {
      loadReferences();
      return references.get(id) || null;
    }

    function updateReference(id, markdown) {
      const entry = getReference(id);
      if (!entry) return false;
      entry.markdown = markdown;
      persistReferences();
      return true;
    }

    function unregisterReference(id) {
      loadReferences();
      return references.delete(id);
    }

    function referenceClipboard(entry) {
      return entry ? `【Madedown 引用】${entry.title}` : '【Madedown 引用】';
    }

    function referenceBlock(entry) {
      if (!entry) return `> ${translate('ref.unavailable')}`;
      const body = quoted(entry.markdown || '');
      return `> 引用自 Madedown《${entry.title}》\n>\n${body}`;
    }

    function openReferenceEditor(id) {
      const entry = getReference(id);
      if (!entry) {
        showToast(translate('ref.unavailable'));
        return;
      }
      patchStore({ referenceEditor: { id, title: entry.title, markdown: entry.markdown, sessionId: entry.sessionId } });
    }

    function serviceOf(name) {
      try {
        if (runtime.ctx && typeof runtime.ctx.get === 'function') {
          const service = runtime.ctx.get(name);
          if (service !== undefined && service !== null) return service;
        }
      } catch {
        /* service unavailable */
      }
      try {
        return runtime.ctx ? runtime.ctx[name] : undefined;
      } catch {
        return undefined;
      }
    }

    function sessionInputFor(sessionId) {
      if (!sessionId) return null;
      try {
        const sessions = serviceOf('sessions');
        const conversation = serviceOf('conversation');
        if (!sessions || typeof sessions.binding !== 'function') return null;
        if (!conversation || !conversation.input || typeof conversation.input.for !== 'function') return null;
        const binding = sessions.binding(sessionId);
        if (!binding || !binding.ctx) return null;
        return conversation.input.for(binding.ctx);
      } catch {
        return null;
      }
    }

    /**
     * Insert one Madedown selection into the chat composer as a reference chip.
     * Falls back to plain draft text when the composer reference pipeline is absent.
     * @returns `{ok, mode:'reference'|'draft'}`.
     */
    function insertMadedownReference(inputActions, sessionId, title, markdown, currentDraft) {
      const content = typeof markdown === 'string' ? markdown : '';
      const entry = registerReference({ title, markdown: content, sessionId });
      const input = sessionInputFor(sessionId);
      if (runtime.referenceSourceRegistered && input !== null && inputActions && typeof inputActions.captureInsertion === 'function') {
        try {
          const span = inputActions.captureInsertion();
          const inserted = input.insertReference({
            source: 'madedown',
            ref: entry.id,
            label: `Madedown · ${entry.title}`,
            appearance: 'file',
            clipboardText: referenceClipboard(entry),
          }, span);
          if (inserted === true) return { ok: true, mode: 'reference', id: entry.id };
        } catch {
          /* fall through to the plain draft */
        }
      }
      unregisterReference(entry.id);
      return { ok: appendSelectionToChat(inputActions, currentDraft, content), mode: 'draft' };
    }

    /**
     * Remove one Madedown reference chip from the composer by rebuilding the
     * semantic draft without that chip.
     * @returns whether the chip was removed.
     */
    function removeMadedownReference(id) {
      const entry = getReference(id);
      if (!entry) return true;
      const input = sessionInputFor(entry.sessionId);
      if (input && input.state && typeof input.state.getSnapshot === 'function' && typeof input.setDraft === 'function') {
        try {
          const snapshot = input.state.getSnapshot();
          const occurrence = snapshot.occurrences.find((item) => item.source === 'madedown' && item.ref === id);
          if (!occurrence) {
            unregisterReference(id);
            return true;
          }
          const text = snapshot.draft.slice(0, occurrence.offset) + snapshot.draft.slice(occurrence.offset + occurrence.length);
          const referencesLeft = snapshot.occurrences
            .filter((item) => item !== occurrence)
            .map((item) => ({
              source: item.source,
              ref: item.ref,
              label: item.label,
              appearance: item.appearance,
              clipboardText: item.clipboardText,
              offset: item.offset > occurrence.offset ? item.offset - occurrence.length : item.offset,
              length: item.length,
              ...(item.invalid ? { invalid: true } : {}),
            }));
          input.setDraft({ text, references: referencesLeft });
          unregisterReference(id);
          return true;
        } catch {
          return false;
        }
      }
      if (entry.sessionId) return false;
      unregisterReference(id);
      return true;
    }

    /**
     * Send a reference + question to the chat as a user message.
     * @returns whether submission was triggered.
     */
    function sendQuickAsk(inputActions, title, content, question, currentDraft) {
      const prompt = typeof question === 'string' ? question.trim() : '';
      if (prompt.length === 0) return false;
      if (!inputActions || typeof inputActions.setDraft !== 'function' || typeof inputActions.submit !== 'function') return false;
      const base = typeof currentDraft === 'string' ? currentDraft.replace(/\s+$/, '') : '';
      const message = referenceBlock({ title, markdown: content }) + '\n\n' + prompt;
      const next = base.length === 0 ? message : `${base}${COMPOSER_SEPARATOR}${message}`;
      try {
        inputActions.setDraft(next);
      } catch {
        return false;
      }
      setTimeout(() => {
        try {
          inputActions.submit();
        } catch {
          showToast(translate('toast.askFailed'));
        }
      }, 40);
      return true;
    }

    /**
     * Upload one browser image into the Host asset store.
     * @param blob - image bytes.
     * @returns uploaded URL, or null.
     */
    async function uploadImageBlob(blob) {
      if (!blob) return null;
      const type = blob.type || 'application/octet-stream';
      if (!type.startsWith('image/')) return null;
      try {
        const response = await fetch(`${API}/upload-image`, {
          method: 'POST',
          headers: { 'content-type': type },
          credentials: 'same-origin',
          body: blob,
        });
        const data = await response.json();
        return data && data.ok && typeof data.url === 'string' ? data.url : null;
      } catch {
        return null;
      }
    }

    /**
     * Copy remote/blob/data image sources referenced by Markdown into Host assets.
     * @param markdown - Markdown containing image syntax.
     * @returns Markdown with local asset URLs where upload succeeded.
     */
    async function localizeMarkdownImages(markdown) {
      const value = typeof markdown === 'string' ? markdown : '';
      if (!value.includes('![')) return value;
      const sources = new Set();
      IMAGE_MARKDOWN_RE.lastIndex = 0;
      let match;
      while ((match = IMAGE_MARKDOWN_RE.exec(value)) !== null) {
        const src = match[2];
        if (typeof src === 'string' && src.length > 0 && !src.startsWith(`${API}/asset/`) && !src.startsWith('#')) sources.add(src);
      }
      if (sources.size === 0) return value;
      const replacements = new Map();
      for (const src of sources) {
        try {
          const response = await fetch(src, { credentials: 'same-origin' });
          if (!response.ok) continue;
          const blob = await response.blob();
          const url = await uploadImageBlob(blob);
          if (url !== null) replacements.set(src, url);
        } catch {
          /* keep the original source */
        }
      }
      if (replacements.size === 0) return value;
      IMAGE_MARKDOWN_RE.lastIndex = 0;
      return value.replace(IMAGE_MARKDOWN_RE, (whole, alt, src, suffix) => {
        const replacement = replacements.get(src);
        return replacement === undefined ? whole : `![${alt}](${replacement})`;
      });
    }

    /**
     * Register the Madedown reference source once the input-trigger service exists.
     * @returns whether the source is registered.
     */
    function ensureReferenceSource() {
      if (runtime.referenceSourceRegistered) return true;
      const triggers = serviceOf('inputTriggers');
      if (!triggers || typeof triggers.registerSource !== 'function') return false;
      const source = {
        trigger: '@',
        name: 'madedown',
        order: 900,
        showGroupTitle: false,
        candidates: async () => [],
        codec: {
          clipboardText: (ref) => referenceClipboard(getReference(ref)),
          serialize: async (ref) => referenceBlock(getReference(ref)),
        },
        openReference: (_session, reference) => {
          openReferenceEditor(reference.ref);
          return true;
        },
      };
      try {
        const dispose = triggers.registerSource(source);
        runtime.referenceSourceDispose = typeof dispose === 'function' ? dispose : null;
        runtime.referenceSourceRegistered = true;
        return true;
      } catch (error) {
        console.error('madedown-dsh: could not register the reference source', error);
        return false;
      }
    }

    function registerReferenceSourceWhenReady(ctx) {
      runtime.ctx = ctx;
      let attempts = 0;
      const tick = () => {
        if (runtime.disposed || runtime.referenceSourceRegistered) return;
        if (ensureReferenceSource()) return;
        attempts += 1;
        if (attempts < 60) setTimeout(tick, 1000);
      };
      tick();
      return () => {
        if (runtime.referenceSourceDispose !== null) {
          try {
            runtime.referenceSourceDispose();
          } catch {
            /* already gone */
          }
          runtime.referenceSourceDispose = null;
        }
        runtime.referenceSourceRegistered = false;
      };
    }

    // ---------------------------------------------------------------------
    // Markdown inline helpers
    // ---------------------------------------------------------------------

    function escapeHtml(value) {
      return String(value === undefined || value === null ? '' : value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[character]));
    }

    function escapeAttr(value) {
      return escapeHtml(value);
    }

    function safeUrl(url) {
      const value = typeof url === 'string' ? url.trim() : '';
      if (/^(?:https?:|mailto:|tel:|data:image\/|#|\.{0,2}\/)/i.test(value)) return value;
      if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return '#';
      return value;
    }

    function escapeInline(value) {
      return String(value === undefined || value === null ? '' : value)
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/~/g, '\\~')
        .replace(/</g, '\\<')
        .replace(/\|/g, '\\|');
    }

    function inlineHtml(markdown) {
      const source = String(markdown === undefined || markdown === null ? '' : markdown);
      let out = '';
      let text = '';
      let index = 0;
      const flush = () => {
        if (text.length > 0) {
          out += escapeHtml(text);
          text = '';
        }
      };
      while (index < source.length) {
        const character = source[index];
        if (character === '\\' && index + 1 < source.length && /[\\`*_{}\[\]()#+\-.!~|><]/.test(source[index + 1])) {
          text += source[index + 1];
          index += 2;
          continue;
        }
        if (character === '`') {
          const end = source.indexOf('`', index + 1);
          if (end > index + 1) {
            flush();
            out += `<code>${escapeHtml(source.slice(index + 1, end))}</code>`;
            index = end + 1;
            continue;
          }
        }
        if (character === '!' && source[index + 1] === '[') {
          const match = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/.exec(source.slice(index));
          if (match) {
            flush();
            out += `<img src="${escapeAttr(safeUrl(match[2]))}" alt="${escapeAttr(match[1])}"${match[3] ? ` title="${escapeAttr(match[3])}"` : ''}>`;
            index += match[0].length;
            continue;
          }
        }
        if (character === '[') {
          const match = /^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/.exec(source.slice(index));
          if (match) {
            flush();
            out += `<a href="${escapeAttr(safeUrl(match[2]))}"${match[3] ? ` title="${escapeAttr(match[3])}"` : ''} target="_blank" rel="noreferrer noopener">${linkIconHtml(safeUrl(match[2]))}${inlineHtml(match[1])}</a>`;
            index += match[0].length;
            continue;
          }
        }
        if (source.startsWith('**', index) || source.startsWith('__', index)) {
          const marker = source.slice(index, index + 2);
          const end = source.indexOf(marker, index + 2);
          if (end > index + 2) {
            flush();
            out += `<strong>${inlineHtml(source.slice(index + 2, end))}</strong>`;
            index = end + 2;
            continue;
          }
        }
        if (source.startsWith('~~', index)) {
          const end = source.indexOf('~~', index + 2);
          if (end > index + 2) {
            flush();
            out += `<del>${inlineHtml(source.slice(index + 2, end))}</del>`;
            index = end + 2;
            continue;
          }
        }
        if ((character === '*' || character === '_') && source[index + 1] !== character) {
          const end = source.indexOf(character, index + 1);
          if (end > index + 1) {
            flush();
            out += `<em>${inlineHtml(source.slice(index + 1, end))}</em>`;
            index = end + 1;
            continue;
          }
        }
        if (character === '\n') {
          flush();
          out += '<br>';
          index += 1;
          continue;
        }
        text += character;
        index += 1;
      }
      flush();
      return out;
    }

    function inlineMarkdown(node) {
      if (!node) return '';
      let out = '';
      for (const child of node.childNodes) {
        if (child.nodeType === 3) {
          out += escapeInline(child.nodeValue);
          continue;
        }
        if (child.nodeType !== 1) continue;
        const tag = child.tagName.toLowerCase();
        if (tag === 'br') out += '\n';
        else if (tag === 'strong' || tag === 'b') out += `**${inlineMarkdown(child)}**`;
        else if (tag === 'em' || tag === 'i') out += `*${inlineMarkdown(child)}*`;
        else if (tag === 'del' || tag === 's' || tag === 'strike') out += `~~${inlineMarkdown(child)}~~`;
        else if (tag === 'code') {
          const content = child.textContent || '';
          const fence = content.includes('`') ? '``' : '`';
          out += `${fence}${content}${fence}`;
        } else if (tag === 'a') {
          out += `[${inlineMarkdown(child)}](${child.getAttribute('href') || ''})`;
        } else if (tag === 'img') {
          out += `![${escapeInline(child.getAttribute('alt') || '')}](${child.getAttribute('src') || ''})`;
        } else if (tag === 'input' || tag === 'button' || tag === 'script' || tag === 'style') {
          /* not content */
        } else {
          out += inlineMarkdown(child);
        }
      }
      return out;
    }

    // ---------------------------------------------------------------------
    // Selection (chat -> editor) Markdown reconstruction.
    // Tables / lists / code / headings keep their Markdown form.
    // ---------------------------------------------------------------------

    const BLOCK_TAGS = new Set([
      'p', 'div', 'section', 'article', 'header', 'footer', 'main', 'aside',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'pre', 'blockquote',
      'table', 'hr', 'figure', 'figcaption', 'details', 'summary', 'dl', 'dt',
      'dd', 'form', 'fieldset',
    ]);
    const INLINE_TAGS = new Set([
      'a', 'abbr', 'b', 'br', 'code', 'del', 'em', 'i', 'img', 'input', 'kbd',
      'mark', 's', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u',
    ]);

    function inlineNodesToMarkdown(nodes) {
      let out = '';
      for (const node of nodes) {
        if (!node) continue;
        if (node.nodeType === 3) out += escapeInline(node.nodeValue);
        else if (node.nodeType === 1) out += inlineMarkdown(node);
      }
      return out;
    }

    function hasBlockChildren(element) {
      if (!element || element.children === undefined) return false;
      for (const child of element.children) {
        if (BLOCK_TAGS.has(child.tagName.toLowerCase())) return true;
      }
      return false;
    }

    /**
     * Convert a rendered chat table back to a GFM Markdown table so sending a
     * selection to Madedown keeps the table format instead of flattening it.
     * @param table - `<table>` element.
     * @returns Markdown table text.
     */
    function tableToMarkdown(table) {
      const rows = [];
      for (const tr of table.querySelectorAll('tr')) {
        const cells = [];
        for (const cell of tr.children) {
          const tag = cell.tagName.toLowerCase();
          if (tag !== 'th' && tag !== 'td') continue;
          cells.push(inlineMarkdown(cell).replace(/\s*\n\s*/g, ' ').trim());
        }
        if (cells.length > 0) rows.push(cells);
      }
      if (rows.length === 0) return '';
      const width = Math.max(...rows.map((row) => row.length));
      const normalized = rows.map((row) => {
        const copy = row.slice();
        while (copy.length < width) copy.push('');
        return copy;
      });
      const line = (cells) => `| ${cells.join(' | ')} |`;
      return [line(normalized[0]), `| ${new Array(width).fill('---').join(' | ')} |`, ...normalized.slice(1).map(line)].join('\n');
    }

    function preToMarkdown(pre) {
      const code = pre.querySelector('code') || pre;
      const raw = (code.textContent || '').replace(/\r\n?/g, '\n').replace(/\n+$/, '');
      const match = /(?:^|\s)language-([A-Za-z0-9_+#.-]+)/.exec(code.className || '');
      const language = match ? match[1] : '';
      const fence = raw.includes('```') ? '````' : '```';
      return `${fence}${language}\n${raw}\n${fence}`;
    }

    function listToMarkdown(list, ordered, indent) {
      const items = [...list.children].filter((child) => child.tagName.toLowerCase() === 'li');
      const lines = [];
      items.forEach((item, index) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        let marker = ordered ? `${index + 1}. ` : '- ';
        if (checkbox) marker = checkbox.checked || checkbox.hasAttribute('checked') ? '- [x] ' : '- [ ] ';
        const clone = item.cloneNode(true);
        for (const nested of [...clone.children]) {
          const tag = nested.tagName.toLowerCase();
          if (tag === 'ul' || tag === 'ol') nested.remove();
        }
        for (const input of [...clone.querySelectorAll('input[type="checkbox"]')]) input.remove();
        let content;
        if (hasBlockChildren(clone)) content = domBlocksMarkdown(clone, '').join(' ');
        else content = inlineMarkdown(clone).replace(/\s*\n\s*/g, ' ').trim();
        lines.push(`${indent}${marker}${content}`.trimEnd());
        for (const nested of [...item.children]) {
          const tag = nested.tagName.toLowerCase();
          if (tag === 'ul' || tag === 'ol') {
            const nestedMarkdown = listToMarkdown(nested, tag === 'ol', `${indent}  `);
            if (nestedMarkdown.length > 0) lines.push(nestedMarkdown);
          }
        }
      });
      return lines.join('\n');
    }

    /**
     * Convert the children of one DOM container into Markdown blocks.
     * @param container - DOM node to walk.
     * @param indent - prefix for nested content.
     * @returns array of Markdown block strings.
     */
    function domBlocksMarkdown(container, indent) {
      const prefix = typeof indent === 'string' ? indent : '';
      const blocks = [];
      let buffer = [];
      const flushInline = () => {
        if (buffer.length === 0) return;
        const markdown = inlineNodesToMarkdown(buffer).trim();
        buffer = [];
        if (markdown.length > 0) blocks.push(prefix + markdown);
      };
      for (const child of container.childNodes) {
        if (child.nodeType === 3) {
          buffer.push(child);
          continue;
        }
        if (child.nodeType !== 1) continue;
        const tag = child.tagName.toLowerCase();
        if (INLINE_TAGS.has(tag) || !BLOCK_TAGS.has(tag)) {
          buffer.push(child);
          continue;
        }
        flushInline();
        const heading = /^h([1-6])$/.exec(tag);
        if (heading) {
          const markdown = inlineMarkdown(child).replace(/\s*\n\s*/g, ' ').trim();
          if (markdown.length > 0) blocks.push(`${prefix}${'#'.repeat(Number(heading[1]))} ${markdown}`);
          continue;
        }
        if (tag === 'hr') {
          blocks.push(`${prefix}---`);
          continue;
        }
        if (tag === 'pre') {
          const markdown = preToMarkdown(child);
          if (markdown.length > 0) blocks.push(prefix + markdown);
          continue;
        }
        if (tag === 'table') {
          const markdown = tableToMarkdown(child);
          if (markdown.length > 0) blocks.push(prefix + markdown);
          continue;
        }
        if (tag === 'ul' || tag === 'ol') {
          const markdown = listToMarkdown(child, tag === 'ol', prefix);
          if (markdown.length > 0) blocks.push(markdown);
          continue;
        }
        if (tag === 'blockquote') {
          const inner = domBlocksMarkdown(child, '').join('\n\n');
          if (inner.trim().length > 0) {
            blocks.push(prefix + inner.split('\n').map((line) => `> ${line}`.trimEnd()).join('\n'));
          }
          continue;
        }
        if (hasBlockChildren(child)) blocks.push(...domBlocksMarkdown(child, prefix));
        else {
          const markdown = inlineMarkdown(child).trim();
          if (markdown.length > 0) blocks.push(prefix + markdown);
        }
      }
      flushInline();
      return blocks;
    }

    /**
     * Convert an HTML fragment (e.g. a cloned selection) into Markdown blocks.
     * @param html - HTML source.
     * @returns Markdown text.
     */
    function markdownFromHtml(html) {
      const holder = document.createElement('div');
      holder.innerHTML = String(html === undefined || html === null ? '' : html);
      return domBlocksMarkdown(holder, '').join('\n\n').trim();
    }

    function selectionToMarkdown(range) {
      try {
        if (!range) return '';
        const holder = document.createElement('div');
        holder.appendChild(range.cloneContents());
        return domBlocksMarkdown(holder, '').join('\n\n').trim();
      } catch {
        return '';
      }
    }

    function selectionHasRichBlocks(range) {
      try {
        if (!range) return false;
        const holder = document.createElement('div');
        holder.appendChild(range.cloneContents());
        return holder.querySelector('table, pre, ul, ol, h1, h2, h3, h4, h5, h6, blockquote, hr, img') !== null;
      } catch {
        return false;
      }
    }

    /**
     * Fallback for browsers/renderers that stringify a table selection as
     * tab-separated rows.
     * @param text - selected plain text.
     * @returns Markdown table text, or an empty string.
     */
    function tsvTableToMarkdown(text) {
      const lines = String(text === undefined || text === null ? '' : text)
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => line.replace(/[ \t]+$/g, ''))
        .filter((line) => line.trim().length > 0);
      if (lines.length < 2) return '';
      const rows = lines.map((line) => line.split('\t').map((cell) => cell.trim()));
      const width = rows[0].length;
      if (width < 2 || !rows.every((row) => row.length === width)) return '';
      const line = (cells) => `| ${cells.map((cell) => cell.replace(/\|/g, '\\|')).join(' | ')} |`;
      return [line(rows[0]), `| ${new Array(width).fill('---').join(' | ')} |`, ...rows.slice(1).map(line)].join('\n');
    }

    // ---------------------------------------------------------------------
    // Block model and serialization
    // ---------------------------------------------------------------------

    function isBlockStart(line) {
      return /^\s{0,3}#{1,6}\s/.test(line)
        || /^\s{0,3}>/.test(line)
        || /^\s*(?:`{3,}|~{3,})/.test(line)
        || /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)
        || /^\s*(?:[-*+]|\d+[.)])\s+/.test(line);
    }

    function splitTableRow(line) {
      let value = line.trim();
      if (value.startsWith('|')) value = value.slice(1);
      if (value.endsWith('|')) value = value.slice(0, -1);
      return value.split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, '|'));
    }

    function parseMarkdown(source) {
      const text = String(source === undefined || source === null ? '' : source).replace(/\r\n?/g, '\n');
      const lines = text.split('\n');
      const blocks = [];
      let index = 0;
      while (index < lines.length) {
        const line = lines[index];
        if (/^\s*$/.test(line)) {
          index += 1;
          continue;
        }
        const fence = /^(\s*)(`{3,}|~{3,})(.*)$/.exec(line);
        if (fence) {
          const marker = fence[2][0];
          const minimum = fence[2].length;
          const language = fence[3].trim();
          const startLine = index;
          const code = [];
          const close = new RegExp(`^\\s*${marker === '`' ? '`' : '~'}{${minimum},}\\s*$`);
          index += 1;
          while (index < lines.length && !close.test(lines[index])) {
            code.push(lines[index]);
            index += 1;
          }
          if (index < lines.length) index += 1;
          blocks.push({ type: 'code', language, text: code.join('\n'), line: startLine });
          continue;
        }
        const heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
        if (heading) {
          blocks.push({ type: 'heading', level: heading[1].length, text: heading[2], line: index });
          index += 1;
          continue;
        }
        if (/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
          blocks.push({ type: 'hr', line: index });
          index += 1;
          continue;
        }
        if (index + 1 < lines.length && line.includes('|') && /^\s*\|?\s*:?-{2,}:?\s*(?:\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[index + 1])) {
          const startLine = index;
          const header = splitTableRow(line);
          const aligns = splitTableRow(lines[index + 1]).map((cell) => {
            if (/^:.*:$/.test(cell)) return 'center';
            if (/^:/.test(cell)) return 'left';
            if (/:$/.test(cell)) return 'right';
            return null;
          });
          const rows = [];
          index += 2;
          while (index < lines.length && lines[index].includes('|') && !/^\s*$/.test(lines[index])) {
            rows.push(splitTableRow(lines[index]));
            index += 1;
          }
          blocks.push({ type: 'table', header, aligns, rows, line: startLine });
          continue;
        }
        if (/^\s{0,3}>/.test(line)) {
          const startLine = index;
          const inner = [];
          while (index < lines.length && (/^\s{0,3}>/.test(lines[index]) || (inner.length > 0 && !/^\s*$/.test(lines[index]) && !isBlockStart(lines[index])))) {
            inner.push(lines[index].replace(/^\s{0,3}>\s?/, ''));
            index += 1;
          }
          blocks.push({ type: 'quote', text: inner.join('\n'), line: startLine });
          continue;
        }
        if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
          const startLine = index;
          const items = [];
          const counters = {};
          while (index < lines.length) {
            const itemMatch = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[index]);
            if (itemMatch) {
              const indent = itemMatch[1].replace(/\t/g, '  ').length;
              const ordered = /\d/.test(itemMatch[2]);
              let content = itemMatch[3];
              let checked = null;
              const task = /^\[([ xX])\]\s+(.*)$/.exec(content);
              if (task) {
                checked = task[1].toLowerCase() === 'x';
                content = task[2];
              }
              let number = null;
              if (ordered) {
                counters[indent] = (counters[indent] || 0) + 1;
                number = counters[indent];
              } else {
                delete counters[indent];
              }
              items.push({ indent, ordered, number, checked, text: content, line: index });
              index += 1;
              continue;
            }
            if (items.length > 0 && !/^\s*$/.test(lines[index]) && !isBlockStart(lines[index])) {
              items[items.length - 1].text += ` ${lines[index].trim()}`;
              index += 1;
              continue;
            }
            break;
          }
          blocks.push({ type: 'list', items, line: startLine });
          continue;
        }
        const startLine = index;
        const parts = [];
        while (index < lines.length && !/^\s*$/.test(lines[index]) && !isBlockStart(lines[index])) {
          parts.push(lines[index].trim());
          index += 1;
        }
        blocks.push({ type: 'paragraph', text: parts.join('\n').trim(), line: startLine });
      }
      return blocks;
    }

    function blocksFromMarkdown(markdown) {
      const blocks = [];
      let listGroup = 0;
      for (const block of parseMarkdown(markdown)) {
        if (block.type === 'heading') blocks.push({ type: 'heading', level: Math.min(6, Math.max(1, block.level || 1)), text: block.text || '' });
        else if (block.type === 'paragraph') blocks.push({ type: 'p', text: block.text || '' });
        else if (block.type === 'quote') blocks.push({ type: 'quote', text: block.text || '' });
        else if (block.type === 'code') blocks.push({ type: 'code', language: block.language || '', text: block.text || '' });
        else if (block.type === 'table') {
          const rows = block.rows.map((row) => {
            const copy = row.slice(0, Math.max(block.header.length, 1));
            while (copy.length < block.header.length) copy.push('');
            return copy;
          });
          blocks.push({ type: 'table', header: block.header.slice(), aligns: block.aligns.slice(), rows });
        } else if (block.type === 'hr') blocks.push({ type: 'hr' });
        else if (block.type === 'list') {
          listGroup += 1;
          for (const item of block.items) {
            blocks.push({
              type: 'li',
              group: listGroup,
              ordered: item.ordered,
              indent: Math.min(3, Math.floor((item.indent || 0) / 2)),
              checked: item.checked === null ? -1 : item.checked ? 1 : 0,
              text: item.text || '',
            });
          }
        }
      }
      return blocks;
    }

    function blockHtml(block) {
      if (block.type === 'p') {
        return `<div class="mdw-block mdw-p" data-md-type="p">${inlineHtml(block.text) || '<br>'}</div>`;
      }
      if (block.type === 'heading') {
        const level = Math.min(6, Math.max(1, block.level || 1));
        return `<div class="mdw-block mdw-h mdw-h${level}" data-md-type="heading" data-level="${level}">${inlineHtml(block.text) || '<br>'}</div>`;
      }
      if (block.type === 'quote') {
        return `<blockquote class="mdw-block" data-md-type="quote">${inlineHtml(block.text) || '<br>'}</blockquote>`;
      }
      if (block.type === 'code') {
        return `<div class="mdw-block" data-md-type="code" data-lang="${escapeAttr(block.language || '')}" data-wrap="true">${codeBannerHtml(block.language || '')}<pre class="mdw-code-pre"><code>${escapeHtml(block.text) || '<br>'}</code></pre></div>`;
      }
      if (block.type === 'hr') {
        return '<div class="mdw-block" data-md-type="hr"><span class="mdw-hr-line" contenteditable="false"></span><span class="mdw-block-tools" contenteditable="false"><button type="button" data-md-action="delete-block" title="delete">×</button></span></div>';
      }
      if (block.type === 'table') {
        const header = block.header.slice();
        const rows = block.rows.map((row) => header.map((_, cellIndex) => (row[cellIndex] === undefined ? '' : row[cellIndex])));
        const headerHtml = header.map((cell) => `<th>${inlineHtml(cell) || '<br>'}</th>`).join('');
        const rowsHtml = rows.map((row) => `<tr>${row.map((cell) => `<td>${inlineHtml(cell) || '<br>'}</td>`).join('')}</tr>`).join('');
        return `<div class="mdw-block" data-md-type="table" data-aligns="${escapeAttr((block.aligns || []).join(','))}"><table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table><span class="mdw-block-tools" contenteditable="false"><button type="button" data-md-action="delete-block" title="delete">×</button></span></div>`;
      }
      if (block.type === 'li') {
        const ordered = block.ordered ? 1 : 0;
        const checked = block.checked === undefined ? -1 : block.checked;
        const indent = Math.min(3, Math.max(0, block.indent || 0));
        const marker = checked >= 0
          ? `<input type="checkbox" class="mdw-check" contenteditable="false"${checked === 1 ? ' checked' : ''}>`
          : `<span class="mdw-marker-holder" contenteditable="false">${ordered ? '1.' : '•'}</span>`;
        return `<div class="mdw-block mdw-li" data-md-type="li" data-ordered="${ordered}" data-checked="${checked}" data-indent="${indent}" data-list-group="${Math.max(0, Number(block.group) || 0)}">${marker}<span class="mdw-li-text">${inlineHtml(block.text) || '<br>'}</span></div>`;
      }
      return '';
    }

    function blockHtmlFromInline(block, html) {
      const content = html || '<br>';
      const marker = block.checked !== undefined && block.checked >= 0
        ? `<input type="checkbox" class="mdw-check" contenteditable="false"${block.checked === 1 ? ' checked' : ''}>`
        : `<span class="mdw-marker-holder" contenteditable="false">${block.ordered ? '1.' : '•'}</span>`;
      const indent = Math.min(3, Math.max(0, block.indent || 0));
      return `<div class="mdw-block mdw-li" data-md-type="li" data-ordered="${block.ordered ? 1 : 0}" data-checked="${block.checked === undefined ? -1 : block.checked}" data-indent="${indent}" data-list-group="${Math.max(0, Number(block.group) || 0)}">${marker}<span class="mdw-li-text">${content}</span></div>`;
    }

    /**
     * Copy plain text with a clipboard-API fast path and a selection fallback.
     * @param text - text to copy.
     * @returns whether the copy command was accepted.
     */
    async function copyTextToClipboard(text) {
      const value = typeof text === 'string' ? text : '';
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(value);
          return true;
        }
      } catch {
        /* fall through to the selection fallback */
      }
      try {
        const area = document.createElement('textarea');
        area.value = value;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        return ok === true;
      } catch {
        return false;
      }
    }

    const CODE_COPY_SVG = '<svg class="mdw-code-icon mdw-code-icon--copy" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke-width="1" stroke="currentColor"><rect x="1.52075" y="4.07373" width="10.3932" height="10.3932" rx="2"/><path d="M11.9792 1.53296C13.36 1.53296 14.4792 2.65225 14.4792 4.03296V9.42847C14.4792 10.3756 13.9521 11.1987 13.1755 11.6228V10.3298C13.3652 10.0787 13.4792 9.7674 13.4792 9.42847V4.03296C13.4792 3.20453 12.8077 2.53296 11.9792 2.53296H6.58374C6.27966 2.53301 5.99684 2.6235 5.7605 2.77905H4.42358C4.85652 2.03463 5.66056 1.53304 6.58374 1.53296H11.9792Z" fill="currentColor" stroke="none"/></svg>';
    const CODE_CHECK_SVG = '<svg class="mdw-code-icon mdw-code-icon--check" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke-width="1" stroke="currentColor"><path d="M2.25 8.5L5.49732 11.7473C5.90519 12.1552 6.57263 12.1344 6.95426 11.7018L13.75 4"/></svg>';
    const CODE_WRAP_SVG = '<svg class="mdw-code-icon mdw-code-icon--wrap" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10.9999 8C10.9999 6.89543 10.1046 6 9 6H4.5V5H9C10.6568 5 11.9999 6.34315 11.9999 8C11.9999 9.65685 10.6568 11 9 11H6.20703L6.85351 11.6465L6.14648 12.3535L4.64652 10.8536C4.45126 10.6583 4.45126 10.3417 4.64652 10.1464L6.14648 8.64648L6.85351 9.35352L6.20703 10H9C10.1046 10 10.9999 9.10457 10.9999 8Z" fill="currentColor"/><path d="M2 15H1V1H2V15Z" fill="currentColor"/><path d="M15 15H14V1H15V15Z" fill="currentColor"/></svg>';
    const CODE_NOWRAP_SVG = '<svg class="mdw-code-icon mdw-code-icon--nowrap" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 2H14V3H2V2Z" fill="currentColor"/><path d="M2 5H8V6H2V5Z" fill="currentColor"/><path d="M2 8H14V9H2V8Z" fill="currentColor"/><path d="M2 11H8V12H2V11Z" fill="currentColor"/><path d="M2 14H14V15H2V14Z" fill="currentColor"/></svg>';
    const LINK_GLOBE_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke-width="1.3" stroke="currentColor"><path d="M7.99986 14.0887C11.3626 14.0887 14.0886 11.3627 14.0886 7.99998C14.0886 4.63727 11.3626 1.91125 7.99986 1.91125C4.63715 1.91125 1.91113 4.63727 1.91113 7.99998C1.91113 11.3627 4.63715 14.0887 7.99986 14.0887Z"/><path d="M2.34619 8H13.6538" stroke-linecap="square"/><path d="M7.99976 14.0889C9.23509 14.0889 10.1743 11.3629 10.1743 8.00006C10.1743 4.63739 9.23509 1.91138 7.99976 1.91138"/><path d="M7.99973 14.0889C6.76445 14.0889 5.8252 11.3629 5.8252 8.00006C5.8252 4.63739 6.76445 1.91138 7.99973 1.91138"/></svg>';

    /**
     * Decorative leading icon for one Markdown link (globe, matching the chat
     * renderer's unknown-site fallback). Non-editable so link text stays editable.
     * @param href - link destination.
     * @returns HTML string for the icon span.
     */
    function linkIconHtml(href) {
      const value = typeof href === 'string' ? href : '';
      const kind = /^(?:https?:)?\/\//i.test(value) ? 'external' : 'link';
      return `<span class="mdw-link-icon" data-link-kind="${kind}" contenteditable="false" aria-hidden="true">${LINK_GLOBE_SVG}</span>`;
    }

    /**
     * Insert a banner (language + wrap/copy actions) into a code block wrapper.
     * @param language - code fence language.
     * @returns HTML string.
     */
    function codeBannerHtml(language) {
      const label = language && language.length > 0 ? escapeHtml(language) : escapeHtml(translate('code.label'));
      const wrapLabel = escapeAttr(translate('code.wrap'));
      const unwrapLabel = escapeAttr(translate('code.unwrap'));
      const copyLabel = escapeAttr(translate('code.copy'));
      const copiedLabel = escapeAttr(translate('code.copied'));
      return `<div class="mdw-code-banner" contenteditable="false">`
        + `<span class="mdw-code-lang">${label}</span>`
        + '<span class="mdw-code-actions">'
        + `<button type="button" class="mdw-code-action mdw-code-action--wrap" data-md-action="wrap-code" contenteditable="false" title="${wrapLabel}" aria-label="${wrapLabel}" data-wrap-label="${wrapLabel}" data-nowrap-label="${unwrapLabel}">${CODE_WRAP_SVG}${CODE_NOWRAP_SVG}</button>`
        + `<button type="button" class="mdw-code-action mdw-code-action--copy" data-md-action="copy-code" contenteditable="false" title="${copyLabel}" aria-label="${copyLabel}" data-copy-label="${copyLabel}" data-copied-label="${copiedLabel}">${CODE_COPY_SVG}${CODE_CHECK_SVG}</button>`
        + '</span></div>';
    }

    function markdownFromBlockElement(element) {
      const type = element.dataset.mdType;
      if (type === 'p') return inlineMarkdown(element).replace(/\n+$/, '');
      if (type === 'heading') {
        const level = Math.min(6, Math.max(1, Number(element.dataset.level) || 1));
        return `${'#'.repeat(level)} ${inlineMarkdown(element).replace(/\n+$/, '')}`;
      }
      if (type === 'quote') {
        const inner = inlineMarkdown(element).replace(/\n+$/, '');
        return inner.split('\n').map((line) => (line.length === 0 ? '>' : `> ${line}`)).join('\n');
      }
      if (type === 'code') {
        const language = element.dataset.lang || '';
        const code = (element.querySelector('code') || element).textContent.replace(/\n+$/, '');
        return `\`\`\`${language}\n${code}\n\`\`\``;
      }
      if (type === 'hr') return '---';
      if (type === 'table') {
        const headerRow = element.querySelector('thead tr');
        const header = headerRow ? Array.from(headerRow.children).map((cell) => inlineMarkdown(cell).replace(/\n/g, ' ').trim()) : [];
        const bodyRows = Array.from(element.querySelectorAll('tbody tr')).map((row) => Array.from(row.children).map((cell) => inlineMarkdown(cell).replace(/\n/g, ' ').trim()));
        const columns = Math.max(1, header.length, ...bodyRows.map((row) => row.length));
        const pad = (row) => {
          const copy = row.slice(0, columns);
          while (copy.length < columns) copy.push('');
          return copy;
        };
        const aligns = String(element.dataset.aligns || '').split(',');
        const alignRow = Array.from({ length: columns }, (_, cellIndex) => {
          const align = aligns[cellIndex];
          if (align === 'center') return ':---:';
          if (align === 'right') return '---:';
          if (align === 'left') return ':---';
          return '---';
        });
        const escapeCell = (cell) => cell.replace(/\|/g, '\\|');
        return [
          `| ${pad(header).map(escapeCell).join(' | ')} |`,
          `| ${alignRow.join(' | ')} |`,
          ...bodyRows.map((row) => `| ${pad(row).map(escapeCell).join(' | ')} |`),
        ].join('\n');
      }
      if (type === 'li') {
        const indent = Math.min(3, Math.max(0, Number(element.dataset.indent) || 0));
        const ordered = element.dataset.ordered === '1';
        const checked = Number(element.dataset.checked);
        const textElement = element.querySelector('.mdw-li-text');
        const text = textElement ? inlineMarkdown(textElement).replace(/\n+$/, '') : '';
        const marker = checked >= 0 ? `- [${checked === 1 ? 'x' : ' '}] ` : ordered ? '1. ' : '- ';
        return `${'  '.repeat(indent)}${marker}${text}`;
      }
      return '';
    }

    function serializeDoc(docElement) {
      if (!docElement) return '';
      const entries = [];
      let counters = null;
      for (const element of Array.from(docElement.children)) {
        if (!(element instanceof Element)) continue;
        const type = element.dataset ? element.dataset.mdType : undefined;
        if (!type) {
          const text = (element.textContent || '').trim();
          if (text.length > 0) entries.push({ kind: 'block', text });
          continue;
        }
        if (type === 'li') {
          if (counters === null) counters = {};
          const indent = Math.min(3, Math.max(0, Number(element.dataset.indent) || 0));
          const ordered = element.dataset.ordered === '1';
          const checked = Number(element.dataset.checked);
          const textElement = element.querySelector('.mdw-li-text');
          const text = textElement ? inlineMarkdown(textElement).replace(/\n+$/, '') : '';
          let marker;
          if (checked >= 0) {
            marker = `- [${checked === 1 ? 'x' : ' '}] `;
          } else if (ordered) {
            counters[indent] = (counters[indent] || 0) + 1;
            Object.keys(counters).forEach((key) => {
              if (Number(key) > indent) delete counters[key];
            });
            marker = `${counters[indent]}. `;
          } else {
            Object.keys(counters).forEach((key) => {
              if (Number(key) >= indent) delete counters[key];
            });
            marker = '- ';
          }
          entries.push({
            kind: 'li',
            family: ordered ? 'o' : 'u',
            group: Math.max(0, Number(element.dataset.listGroup) || 0),
            indent,
            text: `${'  '.repeat(indent)}${marker}${text}`,
          });
          continue;
        }
        counters = null;
        const markdown = markdownFromBlockElement(element);
        if (markdown.trim().length > 0) entries.push({ kind: 'block', text: markdown });
      }
      let out = '';
      let previous = null;
      for (const entry of entries) {
        if (out.length === 0) out = entry.text;
        else if (entry.kind === 'li' && previous !== null && previous.kind === 'li'
          && ((entry.family === previous.family && entry.group === previous.group) || entry.indent > previous.indent)) {
          out += `\n${entry.text}`;
        } else out += `\n\n${entry.text}`;
        previous = entry;
      }
      return out;
    }

    function extractHeadings(text) {
      const lines = String(text === undefined || text === null ? '' : text).replace(/\r\n?/g, '\n').split('\n');
      const headings = [];
      let inFence = false;
      let fenceChar = '';
      for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index];
        const fence = /^\s*(`{3,}|~{3,})/.exec(line);
        if (fence) {
          if (!inFence) {
            inFence = true;
            fenceChar = fence[1][0];
          } else if (fence[1][0] === fenceChar) {
            inFence = false;
          }
          continue;
        }
        if (inFence) continue;
        const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
        if (heading) {
          headings.push({ level: heading[1].length, text: heading[2].replace(/[*_~`]/g, '').replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1'), line: index });
        }
      }
      return headings;
    }

    // ---------------------------------------------------------------------
    // Slash menu
    // ---------------------------------------------------------------------

    function slashItems() {
      return [
        { id: 'paragraph', kind: 'paragraph', labelKey: 'slash.paragraph' },
        { id: 'h1', kind: 'heading', level: 1, labelKey: 'slash.h1' },
        { id: 'h2', kind: 'heading', level: 2, labelKey: 'slash.h2' },
        { id: 'h3', kind: 'heading', level: 3, labelKey: 'slash.h3' },
        { id: 'h4', kind: 'heading', level: 4, labelKey: 'slash.h4' },
        { id: 'h5', kind: 'heading', level: 5, labelKey: 'slash.h5' },
        { id: 'h6', kind: 'heading', level: 6, labelKey: 'slash.h6' },
        { id: 'bold', kind: 'inline', tag: 'strong', sampleKey: 'slash.sample.bold', labelKey: 'slash.bold' },
        { id: 'italic', kind: 'inline', tag: 'em', sampleKey: 'slash.sample.italic', labelKey: 'slash.italic' },
        { id: 'strike', kind: 'inline', tag: 'del', sampleKey: 'slash.sample.strike', labelKey: 'slash.strike' },
        { id: 'code', kind: 'inline', tag: 'code', sampleKey: 'slash.sample.code', labelKey: 'slash.code' },
        { id: 'link', kind: 'link', labelKey: 'slash.link' },
        { id: 'ul', kind: 'list', list: 'ul', labelKey: 'slash.ul' },
        { id: 'ol', kind: 'list', list: 'ol', labelKey: 'slash.ol' },
        { id: 'task', kind: 'list', list: 'task', labelKey: 'slash.task' },
        { id: 'quote', kind: 'quote', labelKey: 'slash.quote' },
        { id: 'codeblock', kind: 'codeblock', labelKey: 'slash.codeblock' },
        { id: 'table', kind: 'table', labelKey: 'slash.table' },
        { id: 'hr', kind: 'hr', labelKey: 'slash.hr' },
        { id: 'image', kind: 'image', labelKey: 'slash.image' },
      ];
    }

    function matchesSlash(item, query) {
      if (query.length === 0) return true;
      const label = translate(item.labelKey).toLowerCase();
      const id = item.id.toLowerCase();
      return label.includes(query.toLowerCase()) || id.includes(query.toLowerCase());
    }

    function readMode() {
      try {
        const value = window.localStorage.getItem(MODE_KEY);
        if (value === 'source' || value === 'wysiwyg') return value;
        if (value === 'edit') return 'source';
      } catch {
        /* storage may be unavailable */
      }
      return 'wysiwyg';
    }

    function writeMode(mode) {
      try {
        window.localStorage.setItem(MODE_KEY, mode);
      } catch {
        /* ignore */
      }
    }

    function caretRect(textarea, position) {
      if (!textarea || typeof document === 'undefined') return null;
      const style = window.getComputedStyle(textarea);
      const mirror = document.createElement('div');
      const properties = [
        'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth',
        'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'whiteSpace',
        'wordBreak', 'wordWrap', 'textTransform',
      ];
      mirror.style.position = 'absolute';
      mirror.style.visibility = 'hidden';
      mirror.style.overflow = 'hidden';
      mirror.style.width = `${textarea.clientWidth}px`;
      for (const property of properties) mirror.style[property] = style[property];
      if (mirror.style.whiteSpace !== 'pre-wrap') mirror.style.whiteSpace = 'pre-wrap';
      mirror.textContent = textarea.value.slice(0, position);
      const marker = document.createElement('span');
      marker.textContent = '\u200b';
      mirror.appendChild(marker);
      document.body.appendChild(mirror);
      const markerRect = marker.getBoundingClientRect();
      const box = textarea.getBoundingClientRect();
      document.body.removeChild(mirror);
      const lineHeight = parseFloat(style.lineHeight) || 18;
      return {
        top: markerRect.top,
        bottom: markerRect.top + (markerRect.height || lineHeight),
        left: markerRect.left,
        height: markerRect.height || lineHeight,
        boxTop: box.top,
        boxLeft: box.left,
      };
    }

    // ---------------------------------------------------------------------
    // WYSIWYG editor: rendered Markdown as the editing surface
    // ---------------------------------------------------------------------

    function WysiwygEditor({ t, text, onChange, placeholder, apiRef, onSaveRequest, onImageRequest, onImageFiles }) {
      const docRef = useRef(null);
      const lastSerialized = useRef(null);
      const onChangeRef = useRef(onChange);
      onChangeRef.current = onChange;
      const onSaveRequestRef = useRef(onSaveRequest);
      onSaveRequestRef.current = onSaveRequest;
      const onImageRequestRef = useRef(onImageRequest);
      onImageRequestRef.current = onImageRequest;
      const onImageFilesRef = useRef(onImageFiles);
      onImageFilesRef.current = onImageFiles;
      const placeholderRef = useRef(placeholder);
      placeholderRef.current = placeholder;
      const [slash, setSlash] = useState(null);
      const slashRef = useRef(null);
      slashRef.current = slash;
      const [urlPrompt, setUrlPrompt] = useState(null);
      const [tableMenu, setTableMenu] = useState(null);
      const urlPromptRef = useRef(null);
      urlPromptRef.current = urlPrompt;
      const savedRange = useRef(null);
      const syncTimer = useRef(null);
      const composing = useRef(false);

      const blockOfNode = (node) => {
        let current = node;
        while (current && current !== docRef.current) {
          if (current.nodeType === 1 && current.dataset && current.dataset.mdType) return current;
          current = current.parentNode;
        }
        return null;
      };

      const currentBlock = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        return blockOfNode(selection.getRangeAt(0).startContainer);
      };

      const selectionRangeInDoc = () => {
        const doc = docRef.current;
        const selection = window.getSelection();
        if (!doc || !selection || selection.rangeCount === 0) return null;
        const range = selection.getRangeAt(0);
        if (!doc.contains(range.startContainer) || !doc.contains(range.endContainer)) return null;
        // A collapsed caret parked on the editing host itself (some browsers and
        // focus implementations do that) is not an editable position yet.
        if (blockOfNode(range.startContainer) === null) return null;
        return range;
      };

      const textRootOf = (block) => {
        if (!block) return null;
        if (block.dataset.mdType === 'li') return block.querySelector('.mdw-li-text');
        if (block.dataset.mdType === 'code') return block.querySelector('code') || block;
        return block;
      };

      const setDomSelection = (range) => {
        const selection = window.getSelection();
        if (!selection) return;
        selection.removeAllRanges();
        selection.addRange(range);
      };

      const placeCaretAtStart = (block) => {
        const root = textRootOf(block);
        if (!root) return;
        const range = document.createRange();
        if (root.firstChild && root.firstChild.nodeType === 3) range.setStart(root.firstChild, 0);
        else range.setStart(root, 0);
        range.collapse(true);
        setDomSelection(range);
        try {
          block.scrollIntoView({ block: 'nearest' });
        } catch {
          /* ignore */
        }
      };

      const placeCaretAtEnd = (block) => {
        const root = textRootOf(block);
        if (!root) return;
        const range = document.createRange();
        range.selectNodeContents(root);
        range.collapse(false);
        setDomSelection(range);
        try {
          block.scrollIntoView({ block: 'nearest' });
        } catch {
          /* ignore */
        }
      };

      const caretAtStart = (block) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        const root = textRootOf(block);
        if (!root || !root.contains(range.startContainer)) return false;
        const probe = document.createRange();
        probe.selectNodeContents(root);
        probe.setEnd(range.startContainer, range.startOffset);
        return probe.toString().replace(/\u200b/g, '').length === 0;
      };

      const caretAtEnd = (block) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return false;
        const range = selection.getRangeAt(0);
        if (!range.collapsed) return false;
        const root = textRootOf(block);
        if (!root || !root.contains(range.endContainer)) return false;
        const probe = document.createRange();
        probe.selectNodeContents(root);
        probe.setStart(range.endContainer, range.endOffset);
        return probe.toString().replace(/\u200b/g, '').length === 0;
      };

      const ensurePlaceholder = (root) => {
        if (!root) return;
        if (root.textContent.replace(/\u200b/g, '').trim().length > 0) return;
        if (root.querySelector('img,input')) return;
        if (!root.querySelector('br')) root.appendChild(document.createElement('br'));
      };

      const decorateEmpty = () => {
        const doc = docRef.current;
        if (!doc) return;
        const blocks = Array.from(doc.children).filter((element) => element instanceof Element && element.dataset && element.dataset.mdType);
        for (const block of blocks) {
          ensurePlaceholder(textRootOf(block));
          block.removeAttribute('data-placeholder');
        }
        doc.removeAttribute('data-placeholder');
        if (blocks.length === 0) {
          doc.setAttribute('data-placeholder', placeholderRef.current || '');
          return;
        }
        if (blocks.length === 1 && blocks[0].dataset.mdType === 'p' && blocks[0].textContent.replace(/\u200b/g, '').trim().length === 0) {
          blocks[0].setAttribute('data-placeholder', placeholderRef.current || '');
        }
      };

      const refreshListMarkers = () => {
        const doc = docRef.current;
        if (!doc) return;
        const counters = {};
        for (const element of Array.from(doc.children)) {
          if (!(element instanceof Element) || element.dataset.mdType !== 'li') {
            for (const key of Object.keys(counters)) delete counters[key];
            continue;
          }
          if (element.dataset.ordered !== '1' || Number(element.dataset.checked) >= 0) continue;
          const indent = Math.min(3, Math.max(0, Number(element.dataset.indent) || 0));
          counters[indent] = (counters[indent] || 0) + 1;
          for (const key of Object.keys(counters)) if (Number(key) > indent) delete counters[key];
          const marker = element.querySelector('.mdw-marker-holder');
          if (marker) marker.textContent = `${counters[indent]}.`;
        }
      };

      const syncFromDom = () => {
        const doc = docRef.current;
        if (!doc) return;
        refreshListMarkers();
        decorateEmpty();
        const markdown = serializeDoc(doc);
        if (markdown === lastSerialized.current) return;
        lastSerialized.current = markdown;
        onChangeRef.current(markdown);
      };

      const scheduleSync = () => {
        if (syncTimer.current !== null) return;
        syncTimer.current = setTimeout(() => {
          syncTimer.current = null;
          if (!composing.current) syncFromDom();
        }, 80);
      };

      const buildFromMarkdown = (markdown) => {
        const doc = docRef.current;
        if (!doc) return;
        const blocks = blocksFromMarkdown(markdown);
        let html = blocks.map(blockHtml).join('');
        if (html.length === 0) html = blockHtml({ type: 'p', text: '' });
        doc.innerHTML = html;
        lastSerialized.current = markdown;
        refreshListMarkers();
        decorateEmpty();
      };

      const elementFromBlock = (block) => {
        const holder = document.createElement('div');
        holder.innerHTML = blockHtml(block);
        return holder.firstElementChild;
      };

      const refreshAndSync = () => {
        refreshListMarkers();
        syncFromDom();
      };

      const removeBlock = (block) => {
        if (!block || !block.parentNode) return;
        const parent = block.parentNode;
        const previous = block.previousElementSibling;
        const next = block.nextElementSibling;
        block.remove();
        if (parent.children.length === 0) {
          const paragraph = document.createElement('div');
          paragraph.className = 'mdw-block mdw-p';
          paragraph.dataset.mdType = 'p';
          paragraph.innerHTML = '<br>';
          parent.appendChild(paragraph);
          placeCaretAtStart(paragraph);
        } else if (previous instanceof Element && previous.dataset.mdType !== 'hr') {
          placeCaretAtEnd(previous);
        } else if (next instanceof Element && next.dataset.mdType !== 'hr') {
          placeCaretAtStart(next);
        }
        refreshAndSync();
      };

      const insertTextAtRange = (range, value) => {
        range.deleteContents();
        if (value.length === 0) return;
        const node = document.createTextNode(value);
        range.insertNode(node);
        const next = document.createRange();
        next.setStart(node, node.length);
        next.collapse(true);
        setDomSelection(next);
      };

      const insertNodeAtRange = (range, node) => {
        range.deleteContents();
        range.insertNode(node);
        const next = document.createRange();
        next.setStartAfter(node);
        next.collapse(true);
        setDomSelection(next);
      };

      const wrapInline = (tag, sample) => {
        let range = selectionRangeInDoc();
        if (!range) {
          focusDoc();
          range = selectionRangeInDoc();
          if (!range) return;
        }
        if (range.collapsed) {
          const element = document.createElement(tag);
          element.textContent = sample || '';
          range.insertNode(element);
          const selection = document.createRange();
          selection.selectNodeContents(element);
          setDomSelection(selection);
        } else {
          const element = document.createElement(tag);
          try {
            element.appendChild(range.extractContents());
          } catch {
            element.textContent = range.toString();
          }
          range.insertNode(element);
          const after = document.createRange();
          after.setStartAfter(element);
          after.collapse(true);
          setDomSelection(after);
        }
        syncFromDom();
      };

      const newParagraph = () => {
        const paragraph = document.createElement('div');
        paragraph.className = 'mdw-block mdw-p';
        paragraph.dataset.mdType = 'p';
        paragraph.innerHTML = '<br>';
        return paragraph;
      };

      const focusDoc = () => {
        const doc = docRef.current;
        if (!doc) return;
        // A live selection inside a block must survive focus restoration.
        if (selectionRangeInDoc() !== null) return;
        try {
          doc.focus({ preventScroll: true });
        } catch {
          doc.focus();
        }
        if (!selectionRangeInDoc()) {
          const blocks = Array.from(doc.children).filter((element) => element.dataset && element.dataset.mdType);
          const last = blocks[blocks.length - 1];
          if (last) placeCaretAtEnd(last);
        }
      };

      const ensureCurrentBlock = () => {
        let block = currentBlock();
        if (block) return block;
        focusDoc();
        block = currentBlock();
        return block;
      };

      const replaceBlock = (oldBlock, newBlock, caret) => {
        if (!oldBlock || !oldBlock.parentNode) return;
        oldBlock.parentNode.replaceChild(newBlock, oldBlock);
        if (caret === 'start') placeCaretAtStart(newBlock);
        else if (caret === 'end') placeCaretAtEnd(newBlock);
        syncFromDom();
      };

      const nextListGroup = () => {
        const doc = docRef.current;
        if (!doc) return 1;
        let max = 0;
        for (const element of Array.from(doc.children)) {
          if (element.dataset && element.dataset.mdType === 'li') {
            const group = Number(element.dataset.listGroup) || 0;
            if (group > max) max = group;
          }
        }
        return max + 1;
      };

      const contentHtmlOf = (block) => {
        const type = block.dataset.mdType;
        if (type === 'li') {
          const textElement = block.querySelector('.mdw-li-text');
          return textElement ? textElement.innerHTML : '';
        }
        if (type === 'code') return escapeHtml((block.querySelector('code') || block).textContent || '');
        if (type === 'table' || type === 'hr') return '';
        return block.innerHTML;
      };

      const convertBlock = (block, target) => {
        if (!block) block = ensureCurrentBlock();
        if (!block) return;
        const content = contentHtmlOf(block);
        let newBlock;
        if (target.type === 'p') {
          newBlock = document.createElement('div');
          newBlock.className = 'mdw-block mdw-p';
          newBlock.dataset.mdType = 'p';
          newBlock.innerHTML = content || '<br>';
        } else if (target.type === 'heading') {
          const level = Math.min(6, Math.max(1, target.level || 1));
          newBlock = document.createElement('div');
          newBlock.className = `mdw-block mdw-h mdw-h${level}`;
          newBlock.dataset.mdType = 'heading';
          newBlock.dataset.level = String(level);
          newBlock.innerHTML = content || '<br>';
        } else if (target.type === 'quote') {
          newBlock = document.createElement('blockquote');
          newBlock.className = 'mdw-block';
          newBlock.dataset.mdType = 'quote';
          newBlock.innerHTML = content || '<br>';
        } else if (target.type === 'code') {
          const codeText = block.dataset.mdType === 'code'
            ? (block.querySelector('code') || block).textContent || ''
            : block.textContent || '';
          newBlock = elementFromBlock({
            type: 'code',
            language: typeof target.language === 'string' ? target.language : (block.dataset.lang || ''),
            text: codeText,
          });
        } else if (target.type === 'li') {
          const list = target.list || 'ul';
          const holder = document.createElement('div');
          holder.innerHTML = blockHtmlFromInline({
            type: 'li',
            group: nextListGroup(),
            ordered: list === 'ol',
            checked: list === 'task' ? 0 : -1,
            indent: 0,
          }, content);
          newBlock = holder.firstElementChild;
        }
        if (!newBlock) return;
        replaceBlock(block, newBlock, 'start');
      };

      /**
       * Delete `count` characters from the very start of a block's text.
       * @param root - editable text root.
       * @param count - number of characters to remove.
       */
      const stripLeadingChars = (root, count) => {
        if (!root || count <= 0) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const removal = document.createRange();
        let started = false;
        let remaining = count;
        let node = walker.nextNode();
        while (node) {
          const length = node.nodeValue ? node.nodeValue.length : 0;
          if (!started) {
            removal.setStart(node, 0);
            started = true;
          }
          if (remaining <= length) {
            removal.setEnd(node, remaining);
            remaining = 0;
            break;
          }
          remaining -= length;
          node = walker.nextNode();
        }
        if (!started) return;
        try {
          removal.deleteContents();
        } catch {
          /* ignore malformed ranges */
        }
      };

      /**
       * Live Markdown input rules: typing `# `, `- `, `1. `, `> `, ```` ``` ````,
       * `- [ ] ` at the start of a block turns it into that block type, like
       * Madedown's inline Markdown shortcuts.
       * @returns whether the current block was converted.
       */
      const autoFormatMarkdown = () => {
        if (slashRef.current !== null || composing.current) return false;
        let convertedAny = false;
        for (let pass = 0; pass < 3; pass += 1) {
          const block = currentBlock();
          if (!block) return convertedAny;
          const type = block.dataset.mdType;
          const root = textRootOf(block);
          const text = root ? (root.textContent || '') : '';
          if (type === 'p') {
            const heading = /^(#{1,6})\s+/.exec(text);
            if (heading) {
              stripLeadingChars(root, heading[0].length);
              convertBlock(block, { type: 'heading', level: heading[1].length });
              convertedAny = true;
              continue;
            }
            const fence = /^(`{3,}|~{3,})([A-Za-z0-9_+.-]*)\s+$/.exec(text);
            if (fence) {
              stripLeadingChars(root, fence[0].length);
              convertBlock(block, { type: 'code', language: fence[2] || '' });
              convertedAny = true;
              continue;
            }
            const ordered = /^(\d+)[.)]\s+/.exec(text);
            if (ordered) {
              stripLeadingChars(root, ordered[0].length);
              convertBlock(block, { type: 'li', list: 'ol' });
              convertedAny = true;
              continue;
            }
            const bullet = /^([-*+])\s+/.exec(text);
            if (bullet) {
              stripLeadingChars(root, bullet[0].length);
              convertBlock(block, { type: 'li', list: 'ul' });
              convertedAny = true;
              continue;
            }
            const quote = /^>\s+/.exec(text);
            if (quote) {
              stripLeadingChars(root, quote[0].length);
              convertBlock(block, { type: 'quote' });
              convertedAny = true;
              continue;
            }
            return convertedAny;
          }
          if (type === 'li') {
            const task = /^\[([ xX])\]\s+/.exec(text);
            if (task && Number(block.dataset.checked) < 0) {
              stripLeadingChars(root, task[0].length);
              convertBlock(block, { type: 'li', list: 'task' });
              const converted = currentBlock();
              if (converted) converted.dataset.checked = task[1].toLowerCase() === 'x' ? '1' : '0';
              convertedAny = true;
              continue;
            }
            return convertedAny;
          }
          return convertedAny;
        }
        return convertedAny;
      };

      const insertAfter = (block, newBlock) => {
        const doc = docRef.current;
        if (!doc) return;
        if (block && block.parentNode === doc) doc.insertBefore(newBlock, block.nextSibling);
        else doc.appendChild(newBlock);
        refreshListMarkers();
      };

      const tableFromCells = () => {
        const holder = document.createElement('div');
        holder.innerHTML = blockHtml({
          type: 'table',
          header: ['列 1', '列 2'],
          aligns: [null, null],
          rows: [['内容', '内容']],
        });
        return holder.firstElementChild;
      };

      const focusFirstCell = (tableBlock) => {
        const cell = tableBlock.querySelector('th,td');
        if (!cell) return;
        const range = document.createRange();
        range.selectNodeContents(cell);
        range.collapse(true);
        setDomSelection(range);
      };

      const moveToNextCell = (direction) => {
        const block = currentBlock();
        if (!block || block.dataset.mdType !== 'table') return;
        const cells = Array.from(block.querySelectorAll('th,td'));
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const anchor = selection.getRangeAt(0).startContainer;
        let index = cells.findIndex((cell) => cell === anchor || cell.contains(anchor));
        if (index < 0) index = 0;
        if (direction > 0 && index === cells.length - 1) {
          const body = block.querySelector('tbody');
          if (!body) return;
          const columns = block.querySelectorAll('thead th').length || 1;
          const row = document.createElement('tr');
          for (let column = 0; column < columns; column += 1) {
            const cell = document.createElement('td');
            cell.innerHTML = '<br>';
            row.appendChild(cell);
          }
          body.appendChild(row);
          const newCells = Array.from(row.children);
          const target = newCells[0];
          if (!target) return;
          const range = document.createRange();
          range.selectNodeContents(target);
          range.collapse(true);
          setDomSelection(range);
          scheduleSync();
          return;
        }
        index = Math.max(0, Math.min(cells.length - 1, index + direction));
        const target = cells[index];
        if (!target) return;
        const range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(true);
        setDomSelection(range);
        scheduleSync();
      };

      const tableContext = () => {
        const doc = docRef.current;
        const selection = window.getSelection();
        if (!doc || !selection || selection.rangeCount === 0) return null;
        const range = selection.getRangeAt(0);
        if (!doc.contains(range.startContainer)) return null;
        const node = range.startContainer instanceof Element ? range.startContainer : range.startContainer.parentElement;
        if (!node) return null;
        const tableBlock = node.closest('[data-md-type="table"]');
        if (!tableBlock || !doc.contains(tableBlock)) return null;
        const cell = node.closest('th,td');
        if (!cell || !tableBlock.contains(cell)) return null;
        const row = cell.closest('tr');
        const rows = Array.from(tableBlock.querySelectorAll('tr'));
        const cells = Array.from(row.children);
        return {
          tableBlock,
          row,
          rows,
          rowIndex: rows.indexOf(row),
          colIndex: cells.indexOf(cell),
          isHeader: row.parentElement.tagName === 'THEAD',
          columns: tableBlock.querySelectorAll('thead th').length || cells.length,
        };
      };

      const focusCell = (cell) => {
        if (!cell) return;
        const range = document.createRange();
        range.selectNodeContents(cell);
        range.collapse(true);
        setDomSelection(range);
      };

      const makeTableCell = (isHeader) => {
        const cell = document.createElement(isHeader ? 'th' : 'td');
        cell.innerHTML = '<br>';
        return cell;
      };

      const syncTableAligns = (block) => {
        const columns = block.querySelectorAll('thead th').length;
        const current = String(block.dataset.aligns || '').split(',');
        const next = [];
        for (let index = 0; index < columns; index += 1) next.push(current[index] || '');
        if (next.every((value) => value === '')) block.removeAttribute('data-aligns');
        else block.dataset.aligns = next.join(',');
      };

      const refreshTableMenu = () => {
        const context = tableContext();
        if (!context) {
          setTableMenu((current) => (current === null ? null : null));
          return;
        }
        const rect = context.tableBlock.getBoundingClientRect();
        setTableMenu((current) => {
          if (
            current !== null
            && Math.abs(current.left - rect.left) < 1
            && Math.abs(current.top - rect.top) < 1
            && Math.abs(current.width - rect.width) < 1
            && Math.abs(current.height - rect.height) < 1
          ) return current;
          return { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
        });
      };

      const insertTableRow = (where) => {
        const context = tableContext();
        if (!context) return;
        const row = document.createElement('tr');
        for (let index = 0; index < context.columns; index += 1) row.appendChild(makeTableCell(false));
        if (context.isHeader) {
          if (where === 'above') return;
          let body = context.tableBlock.querySelector('tbody');
          if (!body) {
            body = document.createElement('tbody');
            context.tableBlock.querySelector('table').appendChild(body);
          }
          body.insertBefore(row, body.firstElementChild);
        } else if (where === 'above') {
          context.row.parentElement.insertBefore(row, context.row);
        } else {
          context.row.parentElement.insertBefore(row, context.row.nextSibling);
        }
        syncTableAligns(context.tableBlock);
        focusCell(row.children[Math.min(context.colIndex, row.children.length - 1)]);
        refreshAndSync();
        refreshTableMenu();
      };

      const insertTableColumn = (where) => {
        const context = tableContext();
        if (!context) return;
        const index = where === 'left' ? context.colIndex : context.colIndex + 1;
        const currentAligns = String(context.tableBlock.dataset.aligns || '').split(',');
        const nextAligns = [];
        for (let column = 0; column < context.columns + 1; column += 1) {
          if (column < index) nextAligns.push(currentAligns[column] || '');
          else if (column === index) nextAligns.push('');
          else nextAligns.push(currentAligns[column - 1] || '');
        }
        for (const row of context.rows) {
          const isHeader = row.parentElement.tagName === 'THEAD';
          const reference = row.children[index] || null;
          row.insertBefore(makeTableCell(isHeader), reference);
        }
        if (nextAligns.every((value) => value === '')) context.tableBlock.removeAttribute('data-aligns');
        else context.tableBlock.dataset.aligns = nextAligns.join(',');
        const targetRow = context.row;
        focusCell(targetRow.children[Math.min(index, targetRow.children.length - 1)]);
        refreshAndSync();
        refreshTableMenu();
      };

      const deleteTableRow = () => {
        const context = tableContext();
        if (!context) return;
        if (context.isHeader) {
          const body = context.tableBlock.querySelector('tbody');
          const firstBodyRow = body ? body.firstElementChild : null;
          if (!firstBodyRow) return;
          const header = context.row;
          header.innerHTML = '';
          for (const cell of Array.from(firstBodyRow.children)) {
            const th = document.createElement('th');
            th.innerHTML = cell.innerHTML || '<br>';
            header.appendChild(th);
          }
          firstBodyRow.remove();
          focusCell(header.children[Math.min(context.colIndex, header.children.length - 1)]);
          refreshAndSync();
          refreshTableMenu();
          return;
        }
        context.row.remove();
        const bodyRows = Array.from(context.tableBlock.querySelectorAll('tbody tr'));
        const targetRow = bodyRows[Math.min(context.rowIndex - 1, bodyRows.length - 1)] || context.tableBlock.querySelector('thead tr');
        const targetCell = targetRow ? targetRow.children[Math.min(context.colIndex, targetRow.children.length - 1)] : null;
        if (targetCell) focusCell(targetCell);
        refreshAndSync();
        refreshTableMenu();
      };

      const deleteTableColumn = () => {
        const context = tableContext();
        if (!context) return;
        if (context.columns <= 1) {
          const block = context.tableBlock;
          const doc = docRef.current;
          if (!doc) return;
          const next = block.nextElementSibling;
          block.remove();
          if (next && next.dataset && next.dataset.mdType && next.dataset.mdType !== 'table' && next.dataset.mdType !== 'hr') placeCaretAtStart(next);
          else {
            const paragraph = newParagraph();
            doc.appendChild(paragraph);
            placeCaretAtStart(paragraph);
          }
          refreshAndSync();
          refreshTableMenu();
          return;
        }
        for (const row of context.rows) {
          const cell = row.children[context.colIndex];
          if (cell) cell.remove();
        }
        const currentAligns = String(context.tableBlock.dataset.aligns || '').split(',');
        currentAligns.splice(context.colIndex, 1);
        if (currentAligns.every((value) => value === '')) context.tableBlock.removeAttribute('data-aligns');
        else context.tableBlock.dataset.aligns = currentAligns.join(',');
        const targetRow = context.row;
        const targetCell = targetRow ? targetRow.children[Math.min(context.colIndex, targetRow.children.length - 1)] : context.tableBlock.querySelector('th,td');
        if (targetCell) focusCell(targetCell);
        refreshAndSync();
        refreshTableMenu();
      };

      const deleteTable = () => {
        const context = tableContext();
        if (!context) return;
        const doc = docRef.current;
        if (!doc) return;
        const block = context.tableBlock;
        const next = block.nextElementSibling;
        const previous = block.previousElementSibling;
        block.remove();
        const textEditable = (element) => element && element.dataset && element.dataset.mdType && element.dataset.mdType !== 'hr' && element.dataset.mdType !== 'table';
        if (textEditable(next)) placeCaretAtStart(next);
        else if (textEditable(previous)) placeCaretAtEnd(previous);
        else {
          const paragraph = newParagraph();
          doc.appendChild(paragraph);
          placeCaretAtStart(paragraph);
        }
        refreshAndSync();
        refreshTableMenu();
      };

      const splitBlock = () => {
        const block = currentBlock();
        if (!block) return;
        const range = selectionRangeInDoc();
        if (!range) return;
        const type = block.dataset.mdType;
        if (type === 'code') {
          insertTextAtRange(range, '\n');
          scheduleSync();
          return;
        }
        if (type === 'table') {
          moveToNextCell(1);
          return;
        }
        if (type === 'hr') return;
        if (type === 'li') {
          const textElement = block.querySelector('.mdw-li-text');
          if (!textElement) return;
          if (!textElement.contains(range.startContainer) && range.startContainer !== textElement) return;
          const tail = document.createRange();
          tail.setStart(range.startContainer, range.startOffset);
          tail.setEnd(textElement, textElement.childNodes.length);
          const fragment = tail.extractContents();
          const newBlock = elementFromBlock({
            type: 'li',
            group: Math.max(0, Number(block.dataset.listGroup) || 0),
            ordered: block.dataset.ordered === '1',
            checked: Number(block.dataset.checked) >= 0 ? 0 : -1,
            indent: Math.min(3, Math.max(0, Number(block.dataset.indent) || 0)),
            text: '',
          });
          const newText = newBlock.querySelector('.mdw-li-text');
          if (fragment.textContent.replace(/\u200b/g, '').trim().length === 0 && !fragment.querySelector('img')) newText.innerHTML = '<br>';
          else newText.appendChild(fragment);
          insertAfter(block, newBlock);
          placeCaretAtStart(newBlock);
          syncFromDom();
          return;
        }
        const tail = document.createRange();
        tail.setStart(range.startContainer, range.startOffset);
        tail.setEnd(block, block.childNodes.length);
        const fragment = tail.extractContents();
        let newBlock;
        if (type === 'quote') {
          newBlock = document.createElement('blockquote');
          newBlock.className = 'mdw-block';
          newBlock.dataset.mdType = 'quote';
        } else {
          newBlock = document.createElement('div');
          newBlock.className = 'mdw-block mdw-p';
          newBlock.dataset.mdType = 'p';
        }
        if (fragment.textContent.replace(/\u200b/g, '').trim().length === 0 && !fragment.querySelector('img')) newBlock.innerHTML = '<br>';
        else newBlock.appendChild(fragment);
        insertAfter(block, newBlock);
        placeCaretAtStart(newBlock);
        syncFromDom();
      };

      const exitCodeBlock = () => {
        const block = currentBlock();
        if (!block || block.dataset.mdType !== 'code') return false;
        const next = block.nextElementSibling;
        const editable = new Set(['p', 'heading', 'li', 'quote', 'code']);
        let target = next && next.dataset && editable.has(next.dataset.mdType) ? next : null;
        if (target === null) {
          target = newParagraph();
          insertAfter(block, target);
        }
        placeCaretAtStart(target);
        refreshAndSync();
        return true;
      };

      const insertSoftBreak = () => {
        const range = selectionRangeInDoc();
        if (!range) return;
        const lineBreak = document.createElement('br');
        range.deleteContents();
        range.insertNode(lineBreak);
        const after = document.createRange();
        after.setStartAfter(lineBreak);
        after.collapse(true);
        setDomSelection(after);
        scheduleSync();
      };

      const backspaceAtStart = () => {
        const block = currentBlock();
        if (!block) return;
        const type = block.dataset.mdType;
        if (type === 'li') {
          const indent = Math.min(3, Math.max(0, Number(block.dataset.indent) || 0));
          if (indent > 0) {
            block.dataset.indent = String(indent - 1);
            syncFromDom();
            return;
          }
          const textElement = block.querySelector('.mdw-li-text');
          const content = textElement ? textElement.innerHTML : '';
          const paragraph = document.createElement('div');
          paragraph.className = 'mdw-block mdw-p';
          paragraph.dataset.mdType = 'p';
          paragraph.innerHTML = content || '<br>';
          replaceBlock(block, paragraph, 'start');
          return;
        }
        if (type === 'heading' || type === 'quote') {
          const content = contentHtmlOf(block);
          const paragraph = document.createElement('div');
          paragraph.className = 'mdw-block mdw-p';
          paragraph.dataset.mdType = 'p';
          paragraph.innerHTML = content || '<br>';
          replaceBlock(block, paragraph, 'start');
          return;
        }
        if (type === 'table') return;
        if (type === 'code') {
          const previous = block.previousElementSibling;
          if (!previous || !previous.dataset || !previous.dataset.mdType) return;
          const target = textRootOf(previous);
          if (!target) return;
          const text = (block.querySelector('code') || block).textContent || '';
          const fragment = document.createDocumentFragment();
          text.split('\n').forEach((line, lineIndex) => {
            if (lineIndex > 0) fragment.appendChild(document.createElement('br'));
            fragment.appendChild(document.createTextNode(line));
          });
          const joinAt = target.childNodes.length;
          while (fragment.firstChild) target.appendChild(fragment.firstChild);
          block.remove();
          const caret = document.createRange();
          if (target.childNodes[joinAt]) caret.setStart(target.childNodes[joinAt], 0);
          else {
            caret.selectNodeContents(target);
            caret.collapse(false);
          }
          setDomSelection(caret);
          refreshAndSync();
          return;
        }
        const previous = block.previousElementSibling;
        if (!previous || !previous.dataset) return;
        if (previous.dataset.mdType === 'hr') {
          previous.remove();
          syncFromDom();
          return;
        }
        if (previous.dataset.mdType === 'table') return;
        const target = textRootOf(previous);
        if (!target) return;
        const joinAt = target.childNodes.length;
        while (block.firstChild) target.appendChild(block.firstChild);
        block.remove();
        const caret = document.createRange();
        if (target.childNodes[joinAt]) caret.setStart(target.childNodes[joinAt], 0);
        else {
          caret.selectNodeContents(target);
          caret.collapse(false);
        }
        setDomSelection(caret);
        refreshAndSync();
      };

      const deleteAtEnd = () => {
        const block = currentBlock();
        if (!block) return;
        const next = block.nextElementSibling;
        if (!next || !next.dataset || !['p', 'heading', 'quote'].includes(next.dataset.mdType)) return;
        const target = textRootOf(block);
        if (!target) return;
        while (next.firstChild) target.appendChild(next.firstChild);
        next.remove();
        refreshAndSync();
      };

      const setListIndent = (direction) => {
        const block = currentBlock();
        if (!block || block.dataset.mdType !== 'li') return;
        const indent = Math.min(3, Math.max(0, Number(block.dataset.indent) || 0));
        const next = direction > 0 ? Math.min(3, indent + 1) : Math.max(0, indent - 1);
        if (next === indent) return;
        block.dataset.indent = String(next);
        refreshAndSync();
      };

      const openSlash = () => {
        const block = currentBlock();
        if (!block || block.dataset.mdType !== 'p') return;
        const content = block.textContent || '';
        if (!content.startsWith('/')) return;
        const range = selectionRangeInDoc();
        const rect = range && typeof range.getBoundingClientRect === 'function'
          ? range.getBoundingClientRect()
          : block.getBoundingClientRect();
        setSlash({ query: content.slice(1).trim(), index: 0, rect: { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width } });
      };

      const closeSlash = () => setSlash(null);

      const removeSlashText = () => {
        const block = currentBlock();
        if (!block) return null;
        const root = textRootOf(block);
        const range = selectionRangeInDoc();
        if (!root || !range) return block;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const firstText = walker.nextNode();
        const removal = document.createRange();
        if (firstText) removal.setStart(firstText, 0);
        else {
          removal.selectNodeContents(root);
          removal.collapse(true);
        }
        try {
          removal.setEnd(range.endContainer, range.endOffset);
        } catch {
          return block;
        }
        removal.deleteContents();
        const caret = document.createRange();
        caret.setStart(removal.startContainer, removal.startOffset);
        caret.collapse(true);
        setDomSelection(caret);
        return block;
      };

      const applySlashItem = (item) => {
        const slashState = slashRef.current;
        setSlash(null);
        if (!slashState) return;
        const block = currentBlock();
        if (!block) return;
        removeSlashText();
        const remaining = currentBlock() || block;
        if (item.kind === 'paragraph') convertBlock(remaining, { type: 'p' });
        else if (item.kind === 'heading') convertBlock(remaining, { type: 'heading', level: item.level });
        else if (item.kind === 'list') convertBlock(remaining, { type: 'li', list: item.list });
        else if (item.kind === 'quote') convertBlock(remaining, { type: 'quote' });
        else if (item.kind === 'codeblock') convertBlock(remaining, { type: 'code' });
        else if (item.kind === 'inline') wrapInline(item.tag, translate(item.sampleKey));
        else if (item.kind === 'link') openUrlPrompt('link');
        else if (item.kind === 'image') {
          if (onImageRequestRef.current) onImageRequestRef.current();
          else openUrlPrompt('image');
        }
        else if (item.kind === 'table') {
          const tableBlock = tableFromCells();
          insertAfter(remaining, tableBlock);
          const paragraph = newParagraph();
          insertAfter(tableBlock, paragraph);
          focusFirstCell(tableBlock);
          syncFromDom();
        } else if (item.kind === 'hr') {
          const holder = document.createElement('div');
          holder.innerHTML = blockHtml({ type: 'hr' });
          const hrBlock = holder.firstElementChild;
          insertAfter(remaining, hrBlock);
          const paragraph = newParagraph();
          insertAfter(hrBlock, paragraph);
          placeCaretAtStart(paragraph);
          syncFromDom();
        }
      };

      const openUrlPrompt = (kind) => {
        const range = selectionRangeInDoc();
        savedRange.current = range ? range.cloneRange() : null;
        const rect = range && typeof range.getBoundingClientRect === 'function'
          ? range.getBoundingClientRect()
          : { left: 80, top: 120, bottom: 120, width: 0 };
        setUrlPrompt({ kind, value: '', rect: { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width } });
      };

      const closeUrlPrompt = (restoreFocus) => {
        setUrlPrompt(null);
        if (restoreFocus) {
          const range = savedRange.current;
          if (range) {
            try {
              setDomSelection(range);
            } catch {
              /* range may be stale */
            }
          }
          focusDoc();
        }
      };

      const commitUrlPrompt = () => {
        const prompt = urlPromptRef.current;
        if (!prompt) return;
        const url = String(prompt.value || '').trim();
        if (url.length === 0) {
          closeUrlPrompt(true);
          return;
        }
        const range = savedRange.current;
        setUrlPrompt(null);
        if (range) {
          try {
            setDomSelection(range);
          } catch {
            /* stale range */
          }
        }
        focusDoc();
        const selection = selectionRangeInDoc();
        if (!selection) return;
        if (prompt.kind === 'image') {
          const image = document.createElement('img');
          image.setAttribute('src', safeUrl(url));
          image.setAttribute('alt', 'image');
          insertNodeAtRange(selection, image);
        } else if (selection.collapsed) {
          const anchor = document.createElement('a');
          anchor.setAttribute('href', safeUrl(url));
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('rel', 'noreferrer noopener');
          anchor.innerHTML = linkIconHtml(safeUrl(url));
          anchor.appendChild(document.createTextNode(url));
          insertNodeAtRange(selection, anchor);
        } else {
          const anchor = document.createElement('a');
          anchor.setAttribute('href', safeUrl(url));
          anchor.setAttribute('target', '_blank');
          anchor.setAttribute('rel', 'noreferrer noopener');
          const iconHolder = document.createElement('div');
          iconHolder.innerHTML = linkIconHtml(safeUrl(url));
          anchor.appendChild(iconHolder.firstElementChild);
          try {
            anchor.appendChild(selection.extractContents());
          } catch {
            anchor.appendChild(document.createTextNode(url));
          }
          selection.insertNode(anchor);
          const after = document.createRange();
          after.setStartAfter(anchor);
          after.collapse(true);
          setDomSelection(after);
        }
        syncFromDom();
      };

      const command = (name, argument) => {
        focusDoc();
        if (name === 'bold') wrapInline('strong', translate('slash.sample.bold'));
        else if (name === 'italic') wrapInline('em', translate('slash.sample.italic'));
        else if (name === 'strike') wrapInline('del', translate('slash.sample.strike'));
        else if (name === 'code') wrapInline('code', translate('slash.sample.code'));
        else if (name === 'link') openUrlPrompt('link');
        else if (name === 'image') {
          if (onImageRequestRef.current) onImageRequestRef.current();
          else openUrlPrompt('image');
        }
        else if (name === 'heading') {
          const block = ensureCurrentBlock();
          if (!block) return;
          const same = block.dataset.mdType === 'heading' && Number(block.dataset.level) === Number(argument);
          convertBlock(block, same ? { type: 'p' } : { type: 'heading', level: argument });
        } else if (name === 'list') {
          const block = ensureCurrentBlock();
          if (!block) return;
          const same = block.dataset.mdType === 'li'
            && ((argument === 'ol' && block.dataset.ordered === '1' && Number(block.dataset.checked) < 0)
              || (argument === 'ul' && block.dataset.ordered !== '1' && Number(block.dataset.checked) < 0)
              || (argument === 'task' && Number(block.dataset.checked) >= 0));
          convertBlock(block, same ? { type: 'p' } : { type: 'li', list: argument });
        } else if (name === 'quote') {
          const block = ensureCurrentBlock();
          if (!block) return;
          convertBlock(block, block.dataset.mdType === 'quote' ? { type: 'p' } : { type: 'quote' });
        } else if (name === 'codeblock') {
          const block = ensureCurrentBlock();
          if (!block) return;
          convertBlock(block, { type: 'code' });
        } else if (name === 'table' || name === 'hr') {
          const block = ensureCurrentBlock();
          const holder = document.createElement('div');
          let inserted;
          if (name === 'table') inserted = tableFromCells();
          else {
            holder.innerHTML = blockHtml({ type: 'hr' });
            inserted = holder.firstElementChild;
          }
          insertAfter(block, inserted);
          const paragraph = newParagraph();
          insertAfter(inserted, paragraph);
          if (name === 'table') focusFirstCell(inserted);
          else placeCaretAtStart(paragraph);
          syncFromDom();
        }
      };

      const jumpToHeading = (index) => {
        const doc = docRef.current;
        if (!doc) return;
        const headings = Array.from(doc.querySelectorAll('[data-md-type="heading"]'));
        const target = headings[index];
        if (!target) return;
        try {
          target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } catch {
          /* ignore */
        }
        placeCaretAtStart(target);
      };

      const selectionInfo = () => {
        const doc = docRef.current;
        const selection = window.getSelection();
        if (!doc || !selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
        const range = selection.getRangeAt(0);
        if (!doc.contains(range.startContainer) || !doc.contains(range.endContainer)) return null;
        const text = selection.toString();
        if (text.trim().length === 0) return null;
        if (typeof range.getBoundingClientRect !== 'function') return null;
        const rect = range.getBoundingClientRect();
        const markdown = selectionToMarkdown(range);
        return {
          text,
          markdown: markdown.length > 0 ? markdown : text,
          rect: { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height },
        };
      };

      const insertImageBlock = (url, alt) => {
        if (typeof url !== 'string' || url.length === 0) return false;
        const block = currentBlock() || ensureCurrentBlock();
        if (!block) return false;
        const paragraph = newParagraph();
        const image = document.createElement('img');
        image.setAttribute('src', url);
        image.setAttribute('alt', typeof alt === 'string' ? alt : '');
        image.setAttribute('loading', 'lazy');
        paragraph.appendChild(image);
        insertAfter(block, paragraph);
        placeCaretAtStart(paragraph);
        refreshAndSync();
        return true;
      };

      const api = { command, focus: focusDoc, selectionInfo, jumpToHeading, flush: syncFromDom, insertImage: insertImageBlock };

      useEffect(() => {
        const doc = docRef.current;
        if (!doc) return;
        if (lastSerialized.current === text) return;
        buildFromMarkdown(text);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [text]);

      useEffect(() => {
        const doc = docRef.current;
        if (!doc) return undefined;
        if (apiRef) apiRef.current = api;

        const onInput = () => {
          if (composing.current) return;
          if (autoFormatMarkdown()) {
            if (slashRef.current !== null) setSlash(null);
            scheduleSync();
            return;
          }
          const slashState = slashRef.current;
          if (slashState !== null) {
            const block = currentBlock();
            if (!block || block.dataset.mdType !== 'p') setSlash(null);
            else {
              const content = block.textContent || '';
              if (!content.startsWith('/') || content.includes(' ')) setSlash(null);
              else setSlash({ ...slashState, query: content.slice(1).trim(), index: 0 });
            }
          }
          scheduleSync();
        };

        const onBeforeInput = (event) => {
          if (event.inputType === 'insertText' && event.data === '/') {
            setTimeout(() => {
              if (slashRef.current === null) openSlash();
            }, 0);
          }
        };

        const onKeyDown = (event) => {
          if (event.isComposing || event.keyCode === 229) return;
          const slashState = slashRef.current;
          if (slashState !== null) {
            const filtered = slashItems().filter((item) => matchesSlash(item, slashState.query));
            const count = Math.max(1, filtered.length);
            if (event.key === 'Escape') {
              event.preventDefault();
              closeSlash();
              return;
            }
            if (event.key === 'Backspace' && slashState.query.length === 0) {
              event.preventDefault();
              closeSlash();
              return;
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
              event.preventDefault();
              setSlash({ ...slashState, index: (slashState.index + 1) % count });
              return;
            }
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
              event.preventDefault();
              setSlash({ ...slashState, index: (slashState.index - 1 + count) % count });
              return;
            }
            if (event.key === 'Enter' || event.key === 'Tab') {
              if (filtered.length > 0) {
                event.preventDefault();
                applySlashItem(filtered[Math.min(slashState.index, filtered.length - 1)]);
                return;
              }
            }
          }
          const mod = event.metaKey || event.ctrlKey;
          if (mod && !event.shiftKey && (event.key === 'b' || event.key === 'B')) {
            event.preventDefault();
            wrapInline('strong', translate('slash.sample.bold'));
            return;
          }
          if (mod && !event.shiftKey && (event.key === 'i' || event.key === 'I')) {
            event.preventDefault();
            wrapInline('em', translate('slash.sample.italic'));
            return;
          }
          if (mod && event.shiftKey && (event.key === 'x' || event.key === 'X')) {
            event.preventDefault();
            wrapInline('del', translate('slash.sample.strike'));
            return;
          }
          if (mod && !event.shiftKey && (event.key === 'e' || event.key === 'E')) {
            event.preventDefault();
            wrapInline('code', translate('slash.sample.code'));
            return;
          }
          if (mod && !event.shiftKey && (event.key === 'k' || event.key === 'K')) {
            event.preventDefault();
            openUrlPrompt('link');
            return;
          }
          if (mod && (event.key === 's' || event.key === 'S')) {
            event.preventDefault();
            syncFromDom();
            if (onSaveRequestRef.current) onSaveRequestRef.current();
            return;
          }
          if ((event.key === 'Enter' && mod && !event.shiftKey) || event.key === 'Escape') {
            const block = currentBlock();
            if (block && block.dataset.mdType === 'code') {
              event.preventDefault();
              exitCodeBlock();
              return;
            }
          }
          if (event.key === 'ArrowDown' && !event.shiftKey && !event.altKey && !mod) {
            const block = currentBlock();
            if (block && block.dataset.mdType === 'code' && caretAtEnd(block)) {
              event.preventDefault();
              exitCodeBlock();
              return;
            }
          }
          if (event.key === 'Enter' && !event.shiftKey && !mod) {
            const block = currentBlock();
            if (block && block.dataset.mdType === 'p') {
              const root = textRootOf(block);
              const text = root ? (root.textContent || '') : '';
              if (/^(?:`{3,}|~{3,})$/.test(text)) {
                event.preventDefault();
                convertBlock(block, { type: 'code' });
                return;
              }
              if (/^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/.test(text)) {
                event.preventDefault();
                const holder = document.createElement('div');
                holder.innerHTML = blockHtml({ type: 'hr' });
                const hrBlock = holder.firstElementChild;
                insertAfter(block, hrBlock);
                const paragraph = newParagraph();
                insertAfter(hrBlock, paragraph);
                block.remove();
                placeCaretAtStart(paragraph);
                refreshAndSync();
                return;
              }
            }
            event.preventDefault();
            splitBlock();
            return;
          }
          if (event.key === 'Enter' && event.shiftKey && !mod) {
            event.preventDefault();
            insertSoftBreak();
            return;
          }
          if (event.key === 'Backspace') {
            const block = currentBlock();
            if (block && caretAtStart(block)) {
              event.preventDefault();
              backspaceAtStart();
            }
            return;
          }
          if (event.key === 'Delete') {
            const block = currentBlock();
            if (block && caretAtEnd(block)) {
              event.preventDefault();
              deleteAtEnd();
            }
            return;
          }
          if (event.key === 'Tab') {
            const block = currentBlock();
            if (block && block.dataset.mdType === 'table') {
              event.preventDefault();
              moveToNextCell(event.shiftKey ? -1 : 1);
              return;
            }
            if (block && block.dataset.mdType === 'li') {
              event.preventDefault();
              setListIndent(event.shiftKey ? -1 : 1);
              return;
            }
            event.preventDefault();
          }
        };

        const onPaste = (event) => {
          const clipboard = event.clipboardData;
          if (!clipboard) return;
          const block = currentBlock();
          const files = Array.from(clipboard.files || []).filter((file) => file.type.startsWith('image/'));
          if (files.length > 0) {
            event.preventDefault();
            focusDoc();
            if (onImageFilesRef.current) {
              onImageFilesRef.current(files);
              return;
            }
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result !== 'string') return;
              focusDoc();
              const range = selectionRangeInDoc();
              if (!range) return;
              const image = document.createElement('img');
              image.setAttribute('src', reader.result);
              image.setAttribute('alt', 'pasted image');
              insertNodeAtRange(range, image);
              scheduleSync();
            };
            reader.readAsDataURL(file);
            return;
          }
          const plain = clipboard.getData('text/plain');
          if (typeof plain !== 'string' || plain.length === 0) return;
          event.preventDefault();
          if (block && block.dataset.mdType === 'code') {
            const range = selectionRangeInDoc();
            if (range) insertTextAtRange(range, plain);
            syncFromDom();
            return;
          }
          const lines = plain.replace(/\r\n?/g, '\n').split('\n');
          focusDoc();
          const range = selectionRangeInDoc();
          if (!range) return;
          insertTextAtRange(range, lines[0]);
          let anchor = currentBlock();
          for (const line of lines.slice(1)) {
            if (!anchor) break;
            const paragraph = document.createElement('div');
            paragraph.className = 'mdw-block mdw-p';
            paragraph.dataset.mdType = 'p';
            if (line.length === 0) paragraph.innerHTML = '<br>';
            else paragraph.textContent = line;
            insertAfter(anchor, paragraph);
            anchor = paragraph;
          }
          if (anchor) placeCaretAtEnd(anchor);
          refreshAndSync();
        };

        const onClick = (event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;
          if (target === docRef.current) {
            const last = docRef.current.lastElementChild;
            if (last !== null) {
              const rect = last.getBoundingClientRect();
              if (event.clientY >= rect.bottom - 1) {
                const paragraph = newParagraph();
                insertAfter(last, paragraph);
                placeCaretAtStart(paragraph);
                refreshAndSync();
                return;
              }
            }
          }
          const copyButton = target.closest('[data-md-action="copy-code"]');
          if (copyButton) {
            event.preventDefault();
            const block = copyButton.closest('[data-md-type="code"]');
            const codeText = block ? (block.querySelector('code') || block).textContent || '' : '';
            void copyTextToClipboard(codeText).then((ok) => {
              if (!ok) return;
              copyButton.setAttribute('data-copied', 'true');
              const copiedLabel = copyButton.getAttribute('data-copied-label') || 'copied';
              copyButton.setAttribute('title', copiedLabel);
              copyButton.setAttribute('aria-label', copiedLabel);
              setTimeout(() => {
                copyButton.removeAttribute('data-copied');
                const copyLabel = copyButton.getAttribute('data-copy-label') || 'copy';
                copyButton.setAttribute('title', copyLabel);
                copyButton.setAttribute('aria-label', copyLabel);
              }, 1200);
            });
            return;
          }
          const wrapButton = target.closest('[data-md-action="wrap-code"]');
          if (wrapButton) {
            event.preventDefault();
            const block = wrapButton.closest('[data-md-type="code"]');
            if (!block) return;
            const wrapped = block.dataset.wrap !== 'false';
            block.dataset.wrap = wrapped ? 'false' : 'true';
            const label = wrapped ? wrapButton.getAttribute('data-nowrap-label') : wrapButton.getAttribute('data-wrap-label');
            if (label) {
              wrapButton.setAttribute('title', label);
              wrapButton.setAttribute('aria-label', label);
            }
            return;
          }
          const deleteButton = target.closest('[data-md-action="delete-block"]');
          if (deleteButton) {
            event.preventDefault();
            const block = blockOfNode(deleteButton);
            if (block) removeBlock(block);
            return;
          }
          const checkbox = target.closest('.mdw-check');
          if (checkbox) {
            const block = blockOfNode(checkbox);
            if (block) {
              block.dataset.checked = block.dataset.checked === '1' ? '0' : '1';
              syncFromDom();
            }
            return;
          }
          const anchor = target.closest('a');
          if (anchor && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            try {
              window.open(anchor.getAttribute('href') || '', '_blank', 'noopener');
            } catch {
              /* ignore */
            }
          }
          refreshTableMenu();
        };

        const onCompositionStart = () => {
          composing.current = true;
        };
        const onCompositionEnd = () => {
          composing.current = false;
          scheduleSync();
          const slashState = slashRef.current;
          if (slashState === null) return;
          const block = currentBlock();
          if (block && block.dataset.mdType === 'p' && (block.textContent || '').startsWith('/')) return;
          setSlash(null);
        };
        const onBlur = () => {
          if (composing.current) return;
          syncFromDom();
        };
        const preventDrop = (event) => event.preventDefault();

        doc.addEventListener('input', onInput);
        doc.addEventListener('beforeinput', onBeforeInput);
        doc.addEventListener('keydown', onKeyDown);
        doc.addEventListener('paste', onPaste);
        doc.addEventListener('click', onClick);
        doc.addEventListener('compositionstart', onCompositionStart);
        doc.addEventListener('compositionend', onCompositionEnd);
        doc.addEventListener('blur', onBlur, true);
        doc.addEventListener('dragover', preventDrop);
        doc.addEventListener('drop', preventDrop);
        let tableFrame = 0;
        const onSelectionChange = () => {
          refreshTableMenu();
          if (tableFrame !== 0) return;
          const schedule = typeof requestAnimationFrame === 'function'
            ? requestAnimationFrame
            : (callback) => { callback(0); return 0; };
          tableFrame = schedule(() => {
            tableFrame = 0;
            refreshTableMenu();
          });
        };
        document.addEventListener('selectionchange', onSelectionChange);
        const scrollHost = doc.parentElement;
        if (scrollHost) scrollHost.addEventListener('scroll', onSelectionChange, { passive: true });
        refreshTableMenu();
        return () => {
          doc.removeEventListener('input', onInput);
          doc.removeEventListener('beforeinput', onBeforeInput);
          doc.removeEventListener('keydown', onKeyDown);
          doc.removeEventListener('paste', onPaste);
          doc.removeEventListener('click', onClick);
          doc.removeEventListener('compositionstart', onCompositionStart);
          doc.removeEventListener('compositionend', onCompositionEnd);
          doc.removeEventListener('blur', onBlur, true);
          doc.removeEventListener('dragover', preventDrop);
          doc.removeEventListener('drop', preventDrop);
          document.removeEventListener('selectionchange', onSelectionChange);
          if (scrollHost) scrollHost.removeEventListener('scroll', onSelectionChange);
          if (tableFrame !== 0 && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(tableFrame);
          if (syncTimer.current !== null) {
            clearTimeout(syncTimer.current);
            syncTimer.current = null;
          }
          // Flush keystrokes that were still inside the debounce window.
          try {
            refreshListMarkers();
            decorateEmpty();
            const markdown = serializeDoc(doc);
            if (markdown !== lastSerialized.current) {
              lastSerialized.current = markdown;
              onChangeRef.current(markdown);
            }
          } catch {
            /* the editor may be tearing down */
          }
          if (apiRef && apiRef.current === api) apiRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(() => {
        if (slash === null) return undefined;
        const onPointerDown = (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest('.madedown-menu')) return;
          setSlash(null);
        };
        const onKey = (event) => {
          if (event.key === 'Escape') setSlash(null);
        };
        document.addEventListener('mousedown', onPointerDown, true);
        document.addEventListener('keydown', onKey, true);
        return () => {
          document.removeEventListener('mousedown', onPointerDown, true);
          document.removeEventListener('keydown', onKey, true);
        };
      }, [slash]);

      useEffect(() => {
        if (urlPrompt === null) return undefined;
        const onKey = (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeUrlPrompt(true);
          }
        };
        document.addEventListener('keydown', onKey, true);
        return () => document.removeEventListener('keydown', onKey, true);
      }, [urlPrompt]);

      const slashFiltered = slash === null ? [] : slashItems().filter((item) => matchesSlash(item, slash.query));
      const slashStyle = slash !== null ? (() => {
        const width = 300;
        const height = 250;
        let left = slash.rect ? slash.rect.left : 60;
        let top = slash.rect ? slash.rect.bottom + 6 : 160;
        left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
        if (top + height > window.innerHeight - 8) top = Math.max(8, (slash.rect ? slash.rect.top : 160) - height - 6);
        return { left: `${left}px`, top: `${top}px`, width: `${width}px` };
      })() : null;
      const tableMenuStyle = tableMenu !== null ? (() => {
        const width = 380;
        const height = 36;
        const left = Math.max(8, Math.min(tableMenu.left, window.innerWidth - width - 8));
        let top = tableMenu.top - height - 6;
        if (top < 8) top = Math.min(tableMenu.bottom + 6, window.innerHeight - height - 8);
        return { left: `${left}px`, top: `${Math.max(8, top)}px` };
      })() : null;
      const urlStyle = urlPrompt !== null ? (() => {
        const width = 280;
        const height = 42;
        let left = urlPrompt.rect ? urlPrompt.rect.left : 80;
        let top = urlPrompt.rect ? urlPrompt.rect.bottom + 6 : 160;
        left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
        if (top + height > window.innerHeight - 8) top = Math.max(8, (urlPrompt.rect ? urlPrompt.rect.top : 160) - height - 6);
        return { left: `${left}px`, top: `${top}px` };
      })() : null;

      return h('div', { className: 'mdw-root' },
        h('div', { className: 'mdw-scroll' },
          h('div', {
            className: 'mdw-doc',
            ref: docRef,
            contentEditable: true,
            suppressContentEditableWarning: true,
            spellCheck: false,
            'data-placeholder': placeholder,
          })),
        slash !== null && slashStyle !== null ? h('div', { className: 'madedown-menu', style: slashStyle },
          h('div', { className: 'madedown-menu__title' }, t('slash.title')),
          slashFiltered.length === 0
            ? h('div', { className: 'madedown-menu__empty' }, t('slash.empty'))
            : h('div', { className: 'madedown-menu__grid' }, slashFiltered.map((item, index) => h('button', {
              key: item.id,
              type: 'button',
              className: 'madedown-menu__item',
              'data-active': String(Math.min(slash.index, slashFiltered.length - 1) === index),
              onMouseDown: (event) => event.preventDefault(),
              onClick: () => applySlashItem(item),
            }, h('span', null, t(item.labelKey)))))) : null,
        urlPrompt !== null && urlStyle !== null ? h('div', { className: 'madedown-urlpop', style: urlStyle },
          h('input', {
            className: 'madedown-urlpop__input',
            value: urlPrompt.value,
            placeholder: t('url.placeholder'),
            'aria-label': urlPrompt.kind === 'image' ? t('url.title.image') : t('url.title.link'),
            autoFocus: true,
            onChange: (event) => setUrlPrompt({ ...urlPrompt, value: event.target.value }),
            onKeyDown: (event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitUrlPrompt();
              }
            },
          }),
          h('button', { type: 'button', className: 'madedown-urlpop__btn', 'data-primary': 'true', onMouseDown: (event) => event.preventDefault(), onClick: commitUrlPrompt }, t('url.confirm')),
          h('button', { type: 'button', className: 'madedown-urlpop__btn', onMouseDown: (event) => event.preventDefault(), onClick: () => closeUrlPrompt(true) }, t('url.cancel'))) : null,
        tableMenu !== null && tableMenuStyle !== null ? h('div', {
          className: 'mdw-tabletools',
          style: tableMenuStyle,
          role: 'toolbar',
          'aria-label': t('table.rowAbove'),
          onMouseDown: (event) => event.preventDefault(),
        },
          h('button', { type: 'button', className: 'mdw-tabletools__btn', title: t('table.rowAbove'), 'aria-label': t('table.rowAbove'), onClick: () => insertTableRow('above') }, t('table.rowAbove')),
          h('button', { type: 'button', className: 'mdw-tabletools__btn', title: t('table.rowBelow'), 'aria-label': t('table.rowBelow'), onClick: () => insertTableRow('below') }, t('table.rowBelow')),
          h('button', { type: 'button', className: 'mdw-tabletools__btn', title: t('table.colLeft'), 'aria-label': t('table.colLeft'), onClick: () => insertTableColumn('left') }, t('table.colLeft')),
          h('button', { type: 'button', className: 'mdw-tabletools__btn', title: t('table.colRight'), 'aria-label': t('table.colRight'), onClick: () => insertTableColumn('right') }, t('table.colRight')),
          h('button', { type: 'button', className: 'mdw-tabletools__btn', 'data-danger': 'true', title: t('table.rowDelete'), 'aria-label': t('table.rowDelete'), onClick: () => deleteTableRow() }, t('table.rowDelete')),
          h('button', { type: 'button', className: 'mdw-tabletools__btn', 'data-danger': 'true', title: t('table.colDelete'), 'aria-label': t('table.colDelete'), onClick: () => deleteTableColumn() }, t('table.colDelete')),
          h('button', { type: 'button', className: 'mdw-tabletools__btn', 'data-danger': 'true', title: t('table.delete'), 'aria-label': t('table.delete'), onClick: () => deleteTable() }, t('table.delete'))) : null);
    }

    // ---------------------------------------------------------------------
    // Error boundary
    // ---------------------------------------------------------------------

    class EditorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }

      static getDerivedStateFromError(error) {
        return { error };
      }

      componentDidCatch(error, info) {
        console.error('madedown-dsh: editor render failed', error, info);
        reportDiag({ error: String(error && error.message ? error.message : error), stack: String(error && error.stack ? error.stack : '').slice(0, 2000) });
      }

      render() {
        if (this.state.error) {
          return h('div', { className: 'madedown-error' }, `${translate('error.title')}: ${this.state.error.message || String(this.state.error)}`);
        }
        return this.props.children;
      }
    }

    // ---------------------------------------------------------------------
    // Composer bridge (editor selection -> chat input, never sends)
    // ---------------------------------------------------------------------

    function appendSelectionToChat(inputActions, currentDraft, selectionText) {
      const text = typeof selectionText === 'string' ? selectionText.replace(/\r\n?/g, '\n').trim() : '';
      if (text.length === 0) return false;
      if (!inputActions || typeof inputActions.setDraft !== 'function') return false;
      const base = typeof currentDraft === 'string' ? currentDraft : '';
      const trimmed = base.replace(/\s+$/, '');
      const next = trimmed.length === 0 ? text : `${trimmed}${COMPOSER_SEPARATOR}${text}`;
      inputActions.setDraft(next);
      return true;
    }

    // ---------------------------------------------------------------------
    // Right-sidebar editor
    // ---------------------------------------------------------------------

    function MadedownBody({ t, useInput, inputActions, sessionId }) {
      const state = useStore();
      const readComposerDraft = typeof useInput === 'function' ? useInput : (selector) => selector({ draft: '' });
      const composerDraft = readComposerDraft((input) => (input && typeof input.draft === 'string' ? input.draft : ''));
      const textareaRef = useRef(null);
      const wysiwygApi = useRef(null);
      const saveButtonRef = useRef(null);
      const tabsRef = useRef(null);
      const imageInputRef = useRef(null);
      const outlineTimer = useRef(null);
      const toolTipTimer = useRef(null);
      const [mode, setMode] = useState(readMode);
      const [outlineOpen, setOutlineOpen] = useState(false);
      const [outlineHover, setOutlineHover] = useState(false);
      const [menu, setMenu] = useState(null);
      const [editorTip, setEditorTip] = useState(null);
      const [saveDialog, setSaveDialog] = useState(null);
      const [closingTab, setClosingTab] = useState(null);
      const [renamingTab, setRenamingTab] = useState(null);
      const [toolTip, setToolTip] = useState(null);
      const [tabsOverflow, setTabsOverflow] = useState(false);
      const [overflowMenu, setOverflowMenu] = useState(null);
      const [dragTabId, setDragTabId] = useState(null);
      const [askDialog, setAskDialog] = useState(null);
      const [localPathPopover, setLocalPathPopover] = useState(null);
      const [aboutOpen, setAboutOpen] = useState(false);
      const renameCancelled = useRef(false);
      const dragActivity = useRef(false);
      const pendingSelection = useRef(null);

      const headings = useMemo(() => extractHeadings(state.text), [state.text]);
      const stats = useMemo(() => docStats(state.text), [state.text]);
      const activeDocSummary = state.docs.find((item) => item.id === state.activeId) || null;
      const activeLocalPath = activeDocSummary !== null && typeof activeDocSummary.localPath === 'string' && activeDocSummary.localPath.length > 0
        ? activeDocSummary.localPath
        : null;

      useEffect(() => {
        if (localPathPopover === null) return undefined;
        const onDown = (event) => {
          if (event.target instanceof Element && event.target.closest('.madedown-localpop, .madedown-localsave')) return;
          setLocalPathPopover(null);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
      }, [localPathPopover]);

      useEffect(() => {
        runtime.bodyMounted = true;
        const timer = setTimeout(() => {
          const element = document.querySelector('.madedown-root');
          const doc = document.querySelector('.mdw-doc');
          let styleProbe = null;
          try {
            const probe = document.createElement('div');
            probe.className = 'mdw-doc';
            probe.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden;pointer-events:none';
            probe.innerHTML = [
              '<div class="mdw-block" data-md-type="p">First</div>',
              '<div class="mdw-block" data-md-type="p" data-probe="p">Paragraph <code data-probe="inline">inline</code></div>',
              '<div class="mdw-block mdw-h1">Heading <code data-probe="heading-code">hc</code></div>',
              '<div class="mdw-block" data-md-type="code" data-lang="js" data-wrap="true"><div class="mdw-code-banner" contenteditable="false"><span class="mdw-code-lang">js</span><span class="mdw-code-actions"><button type="button" class="mdw-code-action">x</button></span></div><pre class="mdw-code-pre"><code>code</code></pre></div>',
              '<div class="mdw-block" data-md-type="table"><table><thead><tr><th>h</th></tr></thead><tbody><tr><td>c <code data-probe="cell-code">tc</code></td></tr></tbody></table></div>',
              '<blockquote class="mdw-block" data-md-type="quote">quote</blockquote>',
              '<div class="mdw-li" data-indent="0"><span class="mdw-marker-holder">•</span><span class="mdw-li-text">item</span></div>',
            ].join('');
            document.body.appendChild(probe);
            const fontOf = (target) => {
              const cs = getComputedStyle(target);
              return `${cs.fontSize}/${cs.lineHeight}/${cs.fontWeight}`;
            };
            const p = probe.querySelector('[data-probe="p"]');
            const h1 = probe.querySelector('.mdw-h1');
            const th = probe.querySelector('th');
            const td = probe.querySelector('td');
            const inlineCode = probe.querySelector('[data-probe="inline"]');
            const pre = probe.querySelector('pre');
            const quote = probe.querySelector('blockquote');
            const pcs = getComputedStyle(p);
            const hcs = getComputedStyle(h1);
            const tcs = getComputedStyle(th);
            const precs = getComputedStyle(pre);
            const qcs = getComputedStyle(quote);
            styleProbe = {
              base: `${pcs.fontSize}/${pcs.lineHeight}/${pcs.fontWeight}`,
              family: pcs.fontFamily.split(',')[0].replace(/"/g, ''),
              pMargin: `${pcs.marginTop}/${pcs.marginBottom}`,
              h1: `${fontOf(h1)} margin ${hcs.marginTop}/${hcs.marginBottom}`,
              th: `${fontOf(th)} pad ${tcs.paddingTop}/${tcs.paddingLeft}`,
              td: fontOf(td),
              inlineCode: fontOf(inlineCode),
              codeBlock: `${fontOf(pre)} bg ${precs.backgroundColor} radius ${precs.borderTopLeftRadius} pad ${precs.paddingTop}`,
              quote: `border ${qcs.borderLeftWidth} ${qcs.borderLeftColor} radius ${qcs.borderTopLeftRadius} pad ${qcs.paddingLeft} margin ${qcs.marginTop} color ${qcs.color}`,
              list: fontOf(probe.querySelector('.mdw-li-text')),
            };
            const codeDetail = (target) => {
              if (!target) return null;
              const cs = getComputedStyle(target);
              const rect = target.getBoundingClientRect();
              return {
                font: `${cs.fontSize}/${cs.lineHeight}/${cs.fontWeight}`,
                family: cs.fontFamily.split(',')[0].replace(/"/g, ''),
                display: cs.display,
                pad: `${cs.paddingTop}/${cs.paddingRight}/${cs.paddingBottom}/${cs.paddingLeft}`,
                border: cs.borderTopWidth,
                radius: cs.borderTopLeftRadius,
                bg: cs.backgroundColor,
                height: Math.round(rect.height * 10) / 10,
                va: cs.verticalAlign,
              };
            };
            styleProbe.inlineCode = codeDetail(inlineCode);
            styleProbe.headingCode = codeDetail(probe.querySelector('[data-probe="heading-code"]'));
            styleProbe.tableCode = codeDetail(probe.querySelector('[data-probe="cell-code"]'));
            const chatRoot = document.querySelector('[data-conversation-scroll]');
            if (chatRoot !== null) {
              const chatP = chatRoot.querySelector('p');
              const chatHeading = chatRoot.querySelector('h1,h2,h3,h4');
              const chatTd = chatRoot.querySelector('table td');
              const chatPre = chatRoot.querySelector('pre');
              const chatQuote = chatRoot.querySelector('blockquote');
              const chatCodes = [...chatRoot.querySelectorAll('code')].filter((code) => code.closest('pre') === null);
              const chatInline = chatCodes.find((code) => code.closest('h1,h2,h3,h4,h5,h6,td,th') === null);
              const chatHeadingCode = chatCodes.find((code) => code.closest('h1,h2,h3,h4,h5,h6') !== null);
              const chatCellCode = chatCodes.find((code) => code.closest('td,th') !== null);
              styleProbe.chat = {
                p: chatP ? fontOf(chatP) : null,
                heading: chatHeading ? fontOf(chatHeading) : null,
                td: chatTd ? fontOf(chatTd) : null,
                pre: chatPre ? fontOf(chatPre) : null,
                inlineCode: codeDetail(chatInline),
                headingCode: codeDetail(chatHeadingCode),
                cellCode: codeDetail(chatCellCode),
                quote: chatQuote ? (() => {
                  const cs = getComputedStyle(chatQuote);
                  return `border ${cs.borderLeftWidth} ${cs.borderLeftColor} radius ${cs.borderTopLeftRadius} pad ${cs.paddingLeft} margin ${cs.marginTop}`;
                })() : null,
              };
            }
            probe.remove();
          } catch (error) {
            styleProbe = { error: String(error && error.message ? error.message : error) };
          }
          reportDiag({
            event: 'mounted',
            mounted: true,
            width: element ? element.clientWidth : 0,
            height: element ? element.clientHeight : 0,
            version: getStore().version,
            tabs: getStore().docs.length,
            activeId: getStore().activeId,
            chars: getStore().text.length,
            mode: readMode(),
            blocks: doc ? doc.querySelectorAll(':scope > [data-md-type]').length : 0,
            headings: doc ? doc.querySelectorAll('[data-md-type="heading"]').length : 0,
            codeBlocks: doc ? doc.querySelectorAll('[data-md-type="code"] .mdw-code-banner').length : 0,
            linkIcons: doc ? doc.querySelectorAll('.mdw-link-icon').length : 0,
            tables: doc ? doc.querySelectorAll('[data-md-type="table"]').length : 0,
            tabChips: document.querySelectorAll('.madedown-tab').length,
            hasTabBar: Boolean(document.querySelector('.madedown-tabs')),
            hasSaveButton: Boolean(document.querySelector('.madedown-save-btn')),
            outlineToggle: Boolean(document.querySelector('.madedown-outline-toggle')),
            aboutButton: Boolean(document.querySelector('.madedown-about-btn')),
            paneTitleProbe: (() => {
              const image = document.querySelector('.madedown-chip--logo .madedown-wordmark');
              if (image === null) return null;
              const chip = image.closest('.madedown-chip');
              const slot = chip !== null ? chip.parentElement : null;
              const box = (element) => {
                if (element === null) return null;
                const rect = element.getBoundingClientRect();
                return { w: Math.round(rect.width * 10) / 10, h: Math.round(rect.height * 10) / 10 };
              };
              const chain = [];
              let node = chip;
              let guard = 0;
              while (node !== null && guard < 6) {
                const style = getComputedStyle(node);
                chain.push({
                  tag: node.tagName,
                  cls: String(node.className || '').slice(0, 60),
                  w: Math.round(node.getBoundingClientRect().width * 10) / 10,
                  overflow: style.overflow,
                  mask: style.maskImage !== 'none' ? style.maskImage : null,
                  paddingRight: style.paddingRight,
                });
                node = node.parentElement;
                guard += 1;
              }
              return { image: box(image), chip: box(chip), chain };
            })(),
            titleInputs: document.querySelectorAll('.madedown-title-input').length,
            tabbarRows: document.querySelectorAll('.madedown-tabbar-row').length,
            mergedToolbarRow: Boolean(document.querySelector('.madedown-toolbar-row .madedown-mode')),
            hasInputActions: typeof inputActions === 'object' && inputActions !== null && typeof inputActions.setDraft === 'function',
            hasUseInput: typeof useInput === 'function',
            roundTrip: roundTripCheck(getStore().text) && roundTripCheck(ROUND_TRIP_SAMPLE),
            sessionId: typeof sessionId === 'string' ? sessionId : null,
            modeButtons: document.querySelectorAll('.madedown-mode-btn').length,
            outlineHandle: Boolean(document.querySelector('.madedown-outline-handle')),
            overflowButton: Boolean(document.querySelector('.madedown-taboverflow-btn')),
            tabStateDot: document.querySelectorAll('.madedown-tab__state').length,
            tabStateSaved: document.querySelectorAll('.madedown-tab__state[data-state="saved"]').length,
            tabStateUnsaved: document.querySelectorAll('.madedown-tab__state[data-state="unsaved"]').length,
            localSaveIndicator: Boolean(document.querySelector('.madedown-localsave')),
            draggingTab: Boolean(document.querySelector('.madedown-tab[data-dragging="true"]')),
            syncIndicator: Boolean(document.querySelector('.madedown-sync')),
            saveInToolbar: Boolean(document.querySelector('.madedown-toolbar-row .madedown-save-btn')),
            plusPinned: Boolean(document.querySelector('.madedown-tabbar-row > .madedown-tab-new')),
            hasCaptureInsertion: typeof (inputActions && inputActions.captureInsertion) === 'function',
            services: {
              conversation: Boolean(serviceOf('conversation')),
              sessions: Boolean(serviceOf('sessions')),
              inputTriggers: Boolean(serviceOf('inputTriggers')),
              referenceSource: runtime.referenceSourceRegistered,
            },
            referencePipeline: (() => {
              try {
                const input = sessionInputFor(typeof sessionId === 'string' ? sessionId : '');
                if (input === null) return { ok: false };
                return {
                  ok: true,
                  insertReference: typeof input.insertReference === 'function',
                  state: Boolean(input.state && typeof input.state.getSnapshot === 'function'),
                  setDraft: typeof input.setDraft === 'function',
                };
              } catch {
                return { ok: false };
              }
            })(),
            styleProbe,
          });
        }, 500);
        return () => {
          clearTimeout(timer);
          runtime.bodyMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      useEffect(() => {
        if (!state.loaded) void pollOnce(true);
      }, [state.loaded]);

      useEffect(() => {
        if (pendingSelection.current !== null && textareaRef.current) {
          const selection = pendingSelection.current;
          pendingSelection.current = null;
          const textarea = textareaRef.current;
          textarea.focus({ preventScroll: true });
          textarea.setSelectionRange(selection.start, selection.end);
        }
      });

      useEffect(() => {
        const onMouseDown = (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest('.madedown-ed-tip')) return;
          setEditorTip(null);
        };
        document.addEventListener('mousedown', onMouseDown, true);
        return () => document.removeEventListener('mousedown', onMouseDown, true);
      }, []);

      useEffect(() => {
        if (menu === null) return undefined;
        const onPointerDown = (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest('.madedown-menu')) return;
          setMenu(null);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setMenu(null);
        };
        document.addEventListener('mousedown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
          document.removeEventListener('mousedown', onPointerDown, true);
          document.removeEventListener('keydown', onKeyDown, true);
        };
      }, [menu]);

      useEffect(() => {
        const onScroll = () => setEditorTip(null);
        window.addEventListener('scroll', onScroll, true);
        return () => window.removeEventListener('scroll', onScroll, true);
      }, []);

      useEffect(() => {
        if (saveDialog === null) return undefined;
        const onPointerDown = (event) => {
          const target = event.target;
          if (target instanceof Element && (target.closest('.madedown-savepop') !== null || target.closest('.madedown-ibtn') !== null)) return;
          setSaveDialog(null);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setSaveDialog(null);
        };
        document.addEventListener('mousedown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
          document.removeEventListener('mousedown', onPointerDown, true);
          document.removeEventListener('keydown', onKeyDown, true);
        };
      }, [saveDialog]);

      useEffect(() => {
        if (closingTab === null) return undefined;
        const onPointerDown = (event) => {
          const target = event.target;
          if (target instanceof Element && target.closest('.madedown-menu') !== null) return;
          setClosingTab(null);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setClosingTab(null);
        };
        document.addEventListener('mousedown', onPointerDown, true);
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
          document.removeEventListener('mousedown', onPointerDown, true);
          document.removeEventListener('keydown', onKeyDown, true);
        };
      }, [closingTab]);

      const updateEditorTip = useCallback(() => {
        if (mode === 'wysiwyg') {
          const info = wysiwygApi.current ? wysiwygApi.current.selectionInfo() : null;
          setEditorTip(info ? { text: info.text, rect: info.rect } : null);
          return;
        }
        const textarea = textareaRef.current;
        if (!textarea) {
          setEditorTip(null);
          return;
        }
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (end <= start) {
          setEditorTip(null);
          return;
        }
        const text = textarea.value.slice(start, end);
        if (text.trim().length === 0) {
          setEditorTip(null);
          return;
        }
        const rect = caretRect(textarea, end);
        if (!rect) {
          setEditorTip(null);
          return;
        }
        setEditorTip({ text, markdown: text, rect: { left: rect.left, top: rect.top - 18, bottom: rect.bottom, width: 0, height: rect.height } });
      }, [mode]);

      const flushEditor = useCallback(() => {
        if (mode === 'wysiwyg' && wysiwygApi.current && typeof wysiwygApi.current.flush === 'function') {
          wysiwygApi.current.flush();
        }
      }, [mode]);

      const showToolTip = useCallback((element, label) => {
        if (!element || typeof label !== 'string') return;
        const rect = element.getBoundingClientRect();
        setToolTip({ text: label, rect: { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width } });
        if (toolTipTimer.current !== null) clearTimeout(toolTipTimer.current);
      }, []);

      const hideToolTip = useCallback(() => {
        if (toolTipTimer.current !== null) clearTimeout(toolTipTimer.current);
        toolTipTimer.current = setTimeout(() => {
          toolTipTimer.current = null;
          setToolTip(null);
        }, 120);
      }, []);

      const tipFor = useCallback((labelKey) => ({
        onMouseEnter: (event) => showToolTip(event.currentTarget, t(labelKey)),
        onMouseLeave: hideToolTip,
        onFocus: (event) => showToolTip(event.currentTarget, t(labelKey)),
        onBlur: hideToolTip,
      }), [hideToolTip, showToolTip, t]);

      const openOutlineHover = useCallback(() => {
        if (outlineTimer.current !== null) {
          clearTimeout(outlineTimer.current);
          outlineTimer.current = null;
        }
        setOutlineHover(true);
      }, []);

      const closeOutlineHover = useCallback(() => {
        if (outlineTimer.current !== null) clearTimeout(outlineTimer.current);
        outlineTimer.current = setTimeout(() => {
          outlineTimer.current = null;
          setOutlineHover(false);
        }, 260);
      }, []);

      useEffect(() => () => {
        if (outlineTimer.current !== null) clearTimeout(outlineTimer.current);
        if (toolTipTimer.current !== null) clearTimeout(toolTipTimer.current);
      }, []);

      useEffect(() => {
        const element = tabsRef.current;
        if (!element) return undefined;
        const measure = () => setTabsOverflow(element.scrollWidth > element.clientWidth + 2);
        measure();
        let observer = null;
        if (typeof ResizeObserver !== 'undefined') {
          observer = new ResizeObserver(measure);
          observer.observe(element);
        }
        window.addEventListener('resize', measure);
        return () => {
          if (observer !== null) observer.disconnect();
          window.removeEventListener('resize', measure);
        };
      }, [state.docs.length]);

      useEffect(() => {
        const element = tabsRef.current;
        if (!element) return;
        const active = element.querySelector('.madedown-tab[data-active="true"]');
        if (active && typeof active.scrollIntoView === 'function') {
          try {
            active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          } catch {
            /* ignore */
          }
        }
      }, [state.activeId, state.docs.length]);

      const insertImageFile = useCallback(async (file) => {
        if (!file) return;
        showToast(t('toast.imageUploading'));
        const url = await uploadImageBlob(file);
        if (!url) {
          showToast(t('toast.imageFailed'));
          return;
        }
        const alt = typeof file.name === 'string' && file.name.length > 0 ? file.name.replace(/\.[^.]+$/, '') : 'image';
        if (mode === 'wysiwyg' && wysiwygApi.current && typeof wysiwygApi.current.insertImage === 'function') {
          wysiwygApi.current.insertImage(url, alt);
        } else {
          insertTemplateSource(`![${alt}](${url})\n`);
        }
        showToast(t('toast.imageInserted'));
      }, [mode, t]);

      const insertImageFiles = useCallback((files) => {
        const list = Array.from(files || []).filter((file) => file && typeof file.type === 'string' && file.type.startsWith('image/'));
        for (const file of list) void insertImageFile(file);
      }, [insertImageFile]);

      const openImagePicker = useCallback(() => {
        if (imageInputRef.current) imageInputRef.current.click();
      }, []);

      const insertTipSelectionToChat = useCallback(() => {
        if (!editorTip) return;
        const content = editorTip.markdown || editorTip.text;
        const result = insertMadedownReference(inputActions, sessionId, getStore().title, content, composerDraft);
        setEditorTip(null);
        showToast(result.mode === 'reference' ? t('toast.refInserted') : result.ok ? t('toast.refFallback') : t('toast.insertFailed'));
        try {
          const selection = window.getSelection();
          if (selection) selection.removeAllRanges();
        } catch {
          /* ignore */
        }
      }, [composerDraft, editorTip, inputActions, sessionId, t]);

      const openAskDialog = useCallback(() => {
        if (!editorTip) return;
        setAskDialog({
          markdown: editorTip.markdown || editorTip.text,
          title: getStore().title,
          question: '',
          rect: editorTip.rect,
        });
        setEditorTip(null);
      }, [editorTip]);

      const sendAskQuestion = useCallback(() => {
        if (askDialog === null) return;
        const question = askDialog.question.trim();
        if (question.length === 0) {
          showToast(t('toast.askFailed'));
          return;
        }
        const ok = sendQuickAsk(inputActions, askDialog.title, askDialog.markdown, question, composerDraft);
        if (!ok) {
          showToast(t('toast.askFailed'));
          return;
        }
        setAskDialog(null);
        showToast(t('toast.askSent'));
      }, [askDialog, composerDraft, inputActions, t]);

      const beginTabDrag = useCallback((event, docItem) => {
        if (event.button !== 0) return;
        if (event.target instanceof Element && event.target.closest('.madedown-tab__close, .madedown-tab__rename')) return;
        const startX = event.clientX;
        const startY = event.clientY;
        let moved = false;
        let frameHandle = 0;
        let pending = null;
        const applyReorderAt = (clientX, clientY) => {
          const element = document.elementFromPoint(clientX, clientY);
          const tabElement = element instanceof Element ? element.closest('.madedown-tab') : null;
          if (!tabElement) return;
          const targetId = tabElement.getAttribute('data-tab-id');
          if (targetId === null || targetId === docItem.id) return;
          const ids = getStore().docs.map((item) => item.id);
          const from = ids.indexOf(docItem.id);
          const to = ids.indexOf(targetId);
          if (from < 0 || to < 0) return;
          ids.splice(from, 1);
          ids.splice(to, 0, docItem.id);
          const byId = new Map(getStore().docs.map((item) => [item.id, item]));
          const docs = ids.map((id) => byId.get(id)).filter(Boolean);
          patchStore({ docs, tabDragging: true });
          void tabsAction('reorder', { ids }).catch(() => {});
        };
        const onMove = (moveEvent) => {
          if (!moved) {
            if (Math.abs(moveEvent.clientX - startX) < 5 && Math.abs(moveEvent.clientY - startY) < 5) return;
            moved = true;
            dragActivity.current = true;
            setDragTabId(docItem.id);
          }
          moveEvent.preventDefault();
          pending = { x: moveEvent.clientX, y: moveEvent.clientY };
          if (frameHandle !== 0) return;
          frameHandle = requestAnimationFrame(() => {
            frameHandle = 0;
            if (pending === null) return;
            const point = pending;
            pending = null;
            applyReorderAt(point.x, point.y);
          });
        };
        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
          if (frameHandle !== 0) cancelAnimationFrame(frameHandle);
          frameHandle = 0;
          setDragTabId(null);
          if (!moved) return;
          dragActivity.current = true;
          setTimeout(() => {
            dragActivity.current = false;
          }, 120);
          const ids = getStore().docs.map((item) => item.id);
          patchStore({ tabDragging: false });
          void tabsAction('reorder', { ids }).then((data) => {
            if (data && data.ok && data.state) adoptServerSnapshot(data.state);
          }).catch(() => {});
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      }, []);

      const openSaveDialog = useCallback(async (anchorRect) => {
        flushEditor();
        const data = await prepareSaveDialog();
        if (!data) return;
        const anchor = anchorRect || (saveButtonRef.current ? saveButtonRef.current.getBoundingClientRect() : null);
        setSaveDialog({
          path: data.path || '',
          exists: Boolean(data.exists),
          title: data.title || store.title,
          rect: anchor ? { left: anchor.left, top: anchor.top, bottom: anchor.bottom, width: anchor.width } : { left: 80, top: 120, bottom: 120, width: 0 },
        });
      }, [flushEditor]);

      const confirmSave = useCallback(async () => {
        if (saveDialog === null) return;
        const data = await saveDocumentToPath(saveDialog.path);
        if (data && data.ok) {
          showToast(translate(data.overwrote ? 'toast.overwroteFile' : 'toast.savedFile', { path: data.path }));
          setSaveDialog(null);
          void pollOnce(true);
        } else {
          showToast(translate('toast.saveFailed', { message: (data && data.error) || '' }));
        }
      }, [saveDialog]);

      const startRenameTab = useCallback(async (document) => {
        if (!document) return;
        if (document.id !== getStore().activeId) {
          await switchTab(document.id);
          if (getStore().activeId !== document.id) return;
        }
        renameCancelled.current = false;
        setRenamingTab({ id: document.id, draft: getStore().title });
      }, []);

      const commitRenameTab = useCallback(() => {
        if (renameCancelled.current) {
          renameCancelled.current = false;
          return;
        }
        const current = renamingTab;
        if (current === null) return;
        const draft = current.draft.trim();
        setRenamingTab(null);
        if (draft.length === 0 || draft === getStore().title) return;
        updateLocalText(getStore().text, draft);
      }, [renamingTab]);

      const cancelRenameTab = useCallback(() => {
        renameCancelled.current = true;
        setRenamingTab(null);
      }, []);

      const requestCloseTab = useCallback((document, event) => {
        if (!document) return;
        commitRenameTab();
        flushEditor();
        if (!document.chars && !document.lines) {
          void closeTab(document.id);
          return;
        }
        const rect = event && event.currentTarget ? event.currentTarget.getBoundingClientRect() : null;
        setClosingTab({
          id: document.id,
          title: document.title || t('tab.untitled'),
          rect: rect ? { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width } : { left: 80, top: 120, bottom: 120, width: 0 },
        });
      }, [commitRenameTab, flushEditor, t]);

      const confirmCloseTab = useCallback(() => {
        if (closingTab === null) return;
        const id = closingTab.id;
        setClosingTab(null);
        void closeTab(id);
      }, [closingTab]);

      const handleCreateTab = useCallback(async () => {
        commitRenameTab();
        flushEditor();
        const created = await createTab();
        if (created) {
          renameCancelled.current = false;
          setRenamingTab({ id: getStore().activeId, draft: getStore().title });
        }
      }, [commitRenameTab, flushEditor]);

      const replaceRangeSource = useCallback((from, to, insert, selection) => {
        const value = store.text;
        const next = value.slice(0, from) + insert + value.slice(to);
        if (selection) pendingSelection.current = selection;
        updateLocalText(next);
      }, []);

      const wrapInlineSource = useCallback((marker, sample) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const value = store.text;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.slice(start, end);
        const content = selected.length > 0 ? selected : (sample || '');
        const insert = marker + content + marker;
        replaceRangeSource(start, end, insert, { start: start + marker.length, end: start + marker.length + content.length });
        textarea.focus();
      }, [replaceRangeSource]);

      const setLinePrefixSource = useCallback((makePrefix, test) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const value = store.text;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const nextBreak = value.indexOf('\n', end);
        const blockEnd = nextBreak === -1 ? value.length : nextBreak;
        const block = value.slice(lineStart, blockEnd);
        const lines = block.split('\n');
        const allMatch = lines.every((line) => test.test(line));
        test.lastIndex = 0;
        const nextLines = lines.map((line, index) => {
          if (allMatch) return line.replace(test, '');
          test.lastIndex = 0;
          const stripped = line.replace(/^(\s*)(?:#{1,6}\s+|[-*+]\s+(?:\[[ xX]\]\s+)?|\d+[.)]\s+|>\s+)?/, '$1');
          return stripped.replace(/^(\s*)/, `$1${makePrefix(index)}`);
        });
        const nextBlock = nextLines.join('\n');
        const next = value.slice(0, lineStart) + nextBlock + value.slice(blockEnd);
        const delta = nextBlock.length - block.length;
        pendingSelection.current = { start: Math.max(lineStart, start + delta), end: Math.max(lineStart, end + delta) };
        updateLocalText(next);
        textarea.focus();
      }, []);

      const insertTemplateSource = useCallback((template) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const value = store.text;
        const start = textarea.selectionStart;
        const before = value.slice(0, start);
        const needsLeading = before.length > 0 && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
        const insert = `${needsLeading}${template}`;
        replaceRangeSource(start, textarea.selectionEnd, insert, { start: start + insert.length, end: start + insert.length });
        textarea.focus();
      }, [replaceRangeSource]);

      const insertCodeBlockSource = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const value = store.text;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.slice(start, end);
        const before = value.slice(0, start);
        const needsLeading = before.length > 0 && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
        const insert = `${needsLeading}\`\`\`\n${selected}\n\`\`\`\n`;
        const innerStart = start + needsLeading.length + 4;
        replaceRangeSource(start, end, insert, { start: innerStart, end: innerStart + selected.length });
        textarea.focus();
      }, [replaceRangeSource]);

      const insertLinkSource = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const value = store.text;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = value.slice(start, end);
        const label = selected.length > 0 ? selected : t('slash.sample.link');
        const insert = `[${label}](url)`;
        const urlStart = start + label.length + 3;
        replaceRangeSource(start, end, insert, { start: urlStart, end: urlStart + 3 });
        textarea.focus();
      }, [replaceRangeSource, t]);

      const insertImageSource = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const value = store.text;
        const start = textarea.selectionStart;
        const alt = value.slice(start, textarea.selectionEnd) || 'image';
        const insert = `![${alt}](url)`;
        const urlStart = start + alt.length + 4;
        replaceRangeSource(start, textarea.selectionEnd, insert, { start: urlStart, end: urlStart + 3 });
        textarea.focus();
      }, [replaceRangeSource]);

      const onSourceInput = useCallback((event) => {
        updateLocalText(event.target.value);
      }, []);

      const onSourceKeyDown = useCallback((event) => {
        const textarea = event.currentTarget;
        const mod = event.metaKey || event.ctrlKey;
        if (mod && !event.shiftKey && (event.key === 'b' || event.key === 'B')) {
          event.preventDefault();
          wrapInlineSource('**', t('slash.sample.bold'));
          return;
        }
        if (mod && !event.shiftKey && (event.key === 'i' || event.key === 'I')) {
          event.preventDefault();
          wrapInlineSource('*', t('slash.sample.italic'));
          return;
        }
        if (mod && event.shiftKey && (event.key === 'x' || event.key === 'X')) {
          event.preventDefault();
          wrapInlineSource('~~', t('slash.sample.strike'));
          return;
        }
        if (mod && !event.shiftKey && (event.key === 'e' || event.key === 'E')) {
          event.preventDefault();
          wrapInlineSource('`', t('slash.sample.code'));
          return;
        }
        if (mod && !event.shiftKey && (event.key === 'k' || event.key === 'K')) {
          event.preventDefault();
          insertLinkSource();
          return;
        }
        if (mod && (event.key === 's' || event.key === 'S')) {
          event.preventDefault();
          void openSaveDialog();
          return;
        }
        if (event.key === 'Tab' && !mod) {
          event.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          replaceRangeSource(start, end, '  ', { start: start + 2, end: start + 2 });
          return;
        }
        if (event.key === 'Enter' && !event.shiftKey && !mod) {
          const value = store.text;
          const caret = textarea.selectionStart;
          if (caret !== textarea.selectionEnd) return;
          const lineStart = value.lastIndexOf('\n', caret - 1) + 1;
          const before = value.slice(lineStart, caret);
          const emptyItem = /^(\s*)(?:([-*+])\s+(?:\[[ xX]\]\s+)?|(\d+)([.)])\s+|(>)\s+)$/.exec(before);
          if (emptyItem) {
            event.preventDefault();
            replaceRangeSource(lineStart, caret, '', { start: lineStart, end: lineStart });
            return;
          }
          const continuation = /^(\s*)(?:([-*+])\s+(?:\[[ xX]\]\s+)?|(\d+)([.)])\s+|(>)\s+)(.*)$/.exec(before);
          if (continuation && continuation[6].trim().length > 0) {
            event.preventDefault();
            let prefix = '';
            if (continuation[5]) prefix = `${continuation[1]}> `;
            else if (continuation[2]) prefix = `${continuation[1]}${continuation[2]} `;
            else if (continuation[3]) prefix = `${continuation[1]}${Number(continuation[3]) + 1}${continuation[4]} `;
            if (continuation[2] && continuation[0].includes('[')) prefix = `${continuation[1]}- [ ] `;
            replaceRangeSource(caret, caret, `\n${prefix}`, { start: caret + 1 + prefix.length, end: caret + 1 + prefix.length });
          }
        }
      }, [insertLinkSource, openSaveDialog, replaceRangeSource, t, wrapInlineSource]);

      const jumpToLine = useCallback((line) => {
        if (mode === 'wysiwyg') {
          const index = headings.filter((heading) => heading.line <= line).length - 1;
          if (wysiwygApi.current) wysiwygApi.current.jumpToHeading(Math.max(0, index));
          return;
        }
        const textarea = textareaRef.current;
        if (!textarea) return;
        const lines = store.text.split('\n');
        let offset = 0;
        for (let index = 0; index < line && index < lines.length; index += 1) offset += lines[index].length + 1;
        textarea.focus({ preventScroll: true });
        textarea.setSelectionRange(offset, offset);
      }, [headings, mode]);

      const runCommand = useCallback((name, argument) => {
        if (mode === 'wysiwyg') {
          if (wysiwygApi.current) wysiwygApi.current.command(name, argument);
          return;
        }
        switch (name) {
          case 'bold':
            wrapInlineSource('**', t('slash.sample.bold'));
            break;
          case 'italic':
            wrapInlineSource('*', t('slash.sample.italic'));
            break;
          case 'strike':
            wrapInlineSource('~~', t('slash.sample.strike'));
            break;
          case 'code':
            wrapInlineSource('`', t('slash.sample.code'));
            break;
          case 'link':
            insertLinkSource();
            break;
          case 'image':
            if (imageInputRef.current) imageInputRef.current.click();
            else insertImageSource();
            break;
          case 'heading':
            setLinePrefixSource(() => (argument === 0 ? '' : `${'#'.repeat(argument)} `), argument === 0 ? /^\s*#{1,6}\s+/ : new RegExp(`^\\s*#{${argument}}\\s+`));
            break;
          case 'list':
            if (argument === 'ul') setLinePrefixSource(() => '- ', /^\s*[-*+]\s+(?!\[[ xX]\])/);
            else if (argument === 'ol') setLinePrefixSource((index) => `${index + 1}. `, /^\s*\d+[.)]\s+/);
            else setLinePrefixSource(() => '- [ ] ', /^\s*[-*+]\s+\[[ xX]\]\s+/);
            break;
          case 'quote':
            setLinePrefixSource(() => '> ', /^\s*>\s+/);
            break;
          case 'codeblock':
            insertCodeBlockSource();
            break;
          case 'table':
            insertTemplateSource('| 列 1 | 列 2 |\n| --- | --- |\n| 内容 | 内容 |\n');
            break;
          case 'hr':
            insertTemplateSource('---\n');
            break;
          default:
            break;
        }
      }, [insertCodeBlockSource, insertImageSource, insertLinkSource, insertTemplateSource, mode, setLinePrefixSource, t, wrapInlineSource]);

      const headingMenuItems = [0, 1, 2, 3, 4, 5, 6].map((level) => ({
        id: `h${level}`,
        label: level === 0 ? t('heading.paragraph') : t(`slash.h${level}`),
        run: () => runCommand('heading', level),
      }));
      const listMenuItems = [
        { id: 'ul', label: t('slash.ul'), run: () => runCommand('list', 'ul') },
        { id: 'ol', label: t('slash.ol'), run: () => runCommand('list', 'ol') },
        { id: 'task', label: t('slash.task'), run: () => runCommand('list', 'task') },
      ];
      const menuItems = menu === null ? [] : (menu.id === 'heading' ? headingMenuItems : listMenuItems);
      const menuStyle = menu !== null && menu.rect ? (() => {
        const width = 170;
        const height = 220;
        const left = Math.max(8, Math.min(menu.rect.left, window.innerWidth - width - 8));
        let top = menu.rect.bottom + 4;
        if (top + height > window.innerHeight - 8) top = Math.max(8, menu.rect.top - height - 4);
        return { left: `${left}px`, top: `${top}px` };
      })() : null;

      const tipStyle = editorTip !== null && editorTip.rect ? (() => {
        const width = 150;
        const left = Math.max(8, Math.min(editorTip.rect.left + editorTip.rect.width / 2 - width / 2, window.innerWidth - width - 8));
        const above = editorTip.rect.top > 52;
        const top = above ? editorTip.rect.top - 40 : editorTip.rect.bottom + 8;
        return { left: `${left}px`, top: `${Math.max(8, top)}px` };
      })() : null;

      const saveStyle = saveDialog !== null && saveDialog.rect ? (() => {
        const width = 340;
        const height = 132;
        const left = Math.max(8, Math.min(saveDialog.rect.left + saveDialog.rect.width - width, window.innerWidth - width - 8));
        let top = saveDialog.rect.bottom + 6;
        if (top + height > window.innerHeight - 8) top = Math.max(8, saveDialog.rect.top - height - 6);
        return { left: `${Math.max(8, left)}px`, top: `${Math.max(8, Math.min(top, window.innerHeight - height - 8))}px` };
      })() : null;

      const closeStyle = closingTab !== null && closingTab.rect ? (() => {
        const width = 260;
        const height = 120;
        const left = Math.max(8, Math.min(closingTab.rect.left, window.innerWidth - width - 8));
        let top = closingTab.rect.bottom + 6;
        if (top + height > window.innerHeight - 8) top = Math.max(8, closingTab.rect.top - height - 6);
        return { left: `${left}px`, top: `${top}px`, width: `${width}px` };
      })() : null;

      const toolTipStyle = toolTip !== null && toolTip.rect ? (() => {
        const width = Math.max(52, Math.min(220, toolTip.text.length * 11 + 16));
        const left = Math.max(8, Math.min(toolTip.rect.left + toolTip.rect.width / 2 - width / 2, window.innerWidth - width - 8));
        const above = toolTip.rect.top > 36;
        const top = above ? toolTip.rect.top - 26 : toolTip.rect.bottom + 6;
        return { left: `${left}px`, top: `${Math.max(8, top)}px`, maxWidth: '220px' };
      })() : null;

      const overflowStyle = overflowMenu !== null && overflowMenu.rect ? (() => {
        const width = 240;
        const height = Math.min(320, 34 + state.docs.length * 30);
        const left = Math.max(8, Math.min(overflowMenu.rect.left - width + 28, window.innerWidth - width - 8));
        const top = Math.min(overflowMenu.rect.bottom + 4, window.innerHeight - height - 8);
        return { left: `${left}px`, top: `${Math.max(8, top)}px`, width: `${width}px` };
      })() : null;

      const askStyle = askDialog !== null && askDialog.rect ? (() => {
        const width = 340;
        const height = 190;
        const left = Math.max(8, Math.min(askDialog.rect.left + askDialog.rect.width / 2 - width / 2, window.innerWidth - width - 8));
        let top = askDialog.rect.top - height - 8;
        if (top < 8) top = Math.min(askDialog.rect.bottom + 8, window.innerHeight - height - 8);
        return { left: `${left}px`, top: `${Math.max(8, top)}px`, width: `${width}px` };
      })() : null;

      const localPathPopStyle = localPathPopover !== null && localPathPopover.rect ? (() => {
        const width = 360;
        const height = 140;
        const left = Math.max(8, Math.min(localPathPopover.rect.left, window.innerWidth - width - 8));
        let top = localPathPopover.rect.top - height - 6;
        if (top < 8) top = Math.max(8, Math.min(localPathPopover.rect.bottom + 6, window.innerHeight - height - 8));
        return { left: `${left}px`, top: `${top}px`, width: `${width}px` };
      })() : null;

      const toolbar = [
        { key: 'bold', label: 'toolbar.bold', content: h('span', { className: 'madedown-glyph-text' }, 'B'), run: () => runCommand('bold') },
        { key: 'italic', label: 'toolbar.italic', content: h('span', { className: 'madedown-glyph-text madedown-glyph-italic' }, 'I'), run: () => runCommand('italic') },
        { key: 'strike', label: 'toolbar.strike', content: h('span', { className: 'madedown-glyph-text madedown-glyph-strike' }, 'S'), run: () => runCommand('strike') },
        { key: 'code', label: 'toolbar.code', content: h('span', { className: 'madedown-glyph-mono' }, '</>'), run: () => runCommand('code') },
        { key: 'link', label: 'toolbar.link', content: h(IconLink, { size: 15 }), run: () => runCommand('link') },
        { sep: true },
        { key: 'heading', label: 'toolbar.heading', content: h('span', { className: 'madedown-glyph-text' }, 'H'), menu: 'heading' },
        { key: 'list', label: 'toolbar.list', content: h(IconBullets, { size: 15 }), menu: 'list' },
        { key: 'task', label: 'toolbar.task', content: h(IconTask, { size: 15 }), run: () => runCommand('list', 'task') },
        { key: 'quote', label: 'toolbar.quote', content: h(IconQuote, { size: 15 }), run: () => runCommand('quote') },
        { key: 'codeblock', label: 'toolbar.codeblock', content: h(IconCodeBlock, { size: 15 }), run: () => runCommand('codeblock') },
        { key: 'table', label: 'toolbar.table', content: h(IconTable, { size: 15 }), run: () => runCommand('table') },
        { key: 'image', label: 'toolbar.image', content: h(IconImage, { size: 15 }), run: () => runCommand('image') },
        { key: 'hr', label: 'toolbar.hr', content: h(IconHr, { size: 15 }), run: () => runCommand('hr') },
      ];

      return h('div', { className: 'madedown-root' },
        h('div', { className: 'madedown-head' },
          h('div', { className: 'madedown-tabbar-row' },
            h('div', { className: 'madedown-tabs', role: 'tablist', ref: tabsRef },
              state.docs.map((document) => h('div', {
                key: document.id,
                className: 'madedown-tab',
                'data-active': String(document.id === state.activeId),
                'data-dragging': String(dragTabId === document.id),
                role: 'tab',
                'aria-selected': String(document.id === state.activeId),
                title: document.title,
                'data-tab-id': document.id,
                onMouseDown: (event) => beginTabDrag(event, document),
              },
              renamingTab !== null && renamingTab.id === document.id
                ? h('input', {
                  className: 'madedown-tab__rename',
                  value: renamingTab.draft,
                  'aria-label': t('tab.rename'),
                  autoFocus: true,
                  onFocus: (event) => event.currentTarget.select(),
                  onChange: (event) => setRenamingTab({ ...renamingTab, draft: event.target.value }),
                  onBlur: commitRenameTab,
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      commitRenameTab();
                    } else if (event.key === 'Escape') {
                      event.preventDefault();
                      cancelRenameTab();
                    }
                  },
                })
                : h('button', {
                  type: 'button',
                  className: 'madedown-tab__label',
                  title: `${document.title} · ${t('tab.rename')}`,
                  onClick: () => {
                    if (dragActivity.current) {
                      dragActivity.current = false;
                      return;
                    }
                    commitRenameTab();
                    flushEditor();
                    void switchTab(document.id);
                  },
                  onDoubleClick: () => void startRenameTab(document),
                },
                h('span', { className: 'madedown-tab__title' }, document.title || t('tab.untitled')),
                (() => {
                  const locallySaved = typeof document.localPath === 'string' && document.localPath.length > 0;
                  return h('span', {
                    className: 'madedown-tab__state',
                    'data-state': locallySaved ? 'saved' : 'unsaved',
                    title: locallySaved ? t('local.savedTitle') : t('local.unsavedTitle'),
                    'aria-hidden': 'true',
                  });
                })()),
              h('button', {
                type: 'button',
                className: 'madedown-tab__close',
                title: t('tab.close'),
                'aria-label': t('tab.close'),
                onMouseDown: (event) => event.preventDefault(),
                onClick: (event) => {
                  event.stopPropagation();
                  requestCloseTab(document, event);
                },
              }, h(IconClose, { size: 10 }))))),
            h('button', {
              type: 'button',
              className: 'madedown-tab-new',
              title: t('tab.new'),
              'aria-label': t('tab.new'),
              ...tipFor('tab.new'),
              onMouseDown: (event) => event.preventDefault(),
              onClick: () => { flushEditor(); void handleCreateTab(); },
            }, '+'),
            tabsOverflow ? h('button', {
              type: 'button',
              className: 'madedown-ibtn madedown-taboverflow-btn',
              title: t('tabs.overflow'),
              'aria-label': t('tabs.overflow'),
              ...tipFor('tabs.overflow'),
              onMouseDown: (event) => event.preventDefault(),
              onClick: (event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setOverflowMenu(overflowMenu === null ? { rect: { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width } } : null);
              },
            }, h('span', { className: 'madedown-taboverflow-glyph' }, h(IconChevronDown, { size: 14 }))) : null),
          h('div', { className: 'madedown-toolbar-row' },
            h('div', { className: 'madedown-toolbar', role: 'toolbar' }, toolbar.map((item, index) => {
              if (item.sep) return h('span', { key: `sep-${index}`, className: 'madedown-toolbar-sep' });
              return h('button', {
                key: item.key,
                type: 'button',
                className: 'madedown-ibtn',
                'aria-label': t(item.label),
                ...tipFor(item.label),
                onMouseDown: (event) => event.preventDefault(),
                onClick: (event) => {
                  if (item.menu) {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setMenu(menu && menu.id === item.menu ? null : { id: item.menu, rect });
                    return;
                  }
                  item.run();
                },
              }, item.content);
            })),
            h('button', {
              type: 'button',
              className: 'madedown-ibtn madedown-about-btn',
              title: t('about.open'),
              'aria-label': t('about.open'),
              ...tipFor('about.open'),
              onClick: () => setAboutOpen(true),
            }, h(IconInfo, { size: 19 })),
            h('button', {
              type: 'button',
              ref: saveButtonRef,
              className: 'madedown-ibtn madedown-save-btn',
              title: t('save.hint'),
              'aria-label': t('save.hint'),
              ...tipFor('save.hint'),
              onClick: () => { flushEditor(); void openSaveDialog(); },
            }, h(IconDownload, { size: 15 })),
            h('div', { className: 'madedown-mode', role: 'group', 'aria-label': t('mode.wysiwyg') },
              h('button', {
                type: 'button',
                className: 'madedown-mode-btn',
                'data-active': String(mode === 'wysiwyg'),
                'aria-label': t('mode.wysiwyg'),
                ...tipFor('mode.wysiwyg'),
                onClick: () => { flushEditor(); setMode('wysiwyg'); writeMode('wysiwyg'); },
              }, h(IconPencil, { size: 14 })),
              h('button', {
                type: 'button',
                className: 'madedown-mode-btn',
                'data-active': String(mode === 'source'),
                'aria-label': t('mode.source'),
                ...tipFor('mode.source'),
                onClick: () => { flushEditor(); setMode('source'); writeMode('source'); },
              }, h(IconCodeBlock, { size: 14 }))))),
        aboutOpen ? h('div', {
          className: 'madedown-aboutmask',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) setAboutOpen(false);
          },
        },
          h('div', { className: 'madedown-aboutcard', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('about.name') },
            h('button', {
              type: 'button',
              className: 'madedown-ibtn madedown-aboutcard__close',
              title: t('action.close'),
              'aria-label': t('action.close'),
              onClick: () => setAboutOpen(false),
            }, h(IconClose, { size: 13 })),
            h('div', { className: 'madedown-aboutcard__head' },
              h(MadedownIcon, { size: 52, className: 'madedown-aboutcard__icon' }),
              h('div', { className: 'madedown-aboutcard__names' },
                h(MadedownWordmark, { height: 24 }),
                h('div', { className: 'madedown-aboutcard__version' }, `v${MADEDOWN_APP_VERSION}`))),
            h('div', { className: 'madedown-aboutcard__intro' }, t('about.intro')),
            h('div', { className: 'madedown-aboutcard__meta' },
              h('div', { className: 'madedown-aboutcard__row' },
                h('span', { className: 'madedown-aboutcard__label' }, t('about.authorLabel')),
                h('span', { className: 'madedown-aboutcard__value' }, t('about.author'))),
              h('div', { className: 'madedown-aboutcard__row' },
                h('span', { className: 'madedown-aboutcard__label' }, t('about.updateLabel')),
                h('span', { className: 'madedown-aboutcard__value' }, t('about.update'))),
              h('div', { className: 'madedown-aboutcard__row' },
                h('span', { className: 'madedown-aboutcard__label' }, t('about.repoLabel')),
                h('span', { className: 'madedown-aboutcard__value' },
                  h('a', {
                    className: 'madedown-aboutcard__link',
                    href: MADEDOWN_REPO_URL,
                    target: '_blank',
                    rel: 'noreferrer noopener',
                  }, 'github.com/zhxnix/dsh-madedown')))),
            h('div', { className: 'madedown-aboutcard__actions' },
              h('button', { type: 'button', className: 'madedown-refcard__btn', 'data-primary': 'true', onClick: () => setAboutOpen(false) }, t('action.close'))))) : null,
        state.conflict ? h('div', { className: 'madedown-banner' },
          h('span', { className: 'madedown-banner__text' }, t('banner.conflict')),
          h('button', { type: 'button', className: 'madedown-banner__btn', onClick: resolveConflictLoadRemote }, t('banner.loadRemote')),
          h('button', { type: 'button', className: 'madedown-banner__btn', onClick: resolveConflictKeepMine }, t('banner.keepMine'))) : null,
        h('input', {
          ref: imageInputRef,
          type: 'file',
          accept: 'image/*',
          multiple: false,
          style: { display: 'none' },
          onChange: (event) => {
            const files = Array.from(event.target.files || []);
            event.target.value = '';
            insertImageFiles(files);
          },
        }),
        h('div', {
          className: 'madedown-body',
          onMouseUp: updateEditorTip,
          onKeyUp: updateEditorTip,
        },
        mode === 'wysiwyg'
          ? h(WysiwygEditor, {
            t,
            text: state.text,
            onChange: (next) => updateLocalText(next),
            placeholder: t('placeholder'),
            apiRef: wysiwygApi,
            onSaveRequest: () => { void openSaveDialog(); },
            onImageRequest: openImagePicker,
            onImageFiles: insertImageFiles,
          })
          : h('div', { className: 'madedown-source-wrap' },
            h('textarea', {
              ref: textareaRef,
              className: 'madedown-source',
              value: state.text,
              placeholder: t('placeholder'),
              spellCheck: false,
              onChange: onSourceInput,
              onKeyDown: onSourceKeyDown,
              onMouseUp: updateEditorTip,
              onKeyUp: updateEditorTip,
              onSelect: updateEditorTip,
              'aria-label': t('title'),
            })),
        headings.length > 0 && (outlineOpen || outlineHover) ? h('div', {
          className: 'madedown-outline',
          'data-transient': String(!outlineOpen),
          onMouseEnter: openOutlineHover,
          onMouseLeave: closeOutlineHover,
        },
          h('div', { className: 'madedown-outline__head' },
            h('span', null, t('outline.title')),
            h('button', {
              type: 'button',
              className: 'madedown-ibtn',
              style: { width: '20px', height: '20px' },
              onClick: () => {
                setOutlineOpen(false);
                setOutlineHover(false);
              },
              'aria-label': t('action.close'),
            }, h(IconClose, { size: 12 }))),
          headings.map((heading) => h('button', {
            key: `outline-${heading.line}`,
            type: 'button',
            className: 'madedown-outline__item',
            style: { paddingLeft: `${6 + (heading.level - 1) * 10}px` },
            title: heading.text,
            onClick: () => jumpToLine(heading.line),
          }, heading.text || '—'))) : null,
            headings.length > 0 && !outlineOpen ? h('button', {
              type: 'button',
              className: 'madedown-outline-handle',
              onMouseEnter: openOutlineHover,
              onMouseLeave: closeOutlineHover,
              onClick: () => setOutlineOpen(true),
              'aria-label': t('outline.title'),
            }, h('span', null, t('outline.title'))) : null),
        h('div', { className: 'madedown-statusbar' },
          h('button', {
            type: 'button',
            className: 'madedown-localsave',
            'data-state': activeLocalPath ? 'saved' : 'unsaved',
            title: activeLocalPath ? t('local.savedHint') : t('local.unsavedHint'),
            onClick: (event) => {
              if (activeLocalPath) {
                const rect = event.currentTarget.getBoundingClientRect();
                setLocalPathPopover((current) => (current === null ? { rect: { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width } } : null));
              } else {
                void openSaveDialog(event.currentTarget.getBoundingClientRect());
              }
            },
          }, h('span', { className: 'madedown-localsave__dot' }), h('span', null, activeLocalPath ? t('local.savedShort') : t('local.unsavedShort'))),
          h('span', { className: 'madedown-statusbar__spacer' }),
          h('span', null, t('stats.chars', { count: stats.chars }))),
        menu !== null && menuStyle !== null ? h('div', { className: 'madedown-menu', style: menuStyle },
          menuItems.map((item) => h('button', {
            key: item.id,
            type: 'button',
            className: 'madedown-menu__item',
            onMouseDown: (event) => event.preventDefault(),
            onClick: () => {
              setMenu(null);
              item.run();
            },
          }, item.label))) : null,
        localPathPopover !== null && localPathPopStyle !== null && activeLocalPath ? h('div', { className: 'madedown-localpop', style: localPathPopStyle },
          h('div', { className: 'madedown-localpop__label' }, t('local.path')),
          h('div', { className: 'madedown-localpop__path' }, activeLocalPath),
          h('div', { className: 'madedown-localpop__actions' },
            h('button', {
              type: 'button',
              className: 'madedown-localpop__btn',
              onClick: () => {
                void copyTextToClipboard(activeLocalPath).then((ok) => {
                  if (ok) showToast(t('local.copiedPath'));
                });
              },
            }, t('local.copyPath')),
            h('button', { type: 'button', className: 'madedown-localpop__btn', onClick: () => setLocalPathPopover(null) }, t('action.close')))) : null,
        saveDialog !== null && saveStyle !== null ? h('div', { className: 'madedown-savepop', style: saveStyle },
          h('div', { className: 'madedown-savepop__label' }, t('save.title')),
          h('input', {
            className: 'madedown-savepop__input',
            value: saveDialog.path,
            placeholder: t('save.placeholder'),
            'aria-label': t('save.pathLabel'),
            autoFocus: true,
            onChange: (event) => setSaveDialog({ ...saveDialog, path: event.target.value }),
            onKeyDown: (event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void confirmSave();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                setSaveDialog(null);
              }
            },
          }),
          h('div', { className: 'madedown-savepop__hint' }, t('save.defaultHint')),
          h('div', { className: 'madedown-savepop__actions' },
            h('button', { type: 'button', className: 'madedown-savepop__btn', onClick: () => setSaveDialog(null) }, t('save.cancel')),
            h('button', { type: 'button', className: 'madedown-savepop__btn', 'data-primary': 'true', onClick: () => void confirmSave() }, t('save.confirm')))) : null,
        closingTab !== null && closeStyle !== null ? h('div', { className: 'madedown-menu', style: closeStyle },
          h('div', { className: 'madedown-menu__text' }, t('tab.closeConfirm', { title: closingTab.title })),
          h('div', { className: 'madedown-menu__actions' },
            h('button', { type: 'button', className: 'madedown-menu__btn', onClick: () => setClosingTab(null) }, t('tab.cancel')),
            h('button', { type: 'button', className: 'madedown-menu__btn', 'data-primary': 'true', onClick: confirmCloseTab }, t('tab.closeAction')))) : null,
        overflowMenu !== null && overflowStyle !== null ? h('div', { className: 'madedown-menu madedown-tabmenu', style: overflowStyle },
          state.docs.map((document, index) => h('button', {
            key: document.id,
            type: 'button',
            className: 'madedown-menu__item madedown-tabmenu__item',
            'data-active': String(document.id === state.activeId),
            onClick: () => {
              setOverflowMenu(null);
              flushEditor();
              void switchTab(document.id);
            },
          }, `${index + 1}. ${document.title || t('tab.untitled')}`))) : null,
        askDialog !== null && askStyle !== null ? h('div', { className: 'madedown-askpop', style: askStyle, role: 'dialog' },
          h('div', { className: 'madedown-askpop__title' }, t('ask.title')),
          h('textarea', {
            className: 'madedown-askpop__input',
            value: askDialog.question,
            placeholder: t('ask.placeholder'),
            autoFocus: true,
            onChange: (event) => setAskDialog({ ...askDialog, question: event.target.value }),
            onKeyDown: (event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendAskQuestion();
              } else if (event.key === 'Escape') {
                event.preventDefault();
                setAskDialog(null);
              }
            },
          }),
          h('div', { className: 'madedown-askpop__actions' },
            h('button', { type: 'button', className: 'madedown-askpop__btn', onClick: () => setAskDialog(null) }, t('ask.cancel')),
            h('button', { type: 'button', className: 'madedown-askpop__btn', 'data-primary': 'true', onClick: sendAskQuestion }, t('ask.send')))) : null,
        toolTip !== null && toolTipStyle !== null ? h('div', { className: 'madedown-tooltip', style: toolTipStyle, role: 'tooltip' }, toolTip.text) : null,
        editorTip !== null && tipStyle !== null ? h('div', { className: 'madedown-sel-toolbar madedown-ed-tip', style: tipStyle, role: 'toolbar' },
          h('button', {
            type: 'button',
            className: 'madedown-sel-btn',
            title: t('selection.toChatHint'),
            onMouseDown: (event) => event.preventDefault(),
            onClick: insertTipSelectionToChat,
          }, h(IconSend, { size: 14 }), h('span', null, t('selection.toChat'))),
          h('button', {
            type: 'button',
            className: 'madedown-sel-btn madedown-sel-btn--ask',
            title: t('tip.quickAsk'),
            onMouseDown: (event) => event.preventDefault(),
            onClick: openAskDialog,
          }, h('span', null, t('tip.quickAsk')))) : null);
    }

    // ---------------------------------------------------------------------
    // Round-trip diagnostics
    // (bump marker: code/link chrome live check)
    // ---------------------------------------------------------------------

    const ROUND_TRIP_SAMPLE = [
      '# Heading one',
      '',
      'Paragraph with **bold**, *italic*, ~~strike~~ and `code` plus [link](https://example.com).',
      '',
      '## Heading two',
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

    function normalizeRoundTrip(markdown) {
      return String(markdown || '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\n+/, '')
        .replace(/\n+$/, '');
    }

    function markdownToWysiwygHtml(markdown) {
      const blocks = blocksFromMarkdown(markdown || '');
      const html = blocks.map(blockHtml).join('');
      return html.length === 0 ? blockHtml({ type: 'p', text: '' }) : html;
    }

    /**
     * Check that the WYSIWYG representation is a fixpoint: rendering the
     * canonical Markdown, serializing the DOM back to Markdown, and rendering
     * again yields the same visual document. The literal Markdown may be
     * normalized (escapes, list spacing), but nothing visible is lost.
     * @param markdown - canonical Markdown to verify.
     * @returns whether the rendered document survives the round-trip.
     */
    function roundTripCheck(markdown) {
      if (typeof document === 'undefined') return false;
      try {
        const holder = document.createElement('div');
        const html = markdownToWysiwygHtml(markdown);
        holder.innerHTML = html;
        const serialized = serializeDoc(holder);
        return markdownToWysiwygHtml(serialized) === html;
      } catch (error) {
        console.error('madedown-dsh: round-trip check failed', error);
        return false;
      }
    }

    function statusText(status) {
      switch (status) {
        case 'loading':
          return translate('status.loading');
        case 'saving':
          return translate('status.saving');
        case 'conflict':
          return translate('status.conflict');
        case 'offline':
          return translate('status.offline');
        case 'error':
          return translate('status.conflict');
        default:
          return translate('status.saved');
      }
    }

    function updatedByText(updatedBy) {
      switch (updatedBy) {
        case 'assistant':
          return translate('by.assistant');
        case 'selection':
          return translate('by.selection');
        case 'user':
          return translate('by.user');
        default:
          return translate('by.system');
      }
    }

    // ---------------------------------------------------------------------
    // Tab title chip
    // ---------------------------------------------------------------------

    function MadedownTitle({ t }) {
      return h('span', { className: 'madedown-chip madedown-chip--logo', title: t('title') },
        h(MadedownWordmark, { height: 11 }));
    }

    // ---------------------------------------------------------------------
    // Conversation-header entry
    // ---------------------------------------------------------------------

    function MadedownHeaderButton({ t, open }) {
      const state = useStore();
      return h('button', {
        type: 'button',
        className: 'madedown-ibtn',
        title: t('openHint'),
        'aria-label': t('openHint'),
        onClick: () => open(),
        style: { width: '28px', height: '28px' },
      }, h(MadedownIcon, { size: 18 }), state.conflict
        ? h('span', { className: 'madedown-dot', 'data-state': 'conflict', style: { position: 'absolute', top: '3px', right: '3px' } })
        : null);
    }

    // ---------------------------------------------------------------------
    // Frame-wide overlay: chat selection -> editor + toast
    // ---------------------------------------------------------------------

    function Overlay({ t, open, sendSelection }) {
      const state = useStore();
      const [selectionTip, setSelectionTip] = useState(null);
      const suppressed = useRef(false);
      const tipRef = useRef(null);

      useEffect(() => {
        const compute = () => {
          if (suppressed.current) return;
          try {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
              setSelectionTip(null);
              return;
            }
            const text = selection.toString().trim();
            if (text.length === 0) {
              let imageOnly = false;
              try {
                const range = selection.getRangeAt(0);
                const holder = document.createElement('div');
                holder.appendChild(range.cloneContents());
                imageOnly = holder.querySelector('img') !== null;
              } catch {
                imageOnly = false;
              }
              if (!imageOnly) {
                setSelectionTip(null);
                return;
              }
            }
            const range = selection.getRangeAt(0);
            const node = range.commonAncestorContainer;
            const element = node.nodeType === 1 ? node : node.parentElement;
            if (!element || typeof element.closest !== 'function') {
              setSelectionTip(null);
              return;
            }
            if (element.closest('[data-conversation-scroll]') === null) {
              setSelectionTip(null);
              return;
            }
            if (element.closest('.madedown-root') !== null || element.closest('[contenteditable="true"]') !== null) {
              setSelectionTip(null);
              return;
            }
            const rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) {
              setSelectionTip(null);
              return;
            }
            setSelectionTip({ text, rect: { left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height } });
          } catch {
            setSelectionTip(null);
          }
        };
        const isInsideOwnUi = (target) => target instanceof Element
          && (target.closest('.madedown-sel-toolbar') !== null || target.closest('.madedown-toast') !== null);
        const onMouseUp = (event) => {
          if (isInsideOwnUi(event.target)) return;
          suppressed.current = false;
          setTimeout(compute, 0);
        };
        const onKeyUp = (event) => {
          if (event.shiftKey || (typeof event.key === 'string' && (event.key.startsWith('Arrow') || event.key === 'Home' || event.key === 'End'))) setTimeout(compute, 0);
        };
        const onMouseDown = (event) => {
          if (isInsideOwnUi(event.target)) return;
          suppressed.current = true;
          setSelectionTip(null);
        };
        const onSelectionChange = () => {
          if (tipRef.current !== null && suppressed.current === false) setTimeout(compute, 100);
        };
        const onScroll = () => {
          if (tipRef.current !== null) compute();
        };
        document.addEventListener('mouseup', onMouseUp, true);
        document.addEventListener('mousedown', onMouseDown, true);
        document.addEventListener('keyup', onKeyUp, true);
        document.addEventListener('selectionchange', onSelectionChange);
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onScroll, true);
        return () => {
          document.removeEventListener('mouseup', onMouseUp, true);
          document.removeEventListener('mousedown', onMouseDown, true);
          document.removeEventListener('keyup', onKeyUp, true);
          document.removeEventListener('selectionchange', onSelectionChange);
          window.removeEventListener('scroll', onScroll, true);
          window.removeEventListener('resize', onScroll, true);
        };
      }, []);

      useEffect(() => {
        tipRef.current = selectionTip;
      }, [selectionTip]);

      const tipStyle = selectionTip !== null ? (() => {
        const width = 168;
        const left = Math.max(8, Math.min(selectionTip.rect.left + selectionTip.rect.width / 2 - width / 2, window.innerWidth - width - 8));
        const top = selectionTip.rect.top > 56 ? selectionTip.rect.top - 42 : selectionTip.rect.bottom + 8;
        return { left: `${left}px`, top: `${Math.max(8, top)}px` };
      })() : null;

      const referenceEditor = state.referenceEditor;
      const [referenceDraft, setReferenceDraft] = useState('');
      const referenceId = referenceEditor ? referenceEditor.id : null;
      useEffect(() => {
        setReferenceDraft(referenceEditor ? referenceEditor.markdown : '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [referenceId]);

      const closeReferenceEditor = () => patchStore({ referenceEditor: null });
      const saveReferenceEditor = () => {
        if (referenceEditor === null) return;
        updateReference(referenceEditor.id, referenceDraft);
        patchStore({ referenceEditor: null });
        showToast(t('ref.saved'));
      };
      const removeReferenceEditor = () => {
        if (referenceEditor === null) return;
        const ok = removeMadedownReference(referenceEditor.id);
        patchStore({ referenceEditor: null });
        showToast(ok ? t('ref.removed') : t('ref.unavailable'));
      };

      return h(React.Fragment, null,
        referenceEditor !== null ? h('div', {
          className: 'madedown-refmask',
          onClick: (event) => {
            if (event.target === event.currentTarget) closeReferenceEditor();
          },
        },
        h('div', { className: 'madedown-refcard', role: 'dialog', 'aria-label': t('ref.title') },
          h('div', { className: 'madedown-refcard__head' },
            h('span', { className: 'madedown-refcard__title' }, `${t('ref.title')} · ${referenceEditor.title}`),
            h('button', {
              type: 'button',
              className: 'madedown-ibtn madedown-refcard__close',
              title: t('ref.close'),
              'aria-label': t('ref.close'),
              onClick: closeReferenceEditor,
            }, h(IconClose, { size: 13 }))),
          h('div', { className: 'madedown-refcard__hint' }, t('ref.hint')),
          h('textarea', {
            className: 'madedown-refcard__text',
            value: referenceDraft,
            onChange: (event) => setReferenceDraft(event.target.value),
            spellCheck: false,
          }),
          h('div', { className: 'madedown-refcard__actions' },
            h('button', { type: 'button', className: 'madedown-refcard__btn', onClick: closeReferenceEditor }, t('ref.close')),
            h('button', { type: 'button', className: 'madedown-refcard__btn', 'data-danger': 'true', onClick: removeReferenceEditor }, t('ref.delete')),
            h('button', { type: 'button', className: 'madedown-refcard__btn', 'data-primary': 'true', onClick: saveReferenceEditor }, t('ref.save'))))) : null,

        selectionTip !== null ? h('div', { className: 'madedown-sel-toolbar', style: tipStyle, role: 'toolbar' },
          h('button', {
            type: 'button',
            className: 'madedown-sel-btn',
            title: t('selection.hint'),
            onMouseDown: (event) => event.preventDefault(),
            onClick: () => {
              suppressed.current = true;
              const text = selectionTip.text;
              setSelectionTip(null);
              let payload = text;
              let asMarkdown = false;
              let richBlocks = false;
              try {
                const selection = window.getSelection();
                if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  richBlocks = selectionHasRichBlocks(range);
                  if (richBlocks) {
                    const markdown = selectionToMarkdown(range);
                    if (markdown.length > 0) {
                      payload = markdown;
                      asMarkdown = true;
                    }
                  }
                }
                if (!asMarkdown) {
                  const table = tsvTableToMarkdown(text);
                  if (table.length > 0) {
                    payload = table;
                    asMarkdown = true;
                  }
                }
                if (selection) selection.removeAllRanges();
              } catch {
                /* fall back to the plain selected text */
              }
              reportDiag({
                event: 'send-selection',
                richBlocks,
                asMarkdown,
                selectedChars: text.length,
                payloadChars: payload.length,
              });
              void sendSelection(payload, { asMarkdown });
            },
          }, h(IconSend, { size: 14 }), h('span', null, t('selection.send')))) : null,
        state.toast !== null ? h('div', { className: 'madedown-toast', role: 'status' },
          h('span', { className: 'madedown-toast__text' }, state.toast.text),
          state.toast.action ? h('button', {
            type: 'button',
            className: 'madedown-toast__btn',
            onClick: () => {
              const action = state.toast.action;
              dismissToast();
              if (action && typeof action.run === 'function') action.run();
            },
          }, state.toast.action.label) : null,
          h('button', {
            type: 'button',
            className: 'madedown-toast__btn',
            'aria-label': t('action.close'),
            onClick: dismissToast,
          }, h(IconClose, { size: 12 }))) : null);
    }

    // ---------------------------------------------------------------------
    // Client plugin
    // ---------------------------------------------------------------------

    const inject = ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs'];

    function apply(ctx) {
      boundTranslate = ctx.locale.bind(NS);
      const t = (key, params) => translate(key, params);

      runtime.open = () => {
        try {
          const sidebar = ctx.sidebarRight;
          if (!sidebar) return false;
          if (sidebar.mounted && sidebar.mounted.getSnapshot() === undefined) {
            showToast(t('openHint'));
            return false;
          }
          const active = sidebar.active();
          if (active && active.kind === KIND) {
            sidebar.focus(active.id);
            return true;
          }
          sidebar.openTab(KIND);
          return true;
        } catch (error) {
          console.error('madedown-dsh: could not open the editor tab', error);
          return false;
        }
      };

      ctx.effect(() => {
        const style = document.createElement('style');
        style.dataset.plugin = TYPE_ID;
        style.dataset.pluginCss = CSS_TAG;
        style.textContent = CSS;
        document.head.appendChild(style);
        return () => {
          style.remove();
        };
      }, 'madedown-dsh: styles');

      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'madedown-dsh: locale');

      ctx.effect(() => {
        window.__madedownDsh = {
          getState: () => ({ ...store }),
          open: () => runtime.open(),
          refresh: () => pollOnce(true),
          roundTrip: (markdown) => roundTripCheck(markdown),
          serialize: (markdown) => {
            const holder = document.createElement('div');
            holder.innerHTML = blocksFromMarkdown(markdown).map(blockHtml).join('');
            return serializeDoc(holder);
          },
        };
        return () => {
          if (window.__madedownDsh) delete window.__madedownDsh;
        };
      }, 'madedown-dsh: debug face');

      ctx.effect(() => startSync(ctx), 'madedown-dsh: sync');

      ctx.effect(() => registerReferenceSourceWhenReady(ctx), 'madedown-dsh: reference source');

      ctx.effect(() => ctx.sidebarRightTabs.register({
        id: TYPE_ID,
        kind: KIND,
        multiple: false,
        keepMounted: true,
        priority: 'extension',
        title: () => t('title'),
        guide: [{
          id: 'madedown',
          order: 12,
          title: () => t('guide.title'),
          description: () => t('guide.description'),
          icon: MadedownIcon,
        }],
      }), 'madedown-dsh: tab type');

      ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
        name: 'sidebar.right.pane.tab',
        key: TYPE_ID,
        locale: NS,
        inject: () => ({ open: () => runtime.open() }),
      }, MadedownBody)), 'madedown-dsh: editor body');

      ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
        name: 'sidebar.right.pane.tab.title',
        key: TYPE_ID,
        locale: NS,
      }, MadedownTitle)), 'madedown-dsh: editor title');

      ctx.effect(() => ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
        name: 'conversation.session.header.utilities',
        id: TYPE_ID,
        order: -4,
        locale: NS,
        inject: () => ({ open: () => runtime.open() }),
      }, MadedownHeaderButton)), 'madedown-dsh: header action');

      ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: TYPE_ID,
        order: 18,
        locale: NS,
        inject: () => ({
          open: () => runtime.open(),
          sendSelection: (text) => void sendSelection(text),
        }),
      }, Overlay)), 'madedown-dsh: overlay');
    }

    const __test = {
      parseMarkdown,
      extractHeadings,
      safeUrl,
      docStats,
      quoted,
      blocksFromMarkdown,
      blockHtml,
      inlineHtml,
      inlineMarkdown,
      serializeDoc,
      roundTripCheck,
      appendSelectionToChat,
      sendSelection,
      markdownFromHtml,
      selectionToMarkdown,
      selectionHasRichBlocks,
      tsvTableToMarkdown,
      sendQuickAsk,
      insertMadedownReference,
      localizeMarkdownImages,
      adoptServerSnapshot,
      getStore: () => ({ ...getStore() }),
      setStore: (patch) => patchStore(patch),
      resetStore: () => patchStore({
        loaded: true,
        version: 0,
        activeId: 'doc-test',
        rev: 0,
        docs: [{ id: 'doc-test', title: 'Madedown', rev: 0, chars: 0, lines: 0, updatedBy: 'system', updatedAt: '' }],
        title: 'Madedown',
        text: '',
        updatedAt: '',
        updatedBy: 'system',
        dirty: false,
        status: 'ready',
        conflict: null,
        error: null,
        toast: null,
        seenOpenRequest: 0,
        lastSyncedAt: 0,
        referenceEditor: null,
      }),
      components: { MadedownBody, MadedownTitle, MadedownHeaderButton, Overlay, MarkdownGlyph, EditorBoundary, WysiwygEditor },
      dicts: { zh, en },
      constants: { NS, KIND, TYPE_ID, API },
    };

    return { inject, apply, __test };
  },
});
