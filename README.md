# 文档排版工具

支持 **公文**、**论文/课设**、**商业文档** 三大方向的在线排版工具。上传 .docx 文件，按行业标准自动排版或逐项自定义，一键导出规范格式的 Word 文档。

## 功能特性

- 三种预设排版模板（公文 GB/T 9704、高校论文、商业文档）
- 标题 + 四级标题 + 正文的字体、字号、对齐、加粗、行距、段间距逐项可配
- 论文方向支持交叉引用：[数字] 标注 + 参考文献列表
- 上传 .docx 自动解析段落并智能识别各级标题
- 点击预览段落可切换标题级别（标题 ← 一级 ← 二级 ← 三级 ← 四级 ← 正文）
- 行距支持多倍行距 & 固定值（pt），段前/段后距可调

## 下载与打开

### 方法一：浏览器在线使用（推荐）

项目已部署后，直接在浏览器打开网页即可使用。无需安装任何软件。

### 方法二：本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/ZOPICLONE1/doc-formatter.git
cd doc-formatter

# 2. 安装依赖（需要 Node.js ≥18）
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:5173/` 即可使用。

### 方法三：构建后使用

```bash
npm install
npm run build
```

构建产物在 `dist/` 目录，可直接部署到任意静态服务器（Nginx、GitHub Pages 等）。

## 技术栈

- React 19 + TypeScript
- Vite
- mammoth.js（.docx 解析）
- docx（.docx 生成）
