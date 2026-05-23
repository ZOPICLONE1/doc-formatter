import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  type IStylesOptions, LineRuleType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ContentSegment, TemplateConfig, Citation, HeadingConfig } from '../types';

function mapAlignment(a: string): typeof AlignmentType[keyof typeof AlignmentType] {
  switch (a) {
    case 'left': return AlignmentType.LEFT;
    case 'center': return AlignmentType.CENTER;
    case 'right': return AlignmentType.RIGHT;
    case 'justify': return AlignmentType.JUSTIFIED;
    default: return AlignmentType.LEFT;
  }
}

function ptToHalfPt(pt: number): number {
  return Math.round(pt * 2);
}

function ptToTwips(pt: number): number {
  return Math.round(pt * 20);
}

function fontFamilyToDocx(family: string): string {
  const map: Record<string, string> = {
    '宋体': 'SimSun',
    '仿宋': 'FangSong',
    '黑体': 'SimHei',
    '楷体': 'KaiTi',
    '微软雅黑': 'Microsoft YaHei',
    '方正小标宋简体': 'FZXiaoBiaoSong-B05S',
    '方正书宋简体': 'FZShuSong-Z01S',
    '方正楷体简体': 'FZKai-Z03S',
  };
  return map[family] || family;
}

function buildSpacing(cfg: HeadingConfig) {
  const before = ptToTwips(cfg.spaceBefore);
  const after = ptToTwips(cfg.spaceAfter);

  if (cfg.lineSpacingType === 'fixed') {
    // Fixed line spacing: value in twips, lineRule = EXACTLY
    return {
      before,
      after,
      line: ptToTwips(cfg.lineSpacing),
      lineRule: LineRuleType.EXACTLY,
    };
  }
  // Multiple line spacing: value in 1/240th of a line
  return {
    before,
    after,
    line: Math.round(cfg.lineSpacing * 240),
  };
}

export async function exportDocx(
  segments: ContentSegment[],
  template: TemplateConfig,
  citations: Citation[],
  citationEnabled: boolean,
  fileName: string,
): Promise<void> {
  const children: Paragraph[] = [];

  segments.forEach((seg) => {
    const cfg = template[seg.level];
    if (!cfg) return;

    let text = seg.text;
    if (!citationEnabled) {
      text = text.replace(/\s*\[\d+\]\s*/g, '');
    }

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text,
            font: { name: fontFamilyToDocx(cfg.fontFamily), eastAsia: cfg.fontFamily },
            size: ptToHalfPt(cfg.fontSize),
            bold: cfg.bold,
          }),
        ],
        alignment: mapAlignment(cfg.alignment),
        spacing: buildSpacing(cfg),
      }),
    );
  });

  if (citationEnabled && citations.length > 0) {
    const filledCitations = citations.filter((c) => c.text.trim().length > 0);
    if (filledCitations.length > 0) {
      const refCfg = template.heading2 || template.heading1;
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '参考文献',
              font: { name: fontFamilyToDocx(refCfg.fontFamily), eastAsia: refCfg.fontFamily },
              size: ptToHalfPt(refCfg.fontSize),
              bold: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: ptToTwips(24), after: ptToTwips(12) },
        }),
      );

      filledCitations.forEach((c) => {
        const bodyCfg = template.body;
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[${c.id}] ${c.text}`,
                font: { name: fontFamilyToDocx(bodyCfg.fontFamily), eastAsia: bodyCfg.fontFamily },
                size: ptToHalfPt(bodyCfg.fontSize),
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: buildSpacing(bodyCfg),
          }),
        );
      });
    }
  }

  const styles: IStylesOptions = {
    default: {
      document: {
        run: {
          font: { name: fontFamilyToDocx(template.body.fontFamily), eastAsia: template.body.fontFamily },
          size: ptToHalfPt(template.body.fontSize),
        },
      },
    },
  };

  const doc = new Document({
    styles,
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName.replace(/\.\w+$/, '') + '_排版后.docx');
}
