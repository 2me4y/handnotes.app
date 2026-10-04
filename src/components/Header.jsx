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
}) {
  return (
    <header className="app-header">
      <div className="header-left">
        {/* Sidebar Toggle Button */}
        <button
          className={`header-sidebar-toggle ${sidebarOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Скрыть боковую панель настроек (Ctrl+B)' : 'Показать боковую панель настроек (Ctrl+B)'}
          aria-label={sidebarOpen ? 'Скрыть боковую панель' : 'Показать боковую панель'}
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          <span className="sidebar-toggle-text">{sidebarOpen ? 'Скрыть панель' : 'Панель'}</span>
        </button>

        <div className="brand">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Конспектограф</span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        {/* Page Switcher */}
        <div className="page-nav">
          <button
            className="nav-btn"
            disabled={currentPage <= 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            title="Предыдущая страница"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="page-indicator">
            Стр. <strong>{currentPage + 1}</strong> из <strong>{Math.max(1, totalPages)}</strong>
          </span>
          <button
            className="nav-btn"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            title="Следующая страница"
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
          title={showGuides ? 'Скрыть разметку' : 'Показать направляющие линии'}
        >
          {showGuides ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="btn-label">Разметка</span>
        </button>

        {/* Zoom controls */}
        <div className="zoom-controls">
          <button
            className="icon-btn"
            onClick={() => setZoom((z) => Math.max(0.25, Number((z - 0.1).toFixed(2))))}
            title="Уменьшить масштаб"
          >
            <ZoomOut size={16} />
          </button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button
            className="icon-btn"
            onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
            title="Увеличить масштаб"
          >
            <ZoomIn size={16} />
          </button>
          <button
            className="icon-btn"
            onClick={() => setZoom(0.5)}
            title="Вписать в экран"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Reset settings button */}
        <button
          className="header-action-btn header-reset-btn"
          onClick={onResetAll}
          title="Сбросить все настройки к начальным значениям"
        >
          <RotateCcw size={16} />
          <span className="btn-label">Сброс</span>
        </button>

        {/* Theme switcher */}
        <button
          className="icon-btn theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
        >
          {theme === 'dark' ? <Sun size={18} className="sun-icon" /> : <Moon size={18} className="moon-icon" />}
        </button>

        {/* Quick export actions */}
        <div className="export-actions">
          <button className="primary-btn" onClick={onExportPNG} title="Скачать страницу как изображение">
            <Download size={16} />
            <span>Скачать PNG</span>
          </button>
          <button className="secondary-btn" onClick={onExportPDF} title="Сохранить весь конспект в PDF">
            <span>PDF</span>
          </button>
          <button className="icon-btn" onClick={onPrint} title="Распечатать">
            <Printer size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
