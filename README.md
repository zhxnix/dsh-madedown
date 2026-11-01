# Madedown DSH

[![checks](https://github.com/zhxnix/dsh-madedown/actions/workflows/check.yml/badge.svg)](https://github.com/zhxnix/dsh-madedown/actions/workflows/check.yml)

DeepSeek Harness（DSH）右侧栏的 **所见即所得 Markdown 笔记编辑器**，灵感来自原生 macOS Markdown 编辑器 [Madedown](https://github.com/zhxnix/Madedown)。

打开后，右侧栏会出现 Madedown 编辑标签页：默认直接编辑渲染后的 Markdown（标题就是标题、表格可直接改单元格），并支持多标签页、本地图片、保存为本地文件，以及与主对话双向联动：

- 对话中的模型可以通过 `madedown` 工具**读取和修改**右侧文档；
- 右侧编辑器的修改会自动进入对话上下文；
- 对话里的选区可一键发送到编辑器，编辑器里的选区也可**插入到对话**（只插入、不发送）；
- 编辑器选区支持「快速提问」，直接在对话中向模型提问。

## 功能

- **所见即所得 / 源码模式**：工具栏最右侧图标切换，实时渲染 Markdown。
- **多标签页**：新建、关闭、双击改名、拖动实时换位；标签过多时右侧出现溢出菜单；标签顺序与激活项持久化。关闭有内容的标签时会提示，并可直接选择「保存到本地」或「确定关闭」。
- **本地保存状态**：标签显示绿/红状态点；状态栏显示当前文档的本地保存状态，点击可查看并复制保存路径。
- **保存到本地文件**：点击下载按钮或 `⌘S` 会弹出**系统原生保存对话框**（macOS），默认文件名 `<标题>.md`、默认位置「文稿」，直接写入你选择的文件。
- **表格编辑**：光标进入表格时浮出工具条，可上方/下方插行、左侧/右侧插列、删除行/列/整表；`Tab` 在最后一个单元格自动新增一行。
- **代码块**：带语言 / 自动换行 / 复制横幅；`⌘/Ctrl+Enter`、`Esc`、末尾按 `↓` 或点击代码块下方空白均可退出代码块。
- **图片**：选择或粘贴图片会上传到 Host 本地资源目录；从对话选区发送图片时也会转存为本地资源。
- **目录**：编辑区右上方的半透明深蓝目录，悬停展开、移开收起，点击把手可固定。
- **Markdown 快捷输入**：行首输入 `# `、`- `、`1. `、`> `、```` ``` ```` 等自动变块；行首 `/` 打开格式菜单。
- **列表 / 任务列表**：回车续写、`Tab` 缩进、任务复选框直接勾选。
- **与对话渲染一致**：使用对话 Markdown 的同一套排版 token（字体、字号、行高、标题、列表、引用、代码、表格）。
- **对话联动**：对话选区发送到编辑器、编辑器选区插入对话、快速提问、Madedown 引用 chip（点击可编辑发送给模型的内容）。
- **关于弹窗**：查看应用图标、字标、版本号、作者、最新更新与代码仓库地址。

## 安装

### 从 GitHub（当前可用）

```sh
dsh plugin --profile web add github:zhxnix/dsh-madedown
```

### 从 npm

npm 包发布后可使用：

```sh
dsh plugin --profile web add dsh-madedown@latest
```

> 目前 npm 包尚未发布；发布后 1024Store 中的条目会自动从 browse-only 变为可安装。

### 本地开发安装

在 DSH 中执行：

```text
plugin_manager install_bundle  target=/path/to/madedown-dsh
```

安装后客户端模块通常通过 client HMR 自动载入；若未出现，刷新一下 DSH 页面。安装需要 `pnpm`（可通过 `corepack enable pnpm` 提供）。

## 使用

1. 点击右侧栏的 Madedown 入口、对话标题栏的 Madedown 图标，或让模型执行 `madedown` 的 `open` 动作；
2. 直接在渲染后的文档里编辑，或用工具栏/快捷键；
3. 多篇笔记用顶部标签页管理，可拖动排序、双击改名；
4. `⌘S` 保存到本地文件；标签与文档会自动持久化到 Host。

### 常用快捷键

| 快捷键 | 作用 |
| --- | --- |
| `⌘B` / `⌘I` / `⇧⌘X` / `⌘E` | 粗体 / 斜体 / 删除线 / 行内代码 |
| `⌘K` | 插入链接 |
| `⌘S` | 保存到本地文件 |
| `Tab` / `⇧Tab` | 列表缩进 / 反缩进；表格内切换单元格 |
| `⌘/Ctrl+Enter`、`Esc`、`↓`（代码末尾） | 退出代码块 |
| `Enter`（空列表项） | 退出列表 |

## 数据与隐私

- 文档保存在 `$DSH_HOME/madedown-dsh/documents.json`（默认 `~/.dsh/madedown-dsh/documents.json`；可用环境变量 `MADEDOWN_DSH_HOME` 覆盖目录）。
- 图片保存在 `$DSH_HOME/madedown-dsh/assets/`，通过本机 Host 路由提供，不会上传到任何外部服务。
- 引用内容与编辑状态只保存在浏览器 `localStorage` 与本地 Host 数据中。
- 插件本身不发起外部网络请求；与对话/模型的数据交换都走 DSH 自身的本地会话链路。

## 模型工具

`madedown` 工具（参数 `action`，可选 `document` 指定标签 id 或标题，默认当前标签）：

| action | 作用 |
| --- | --- |
| `read` | 读取文档全文、标题、版本、统计与标签列表 |
| `write` | 整篇重写（`text`，可选 `title`） |
| `append` | 在文档末尾追加一段 `text` |
| `replace` | 字面量查找替换（`find` / `replaceWith` / `all`） |
| `list` | 列出所有标签与当前激活标签 |
| `select` | 切换当前激活标签（`document` 必填） |
| `create` | 新建标签（可选 `title` / 初始 `text`） |
| `open` | 在右侧栏打开/显示编辑器 |

Host 还会注册一段系统提示，列出标签并内联当前标签内容（超长内容会截断并提示用工具读取全文）。

## 插件市场

- GitHub 仓库已添加 `dsh-plugin` topic，dshfind 等基于 topic 聚合的 DSH 插件目录会在数据刷新后自动收录；
- 已加入 1024Store 插件目录（[PR #785](https://github.com/imsai-sh/awesome-deepseek-harness-plugins/pull/785)，已合并）；npm 包发布前显示为 browse-only。

## 开发与检查

```sh
node --check host.js
node --check impl.js
node --check client.js
node scripts/check-host.mjs

# 渲染 / WYSIWYG 测试需要 React 与 jsdom
npm install --prefix /tmp/madedown-test react@18.3.1 react-dom@18.3.1 jsdom@24
node scripts/check-client.mjs
node scripts/check-wysiwyg.mjs
```

`check-host.mjs` 覆盖多标签、旧数据迁移与本地导出；`check-client.mjs` 覆盖 Markdown ↔ DOM 往返、选区转换、组件渲染与注册；`check-wysiwyg.mjs` 在 jsdom 中覆盖块命令、表格操作、代码块退出、拖动标签、关于弹窗等交互。

## 许可证

[MIT](./LICENSE) © 2026 zhxnix
