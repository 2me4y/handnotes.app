import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Image as ImageIcon,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Languages,
  CheckCircle,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import AdBanner from './AdBanner';
import { drawPaperBackground } from '../utils/paperEngine';
import { drawTextPage } from '../utils/textEngine';

export default function DownloadPage({
  onBackToEditor,
  config,
  textBlocksWithLayout,
  currentPage,
  setCurrentPage,
  totalPages,
  totalLines,
  loadedImage,
  onExportPNG,
  onExportJPG,
  onExportPDF,
  onPrint,
  theme,
  setTheme,
  lang = 'ru',
  onToggleLang,
  t = {},
}) {
  const [downloadPreviewZoom, setDownloadPreviewZoom] = useState(0.38);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const previewCanvasRef = useRef(null);

  // Render the current page onto the preview canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

    // 1. Draw paper
    drawPaperBackground(
      ctx,
      {
        width: config.canvasWidth,
        height: config.canvasHeight,
        preset: config.preset,
        photoBrightness: config.photoBrightness,
        photoContrast: config.photoContrast,
        photoSaturation: config.photoSaturation,
        photoRotation: config.photoRotation,
        photoScale: config.photoScale,
        photoOffsetX: config.photoOffsetX,
        photoOffsetY: config.photoOffsetY,
        photoFit: config.photoFit || 'contain',
        gridSize: config.gridSize,
        showMarginLine: config.showMarginLine,
        marginLineX: config.marginLineX,
      },
      loadedImage
    );

    // 2. Draw text blocks
    textBlocksWithLayout.forEach((block) => {
      const lines = block.pages?.[currentPage] || [];
      if (lines.length > 0) {
        drawTextPage(ctx, lines, { ...config, ...block }, currentPage);
      }
    });
  }, [config, textBlocksWithLayout, currentPage, loadedImage]);

  const handlePdfClick = async () => {
    setIsExportingPdf(true);
    try {
      await onExportPDF();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const isSpread = config.canvasWidth > config.canvasHeight * 1.15;

  return (
    <div className="download-page-container">
      {/* Top Navigation Bar */}
      <header className="download-page-header">
        <div className="download-header-left">
          <button
            className="back-to-editor-btn"
            onClick={onBackToEditor}
            title={t.backToEditorBtn || 'Вернуться к редактированию конспекта'}
          >
            <ArrowLeft size={18} />
            <span>{t.backToEditorBtn || 'Назад к редактору'}</span>
          </button>

          <div className="download-brand">
            <span className="brand-name">handnotes</span>
            <span className="brand-dot">.app</span>
            <span className="download-badge">EXPORT</span>
          </div>
        </div>

        <div className="download-header-right">
          {/* Language Switcher */}
          <button
            className="header-action-btn"
            onClick={onToggleLang}
            title={t.langToggleTitle || 'Switch language / Переключить язык'}
          >
            <Languages size={16} />
            <span className="lang-code-badge">{lang.toUpperCase()}</span>
          </button>

          {/* Theme Switcher */}
          <button
            className="icon-btn theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? (t.themeLight || 'Светлая тема') : (t.themeDark || 'Тёмная тема')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Download View with Left & Right Ad Slots */}
      <div className="download-page-body">
        {/* Left Side Ad Banner */}
        <aside className="download-ad-column download-ad-left">
          <div className="sticky-ad-box">
            <AdBanner
              slotId="ad-slot-download-left"
              format="vertical"
              lang={lang}
              t={t}
            />
          </div>
        </aside>

        {/* Central Content Area */}
        <main className="download-main-content">
          {/* Top Leaderboard Ad Slot */}
          <div className="download-top-ad">
            <AdBanner
              slotId="ad-slot-download-top"
              format="horizontal"
              lang={lang}
              t={t}
            />
          </div>

          {/* Document Summary Header */}
          <div className="download-title-section">
            <div className="title-icon-badge">
              <Sparkles size={22} />
            </div>
            <div className="title-text-group">
              <h2>{t.downloadPageTitle || 'Скачивание конспекта'}</h2>
              <p className="title-subtitle">
                {t.downloadPageSubtitle || 'Готовый рукописный конспект высокой чёткости для печати или сдачи преподавателю'}
              </p>
            </div>
          </div>

          {/* Document Properties Quick Pills */}
          <div className="doc-summary-pills">
            <div className="doc-pill">
              <span className="doc-pill-label">{t.docInfoPages || 'Страниц:'}</span>
              <span className="doc-pill-val">{totalPages}</span>
            </div>
            <div className="doc-pill">
              <span className="doc-pill-label">{t.docInfoLines || 'Строк:'}</span>
              <span className="doc-pill-val">{totalLines}</span>
            </div>
            <div className="doc-pill">
              <span className="doc-pill-label">{t.docInfoFormat || 'Формат:'}</span>
              <span className="doc-pill-val">{isSpread ? (lang === 'en' ? '2-Page Spread' : 'Разворот (2 листа)') : (lang === 'en' ? 'A4 Sheet' : '1 лист A4')}</span>
            </div>
            <div className="doc-pill">
              <span className="doc-pill-label">{t.docInfoFont || 'Шрифт:'}</span>
              <span className="doc-pill-val font-tag" style={{ fontFamily: config.fontFamily }}>
                {config.fontFamily}
              </span>
            </div>
            <div className="doc-pill guarantee">
              <CheckCircle size={14} />
              <span>{t.freeGuarantee || '100% Бесплатно • Без водяных знаков'}</span>
            </div>
          </div>

          {/* Interactive Page Preview Card */}
          <div className="download-preview-card">
            <div className="preview-toolbar">
              <div className="preview-pagination">
                <button
                  className="preview-page-btn"
                  disabled={currentPage <= 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  title={t.prevPage || 'Предыдущая страница'}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="preview-page-text">
                  {lang === 'en' ? `Page ${currentPage + 1} of ${totalPages}` : `Страница ${currentPage + 1} из ${totalPages}`}
                </span>
                <button
                  className="preview-page-btn"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  title={t.nextPage || 'Следующая страница'}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="preview-zoom-controls">
                <button
                  className="preview-zoom-btn"
                  onClick={() => setDownloadPreviewZoom((z) => Math.max(0.25, Number((z - 0.05).toFixed(2))))}
                  title={t.zoomOut || 'Уменьшить'}
                >
                  <ZoomOut size={15} />
                </button>
                <span className="preview-zoom-val">{Math.round(downloadPreviewZoom * 100)}%</span>
                <button
                  className="preview-zoom-btn"
                  onClick={() => setDownloadPreviewZoom((z) => Math.min(0.8, Number((z + 0.05).toFixed(2))))}
                  title={t.zoomIn || 'Увеличить'}
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  className="preview-zoom-btn"
                  onClick={() => setDownloadPreviewZoom(0.38)}
                  title={t.zoomFit || 'По умолчанию'}
                >
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>

            {/* Canvas Wrapper */}
            <div className="download-canvas-viewport">
              <div
                className="download-canvas-scaler"
                style={{
                  width: `${config.canvasWidth * downloadPreviewZoom}px`,
                  height: `${config.canvasHeight * downloadPreviewZoom}px`,
                }}
              >
                <canvas
                  ref={previewCanvasRef}
                  width={config.canvasWidth}
                  height={config.canvasHeight}
                  style={{
                    width: `${config.canvasWidth * downloadPreviewZoom}px`,
                    height: `${config.canvasHeight * downloadPreviewZoom}px`,
                    display: 'block',
                    borderRadius: '6px',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Download Cards Grid */}
          <div className="download-actions-grid">
            {/* Primary Action: Download All as Multi-Page PDF */}
            <div className="action-card primary-pdf" onClick={handlePdfClick}>
              <div className="card-top-row">
                <div className="card-icon-wrap primary">
                  <FileText size={26} />
                </div>
                <span className="card-badge-recommend">
                  {lang === 'en' ? '★ Recommended' : '★ Рекомендуется'}
                </span>
              </div>
              <div className="card-text">
                <h3>{t.downloadAllPdfBtn || 'Скачать весь конспект в PDF'}</h3>
                <p>
                  {t.downloadAllPdfDesc || `Все страницы (${totalPages}) в одном файле A4 формата для печати или отправки`}
                </p>
              </div>
              <button className="card-action-btn primary" disabled={isExportingPdf}>
                <Download size={18} />
                <span>
                  {isExportingPdf
                    ? (lang === 'en' ? 'Generating PDF...' : 'Формирование PDF...')
                    : (t.downloadAllPdfBtn || 'Скачать PDF')}
                </span>
              </button>
            </div>

            {/* Download Current Page as High-Res PNG */}
            <div className="action-card secondary-png" onClick={onExportPNG}>
              <div className="card-top-row">
                <div className="card-icon-wrap png">
                  <ImageIcon size={24} />
                </div>
                <span className="card-badge-format">PNG • 1400×1980</span>
              </div>
              <div className="card-text">
                <h3>{t.downloadCurrentPngBtn || 'Скачать страницу как PNG'}</h3>
                <p>
                  {t.downloadCurrentPngDesc || 'Сверхчёткое изображение без потерь качества'}
                </p>
              </div>
              <button className="card-action-btn secondary">
                <Download size={16} />
                <span>{t.downloadCurrentPngBtn || 'Скачать PNG'}</span>
              </button>
            </div>

            {/* Download Current Page as JPG */}
            <div className="action-card secondary-jpg" onClick={onExportJPG}>
              <div className="card-top-row">
                <div className="card-icon-wrap jpg">
                  <ImageIcon size={24} />
                </div>
                <span className="card-badge-format">JPG • 95%</span>
              </div>
              <div className="card-text">
                <h3>{t.downloadCurrentJpgBtn || 'Скачать страницу как JPG'}</h3>
                <p>
                  {t.downloadCurrentJpgDesc || 'Компактный размер для мессенджеров и соцсетей'}
                </p>
              </div>
              <button className="card-action-btn secondary">
                <Download size={16} />
                <span>{t.downloadCurrentJpgBtn || 'Скачать JPG'}</span>
              </button>
            </div>

            {/* Direct Print */}
            <div className="action-card secondary-print" onClick={onPrint}>
              <div className="card-top-row">
                <div className="card-icon-wrap print">
                  <Printer size={24} />
                </div>
                <span className="card-badge-format">Ctrl+P</span>
              </div>
              <div className="card-text">
                <h3>{t.printDirectBtn || 'Распечатать на принтере'}</h3>
                <p>
                  {t.printDirectDesc || 'Прямая печать через диалоговое окно браузера'}
                </p>
              </div>
              <button className="card-action-btn secondary">
                <Printer size={16} />
                <span>{t.printDirectBtn || 'Печать'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Ad Banner */}
          <div className="download-bottom-ad">
            <AdBanner
              slotId="ad-slot-download-bottom"
              format="horizontal"
              lang={lang}
              t={t}
            />
          </div>

          {/* Return to Editor Link */}
          <div className="download-return-bar">
            <button className="return-editor-link-btn" onClick={onBackToEditor}>
              <ArrowLeft size={16} />
              <span>{t.backToEditorBtn || 'Вернуться к редактированию конспекта'}</span>
            </button>
          </div>
        </main>

        {/* Right Side Ad Banner */}
        <aside className="download-ad-column download-ad-right">
          <div className="sticky-ad-box">
            <AdBanner
              slotId="ad-slot-download-right"
              format="vertical"
              lang={lang}
              t={t}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
