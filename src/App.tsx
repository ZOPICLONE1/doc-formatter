import { useState, useCallback } from 'react';
import * as mammoth from 'mammoth';
import type {
  DocDirection, TemplateConfig, ContentSegment,
  Citation, HeadingLevel,
} from './types';
import { DEFAULT_TEMPLATES } from './constants';
import { parseHtmlToSegments, detectCitations } from './utils/formatEngine';
import { exportDocx } from './utils/docxGen';
import DirectionTabs from './components/DirectionTabs';
import UploadZone from './components/UploadZone';
import TemplatePanel from './components/TemplatePanel';
import CitationPanel from './components/CitationPanel';
import PreviewArea from './components/PreviewArea';
import './App.css';

export default function App() {
  const [direction, setDirection] = useState<DocDirection>('official');
  const [template, setTemplate] = useState<TemplateConfig>(DEFAULT_TEMPLATES.official);
  const [segments, setSegments] = useState<ContentSegment[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [citationEnabled, setCitationEnabled] = useState(false);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleDirectionChange = useCallback((d: DocDirection) => {
    setDirection(d);
    setTemplate(JSON.parse(JSON.stringify(DEFAULT_TEMPLATES[d])));
    if (d !== 'academic') {
      setCitationEnabled(false);
      setCitations([]);
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
      const parsed = parseHtmlToSegments(result.value);

      if (result.messages.length > 0) {
        console.warn('Mammoth parsing messages:', result.messages);
      }

      setSegments(parsed);

      const fullText = parsed.map((s) => s.text).join('\n');
      const detected = detectCitations(fullText);
      if (detected.length > 0) {
        setCitations(detected);
        setCitationEnabled(true);
      }
    } catch (err) {
      console.error('Failed to parse document:', err);
      alert('文档解析失败，请确认文件格式正确');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSegmentLevelChange = useCallback((segId: string, level: HeadingLevel) => {
    setSegments((prev) =>
      prev.map((s) => (s.id === segId ? { ...s, level } : s)),
    );
  }, []);

  const handleInsertCitation = useCallback((segId: string, citationId: number) => {
    setSegments((prev) =>
      prev.map((s) =>
        s.id === segId
          ? { ...s, text: s.text.replace(/\s*\[\d+\]\s*$/, '') + ` [${citationId}]` }
          : s,
      ),
    );

    setCitations((old) => {
      if (old.some((c) => c.id === citationId)) return old;
      return [...old, { id: citationId, text: '' }].sort((a, b) => a.id - b.id);
    });
  }, []);

  const handleExport = useCallback(async () => {
    if (segments.length === 0) {
      alert('没有可导出的内容');
      return;
    }
    setExporting(true);
    try {
      await exportDocx(segments, template, citations, citationEnabled, fileName || 'document.docx');
    } catch (err) {
      console.error('Export failed:', err);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  }, [segments, template, citations, citationEnabled, fileName]);

  const hasContent = segments.length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1>文档排版工具</h1>
        <p className="subtitle">支持公文、论文/课设、商业文档自动排版，一键导出规范格式</p>
        <DirectionTabs current={direction} onChange={handleDirectionChange} />
      </header>

      <main className="app-main">
        <aside className="sidebar">
          {!hasContent && !loading && (
            <UploadZone onFile={handleFile} disabled={false} />
          )}

          {(hasContent || loading) && (
            <>
              <div className="file-bar">
                <span className="file-name" title={fileName}>
                  {loading ? '解析中...' : fileName}
                </span>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setSegments([]);
                    setCitations([]);
                    setCitationEnabled(false);
                    setFileName('');
                  }}
                >
                  重新上传
                </button>
              </div>

              <TemplatePanel
                direction={direction}
                template={template}
                onChange={setTemplate}
              />

              {direction === 'academic' && (
                <CitationPanel
                  citations={citations}
                  segments={segments}
                  onChange={setCitations}
                  onInsert={handleInsertCitation}
                  enabled={citationEnabled}
                  onToggle={setCitationEnabled}
                />
              )}

              <div className="export-section">
                <button
                  className="btn btn-primary btn-export"
                  onClick={handleExport}
                  disabled={exporting || segments.length === 0}
                >
                  {exporting ? '导出中...' : '导出排版后的 Word 文档'}
                </button>
              </div>
            </>
          )}
        </aside>

        <section className="main-content">
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>正在解析文档...</p>
            </div>
          )}

          {!loading && hasContent && (
            <PreviewArea
              segments={segments}
              template={template}
              citations={citations}
              citationEnabled={citationEnabled}
              onSegmentLevelChange={handleSegmentLevelChange}
            />
          )}

          {!loading && !hasContent && (
            <div className="welcome-state">
              <div className="welcome-card">
                <h2>开始排版</h2>
                <div className="welcome-steps">
                  <div className="step">
                    <span className="step-num">1</span>
                    <div>
                      <strong>选择文档类型</strong>
                      <p>在上方切换公文、论文/课设或商业方向</p>
                    </div>
                  </div>
                  <div className="step">
                    <span className="step-num">2</span>
                    <div>
                      <strong>上传 Word 文档</strong>
                      <p>拖拽或点击左侧上传区域，导入 .docx 文件</p>
                    </div>
                  </div>
                  <div className="step">
                    <span className="step-num">3</span>
                    <div>
                      <strong>调整排版</strong>
                      <p>使用预设模板或自定义字体字号，点击段落可切换标题级别</p>
                    </div>
                  </div>
                  <div className="step">
                    <span className="step-num">4</span>
                    <div>
                      <strong>导出文档</strong>
                      <p>点击导出按钮下载排版完成的 Word 文档</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
