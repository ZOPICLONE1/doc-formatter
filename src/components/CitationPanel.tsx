import { useState } from 'react';
import type { Citation, ContentSegment } from '../types';

interface Props {
  citations: Citation[];
  segments: ContentSegment[];
  onChange: (citations: Citation[]) => void;
  onInsert: (segId: string, citationId: number) => void;
  enabled: boolean;
  onToggle: (v: boolean) => void;
}

export default function CitationPanel({
  citations, segments, onChange, onInsert, enabled, onToggle,
}: Props) {
  const [selectedSeg, setSelectedSeg] = useState('');

  function addCitation() {
    const newId = citations.length > 0
      ? Math.max(...citations.map((c) => c.id)) + 1
      : 1;
    onChange([...citations, { id: newId, text: '' }]);
  }

  function updateCitation(id: number, text: string) {
    onChange(citations.map((c) => (c.id === id ? { ...c, text } : c)));
  }

  function removeCitation(id: number) {
    onChange(citations.filter((c) => c.id !== id));
  }

  function handleInsert() {
    if (selectedSeg) {
      const latestId = citations.length > 0
        ? Math.max(...citations.map((c) => c.id))
        : 0;
      if (latestId > 0) {
        onInsert(selectedSeg, latestId);
      }
    }
  }

  return (
    <div className="citation-panel">
      <div className="panel-header">
        <h3>交叉引用管理</h3>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span>{enabled ? '已启用' : '已禁用'}</span>
        </label>
      </div>

      {enabled && (
        <div className="citation-body">
          <div className="citation-insert">
            <select
              value={selectedSeg}
              onChange={(e) => setSelectedSeg(e.target.value)}
            >
              <option value="">-- 选择插入位置 --</option>
              {segments.map((seg) => (
                <option key={seg.id} value={seg.id}>
                  [{seg.level}] {seg.text.slice(0, 40)}...
                </option>
              ))}
            </select>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleInsert}
              disabled={!selectedSeg || citations.length === 0}
            >
              插入引用
            </button>
          </div>

          <div className="citation-list">
            <div className="citation-list-header">
              <span>参考文献列表</span>
              <button className="btn btn-sm btn-outline" onClick={addCitation}>
                + 添加文献
              </button>
            </div>
            {citations.map((c) => (
              <div key={c.id} className="citation-item">
                <span className="citation-id">[{c.id}]</span>
                <input
                  type="text"
                  placeholder="作者. 标题. 期刊/出版社, 年份."
                  value={c.text}
                  onChange={(e) => updateCitation(c.id, e.target.value)}
                />
                <button
                  className="btn-icon btn-danger"
                  onClick={() => removeCitation(c.id)}
                  title="删除"
                >
                  ×
                </button>
              </div>
            ))}
            {citations.length === 0 && (
              <p className="hint">暂无引用文献，点击上方按钮添加</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
