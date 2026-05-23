import type { DocDirection, TemplateConfig } from './types';

export const DIRECTION_LABELS: Record<DocDirection, string> = {
  official: '公文',
  academic: '论文 / 课设',
  business: '商业',
};

export const DIRECTION_DESC: Record<DocDirection, string> = {
  official: 'GB/T 9704 标准公文格式，适用于政府机关、事业单位正式文件',
  academic: '高校毕业论文与课程设计标准格式，支持交叉引用',
  business: '商务文档标准格式，适用于商业报告、企划书等',
};

export const DEFAULT_TEMPLATES: Record<DocDirection, TemplateConfig> = {
  official: {
    title:    { fontFamily: '方正小标宋简体', fontSize: 22, bold: false, alignment: 'center', lineSpacing: 36, lineSpacingType: 'fixed', spaceBefore: 0,  spaceAfter: 12 },
    heading1:  { fontFamily: '黑体', fontSize: 16, bold: true,  alignment: 'left',   lineSpacing: 28, lineSpacingType: 'fixed', spaceBefore: 12, spaceAfter: 6 },
    heading2:  { fontFamily: '楷体', fontSize: 16, bold: true,  alignment: 'left',   lineSpacing: 28, lineSpacingType: 'fixed', spaceBefore: 8,  spaceAfter: 4 },
    heading3:  { fontFamily: '仿宋', fontSize: 16, bold: true,  alignment: 'left',   lineSpacing: 28, lineSpacingType: 'fixed', spaceBefore: 6,  spaceAfter: 4 },
    heading4:  { fontFamily: '仿宋', fontSize: 16, bold: false, alignment: 'left',   lineSpacing: 28, lineSpacingType: 'fixed', spaceBefore: 4,  spaceAfter: 2 },
    body:      { fontFamily: '仿宋', fontSize: 16, bold: false, alignment: 'justify', lineSpacing: 28, lineSpacingType: 'fixed', spaceBefore: 0,  spaceAfter: 0 },
  },
  academic: {
    title:    { fontFamily: '黑体', fontSize: 22, bold: true,  alignment: 'center', lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 0,  spaceAfter: 24 },
    heading1:  { fontFamily: '黑体', fontSize: 16, bold: true,  alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 24, spaceAfter: 12 },
    heading2:  { fontFamily: '黑体', fontSize: 14, bold: true,  alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 18, spaceAfter: 8 },
    heading3:  { fontFamily: '黑体', fontSize: 12, bold: true,  alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 12, spaceAfter: 6 },
    heading4:  { fontFamily: '黑体', fontSize: 12, bold: false, alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 8,  spaceAfter: 4 },
    body:      { fontFamily: '宋体', fontSize: 12, bold: false, alignment: 'justify', lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 0,  spaceAfter: 0 },
  },
  business: {
    title:    { fontFamily: '微软雅黑', fontSize: 18, bold: true,  alignment: 'center', lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 0,  spaceAfter: 18 },
    heading1:  { fontFamily: '微软雅黑', fontSize: 16, bold: true,  alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 18, spaceAfter: 10 },
    heading2:  { fontFamily: '微软雅黑', fontSize: 14, bold: true,  alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 14, spaceAfter: 8 },
    heading3:  { fontFamily: '微软雅黑', fontSize: 12, bold: true,  alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 10, spaceAfter: 6 },
    heading4:  { fontFamily: '微软雅黑', fontSize: 12, bold: false, alignment: 'left',   lineSpacing: 1.5, lineSpacingType: 'multiple', spaceBefore: 6,  spaceAfter: 4 },
    body:      { fontFamily: '宋体', fontSize: 12, bold: false, alignment: 'justify', lineSpacing: 1.15, lineSpacingType: 'multiple', spaceBefore: 0,  spaceAfter: 0 },
  },
};

export const LINE_SPACING_TYPE_LABELS: Record<string, string> = {
  multiple: '多倍行距',
  fixed: '固定值 (pt)',
};

export const LINE_SPACING_OPTIONS = [
  { label: '1.0 倍', value: 1.0 },
  { label: '1.15 倍', value: 1.15 },
  { label: '1.25 倍', value: 1.25 },
  { label: '1.5 倍', value: 1.5 },
  { label: '1.75 倍', value: 1.75 },
  { label: '2.0 倍', value: 2.0 },
  { label: '2.5 倍', value: 2.5 },
];

export const FIXED_LINE_SPACING_OPTIONS = [
  { label: '20 pt', value: 20 },
  { label: '22 pt', value: 22 },
  { label: '24 pt', value: 24 },
  { label: '26 pt', value: 26 },
  { label: '28 pt', value: 28 },
  { label: '30 pt', value: 30 },
  { label: '32 pt', value: 32 },
  { label: '36 pt', value: 36 },
];

export const SPACE_BEFORE_AFTER_OPTIONS = [
  { label: '0 pt', value: 0 },
  { label: '2 pt', value: 2 },
  { label: '4 pt', value: 4 },
  { label: '6 pt', value: 6 },
  { label: '8 pt', value: 8 },
  { label: '10 pt', value: 10 },
  { label: '12 pt', value: 12 },
  { label: '16 pt', value: 16 },
  { label: '18 pt', value: 18 },
  { label: '24 pt', value: 24 },
  { label: '30 pt', value: 30 },
  { label: '36 pt', value: 36 },
];

export const ALIGNMENT_LABELS: Record<string, string> = {
  left: '靠左',
  center: '居中',
  right: '靠右',
  justify: '两端对齐',
};

export const HEADING_LABELS: Record<string, string> = {
  title: '标题',
  heading1: '一级标题',
  heading2: '二级标题',
  heading3: '三级标题',
  heading4: '四级标题',
  body: '正文',
};

export const HEADING_ORDER = ['title', 'heading1', 'heading2', 'heading3', 'heading4', 'body'] as const;

export const FONT_SIZE_OPTIONS = [
  { label: '初号 (42pt)', value: 42 },
  { label: '小初 (36pt)', value: 36 },
  { label: '一号 (26pt)', value: 26 },
  { label: '小一 (24pt)', value: 24 },
  { label: '二号 (22pt)', value: 22 },
  { label: '小二 (18pt)', value: 18 },
  { label: '三号 (16pt)', value: 16 },
  { label: '小三 (15pt)', value: 15 },
  { label: '四号 (14pt)', value: 14 },
  { label: '小四 (12pt)', value: 12 },
  { label: '五号 (10.5pt)', value: 10.5 },
  { label: '小五 (9pt)', value: 9 },
];

export const FONT_FAMILY_OPTIONS = [
  '宋体', '仿宋', '黑体', '楷体', '微软雅黑',
  '方正小标宋简体', '方正书宋简体', '方正楷体简体',
  'Arial', 'Times New Roman', 'Calibri',
];
