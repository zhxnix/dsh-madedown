# Changelog

## 0.6.3

- Fix: a locally saved document showed as "not saved locally" after a page refresh or plugin reload. `localPath` / `localSavedAt` are now preserved when the document store is loaded from disk.

## 0.6.2

- The About dialog can check the latest GitHub release and update the plugin to it (git checkout: fast-forward pull; npm installs: best-effort `dsh plugin add`; a restart is required).
- When a newer release exists, the status bar shows a small "new version" hint that opens the About dialog.

## 0.6.1

- Saving to a local file now opens the native macOS save panel instead of an in-page path prompt (in-page prompt remains as a non-macOS fallback).
- Closing a non-empty tab now offers exactly two actions: **Save locally** and **Close anyway** (red); the close confirmation explains that unsaved content cannot be recovered.

## 0.6.0

- Table editing: a contextual toolbar for inserting rows/columns and deleting rows, columns, or the whole table; Tab in the last cell adds a row.
- Code blocks: exit with Cmd/Ctrl+Enter, Escape, ArrowDown at the end, or by clicking below the block; language / wrap / copy banner.
- Theme-aware Madedown logo and wordmark in the sidebar tab, conversation header, and About dialog.
- Tab bar redesign: draggable tabs with live reordering, pinned +/overflow controls, local-save status dots, logo-blue active underline.
- Local-save status can be clicked to reveal and copy the saved file path.
- About dialog with app icon, wordmark, version, author, latest changes, and repository placeholder.
- Outline panel now appears at the top-right of the editor as a translucent dark-blue overlay and auto-hides on mouse leave.
- Images can be picked or pasted; chat image selections are localized into editor assets.
- Quick ask, editor-to-chat reference chips, and chat-to-editor selections.

## 0.5.x

- Statistic bar simplification, local-save indicators, tab overflow menu, icon-only render/source switch, save button relocated, About button.
- Code-block banners, link site glyphs, outline refinements, and theme fixes.

## 0.1.0 – 0.4.x

- Initial DSH sidebar Madedown editor: WYSIWYG/source modes, multi-document tabs with assistant `madedown` tool, image insertion, save-to-local-file, chat integration, and Markdown quick input.
