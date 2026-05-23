export type DocDirection = 'official' | 'academic' | 'business';

export type Alignment = 'left' | 'center' | 'right' | 'justify';

export type LineSpacingType = 'multiple' | 'fixed';

export interface HeadingConfig {
  fontFamily: string;
  fontSize: number; // pt
  bold: boolean;
  alignment: Alignment;
  lineSpacing: number;   // 多倍行距时的倍数 (如 1.5) 或固定值时的磅数 (如 28)
  lineSpacingType: LineSpacingType; // 'multiple' | 'fixed'
  spaceBefore: number;   // 段前距 pt
  spaceAfter: number;    // 段后距 pt
}

export interface TemplateConfig {
  title: HeadingConfig;
  heading1: HeadingConfig;
  heading2: HeadingConfig;
  heading3: HeadingConfig;
  heading4: HeadingConfig;
  body: HeadingConfig;
}

export type HeadingLevel = 'title' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'body';

export interface ContentSegment {
  id: string;
  text: string;
  level: HeadingLevel;
}

export interface Citation {
  id: number;
  text: string;
}

export interface DocState {
  direction: DocDirection;
  template: TemplateConfig;
  segments: ContentSegment[];
  citations: Citation[];
  citationEnabled: boolean;
  fileName: string;
}
