import React, { useState, useRef, useMemo } from 'react';
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
import { PAPER_PRESETS, getPaperPresets } from '../utils/paperEngine';
import { getBuiltinPresets } from '../utils/presetManager';
import { TRANSLATIONS, SAMPLE_TEXTS_EN, formatBlockName } from '../utils/i18n';

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
  lang = 'ru',
  t: propT,
  onGoToDownload,
}) {
  const t = propT || TRANSLATIONS[lang] || TRANSLATIONS.ru;
  const builtinPresets = useMemo(() => getBuiltinPresets(lang), [lang]);
  const paperPresets = useMemo(() => getPaperPresets(lang), [lang]);
  const sampleTexts = lang === 'en' ? SAMPLE_TEXTS_EN : SAMPLE_TEXTS;

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
          <span>{t.tabText || 'Текст'}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'font' ? 'active' : ''}`}
          onClick={() => setActiveTab('font')}
        >
          <Type size={18} />
          <span>{t.tabFont || 'Шрифт'}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'paper' ? 'active' : ''}`}
          onClick={() => setActiveTab('paper')}
        >
          <ImageIcon size={18} />
          <span>{t.tabPaper || 'Тетрадь'}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          <Sliders size={18} />
          <span>{t.tabLayout || 'Поля'}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => setActiveTab('presets')}
          title={t.tabPresets || 'Сохранённые и готовые пресеты настроек'}
        >
          <Bookmark size={18} />
          <span>{t.tabPresets || 'Пресеты'}</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          <Download size={18} />
          <span>{t.tabExport || 'Экспорт'}</span>
        </button>
        <button
          className="sidebar-hide-btn"
          onClick={onToggleSidebar}
          title={t.sidebarToggleTitleHide || 'Скрыть боковую панель (Ctrl+B)'}
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
                  <span>{t.blocksTitle || 'Блоки текста'} ({textBlocks?.length || 1})</span>
                </div>
                <button
                  className="add-block-btn"
                  onClick={onAddBlock}
                  title={t.addBlockBtnTitle || 'Добавить новый блок текста снизу или в произвольное место'}
                >
                  <Plus size={14} />
                  <span>{t.newBlockBtn || 'Новый блок'}</span>
                </button>
              </div>

              {/* Block Selection Chips */}
              <div className="blocks-chips-row">
                {textBlocks && textBlocks.map((block, idx) => {
                  const displayName = formatBlockName(block, idx, lang);
                  return (
                    <div
                      key={block.id}
                      className={`block-chip ${block.id === activeBlockId ? 'active' : ''}`}
                      onClick={() => onSelectBlock && onSelectBlock(block.id)}
                      title={t.editBlockTitle ? t.editBlockTitle.replace('{name}', displayName) : `Редактировать "${displayName}"`}
                    >
                      <span className="block-chip-name">{displayName}</span>
                      {textBlocks.length > 1 && (
                        <button
                          className="block-chip-del-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(t.confirmDeleteBlock ? t.confirmDeleteBlock.replace('{name}', displayName) : `Удалить "${displayName}"?`)) {
                              onDeleteBlock && onDeleteBlock(block.id);
                            }
                          }}
                          title={t.deleteBlock || 'Удалить этот блок'}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Active Block Control Bar */}
              {activeBlock && (
                <div className="active-block-bar">
                  <div className="active-block-name-wrap">
                    <span className="active-block-label">{t.editingBlock || 'Редактируется:'}</span>
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
                          setTempBlockName(formatBlockName(activeBlock, 0, lang));
                        }}
                        title={t.renameBlockHint || 'Нажмите, чтобы переименовать этот блок'}
                      >
                        <strong>{formatBlockName(activeBlock, 0, lang)}</strong>
                        <span className="tiny-edit-hint">✎</span>
                      </span>
                    )}
                  </div>

                  <div className="active-block-actions">
                    <button
                      className="tiny-action-btn"
                      onClick={() => onDuplicateBlock && onDuplicateBlock(activeBlock.id)}
                      title={t.activeBlockDuplicateTitle || 'Дублировать этот блок текста'}
                    >
                      <Copy size={13} />
                      <span>{t.duplicateBlock || 'Копия'}</span>
                    </button>
                    {textBlocks && textBlocks.length > 1 && (
                      <button
                        className="tiny-action-btn danger"
                        onClick={() => {
                          if (window.confirm(t.confirmDeleteBlock ? t.confirmDeleteBlock.replace('{name}', activeBlock.name || 'this block') : `Удалить "${activeBlock.name || 'этот блок'}"?`)) {
                            onDeleteBlock && onDeleteBlock(activeBlock.id);
                          }
                        }}
                        title={t.activeBlockDeleteTitle || 'Удалить этот блок текста'}
                      >
                        <Trash2 size={13} />
                        <span>{t.deleteBlock || 'Удалить'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pane-header">
              <h3>{t.notesTextTitle || 'Текст конспекта'}</h3>
              <div className="sample-presets">
                <span className="preset-label">{t.examplesLabel || 'Примеры:'}</span>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.algebra)}
                  title={lang === 'en' ? 'School Algebra' : 'Школьная алгебра (квадратные уравнения)'}
                >
                  {t.sampleAlgebra || 'Алгебра'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.russian)}
                  title={lang === 'en' ? 'Literary Essay' : 'Русский язык (упражнение)'}
                >
                  {t.sampleRussian || 'Русский'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.physics)}
                  title={lang === 'en' ? 'Physics Lecture' : 'Физика (термодинамика)'}
                >
                  {t.samplePhysics || 'Физика'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.chemistry)}
                  title={lang === 'en' ? 'Organic Chemistry' : 'Органическая химия'}
                >
                  {t.sampleChemistry || 'Химия'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.biology)}
                  title={lang === 'en' ? 'Biology & Cytology' : 'Биология (клетка)'}
                >
                  {t.sampleBiology || 'Биология'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.history)}
                  title={lang === 'en' ? 'World History' : 'История (географические открытия)'}
                >
                  {t.sampleHistory || 'История'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.programming)}
                  title={lang === 'en' ? 'Computer Science' : 'IT и структуры данных'}
                >
                  {t.sampleProgramming || 'IT'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.english)}
                  title={lang === 'en' ? 'English Grammar' : 'Английский язык'}
                >
                  {t.sampleEnglish || 'English'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.lab_work)}
                  title={lang === 'en' ? 'Physics Lab Report' : 'Лабораторная работа'}
                >
                  {t.sampleLab || 'Лаб. работа'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.bujo)}
                  title={lang === 'en' ? 'Bullet Journal Planner' : 'Bullet Journal планер'}
                >
                  {t.sampleBujo || 'Планер'}
                </button>
                <button
                  className="chip-btn"
                  onClick={() => setText(sampleTexts.cursive_copybook)}
                  title={lang === 'en' ? 'Cursive Penmanship' : 'Прописи'}
                >
                  {t.sampleCopybook || 'Прописи'}
                </button>
              </div>
            </div>

            <textarea
              className="text-input-area"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.textareaPlaceholder || 'Введите или вставьте сюда текст вашей лекции или конспекта...'}
              rows={14}
            />

            {/* Quick Link to Built-in Notebook Templates */}
            <div
              className="template-shortcut-card"
              onClick={() => setActiveTab('presets')}
              title={t.templateShortcutSub || 'Перейти к полной коллекции готовых шаблонов тетрадей'}
            >
              <div className="shortcut-info">
                <Sparkles size={16} className="shortcut-sparkle" />
                <div>
                  <span className="shortcut-title">
                    {t.templateShortcutTitle ? t.templateShortcutTitle.replace('{count}', builtinPresets.length) : `Готовые шаблоны тетрадей (${builtinPresets.length})`}
                  </span>
                  <span className="shortcut-sub">
                    {t.templateShortcutSub || 'Школа, университет, формулы, линейка, прописи, планер'}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} />
            </div>

            <div className="text-stats">
              <div className="stat-item">
                {t.statChars || 'Символов:'} <strong>{text.length}</strong>
              </div>
              <div className="stat-item">
                {t.statWords || 'Слов:'} <strong>{text.trim() ? text.trim().split(/\s+/).length : 0}</strong>
              </div>
              <div className="stat-item">
                {t.statLines || 'Строк:'} <strong>{totalLines}</strong>
              </div>
              <div className="stat-item">
                {t.statPages || 'Страниц:'} <strong>{Math.max(1, totalPages)}</strong>
              </div>
            </div>

            <div className="pane-footer">
              <button
                className="secondary-btn"
                onClick={() => setText('')}
                disabled={!text}
              >
                <Trash2 size={16} />
                <span>{t.clearTextBtn || 'Очистить текст'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 2. TAB: FONT & HANDWRITING ==================== */}
        {activeTab === 'font' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>{t.tabFont || 'Почерк и шрифт'}</h3>
            </div>

            {/* Upload Custom Font */}
            <div className="control-group custom-font-box">
              <div className="group-title-row">
                <label className="group-label">{t.customFontTitle || 'Свой рукописный шрифт'}</label>
                <span className="badge-small">{t.customFontFormats || '.ttf, .otf, .woff'}</span>
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
                <span>{t.uploadFontFromPc || 'Загрузить свой шрифт с компьютера'}</span>
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
                        {uf.name} ({t.loadedFontTag || 'Загружен'})
                      </span>
                      <button
                        className="delete-font-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveUserFont(uf.id);
                        }}
                        title={t.deleteFontTitle || 'Удалить шрифт'}
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
              <label className="group-label">{t.baseFontsTitle || 'Базовые рукописные шрифты'}</label>
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
                      {t.fontPreviewSample || 'Конспект лекции'}
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
                  <span>{t.fontSizeLabel || 'Размер шрифта'}</span>
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
                  <span>{t.slantAngleLabel || 'Наклон почерка'}</span>
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
                  <span>{t.slantLeft || '← Влево'}</span>
                  <button
                    className="tiny-link-btn"
                    onClick={() => updateConfig('slantAngle', 0)}
                  >
                    {t.slantStraight || 'Прямо (0°)'}
                  </button>
                  <span>{t.slantRight || 'Вправо →'}</span>
                </div>
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.lineHeightLabel || 'Межстрочный интервал'}</span>
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
                    {t.quick20Dense || '20 px (Мин)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('lineHeight', 35)}
                  >
                    {t.quick35Cell || '35 px (1 кл.)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('lineHeight', 70)}
                  >
                    {t.quick70Cell || '70 px (2 кл.)'}
                  </button>
                </div>
                <span className="slider-subtext">
                  {t.lineHeightHint || 'Совет: 20 px — плотные строки, 35 px — 1 клетка, 70 px — 2 клетки'}
                </span>
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.letterSpacingLabel || 'Межбуквенный интервал'}</span>
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
                  <span>{t.fontWeightLabel || 'Толщина ручки / Жирность'}</span>
                  <span className="slider-val">{config.fontWeight}</span>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${config.fontWeight === '400' ? 'active' : ''}`}
                    onClick={() => updateConfig('fontWeight', '400')}
                  >
                    {t.weightNormal || 'Обычная'}
                  </button>
                  <button
                    className={`segment-btn ${config.fontWeight === '500' ? 'active' : ''}`}
                    onClick={() => updateConfig('fontWeight', '500')}
                  >
                    {t.weightMedium || 'Средняя'}
                  </button>
                  <button
                    className={`segment-btn ${config.fontWeight === '700' ? 'active' : ''}`}
                    onClick={() => updateConfig('fontWeight', '700')}
                  >
                    {t.weightBold || 'Жирная'}
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Perspective & Spatial Tilt (Трапеция и поворот для фото под углом) */}
            <div className="control-card highlight-card">
              <div className="group-title-row">
                <label className="group-label with-icon">
                  <Maximize2 size={15} /> {t.perspTrapezoidTitle || '3D Перспектива и ракурс (Трапеция)'}
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
                    <RotateCcw size={12} /> {t.reset3dBtn || 'Сбросить 3D'}
                  </button>
                )}
              </div>

              {/* Perspective Y: Trapezoid top narrower / bottom wider */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.perspTrapezoidLabel || 'Трапеция (Верх уже / Низ шире)'}</span>
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
                  {t.perspTrapezoidHint || 'Верх текста сужается, а низ расширяется для соответствия фото тетради на столе'}
                </span>
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('perspectiveY', 0)}
                  >
                    {t.perspStraight || 'Прямо (0%)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('perspectiveY', 20)}
                  >
                    {t.perspModerate || 'Умеренный (+20%)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('perspectiveY', 35)}
                  >
                    {t.perspDesk || 'Стол (+35%)'}
                  </button>
                </div>
              </div>

              {/* Text Block Rotation */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.textRotationLabel || 'Поворот текста (по строкам фото)'}</span>
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
                  <span>{t.lineSlopeLabel || 'Наклон строк вверх / вниз'}</span>
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
                  <span>{t.perspSideLabel || 'Боковая перспектива (Сдвиг)'}</span>
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
                  <span>🌊</span> {t.curvatureSectionTitle || 'Искривление листа и бугорки (Неровная бумага)'}
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
                    <RotateCcw size={12} /> {t.flattenBtn || 'Выпрямить'}
                  </button>
                )}
              </div>

              {/* Page Bulge: vertical arc */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.curvatureArcLabel || 'Бугорок / Прогиб строк (Дуга)'}</span>
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
                  {t.curvatureArcHint || 'Выгибает строки дугой: вверх (бугорок на столе) или вниз (прогиб листа)'}
                </span>
                <div className="quick-buttons-row">
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', 0)}
                  >
                    {t.curvatureStraight || 'Прямо (0)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', 20)}
                  >
                    {t.curvatureBulge20 || 'Бугорок (+20px)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', 35)}
                  >
                    {t.curvatureBulge35 || 'Выпуклый (+35px)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('pageBulge', -20)}
                  >
                    {t.curvatureSag20 || 'Прогиб (-20px)'}
                  </button>
                </div>
              </div>

              {/* Bulge Apex Shift: Notebook spine */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.bulgeApexLabel || 'Смещение вершины изгиба (Корешок)'}</span>
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
                    {t.spineLeft || '← Корешок слева (-30%)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('bulgeCenterX', 0)}
                  >
                    {t.spineCenter || 'Центр (0%)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('bulgeCenterX', 30)}
                  >
                    {t.spineRight || 'Справа (+30%) →'}
                  </button>
                </div>
              </div>

              {/* Oval Curvature (Barrel distortion) */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.ovalBarrelLabel || 'Овал страницы (Бочка)'}</span>
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
                  {t.ovalBarrelHint || 'Широкие строки в середине страницы и сужение к краям (овальный контур)'}
                </span>
              </div>
            </div>

            {/* Ink color & realism */}
            <div className="control-card">
              <label className="group-label">{t.inkColorLabel || 'Цвет чернил ручки'}</label>
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
                <label className="custom-color-picker" title={t.customColorPicker || 'Выбрать свой цвет'}>
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
                  <span>{t.inkOpacityLabel2 || 'Плотность нажима чернил'}</span>
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
                    <Sparkles size={16} className="sparkle-icon" /> {t.jitterTitle || 'Живой почерк (неровности)'}
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
                  {t.jitterHint || 'Имитирует дрожание руки, живую вариацию угла букв и высоты строк'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. TAB: NOTEBOOK & PHOTO ==================== */}
        {activeTab === 'paper' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>{t.tabPaper || 'Фон и фото тетради'}</h3>
            </div>

            {/* Custom Photo Upload */}
            <div className="control-group upload-section">
              <label className="group-label">{t.uploadPhotoBtn || 'Своё фото тетради'}</label>
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
                    <span className="photo-badge">{t.photoYourActive || 'Ваше фото активно'}</span>
                  </div>
                  <div className="photo-actions">
                    <button
                      className="secondary-btn"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <Upload size={14} />
                      <span>{t.photoReplace || 'Заменить'}</span>
                    </button>
                    <button
                      className="danger-btn"
                      onClick={onRemovePhoto}
                      title={t.photoDeleteTitle || 'Удалить фото и вернуться к пресетам'}
                    >
                      <Trash2 size={14} />
                      <span>{t.photoDelete || 'Удалить'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="dropzone-box"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <Upload size={28} />
                  <p className="drop-title">{t.photoDropTitle || 'Нажмите или перетащите фото сюда'}</p>
                  <p className="drop-sub">{t.photoDropSub || 'JPG, PNG, WebP (фото настоящего тетрадного листа)'}</p>
                </div>
              )}
            </div>

            {/* Page Format (1 sheet vs 2-page spread) */}
            <div className="control-group">
              <label className="group-label">{t.photoFormatTitle || 'Формат тетради'}</label>
              <div className="segmented-control">
                <button
                  className={`segment-btn ${config.pageFormat === 'portrait' ? 'active' : ''}`}
                  onClick={() => onSetPageFormat && onSetPageFormat('portrait')}
                  title={t.photoFormat1SheetTitle || 'Один вертикальный лист (1400×1980)'}
                >
                  {t.photoFormat1Sheet || '📄 1 лист'}
                </button>
                <button
                  className={`segment-btn ${config.pageFormat === 'spread' ? 'active' : ''}`}
                  onClick={() => onSetPageFormat && onSetPageFormat('spread')}
                  title={t.photoFormatSpreadTitle || 'Разворот на 2 страницы (2400×1600)'}
                >
                  {t.photoFormatSpread || '📖 2 листа (Разворот)'}
                </button>
                {customImage && (
                  <button
                    className={`segment-btn ${config.pageFormat === 'auto' ? 'active' : ''}`}
                    onClick={() => onSetPageFormat && onSetPageFormat('auto')}
                    title={t.photoFormatAutoTitle || 'Адаптировать холст под пропорции загруженного фото без обрезки'}
                  >
                    {t.photoFormatAuto || '📷 По фото (100%)'}
                  </button>
                )}
              </div>
            </div>

            {/* Photo Fit Mode (for uploaded photo) */}
            {customImage && (
              <div className="control-group">
                <div className="group-title-row">
                  <label className="group-label">{t.photoFitLabel || 'Отображение фото'}</label>
                  <button
                    className="tiny-link-btn"
                    onClick={() => onSetPageFormat && onSetPageFormat('auto')}
                  >
                    {t.photoFitCanvasBtn || 'Подогнать холст под фото'}
                  </button>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${config.photoFit === 'contain' ? 'active' : ''}`}
                    onClick={() => updateConfig('photoFit', 'contain')}
                    title={t.photoFitContainTitle || 'Вписать фото полностью — ни один край не будет обрезан'}
                  >
                    {t.photoFitContain || 'Вписать целиком (100% без обрезки)'}
                  </button>
                  <button
                    className={`segment-btn ${config.photoFit === 'cover' ? 'active' : ''}`}
                    onClick={() => updateConfig('photoFit', 'cover')}
                    title={t.photoFitCoverTitle || 'Заполнить холст целиком'}
                  >
                    {t.photoFitCover || 'Заполнить холст (Cover)'}
                  </button>
                </div>
              </div>
            )}

            {/* Paper Presets (Active if no custom photo or as reference) */}
            {!customImage && (
              <div className="control-group">
                <label className="group-label">
                  {t.builtinSheetsLabel ? t.builtinSheetsLabel.replace('{count}', paperPresets.length) : `Встроенные тетрадные листы (${paperPresets.length})`}
                </label>
                <div className="preset-grid">
                  {paperPresets.map((preset) => (
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
                  <label className="toggle-label">{t.marginLineLabel || 'Красная линия полей'}</label>
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
                  {customImage ? (t.adjustmentsPhotoLabel || 'Регулировка фото тетради') : (t.adjustmentsLabel || 'Коррекция бумажного фона')}
                </label>
                <button
                  className="tiny-link-btn"
                  onClick={onResetPhotoAdjustments}
                >
                  <RotateCcw size={12} /> {t.resetBtnSmall || 'Сбросить'}
                </button>
              </div>

              {/* Brightness */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.photoBrightnessLabel || 'Яркость (отбеливание)'}</span>
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
                  <span>{t.photoContrastLabel || 'Контраст'}</span>
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
                  <span>{t.photoSaturationLabel || 'Насыщенность'}</span>
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
                  <span>{t.photoRotationLabel || 'Поворот фото (выравнивание)'}</span>
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
                  <span>{t.photoScaleLabel || 'Масштаб фото (Зум)'}</span>
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
                  <span>{t.photoOffsetXLabel || 'Смещение по горизонтали (X)'}</span>
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
                  <span>{t.photoOffsetYLabel || 'Смещение по вертикали (Y)'}</span>
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
              <h3>{t.tabLayout || 'Поля и выравнивание'}</h3>
            </div>

            <div className="control-card">
              <div className="drag-hint-box">
                <Move size={16} />
                <span>
                  <strong>{lang === 'en' ? 'Tip:' : 'Совет:'}</strong> {t.dragTextAdvice || 'Вы можете просто зажать и перетаскивать текст мышью прямо по листу тетради!'}
                </span>
              </div>

              {/* Text Alignment */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.textAlignLabel || 'Выравнивание текста'}</span>
                  <span className="slider-val">
                    {(!config.textAlign || config.textAlign === 'left') && (t.alignLeft || 'По левому краю')}
                    {config.textAlign === 'center' && (t.alignCenter || 'По центру')}
                    {config.textAlign === 'right' && (t.alignRight || 'По правому краю')}
                    {config.textAlign === 'justify' && (t.alignJustify || 'По ширине')}
                  </span>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${(!config.textAlign || config.textAlign === 'left') ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'left')}
                    title={t.alignLeft || 'По левому краю'}
                  >
                    <AlignLeft size={14} />
                    <span>{lang === 'en' ? 'Left' : 'Влево'}</span>
                  </button>
                  <button
                    className={`segment-btn ${config.textAlign === 'center' ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'center')}
                    title={t.alignCenter || 'По центру'}
                  >
                    <AlignCenter size={14} />
                    <span>{lang === 'en' ? 'Center' : 'Центр'}</span>
                  </button>
                  <button
                    className={`segment-btn ${config.textAlign === 'right' ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'right')}
                    title={t.alignRight || 'По правому краю'}
                  >
                    <AlignRight size={14} />
                    <span>{lang === 'en' ? 'Right' : 'Вправо'}</span>
                  </button>
                  <button
                    className={`segment-btn ${config.textAlign === 'justify' ? 'active' : ''}`}
                    onClick={() => updateConfig('textAlign', 'justify')}
                    title={t.alignJustify || 'По ширине'}
                  >
                    <AlignJustify size={14} />
                    <span>{lang === 'en' ? 'Justify' : 'По ширине'}</span>
                  </button>
                </div>
              </div>

              {/* Columns mode (1 or 2 pages) */}
              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.colsSpreadLabel || 'Колонки текста (Разворот)'}</span>
                  <span className="slider-val">{config.columnsCount === 2 ? (lang === 'en' ? '2 pages' : '2 страницы') : (t.cols1Col || '1 колонка')}</span>
                </div>
                <div className="segmented-control">
                  <button
                    className={`segment-btn ${config.columnsCount !== 2 ? 'active' : ''}`}
                    onClick={() => updateConfig('columnsCount', 1)}
                  >
                    {t.cols1Col || '1 колонка'}
                  </button>
                  <button
                    className={`segment-btn ${config.columnsCount === 2 ? 'active' : ''}`}
                    onClick={() => updateConfig('columnsCount', 2)}
                  >
                    {t.cols2Col || '📖 2 колонки (Разворот)'}
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
                    title={t.leftSheetTitle || 'Разместить текст только на левой странице'}
                  >
                    {t.leftSheetBtn || '◀ Левый лист'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => {
                      updateConfig('columnsCount', 2);
                      updateConfig('marginLeft', Math.round(config.canvasWidth * 0.06));
                      updateConfig('marginRight', Math.round(config.canvasWidth * 0.06));
                    }}
                    title={t.bothSheetsTitle || 'Текст на оба листа разворота'}
                  >
                    {t.bothSheetsBtn || 'Оба листа'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => {
                      updateConfig('columnsCount', 1);
                      updateConfig('marginLeft', Math.round(config.canvasWidth / 2 + 50));
                      updateConfig('marginRight', Math.round(config.canvasWidth * 0.06));
                    }}
                    title={t.rightSheetTitle || 'Разместить текст только на правой странице'}
                  >
                    {t.rightSheetBtn || 'Правый лист ▶'}
                  </button>
                </div>
              </div>

              {config.columnsCount === 2 && (
                <div className="slider-row">
                  <div className="slider-label-wrap">
                    <span>{t.gutterLabel || 'Зазор между страницами (Корешок)'}</span>
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
                  <span>{t.marginLeftLabel || 'Отступ слева (X)'}</span>
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
                    {t.marginLeftChip || 'К левому краю (40px)'}
                  </button>
                  <button
                    className="chip-btn"
                    onClick={() => updateConfig('marginLeft', 290)}
                  >
                    {t.marginSchoolChip || 'Школьные поля (290px)'}
                  </button>
                </div>
              </div>

              <div className="slider-row">
                <div className="slider-label-wrap">
                  <span>{t.marginTopLabel || 'Отступ сверху (Margin Top)'}</span>
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
                  <span>{t.marginRightLabel || 'Отступ справа (Margin Right)'}</span>
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
                  <span>{t.marginBottomLabel || 'Отступ снизу (Margin Bottom)'}</span>
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
                  <span>{t.paragraphIndentLabel || 'Красная строка (Абзацный отступ)'}</span>
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
              <span className="preset-label">{t.quickMarginsLabel || 'Быстрые пресеты полей:'}</span>
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
                  {t.marginsPresetSchool || 'Стандартная школьная тетрадь'}
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
                  {t.marginsPresetNarrow || 'Узкие поля (А4)'}
                </button>
              </div>
            </div>

            {/* Reset All Settings Box */}
            <div className="sidebar-reset-box">
              <button
                className="secondary-btn w-full reset-all-btn"
                onClick={onResetAll}
                title={t.resetAllDefaultsTitle || 'Сбросить все настройки текста, полей и наклона к начальным'}
              >
                <RotateCcw size={16} />
                <span>{t.resetAllDefaults || 'Сбросить все настройки по умолчанию'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================== 5. TAB: PRESETS (СОХРАНЕНИЕ И ЗАГРУЗКА ПРЕСЕТОВ) ==================== */}
        {activeTab === 'presets' && (
          <div className="tab-pane">
            <div className="pane-header">
              <h3>{t.tabPresets || 'Пресеты настроек'}</h3>
            </div>

            {/* 1. Save Current Preset */}
            <div className="control-card save-preset-card">
              <label className="group-label">{t.saveCurrentAsPresetTitle || 'Сохранить текущие настройки как пресет'}</label>
              <p className="slider-subtext" style={{ marginBottom: '12px' }}>
                {t.savePresetExpl || 'Сохраните текущий шрифт, межстрочный интервал, цвет чернил, поля и 3D-наклон. В будущем вы сможете применить этот стиль в 1 клик!'}
              </p>

              <div className="save-preset-form">
                <input
                  type="text"
                  className="preset-name-input"
                  placeholder={t.savePresetInputPlaceholder || 'Название пресета (например: Мой конспект)...'}
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
                      alert(t.pleaseEnterPresetName || 'Пожалуйста, введите название пресета');
                    }
                  }}
                >
                  <Save size={15} />
                  <span>{t.savePresetBtn || 'Сохранить пресет'}</span>
                </button>
              </div>

              {presetSaveSuccess && (
                <div className="preset-save-toast">
                  <Check size={15} />
                  <span>{t.presetSavedToast || 'Пресет успешно сохранён! Теперь он доступен в списке ниже.'}</span>
                </div>
              )}
            </div>

            {/* 2. User Saved Presets List */}
            <div className="control-card">
              <div className="slider-label-wrap" style={{ marginBottom: '10px' }}>
                <span className="group-label" style={{ margin: 0 }}>
                  {t.mySavedPresets ? t.mySavedPresets.replace('{count}', userPresets?.length || 0) : `Мои сохранённые пресеты (${userPresets?.length || 0})`}
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
                    title="JSON import"
                  >
                    <FolderUp size={13} />
                    <span>{t.importJsonBtn || 'Импорт .json'}</span>
                  </button>
                </div>
              </div>

              {(!userPresets || userPresets.length === 0) ? (
                <div className="empty-presets-box">
                  <Bookmark size={26} className="empty-icon" />
                  <p className="empty-title">{t.noPresetsTitle || 'У вас пока нет сохранённых пресетов'}</p>
                  <p className="empty-sub">
                    {t.noPresetsSub || 'Настройте стиль листа и нажмите «Сохранить пресет» выше!'}
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
                        <span className="preset-tag">{t.tagFont || 'Шрифт:'} {preset.config?.fontFamily || 'Caveat'}</span>
                        <span className="preset-tag">{preset.config?.fontSize || 42}px</span>
                        <span className="preset-tag">{t.tagLine || 'Строка:'} {preset.config?.lineHeight || 70}px</span>
                        <span className="preset-tag">{preset.config?.marginLeft || 290}px</span>
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
                              <span>{t.appliedToast || 'Применён!'}</span>
                            </>
                          ) : (
                            <>
                              <Check size={13} />
                              <span>{t.applyBtn || 'Применить'}</span>
                            </>
                          )}
                        </button>
                        <button
                          className="chip-btn"
                          onClick={() => onExportPreset && onExportPreset(preset)}
                          title="JSON export"
                        >
                          <Download size={13} />
                          <span>{t.exportJsonBtn || 'Файл'}</span>
                        </button>
                        <button
                          className="chip-btn danger-hover"
                          onClick={() => {
                            if (window.confirm(t.deletePresetConfirm ? t.deletePresetConfirm.replace('{name}', preset.name) : `Удалить пресет "${preset.name}"?`)) {
                              onDeletePreset && onDeletePreset(preset.id);
                            }
                          }}
                          title={t.deleteBlock || 'Удалить'}
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
                  {t.builtinTemplatesTitle ? t.builtinTemplatesTitle.replace('{count}', builtinPresets.length) : `Готовые встроенные шаблоны (${builtinPresets.length})`}
                </label>
              </div>

              {/* Category Filter Chips */}
              <div className="category-filter-chips">
                {(lang === 'en'
                  ? [
                      { id: 'all', label: t.catAll || 'All Templates' },
                      { id: 'School', label: t.catSchool || 'School' },
                      { id: 'University', label: t.catUni || 'University' },
                      { id: 'Science', label: t.catScience || 'Science' },
                      { id: 'Languages', label: t.catLanguages || 'Languages' },
                      { id: 'Planner', label: t.catPlanner || 'Planner' },
                      { id: '3D Effect', label: t.cat3D || '3D Effect' },
                    ]
                  : [
                      { id: 'all', label: t.catAll || 'Все шаблоны' },
                      { id: 'Школа', label: t.catSchool || 'Школа' },
                      { id: 'Университет', label: t.catUni || 'Университет' },
                      { id: 'Наука', label: t.catScience || 'Наука' },
                      { id: 'Языки', label: t.catLanguages || 'Языки' },
                      { id: 'Планер', label: t.catPlanner || 'Планер' },
                      { id: '3D Эффект', label: t.cat3D || '3D Эффект' },
                    ]
                ).map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="presets-list">
                {builtinPresets
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
                        <span className="preset-tag">{t.tagFont || 'Шрифт:'} {preset.config?.fontFamily || 'Caveat'}</span>
                        <span className="preset-tag">
                          {t.tagPaper || 'Лист:'}{' '}
                          {preset.config?.preset === 'grid'
                            ? (t.paperGrid || 'Клетка')
                            : preset.config?.preset === 'lined'
                            ? (t.paperLined || 'Линейка')
                            : preset.config?.preset === 'slanted'
                            ? (t.paperSlanted || 'Косая')
                            : preset.config?.preset === 'dots'
                            ? (t.paperDots || 'Точки')
                            : preset.config?.preset === 'vintage'
                            ? (t.paperVintage || 'Крафт')
                            : (t.paperBlank || 'Лист')}
                        </span>
                        <span className="preset-tag">{t.tagLine || 'Строка:'} {preset.config?.lineHeight || 70}px</span>
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
                        >
                          <Check size={13} />
                          <span>
                            {appliedPresetId === preset.id && appliedMode === 'full'
                              ? (t.appliedAllToast || 'Шаблон и текст загружены!')
                              : (t.applyAllBtn || 'Применить всё (стиль + текст)')}
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
                        >
                          <span>
                            {appliedPresetId === preset.id && appliedMode === 'style'
                              ? (t.appliedStyleToast || 'Стиль применён!')
                              : (t.applyStyleOnlyBtn || 'Только стиль')}
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
              <h3>{t.exportSectionTitle || 'Экспорт и сохранение'}</h3>
            </div>

            <div className="sidebar-download-nav-card">
              <div className="download-nav-badge">
                <Sparkles size={14} />
                <span>{t.dedicatedDownloadBadge || 'Новая страница скачивания'}</span>
              </div>
              <h4 className="download-nav-title">{t.downloadPageTitle || 'Страница скачивания конспекта'}</h4>
              <p className="download-nav-desc">
                {t.sidebarDownloadPageNotice || 'Скачивание PDF, изображений PNG/JPG и печать перенесены на отдельную страницу с полноэкранным просмотром и выбором качества.'}
              </p>

              <button
                className="sidebar-go-to-download-btn"
                onClick={onGoToDownload}
                title={t.goToDownloadPageTitle || 'Перейти на страницу скачивания готового конспекта'}
              >
                <Download size={18} />
                <span>{t.goToDownloadPage || 'Перейти к скачиванию'}</span>
                <ChevronRight size={18} />
              </button>

              <div className="sidebar-download-features">
                <div className="feature-item">✓ {t.summaryBadgeFree || '100% Бесплатно без водяных знаков'}</div>
                <div className="feature-item">✓ {t.exportPdfBadge || 'Многостраничный PDF'}</div>
                <div className="feature-item">✓ {t.exportPngBadge || 'HD PNG и JPG'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
