import React, { useState, useRef } from 'react';
import {
  FileText,
  Type,
  Image as ImageIcon,
  Sliders,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Check,
  Trash2,
  FolderUp,
  Maximize2,
  Move,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bookmark,
  Plus,
  Copy,
  Save,
  PanelLeftClose,
  ChevronRight,
} from 'lucide-react';
import { DEFAULT_FONTS, INK_COLORS, SAMPLE_TEXTS } from '../utils/constants';
import { PAPER_PRESETS } from '../utils/paperEngine';
import { BUILTIN_PRESETS } from '../utils/presetManager';

export default function Sidebar({
  isOpen = true,
  onToggleSidebar,
  text,
  setText,
  config,
  setConfig,
  textBlocks,
  activeBlockId,
  onSelectBlock,
  onAddBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onRenameBlock,
  userPresets,
  onSavePreset,
  onApplyPreset,
  onDeletePreset,
  onExportPreset,
  onImportPreset,
  userFonts,
  onUploadFont,
  onRemoveUserFont,
  customImage,
  onUploadPhoto,
  onRemovePhoto,
  onResetPhotoAdjustments,
  onSetPageFormat,
  onExportPNG,
  onExportJPG,
  onExportPDF,
  onPrint,
  onResetAll,
  totalPages,
  totalLines,
}) {
  const [activeTab, setActiveTab] = useState('text');
  const [newPresetName, setNewPresetName] = useState('');
  const [presetSaveSuccess, setPresetSaveSuccess] = useState(false);
  const [appliedPresetId, setAppliedPresetId] = useState(null);
  const [appliedMode, setAppliedMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingBlockNameId, setEditingBlockNameId] = useState(null);
  const [tempBlockName, setTempBlockName] = useState('');

  const fontInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const presetFileInputRef = useRef(null);

  const activeBlock = (textBlocks && textBlocks.find((b) => b.id === activeBlockId)) || textBlocks?.[0];

  const updateConfig = (key, val) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleFontFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFont(file);
      e.target.value = '';
    }
  };

  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadPhoto(file);
      e.target.value = '';
    }
  };

  return (
    <aside className={`app-sidebar ${!isOpen ? 'collapsed' : ''}`}>
      {/* Tab navigation bar */}
      <nav className="sidebar-tabs">
        <button
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <FileText size={18} />
          <span>Текст</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'font' ? 'active' : ''}`}
          onClick={() => setActiveTab('font')}
        >
          <Type size={18} />
          <span>Шрифт</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'paper' ? 'active' : ''}`}
          onClick={() => setActiveTab('paper')}
        >
          <ImageIcon size={18} />
          <span>Тетрадь</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          <Sliders size={18} />
          <span>Поля</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
          title="Сохранённые и готовые пресеты настроек"
        >
          <Bookmark size={18} />
          <span>Пресеты</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          <Download size={18} />
          <span>Экспорт</span>
        </button>
        <button
          className="sidebar-hide-btn"
          onClick={onToggleSidebar}
          title="Скрыть боковую панель (Ctrl+B)"
        >
          <PanelLeftClose size={16} />
        </button>
      </nav>

      {/* Tab contents */}
      <div className="tab-content">
        {/* ==================== 1. TAB: TEXT ==================== */}
        {activeTab === 'text' && (
          <div className="tab-pane">
            {/* Multi-Block Management Card */}
            <div className="blocks-manager-card">
              <div className="blocks-manager-header">
                <div className="blocks-header-title">
                  <Layers size={16} />
                  <span>Блоки текста ({textBlocks?.length || 1})</span>
                </div>
                <button
                  className="add-block-btn"
                  onClick={onAddBlock}
                  title="Добавить новый блок текста снизу или в произвольное место"
                >
                  <Plus size={14} />
                  <span>+ Новый блок</span>
                </button>
              </div>

              {/* Block Selection Chips */}
              <div className="blocks-chips-row">
                {textBlocks && textBlocks.map((block, idx) => (
                  <div
                    key={block.id}
                    className={`block-chip ${block.id === activeBlockId ? 'active' : ''}`}
                    onClick={() => onSelectBlock && onSelectBlock(block.id)}
                    title={`Редактировать "${block.name || `Блок ${idx + 1}`}"`}
                  >
                    <span className="block-chip-name">{block.name || `Блок ${idx + 1}`}</span>
                    {textBlocks.length > 1 && (
                      <button
                        className="block-chip-del-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Удалить "${block.name || 'этот блок'}"?`)) {
                            onDeleteBlock && onDeleteBlock(block.id);
                          }
                        }}
                        title="Удалить этот блок"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Active Block Control Bar */}
              {activeBlock && (
                <div className="active-block-bar">
                  <div className="active-block-name-wrap">
                    <span className="active-block-label">Редактируется:</span>
                    {editingBlockNameId === activeBlock.id ? (
                      <input
                        type="text"
                        className="block-rename-input"
                        value={tempBlockName}
                        autoFocus
                        onChange={(e) => setTempBlockName(e.target.value)}
                        onBlur={() => {
                          if (tempBlockName.trim()) {
                            onRenameBlock && onRenameBlock(activeBlock.id, tempBlockName.trim());
                          }
                          setEditingBlockNameId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (tempBlockName.trim()) {
                              onRenameBlock && onRenameBlock(activeBlock.id, tempBlockName.trim());
                            }
                            setEditingBlockNameId(null);
                          }
                        }}
                      />
                    ) : (
                      <span
                        className="active-block-title"
                        onClick={() => {
                          setEditingBlockNameId(activeBlock.id);
                          setTempBlockName(activeBlock.name || '');
                        }}
                        title="Нажмите, чтобы переименовать этот блок"
                      >
                        <strong>{activeBlock.name || 'Блок'}</strong>
                        <span className="tiny-edit-hint">✎</span>
                      </span>
                    )}
                  </div>

                  <div className="active-block-actions">
                    <button
                      className="tiny-action-btn"
                      onClick={() => onDuplicateBlock && onDuplicateBlock(activeBlock.id)}
                      title="Дублировать этот блок текста"
                    >
                      <Copy size={13} />
                      <span>Копия</span>
                    </button>
                    {textBlocks && textBlocks.length > 1 && (
                      <button
                        className="tiny-action-btn danger"
                        onClick={() => {
                          if (window.confirm(`Удалить "${activeBlock.name || 'этот блок'}"?`)) {
                            onDeleteBlock && onDeleteBlock(activeBlock.id);
                          }
                        }}
                        title="Удалить этот блок текста"
                      >
                        <Trash2 size={13} />
                        <span>Удалить</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pane-header">
              <h3>Текст конспекта</h3>
              <div className="sample-presets">
                <span className="preset-label">Примеры:</span>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.algebra)}
                  title="Школьная алгебра (квадратные уравнения)"
                >
                  Алгебра
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.russian)}
                  title="Русский язык (упражнение)"
                >
                  Русский
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.physics)}
                  title="Физика (термодинамика)"
                >
                  Физика
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.chemistry)}
                  title="Органическая химия"
                >
                  Химия
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.biology)}
                  title="Биология (клетка)"
                >
                  Биология
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.history)}
                  title="История (географические открытия)"
                >
                  История
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.programming)}
                  title="IT и структуры данных"
                >
                  IT
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.english)}
                  title="Английский язык"
                >
                  English
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.lab_work)}
                  title="Лабораторная работа"
                >
                  Лаб. работа
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.bujo)}
                  title="Bullet Journal планер"
                >
                  Планер
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(SAMPLE_TEXTS.cursive_copybook)}
                  title="Прописи"
                >
                  Прописи
                </button>
              </div>
            </div>

            <textarea
              className="text-input-area"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите или вставьте сюда текст вашей лекции или конспекта..."
              rows={14}
            />

            {/* Quick Link to Built-in Notebook Templates */}
            <div
              className="template-shortcut-card"
              onClick={() => setActiveTab('presets')}
              title="Перейти к полной коллекции готовых шаблонов тетрадей"
            >
              <div className="shortcut-info">
                <Sparkles size={16} className="shortcut-sparkle" />
                <div>
                  <span className="shortcut-title">Готовые шаблоны тетрадей ({BUILTIN_PRESETS.length})</span>
                  <span className="shortcut-sub">Школа, университет, формулы, линейка, прописи, планер</span>
                </div>
              </div>
              <ChevronRight size={16} />
            </div>

            <div className="text-stats">
              <div className="stat-item">
                Символов: <strong>{text.length}</strong>
              </div>
              <div className="stat-item">
                Слов: <strong>{text.trim() ? text.trim().split(/\s+/).length : 0}</strong>
              </div>
              <div className="stat-item">
                Строк: <strong>{totalLines}</strong>
              </div>
              <div className="stat-item">
                Страниц: <strong>{Math.max(1, totalPages)}</strong>
              </div>
            </div>

            <div className="pane-footer">
              <button
                className="secondary-btn"
                onClick={() => setText('')}
                disabled={!text}
              >
                <Trash2 size={16} />
                <span>Очистить текст</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 2. TAB: FONT & HANDWRITING ==================== */}
        {activeTab === 'font' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>Почерк и шрифт</h3>
            </div>

            {/* Upload Custom Font */}
            <div className="control-group custom-font-box">
              <div className="group-title-row">
                <label className="group-label">Свой рукописный шрифт</label>
                <span className="badge-small">.ttf, .otf, .woff</span>
              </div>
              <input
                type="file"
                ref={fontInputRef}
                accept=".ttf,.otf,.woff,.woff2"
                style={{ display: 'none' }}
                onChange={handleFontFile}
              />
              <button
                className="upload-box-btn"
                onClick={() => fontInputRef.current?.click()}
              >
                <FolderUp size={18} />
                <span>Загрузить свой шрифт с компьютера</span>
              </button>

              {userFonts.length > 0 && (
                <div className="user-fonts-list">
                  {userFonts.map((uf) => (
                    <div
                      key={uf.id}
                      className={`user-font-item ${
                        config.fontFamily === uf.id ? 'selected' : ''
                      }`}
                      onClick={() => updateConfig('fontFamily', uf.id)}
                    >
                      <span
                        className="user-font-name"
                        style={{ fontFamily: uf.id }}
                      >
                        {uf.name} (Загружен)
                      </span>
                      <button
                        className="delete-font-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveUserFont(uf.id);
                        }}
                        title="Удалить шрифт"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Built-in Fonts */}
            <div className="control-group">
              <label className="group-label">Базовые рукописные шрифты</label>
              <div className="font-grid">
                {DEFAULT_FONTS.map((f) => (
                  <div
                    key={f.id}
                    className={`font-card ${
                      config.fontFamily === f.id ? 'active' : ''
                    }`}
                    onClick={() => updateConfig('fontFamily', f.id)}
                  >
                    <span
                      className="font-preview"
                      style={{ fontFamily: f.id }}
                    >
                      Конспект лекции
                    </span>
                    <span className="font-title">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sliders: Size, Slant, LineHeight, LetterSpacing */}
            <div className="control-card">
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Размер шрифта</span>
                  <span className="slider-val">{config.fontSize} px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="1"
                  value={config.fontSize}
                  onChange={(e) => updateConfig('fontSize', Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Наклон почерка</span>
                  <span className="slider-val">
                    {config.slantAngle > 0 ? `+${config.slantAngle}°` : `${config.slantAngle}°`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-25"
                  max="35"
                  step="1"
                  value={config.slantAngle}
                  onChange={(e) => updateConfig('slantAngle', Number(e.target.value))}
                />
                <div className="slider-hints">
                  <span>← Влево</span>
                  <button
                    className="tiny-link-btn"
                    onClick={() => updateConfig('slantAngle', 0)}
                  >
                    Прямо (0°)
                  </button>
                  <span>Вправо →</span>
                </div>
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Межстрочный интервал</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      min="15"
                      max="200"
                      value={config.lineHeight}
                      onChange={(e) => updateConfig('lineHeight', Math.max(15, Number(e.target.value) || 20))}
                      style={{
                        width: '54px',
                        padding: '2px 4px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '4px',
                        color: 'inherit',
                        fontSize: '13px',
                        textAlign: 'right'
                      }}
                    />
                    <span className="slider-val" style={{ margin: 0 }}>px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="1"
                  value={config.lineHeight}
                  onChange={(e) => updateConfig('lineHeight', Number(e.target.value))}
                />
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('lineHeight', 20)}
                  >
                    20 px (Мин)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('lineHeight', 35)}
                  >
                    35 px (1 кл.)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('lineHeight', 70)}
                  >
                    70 px (2 кл.)
                  </button>
                </div>
                <span className="slider-subtext">
                  Совет: 20 px — плотные строки, 35 px — 1 клетка, 70 px — 2 клетки
                </span>
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Межбуквенный интервал</span>
                  <span className="slider-val">{config.letterSpacing} px</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="8"
                  step="0.5"
                  value={config.letterSpacing}
                  onChange={(e) => updateConfig('letterSpacing', Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Толщина ручки / Жирность</span>
                  <span className="slider-val">{config.fontWeight}</span>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${config.fontWeight === '400' ? 'active' : ''}`}
                    onClick={() => updateConfig('fontWeight', '400')}
                  >
                    Обычная
                  </button>
                  <button
                    className={`segment-btn ${config.fontWeight === '500' ? 'active' : ''}`}
                    onClick={() => updateConfig('fontWeight', '500')}
                  >
                    Средняя
                  </button>
                  <button
                    className={`segment-btn ${config.fontWeight === '700' ? 'active' : ''}`}
                    onClick={() => updateConfig('fontWeight', '700')}
                  >
                    Жирная
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Perspective & Spatial Tilt (Трапеция и поворот для фото под углом) */}
            <div className="control-card highlight-card">
              <div className="group-title-row">
                <label className="group-label with-icon">
                  <Maximize2 size={15} /> 3D Перспектива и ракурс (Трапеция)
                </label>
                {(config.perspectiveY !== 0 || config.perspectiveX !== 0 || config.textRotation !== 0 || config.lineSlope !== 0) && (
                  <button
                    className="tiny-link-btn"
                    onClick={() => {
                      updateConfig('perspectiveY', 0);
                      updateConfig('perspectiveX', 0);
                      updateConfig('textRotation', 0);
                      updateConfig('lineSlope', 0);
                    }}
                  >
                    <RotateCcw size={12} /> Сбросить 3D
                  </button>
                )}
              </div>

              {/* Perspective Y: Trapezoid top narrower / bottom wider */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Трапеция (Верх уже / Низ шире)</span>
                  <span className="slider-val">
                    {config.perspectiveY > 0 ? `+${config.perspectiveY}%` : `${config.perspectiveY || 0}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  step="2"
                  value={config.perspectiveY || 0}
                  onChange={(e) => updateConfig('perspectiveY', Number(e.target.value))}
                />
                <span className="slider-subtext">
                  Верх текста сужается, а низ расширяется для соответствия фото тетради на столе
                </span>
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('perspectiveY', 0)}
                  >
                    Прямо (0%)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('perspectiveY', 20)}
                  >
                    Умеренный (+20%)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('perspectiveY', 35)}
                  >
                    Стол (+35%)
                  </button>
                </div>
              </div>

              {/* Text Block Rotation */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Поворот текста (по строкам фото)</span>
                  <span className="slider-val">
                    {config.textRotation > 0 ? `+${config.textRotation}°` : `${config.textRotation || 0}°`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={config.textRotation || 0}
                  onChange={(e) => updateConfig('textRotation', Number(e.target.value))}
                />
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('textRotation', -3)}
                  >
                    -3°
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('textRotation', 0)}
                  >
                    0°
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('textRotation', 3)}
                  >
                    +3°
                  </button>
                </div>
              </div>

              {/* Line Slope / Skew Y */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Наклон строк вверх / вниз</span>
                  <span className="slider-val">{config.lineSlope || 0}°</span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="0.5"
                  value={config.lineSlope || 0}
                  onChange={(e) => updateConfig('lineSlope', Number(e.target.value))}
                />
              </div>

              {/* Perspective X: side view */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Боковая перспектива (Сдвиг)</span>
                  <span className="slider-val">{config.perspectiveX || 0}%</span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="2"
                  value={config.perspectiveX || 0}
                  onChange={(e) => updateConfig('perspectiveX', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Sheet Curvature & Bulge (Бугорки, овал и прогиб строк) */}
            <div className="control-card highlight-card">
              <div className="group-title-row">
                <label className="group-label with-icon">
                  <span>🌊</span> Искривление листа и бугорки (Неровная бумага)
                </label>
                {(config.pageBulge !== 0 || config.bulgeCenterX !== 0 || config.ovalCurvature !== 0) && (
                  <button
                    className="tiny-link-btn"
                    onClick={() => {
                      updateConfig('pageBulge', 0);
                      updateConfig('bulgeCenterX', 0);
                      updateConfig('ovalCurvature', 0);
                    }}
                  >
                    <RotateCcw size={12} /> Выпрямить
                  </button>
                )}
              </div>

              {/* Page Bulge: vertical arc */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Бугорок / Прогиб строк (Дуга)</span>
                  <span className="slider-val">
                    {config.pageBulge > 0 ? `+${config.pageBulge} px` : `${config.pageBulge || 0} px`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  step="2"
                  value={config.pageBulge || 0}
                  onChange={(e) => updateConfig('pageBulge', Number(e.target.value))}
                />
                <span className="slider-subtext">
                  Выгибает строки дугой: вверх (бугорок на столе) или вниз (прогиб листа)
                </span>
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', 0)}
                  >
                    Прямо (0)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', 20)}
                  >
                    Бугорок (+20px)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', 35)}
                  >
                    Выпуклый (+35px)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', -20)}
                  >
                    Прогиб (-20px)
                  </button>
                </div>
              </div>

              {/* Bulge Apex Shift: Notebook spine */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Смещение вершины изгиба (Корешок)</span>
                  <span className="slider-val">{config.bulgeCenterX || 0}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={config.bulgeCenterX || 0}
                  onChange={(e) => updateConfig('bulgeCenterX', Number(e.target.value))}
                />
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('bulgeCenterX', -30)}
                  >
                    ← Корешок слева (-30%)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('bulgeCenterX', 0)}
                  >
                    Центр (0%)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('bulgeCenterX', 30)}
                  >
                    Справа (+30%) →
                  </button>
                </div>
              </div>

              {/* Oval Curvature (Barrel distortion) */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Овал страницы (Бочка)</span>
                  <span className="slider-val">{config.ovalCurvature || 0}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={config.ovalCurvature || 0}
                  onChange={(e) => updateConfig('ovalCurvature', Number(e.target.value))}
                />
                <span className="slider-subtext">
                  Широкие строки в середине страницы и сужение к краям (овальный контур)
                </span>
              </div>
            </div>

            {/* Ink color & realism */}
            <div className="control-card">
              <label className="group-label">Цвет чернил ручки</label>
              <div className="color-palette">
                {INK_COLORS.map((col) => (
                  <button
                    key={col.id}
                    className={`color-chip ${config.inkColor === col.value ? 'selected' : ''}`}
                    style={{ backgroundColor: col.value }}
                    onClick={() => updateConfig('inkColor', col.value)}
                    title={col.name}
                  >
                    {config.inkColor === col.value && <Check size={14} color="#fff" />}
                  </button>
                ))}
                <label className="custom-color-picker" title="Выбрать свой цвет">
                  <input
                    type="color"
                    value={config.inkColor}
                    onChange={(e) => updateConfig('inkColor', e.target.value)}
                  />
                  <span>🎨</span>
                </label>
              </div>

              <div className="slider-row" style={{ marginTop: '16px' }}>
                <div className="slider-label-wrap">
                  <span>Плотность нажима чернил</span>
                  <span className="slider-val">{Math.round(config.inkOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.0"
                  step="0.02"
                  value={config.inkOpacity}
                  onChange={(e) => updateConfig('inkOpacity', Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span className="with-icon">
                    <Sparkles size={16} className="sparkle-icon" /> Живой почерк (неровности)
                  </span>
                  <span className="slider-val">{Math.round(config.jitterIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.05"
                  value={config.jitterIntensity}
                  onChange={(e) => updateConfig('jitterIntensity', Number(e.target.value))}
                />
                <span className="slider-subtext">
                  Имитирует дрожание руки, живую вариацию угла букв и высоты строк
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. TAB: NOTEBOOK & PHOTO ==================== */}
        {activeTab === 'paper' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>Фон и фото тетради</h3>
            </div>

            {/* Custom Photo Upload */}
            <div className="control-group upload-section">
              <label className="group-label">Своё фото тетради</label>
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoFile}
              />

              {customImage ? (
                <div className="loaded-photo-card">
                  <div className="photo-thumb-wrap">
                    <img src={customImage} alt="Uploaded notebook" className="photo-thumb" />
                    <span className="photo-badge">Ваше фото активно</span>
                  </div>
                  <div className="photo-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      <span>Заменить</span>
                    </button>
                    <button
                      className="danger-btn"
                      onClick={onRemovePhoto}
                      title="Удалить фото и вернуться к пресетам"
                    >
                      <Trash2 size={14} />
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="dropzone-box"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Upload size={28} />
                  <p className="drop-title">Нажмите или перетащите фото сюда</p>
                  <p className="drop-sub">JPG, PNG, WebP (фото настоящего тетрадного листа)</p>
                </div>
              )}
            </div>

            {/* Page Format (1 sheet vs 2-page spread) */}
            <div className="control-group">
              <label className="group-label">Формат тетради</label>
              <div className="segmented-control">
                <button
                  className={`segment-btn ${config.pageFormat === 'portrait' ? 'active' : ''}`}
                  onClick={() => onSetPageFormat && onSetPageFormat('portrait')}
                  title="Один вертикальный лист (1400×1980)"
                >
                  📄 1 лист
                </button>
                <button
                  className={`segment-btn ${config.pageFormat === 'spread' ? 'active' : ''}`}
                  onClick={() => onSetPageFormat && onSetPageFormat('spread')}
                  title="Разворот на 2 страницы (2400×1600)"
                >
                  📖 2 листа (Разворот)
                </button>
                {customImage && (
                  <button
                    className={`segment-btn ${config.pageFormat === 'auto' ? 'active' : ''}`}
                    onClick={() => onSetPageFormat && onSetPageFormat('auto')}
                    title="Адаптировать холст под пропорции загруженного фото без обрезки"
                  >
                    📷 По фото (100%)
                  </button>
                )}
              </div>
            </div>

            {/* Photo Fit Mode (for uploaded photo) */}
            {customImage && (
              <div className="control-group">
                <div className="group-title-row">
                  <label className="group-label">Отображение фото</label>
                  <button
                    className="tiny-link-btn"
                    onClick={() => onSetPageFormat && onSetPageFormat('auto')}
                  >
                    Подогнать холст под фото
                  </button>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${config.photoFit === 'contain' ? 'active' : ''}`}
                    onClick={() => updateConfig('photoFit', 'contain')}
                    title="Вписать фото полностью — ни один край не будет обрезан"
                  >
                    Вписать целиком (100% без обрезки)
                  </button>
                  <button
                    className={`segment-btn ${config.photoFit === 'cover' ? 'active' : ''}`}
                    onClick={() => updateConfig('photoFit', 'cover')}
                    title="Заполнить холст целиком"
                  >
                    Заполнить холст (Cover)
                  </button>
                </div>
              </div>
            )}

            {/* Paper Presets (Active if no custom photo or as reference) */}
            {!customImage && (
              <div className="control-group">
                <label className="group-label">Встроенные тетрадные листы ({PAPER_PRESETS.length})</label>
                <div className="preset-grid">
                  {PAPER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      className={`preset-card ${config.preset === preset.id ? 'active' : ''}`}
                      onClick={() => updateConfig('preset', preset.id)}
                      title={preset.desc || preset.name}
                    >
                      <span className="preset-name">{preset.name}</span>
                      {preset.desc && <span className="preset-desc-hint">{preset.desc}</span>}
                    </button>
                  ))}
                </div>

                <div className="toggle-row" style={{ marginTop: '12px' }}>
                  <label className="toggle-label">Красная линия полей</label>
                  <input
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={config.showMarginLine}
                    onChange={(e) => updateConfig('showMarginLine', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {/* Photo & Paper Adjustments */}
            <div className="control-card">
              <div className="group-title-row">
                <label className="group-label">
                  {customImage ? 'Регулировка фото тетради' : 'Коррекция бумажного фона'}
                </label>
                <button
                  className="tiny-link-btn"
                  onClick={onResetPhotoAdjustments}
                >
                  <RotateCcw size={12} /> Сбросить
                </button>
              </div>

              {/* Brightness */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Яркость (отбеливание)</span>
                  <span className="slider-val">{config.photoBrightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  step="1"
                  value={config.photoBrightness}
                  onChange={(e) => updateConfig('photoBrightness', Number(e.target.value))}
                />
              </div>

              {/* Contrast */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Контраст</span>
                  <span className="slider-val">{config.photoContrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  step="1"
                  value={config.photoContrast}
                  onChange={(e) => updateConfig('photoContrast', Number(e.target.value))}
                />
              </div>

              {/* Saturation */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Насыщенность</span>
                  <span className="slider-val">{config.photoSaturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={config.photoSaturation}
                  onChange={(e) => updateConfig('photoSaturation', Number(e.target.value))}
                />
              </div>

              {/* Rotation */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Поворот фото (выравнивание)</span>
                  <span className="slider-val">{config.photoRotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={config.photoRotation}
                  onChange={(e) => updateConfig('photoRotation', Number(e.target.value))}
                />
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('photoRotation', ((config.photoRotation - 90 + 180) % 360) - 180)}
                  >
                    -90°
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('photoRotation', 0)}
                  >
                    0°
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('photoRotation', ((config.photoRotation + 90 + 180) % 360) - 180)}
                  >
                    +90°
                  </button>
                </div>
              </div>

              {/* Scale / Zoom */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Масштаб фото (Зум)</span>
                  <span className="slider-val">{Math.round(config.photoScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={config.photoScale}
                  onChange={(e) => updateConfig('photoScale', Number(e.target.value))}
                />
              </div>

              {/* Pan X and Y */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Смещение по горизонтали (X)</span>
                  <span className="slider-val">{config.photoOffsetX} px</span>
                </div>
                <input
                  type="range"
                  min="-400"
                  max="400"
                  step="5"
                  value={config.photoOffsetX}
                  onChange={(e) => updateConfig('photoOffsetX', Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Смещение по вертикали (Y)</span>
                  <span className="slider-val">{config.photoOffsetY} px</span>
                </div>
                <input
                  type="range"
                  min="-500"
                  max="500"
                  step="5"
                  value={config.photoOffsetY}
                  onChange={(e) => updateConfig('photoOffsetY', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. TAB: MARGINS & LAYOUT ==================== */}
        {activeTab === 'layout' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>Поля и выравнивание</h3>
            </div>

            <div className="control-card">
              <div className="drag-hint-box">
                <Move size={16} />
                <span>
                  <strong>Совет:</strong> Вы можете просто зажать и перетаскивать текст мышью прямо по листу тетради!
                </span>
              </div>

              {/* Text Alignment */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Выравнивание текста</span>
                  <span className="slider-val">
                    {(!config.textAlign || config.textAlign === 'left') && 'По левому краю'}
                    {config.textAlign === 'center' && 'По центру'}
                    {config.textAlign === 'right' && 'По правому краю'}
                    {config.textAlign === 'justify' && 'По ширине'}
                  </span>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${(!config.textAlign || config.textAlign === 'left') ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'left')}
                    title="По левому краю (стандартно для тетради)"
                  >
                    <AlignLeft size={14} />
                    <span>Влево</span>
                  </button>
                  <button
                    className={`segment-btn ${config.textAlign === 'center' ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'center')}
                    title="По центру"
                  >
                    <AlignCenter size={14} />
                    <span>Центр</span>
                  </button>
                  <button
                    className={`segment-btn ${config.textAlign === 'right' ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'right')}
                    title="По правому краю"
                  >
                    <AlignRight size={14} />
                    <span>Вправо</span>
                  </button>
                  <button
                    className={`segment-btn ${config.textAlign === 'justify' ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'justify')}
                    title="По ширине страницы"
                  >
                    <AlignJustify size={14} />
                    <span>По ширине</span>
                  </button>
                </div>
              </div>

              {/* Columns mode (1 or 2 pages) */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Колонки текста (Разворот)</span>
                  <span className="slider-val">{config.columnsCount === 2 ? '2 страницы' : '1 колонка'}</span>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${config.columnsCount !== 2 ? 'active' : ''}`}
                    onClick={() => updateConfig('columnsCount', 1)}
                  >
                    1 колонка
                  </button>
                  <button
                    className={`segment-btn ${config.columnsCount === 2 ? 'active' : ''}`}
                    onClick={() => updateConfig('columnsCount', 2)}
                  >
                    📖 2 колонки (Разворот)
                  </button>
                </div>
                <div className="quick-buttons-row" style={{ marginTop: '4px' }}>
                  <button
                    className="chip-btn"
                    onClick={() => {
                      updateConfig('columnsCount', 1);
                      updateConfig('marginLeft', Math.round(config.canvasWidth * 0.06));
                      updateConfig('marginRight', Math.round(config.canvasWidth / 2 + 50));
                    }}
                    title="Разместить текст только на левой странице"
                  >
                    ◀ Левый лист
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => {
                      updateConfig('columnsCount', 2);
                      updateConfig('marginLeft', Math.round(config.canvasWidth * 0.06));
                      updateConfig('marginRight', Math.round(config.canvasWidth * 0.06));
                    }}
                    title="Текст на оба листа разворота"
                  >
                    Оба листа
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => {
                      updateConfig('columnsCount', 1);
                      updateConfig('marginLeft', Math.round(config.canvasWidth / 2 + 50));
                      updateConfig('marginRight', Math.round(config.canvasWidth * 0.06));
                    }}
                    title="Разместить текст только на правой странице"
                  >
                    Правый лист ▶
                  </button>
                </div>
              </div>

              {config.columnsCount === 2 && (
                <div className="slider-row">
                  <div className="slider-label-wrap">
                    <span>Зазор между страницами (Корешок)</span>
                    <span className="slider-val">{config.columnGap || 100} px</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="250"
                    step="5"
                    value={config.columnGap || 100}
                    onChange={(e) => updateConfig('columnGap', Number(e.target.value))}
                  />
                </div>
              )}

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Отступ слева (X)</span>
                  <span className="slider-val">{config.marginLeft} px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="600"
                  step="5"
                  value={config.marginLeft}
                  onChange={(e) => updateConfig('marginLeft', Number(e.target.value))}
                />
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('marginLeft', 40)}
                  >
                    К левому краю (40px)
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('marginLeft', 290)}
                  >
                    Школьные поля (290px)
                  </button>
                </div>
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Отступ сверху (Margin Top)</span>
                  <span className="slider-val">{config.marginTop} px</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="5"
                  value={config.marginTop}
                  onChange={(e) => updateConfig('marginTop', Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Отступ справа (Margin Right)</span>
                  <span className="slider-val">{config.marginRight} px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="300"
                  step="5"
                  value={config.marginRight}
                  onChange={(e) => updateConfig('marginRight', Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Отступ снизу (Margin Bottom)</span>
                  <span className="slider-val">{config.marginBottom} px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="300"
                  step="5"
                  value={config.marginBottom}
                  onChange={(e) => updateConfig('marginBottom', Number(e.target.value))}
                />
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>Красная строка (Абзацный отступ)</span>
                  <span className="slider-val">{config.paragraphIndent} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={config.paragraphIndent}
                  onChange={(e) => updateConfig('paragraphIndent', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="preset-buttons-box">
              <span className="preset-label">Быстрые пресеты полей:</span>
              <div className="chip-row">
                <button
                  className="chip-btn"
                  onClick={() => {
                    setConfig((c) => ({
                      ...c,
                      marginLeft: 290,
                      marginTop: 140,
                      marginRight: 90,
                      marginBottom: 100,
                      paragraphIndent: 0,
                    }));
                  }}
                >
                  Стандартная школьная тетрадь
                </button>
                <button
                  className="chip-btn"
                  onClick={() => {
                    setConfig((c) => ({
                      ...c,
                      marginLeft: 120,
                      marginTop: 100,
                      marginRight: 100,
                      marginBottom: 100,
                      paragraphIndent: 0,
                    }));
                  }}
                >
                  Узкие поля (А4)
                </button>
              </div>
            </div>

            {/* Reset All Settings Box */}
            <div className="sidebar-reset-box">
              <button
                className="secondary-btn w-full reset-all-btn"
                onClick={onResetAll}
                title="Сбросить все настройки текста, полей и наклона к начальным"
              >
                <RotateCcw size={16} />
                <span>Сбросить все настройки по умолчанию</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 5. TAB: PRESETS (СОХРАНЕНИЕ И ЗАГРУЗКА ПРЕСЕТОВ) ==================== */}
        {activeTab === 'presets' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>Пресеты настроек</h3>
            </div>

            {/* 1. Save Current Preset */}
            <div className="control-card save-preset-card">
              <label className="group-label">Сохранить текущие настройки как пресет</label>
              <p className="slider-subtext" style={{ marginBottom: '12px' }}>
                Сохраните текущий шрифт, межстрочный интервал, цвет чернил, поля и 3D-наклон. В будущем вы сможете применить этот стиль в 1 клик!
              </p>

              <div className="save-preset-form">
                <input
                  type="text"
                  className="preset-name-input"
                  placeholder="Название пресета (например: Мой конспект)..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newPresetName.trim()) {
                      onSavePreset && onSavePreset(newPresetName.trim());
                      setNewPresetName('');
                      setPresetSaveSuccess(true);
                      setTimeout(() => setPresetSaveSuccess(false), 2500);
                    }
                  }}
                />
                <button
                  className="primary-btn save-preset-btn"
                  onClick={() => {
                    if (newPresetName.trim()) {
                      onSavePreset && onSavePreset(newPresetName.trim());
                      setNewPresetName('');
                      setPresetSaveSuccess(true);
                      setTimeout(() => setPresetSaveSuccess(false), 2500);
                    } else {
                      alert('Пожалуйста, введите название пресета');
                    }
                  }}
                >
                  <Save size={15} />
                  <span>Сохранить пресет</span>
                </button>
              </div>

              {presetSaveSuccess && (
                <div className="preset-save-toast">
                  <Check size={15} />
                  <span>Пресет успешно сохранён! Теперь он доступен в списке ниже.</span>
                </div>
              )}
            </div>

            {/* 2. User Saved Presets List */}
            <div className="control-card">
              <div className="slider-label-wrap" style={{ marginBottom: '10px' }}>
                <span className="group-label" style={{ margin: 0 }}>
                  Мои сохранённые пресеты ({userPresets?.length || 0})
                </span>
                <div>
                  <input
                    type="file"
                    ref={presetFileInputRef}
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onImportPreset) {
                        onImportPreset(file);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    className="tiny-link-btn"
                    onClick={() => presetFileInputRef.current?.click()}
                    title="Загрузить пресет из файла .json"
                  >
                    <FolderUp size={13} />
                    <span>Импорт .json</span>
                  </button>
                </div>
              </div>

              {(!userPresets || userPresets.length === 0) ? (
                <div className="empty-presets-box">
                  <Bookmark size={26} className="empty-icon" />
                  <p className="empty-title">У вас пока нет сохранённых пресетов</p>
                  <p className="empty-sub">
                    Настройте стиль листа и нажмите <strong>«Сохранить пресет»</strong> выше!
                  </p>
                </div>
              ) : (
                <div className="presets-list">
                  {userPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`preset-item-card ${appliedPresetId === preset.id ? 'applied' : ''}`}
                    >
                      <div className="preset-item-header">
                        <span className="preset-item-title">{preset.name}</span>
                        <span className="preset-item-date">{preset.createdAt}</span>
                      </div>

                      <div className="preset-tags-row">
                        <span className="preset-tag">Шрифт: {preset.config?.fontFamily || 'Caveat'}</span>
                        <span className="preset-tag">Размер: {preset.config?.fontSize || 42}px</span>
                        <span className="preset-tag">Строки: {preset.config?.lineHeight || 70}px</span>
                        <span className="preset-tag">Поля: {preset.config?.marginLeft || 290}px</span>
                      </div>

                      <div className="preset-actions-row">
                        <button
                          className="chip-btn active"
                          onClick={() => {
                            onApplyPreset && onApplyPreset(preset);
                            setAppliedPresetId(preset.id);
                            setTimeout(() => setAppliedPresetId(null), 2000);
                          }}
                        >
                          {appliedPresetId === preset.id ? (
                            <>
                              <Check size={13} />
                              <span>Применён!</span>
                            </>
                          ) : (
                            <>
                              <Check size={13} />
                              <span>Применить</span>
                            </>
                          )}
                        </button>
                        <button
                          className="chip-btn"
                          onClick={() => onExportPreset && onExportPreset(preset)}
                          title="Скачать файл настроек (.json)"
                        >
                          <Download size={13} />
                          <span>Файл</span>
                        </button>
                        <button
                          className="chip-btn danger-hover"
                          onClick={() => {
                            if (window.confirm(`Удалить пресет "${preset.name}"?`)) {
                              onDeletePreset && onDeletePreset(preset.id);
                            }
                          }}
                          title="Удалить пресет"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Built-in Templates */}
            <div className="control-card">
              <div className="slider-label-wrap" style={{ marginBottom: '8px' }}>
                <label className="group-label" style={{ margin: 0 }}>
                  Готовые встроенные шаблоны ({BUILTIN_PRESETS.length})
                </label>
              </div>

              {/* Category Filter Chips */}
              <div className="category-filter-chips">
                {['all', 'Школа', 'Университет', 'Наука', 'Языки', 'Планер', '3D Эффект'].map((cat) => (
                  <button
                    key={cat}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'Все шаблоны' : cat}
                  </button>
                ))}
              </div>

              <div className="presets-list">
                {BUILTIN_PRESETS
                  .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
                  .map((preset) => (
                    <div key={preset.id} className="preset-item-card builtin">
                      <div className="preset-item-header">
                        <span className="preset-item-title">{preset.name}</span>
                        {preset.category && (
                          <span className="preset-cat-badge">{preset.category}</span>
                        )}
                      </div>
                      <p className="preset-item-desc">{preset.description}</p>

                      <div className="preset-tags-row">
                        <span className="preset-tag">Шрифт: {preset.config?.fontFamily || 'Caveat'}</span>
                        <span className="preset-tag">
                          Лист:{' '}
                          {preset.config?.preset === 'grid'
                            ? 'Клетка'
                            : preset.config?.preset === 'lined'
                            ? 'Линейка'
                            : preset.config?.preset === 'slanted'
                            ? 'Косая'
                            : preset.config?.preset === 'dots'
                            ? 'Точки'
                            : preset.config?.preset === 'vintage'
                            ? 'Крафт'
                            : 'Лист'}
                        </span>
                        <span className="preset-tag">Строка: {preset.config?.lineHeight || 70}px</span>
                      </div>

                      <div className="preset-actions-row">
                        <button
                          className="chip-btn active w-full"
                          onClick={() => {
                            onApplyPreset && onApplyPreset(preset, true);
                            setAppliedPresetId(preset.id);
                            setAppliedMode('full');
                            setTimeout(() => {
                              setAppliedPresetId(null);
                              setAppliedMode(null);
                            }, 2000);
                          }}
                          title="Применить оформление тетради и вставить примерный конспект"
                        >
                          <Check size={13} />
                          <span>
                            {appliedPresetId === preset.id && appliedMode === 'full'
                              ? 'Шаблон и текст загружены!'
                              : 'Применить всё (стиль + текст)'}
                          </span>
                        </button>
                        <button
                          className="chip-btn"
                          onClick={() => {
                            onApplyPreset && onApplyPreset(preset, false);
                            setAppliedPresetId(preset.id);
                            setAppliedMode('style');
                            setTimeout(() => {
                              setAppliedPresetId(null);
                              setAppliedMode(null);
                            }, 2000);
                          }}
                          title="Применить только параметры тетради и шрифт, оставив ваш текст"
                        >
                          <span>
                            {appliedPresetId === preset.id && appliedMode === 'style'
                              ? 'Стиль применён!'
                              : 'Только стиль'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. TAB: EXPORT ==================== */}
        {activeTab === 'export' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>Экспорт и сохранение</h3>
            </div>

            <div className="export-cards-grid">
              <div className="export-action-card" onClick={onExportPNG}>
                <div className="export-card-icon png-icon">
                  <Download size={22} />
                </div>
                <div className="export-card-info">
                  <h4>Скачать как PNG</h4>
                  <p>Текущая страница в сверхвысоком разрешении (1400×1980 px)</p>
                </div>
              </div>

              <div className="export-action-card" onClick={onExportJPG}>
                <div className="export-card-icon jpg-icon">
                  <Download size={22} />
                </div>
                <div className="export-card-info">
                  <h4>Скачать как JPG</h4>
                  <p>Оптимизированный размер файла для отправки учителю или в мессенджер</p>
                </div>
              </div>

              <div className="export-action-card" onClick={onExportPDF}>
                <div className="export-card-icon pdf-icon">
                  <Layers size={22} />
                </div>
                <div className="export-card-info">
                  <h4>Сохранить все страницы в PDF</h4>
                  <p>Скомпилировать весь конспект (все страницы) в один PDF файл</p>
                </div>
              </div>

              <div className="export-action-card" onClick={onPrint}>
                <div className="export-card-icon print-icon">
                  <Download size={22} />
                </div>
                <div className="export-card-info">
                  <h4>Распечатать</h4>
                  <p>Открыть стандартное окно печати браузера</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
