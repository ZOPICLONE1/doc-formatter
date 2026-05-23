import type { TemplateConfig, HeadingLevel, DocDirection, LineSpacingType } from '../types';
import {
  HEADING_LABELS, HEADING_ORDER, FONT_SIZE_OPTIONS, FONT_FAMILY_OPTIONS,
  ALIGNMENT_LABELS, DEFAULT_TEMPLATES,
  LINE_SPACING_TYPE_LABELS, LINE_SPACING_OPTIONS, FIXED_LINE_SPACING_OPTIONS,
  SPACE_BEFORE_AFTER_OPTIONS,
} from '../constants';

interface Props {
  direction: DocDirection;
  template: TemplateConfig;
  onChange: (t: TemplateConfig) => void;
}

export default function TemplatePanel({ direction, template, onChange }: Props) {
  function update(level: HeadingLevel, field: string, value: string | number | boolean) {
    const updated = {
      ...template,
      [level]: { ...template[level], [field]: value },
    };
    onChange(updated);
  }

  function resetToDefault() {
    onChange(JSON.parse(JSON.stringify(DEFAULT_TEMPLATES[direction])));
  }

  return (
    <div className="template-panel">
      <div className="panel-header">
        <h3>排版模板设置</h3>
        <button className="btn btn-sm btn-outline" onClick={resetToDefault}>
          恢复默认
        </button>
      </div>

      <div className="template-levels">
        {HEADING_ORDER.map((level) => {
          const lvl = level as HeadingLevel;
          const cfg = template[lvl];
          const isFixed = cfg.lineSpacingType === 'fixed';
          return (
            <div key={lvl} className="template-level-card">
              <div className="level-title">{HEADING_LABELS[lvl]}</div>

              <div className="level-controls">
                <label>
                  <span>字体</span>
                  <select value={cfg.fontFamily} onChange={(e) => update(lvl, 'fontFamily', e.target.value)}>
                    {FONT_FAMILY_OPTIONS.map((f) => (<option key={f} value={f}>{f}</option>))}
                  </select>
                </label>
                <label>
                  <span>字号</span>
                  <select value={cfg.fontSize} onChange={(e) => update(lvl, 'fontSize', Number(e.target.value))}>
                    {FONT_SIZE_OPTIONS.map((fs) => (<option key={fs.value} value={fs.value}>{fs.label}</option>))}
                  </select>
                </label>
                <label>
                  <span>对齐</span>
                  <select value={cfg.alignment} onChange={(e) => update(lvl, 'alignment', e.target.value)}>
                    {Object.entries(ALIGNMENT_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                  </select>
                </label>
                <label className="bold-check">
                  <input type="checkbox" checked={cfg.bold} onChange={(e) => update(lvl, 'bold', e.target.checked)} />
                  <span>加粗</span>
                </label>
              </div>

              <div className="level-controls spacing-row">
                <label>
                  <span>行距类型</span>
                  <select value={cfg.lineSpacingType} onChange={(e) => update(lvl, 'lineSpacingType', e.target.value as LineSpacingType)}>
                    {Object.entries(LINE_SPACING_TYPE_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                  </select>
                </label>
                <label>
                  <span>行距值</span>
                  {isFixed ? (
                    <select value={cfg.lineSpacing} onChange={(e) => update(lvl, 'lineSpacing', Number(e.target.value))}>
                      {FIXED_LINE_SPACING_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                    </select>
                  ) : (
                    <select value={cfg.lineSpacing} onChange={(e) => update(lvl, 'lineSpacing', Number(e.target.value))}>
                      {LINE_SPACING_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                    </select>
                  )}
                </label>
                <label>
                  <span>段前距</span>
                  <select value={cfg.spaceBefore} onChange={(e) => update(lvl, 'spaceBefore', Number(e.target.value))}>
                    {SPACE_BEFORE_AFTER_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </label>
                <label>
                  <span>段后距</span>
                  <select value={cfg.spaceAfter} onChange={(e) => update(lvl, 'spaceAfter', Number(e.target.value))}>
                    {SPACE_BEFORE_AFTER_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
