import React from 'react';
import {
  Sun,
  Moon,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  BookOpen,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  Languages,
} from 'lucide-react';

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  theme,
  setTheme,
  currentPage,
  setCurrentPage,
  totalPages,
  zoom,
  setZoom,
  showGuides,
  setShowGuides,
  onExportPNG,
  onExportPDF,
  onPrint,
  onResetAll,
  lang = 'ru',
  onToggleLang,
  t = {},
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        {/* Sidebar Toggle Button */}
        <button
          className={`header-sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          title={sidebarOpen ? (t.sidebarToggleTitleHide || 'Скрыть боковую панель настроек (Ctrl+B)') : (t.sidebarToggleTitleShow || 'Показать боковую панель настроек (Ctrl+B)')}
          aria-label={sidebarOpen ? (t.sidebarToggleHide || 'Скрыть панель') : (t.sidebarToggleShow || 'Панель')}
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          <span className="sidebar-toggle-text">{sidebarOpen ? (t.sidebarToggleHide || 'Скрыть панель') : (t.sidebarToggleShow || 'Панель')}</span>
        </button>

        <div className="brand" title={lang === 'en' ? 'handnotes.app — handwritten notes studio' : 'handnotes.app — генератор рукописных конспектов'}>
          <div className="brand-icon handnotes-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="2.5" width="14" height="19" rx="3.5" fill="url(#hnGrad)" />
              <path d="M7 6.5h6M7 10.5h6M7 14.5h4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9"/>
              <path d="M15.5 13.5l4-4a1.8 1.8 0 0 0-2.5-2.5l-4 4v2.5h2.5z" fill="#38bdf8" stroke="#1e293b" strokeWidth="0.8"/>
              <defs>
                <linearGradient id="hnGrad" x1="3" y1="2.5" x2="17" y2="21.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">{t.brandTitle || 'handnotes'}<span className="brand-domain">{t.brandDomain || '.app'}</span></span>
            <span className="brand-badge">{t.brandBadge || 'STUDIO'}</span>
          </div>
        </div>

        {/* Page Switcher */}
        <div className="page-nav">
          <button
            className="nav-btn"
            disabled={currentPage <= 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            title={t.prevPage || 'Предыдущая страница'}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="page-indicator">
            {lang === 'en' ? 'Page ' : 'Стр. '}<strong>{currentPage + 1}</strong>{lang === 'en' ? ' of ' : ' из '}<strong>{Math.max(1, totalPages)}</strong>
          </span>
          <button
            className="nav-btn"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            title={t.nextPage || 'Следующая страница'}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="header-right">
        {/* Guides toggle */}
        <button
          className={`header-action-btn ${showGuides ? 'active' : ''}`}
          onClick={() => setShowGuides(!showGuides)}
          title={showGuides ? (t.guidesHide || 'Скрыть разметку') : (t.guidesShow || 'Показать направляющие линии')}
        >
          {showGuides ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="btn-label">{t.guidesBtn || 'Разметка'}</span>
        </button>

        {/* Zoom controls */}
        <div className="zoom-controls">
          <button
            className="icon-btn"
            onClick={() => setZoom((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}
            title={t.zoomOut || 'Уменьшить масштаб'}
          >
            <ZoomOut size={16} />
          </button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button
            className="icon-btn"
            onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
            title={t.zoomIn || 'Увеличить масштаб'}
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="icon-btn"
            onClick={() => setZoom(0.5)}
            title={t.zoomFit || 'Вписать в экран'}
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Language switcher button */}
        <button
          className="header-action-btn header-lang-btn"
          onClick={onToggleLang}
          title={t.langToggleTitle || 'Switch language / Переключить язык'}
          aria-label="Toggle language"
        >
          <Languages size={16} />
          <span className="lang-code-badge">{lang.toUpperCase()}</span>
        </button>

        {/* Reset settings button */}
        <button
          className="header-action-btn header-reset-btn"
          onClick={onResetAll}
          title={t.resetTitle || 'Сбросить все настройки к начальным значениям'}
        >
          <RotateCcw size={16} />
          <span className="btn-label">{t.resetBtn || 'Сброс'}</span>
        </button>

        {/* Theme switcher */}
        <button
          className="icon-btn theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? (t.themeLight || 'Переключить на светлую тему') : (t.themeDark || 'Переключить на тёмную тему')}
        >
          {theme === 'dark' ? <Sun size={18} className="sun-icon" /> : <Moon size={18} className="moon-icon" />}
        </button>

        {/* Quick export actions */}
        <div className="export-actions">
          <button className="primary-btn" onClick={onExportPNG} title={t.exportPngTitle || 'Скачать страницу как изображение'}>
            <Download size={16} />
            <span>{t.downloadPng || 'Скачать PNG'}</span>
          </button>
          <button className="secondary-btn" onClick={onExportPDF} title={t.exportPdfTitle || 'Сохранить весь конспект в PDF'}>
            <span>{t.downloadPdf || 'PDF'}</span>
          </button>
          <button className="icon-btn" onClick={onPrint} title={t.exportPrintTitle || 'Распечатать'}>
            <Printer size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
