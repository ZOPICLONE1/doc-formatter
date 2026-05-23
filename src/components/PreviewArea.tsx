import type { ContentSegment, HeadingLevel, TemplateConfig, Citation } from '../types';
import { HEADING_LABELS, HEADING_ORDER } from '../constants';
import { templateLevelToStyle, highlightCitations } from '../utils/formatEngine';

interface Props {
  segments: ContentSegment[];
  template: TemplateConfig;
  citations: Citation[];
  citationEnabled: boolean;
  onSegmentLevelChange: (segId: string, level: HeadingLevel) => void;
}

export default function PreviewArea({
  segments, template, citations, citationEnabled, onSegmentLevelChange,
}: Props) {
  if (segments.length === 0) {
    return (
      <div className="preview-empty">
        <p>上传文档后在此预览排版效果</p>
        <p className="hint">点击段落可切换标题级别</p>
      </div>
    );
  }

  return (
    <div className="preview-area">
      <div className="preview-toolbar">
        <span className="preview-label">排版预览</span>
        <span className="preview-hint">点击段落切换级别</span>
      </div>
      <div className="preview-document">
        {segments.map((seg) => {
          const style = templateLevelToStyle(seg.level, template);
          const html = citationEnabled
            ? highlightCitations(seg.text)
            : seg.text;

          return (
            <div key={seg.id} className="preview-segment-wrapper">
              <div
                className={`preview-segment level-${seg.level}`}
                style={style}
                dangerouslySetInnerHTML={{ __html: html }}
                onClick={() => {
                  const idx = HEADING_ORDER.indexOf(seg.level);
                  const nextIdx = (idx + 1) % HEADING_ORDER.length;
                  onSegmentLevelChange(seg.id, HEADING_ORDER[nextIdx] as HeadingLevel);
                }}
                title={`当前: ${HEADING_LABELS[seg.level]} — 点击切换`}
              />
              <span className="segment-level-badge">{HEADING_LABELS[seg.level]}</span>
            </div>
          );
        })}

        {citationEnabled && citations.filter((c) => c.text.trim()).length > 0 && (
          <div className="preview-references">
            <div
              className="preview-segment level-heading2"
              style={templateLevelToStyle('heading2', template)}
            >
              参考文献
            </div>
            {citations.filter((c) => c.text.trim()).map((c) => (
              <div
                key={c.id}
                className="preview-segment level-body"
                style={templateLevelToStyle('body', template)}
              >
                [{c.id}] {c.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
