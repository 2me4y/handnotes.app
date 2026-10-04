/**
 * Preset Manager for Konspekt
 * Handles saving, loading, exporting, and importing user presets
 */

export const PRESETS_STORAGE_KEY = 'konspekt_user_presets';

import { SAMPLE_TEXTS } from './constants';

export const BUILTIN_PRESETS = [
  {
    id: 'builtin_school_math',
    name: 'Школьная математика (2 клетки)',
    category: 'Школа',
    description: 'Классическая тетрадь в клетку 35 px, синяя ручка, шаг строк 70 px (через клетку), школьные поля 290 px',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.algebra,
    config: {
      fontFamily: 'Caveat',
      fontSize: 42,
      lineHeight: 70,
      letterSpacing: 1.5,
      fontWeight: '500',
      slantAngle: 5,
      inkColor: '#1d4ed8',
      inkOpacity: 0.94,
      jitterIntensity: 0.35,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_school_russian',
    name: 'Русский язык (Тетрадь в линейку)',
    category: 'Школа',
    description: 'Школьная линейка 50 px с полями, каллиграфический почерк Marck Script, аккуратная домашняя работа',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.russian,
    config: {
      fontFamily: 'Marck Script',
      fontSize: 34,
      lineHeight: 50,
      letterSpacing: 1.2,
      fontWeight: 'normal',
      slantAngle: 5,
      inkColor: '#1d4ed8',
      inkOpacity: 0.94,
      jitterIntensity: 0.3,
      textAlign: 'left',
      marginTop: 120,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'lined',
      lineSpacing: 50,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_school_copybook',
    name: 'Прописи (Косая линейка)',
    category: 'Школа',
    description: 'Тетрадь в частую косую линейку для чистописания 1–2 класса, каллиграфические буквы с правильным наклоном',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.cursive_copybook,
    config: {
      fontFamily: 'Marck Script',
      fontSize: 30,
      lineHeight: 42,
      letterSpacing: 1.2,
      fontWeight: 'normal',
      slantAngle: 7,
      inkColor: '#1e3a8a',
      inkOpacity: 0.95,
      jitterIntensity: 0.25,
      textAlign: 'left',
      marginTop: 100,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'slanted',
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_dense_1cell',
    name: 'Плотный студенческий конспект (1 клетка)',
    category: 'Университет',
    description: 'Каждая строка в клетку: 35 px межстрочный, мелкий беглый почерк 28 px, тёмно-синяя ручка',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.math_uni,
    config: {
      fontFamily: 'Caveat',
      fontSize: 28,
      lineHeight: 35,
      letterSpacing: 1.0,
      fontWeight: '500',
      slantAngle: 4,
      inkColor: '#1e3a8a',
      inkOpacity: 0.95,
      jitterIntensity: 0.25,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_physics_lecture',
    name: 'Лекция по физике (Термодинамика)',
    category: 'Университет',
    description: 'Стандартный конспект с формулами, законами и выводами, синяя паста, школьная сетка 35 px',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.physics,
    config: {
      fontFamily: 'Caveat',
      fontSize: 40,
      lineHeight: 70,
      letterSpacing: 1.5,
      fontWeight: '500',
      slantAngle: 5,
      inkColor: '#1d4ed8',
      inkOpacity: 0.94,
      jitterIntensity: 0.35,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_chemistry',
    name: 'Химия (Органические реакции)',
    category: 'Наука',
    description: 'Чёрная гелевая ручка, рукописный шрифт Neucha, тетрадь в клетку с химическими свойствами',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.chemistry,
    config: {
      fontFamily: 'Neucha',
      fontSize: 34,
      lineHeight: 70,
      letterSpacing: 1.2,
      fontWeight: 'normal',
      slantAngle: 0,
      inkColor: '#18181b',
      inkOpacity: 0.96,
      jitterIntensity: 0.25,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_biology',
    name: 'Биология (Цитология и клетка)',
    category: 'Наука',
    description: 'Тетрадь в линейку, аккуратный студенческий почерк Bad Script, синяя паста, понятная структура',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.biology,
    config: {
      fontFamily: 'Bad Script',
      fontSize: 34,
      lineHeight: 50,
      letterSpacing: 1.3,
      fontWeight: 'normal',
      slantAngle: 4,
      inkColor: '#1d4ed8',
      inkOpacity: 0.93,
      jitterIntensity: 0.32,
      textAlign: 'left',
      marginTop: 120,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'lined',
      lineSpacing: 50,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_lab_report',
    name: 'Лабораторная работа (Физика)',
    category: 'Лабораторная',
    description: 'Строгий технический печатный почерк Kelly Slab, тёмно-синяя ручка, формулы погрешностей и вывод',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.lab_work,
    config: {
      fontFamily: 'Kelly Slab',
      fontSize: 34,
      lineHeight: 70,
      letterSpacing: 1.4,
      fontWeight: 'normal',
      slantAngle: 0,
      inkColor: '#1e3a8a',
      inkOpacity: 0.96,
      jitterIntensity: 0.2,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_bujo_dots',
    name: 'Bullet Journal (Точечный планер)',
    category: 'Планер',
    description: 'Тетрадь в точку (Dot Grid 35 px), современный почерк Shantell Sans, черная гелевая ручка, чек-листы',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.bujo,
    config: {
      fontFamily: 'Shantell Sans',
      fontSize: 30,
      lineHeight: 45,
      letterSpacing: 1.1,
      fontWeight: 'normal',
      slantAngle: 0,
      inkColor: '#18181b',
      inkOpacity: 0.96,
      jitterIntensity: 0.22,
      textAlign: 'left',
      marginTop: 120,
      marginLeft: 150,
      marginRight: 100,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'dots',
      gridSize: 35,
      showMarginLine: false,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_english_notes',
    name: 'Английский язык (Grammar & Rules)',
    category: 'Языки',
    description: 'Тетрадь в линейку, насыщенные фиолетовые чернила, шрифт Caveat, правила времен и полезные идиомы',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.english,
    config: {
      fontFamily: 'Caveat',
      fontSize: 38,
      lineHeight: 50,
      letterSpacing: 1.3,
      fontWeight: '500',
      slantAngle: 4,
      inkColor: '#3730a3',
      inkOpacity: 0.95,
      jitterIntensity: 0.3,
      textAlign: 'left',
      marginTop: 120,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'lined',
      lineSpacing: 50,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_history_timeline',
    name: 'История (Хронология и даты)',
    category: 'Школа',
    description: 'Школьная клетка, синяя паста, даты, тезисы и ключевые географические открытия',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.history,
    config: {
      fontFamily: 'Caveat',
      fontSize: 40,
      lineHeight: 70,
      letterSpacing: 1.4,
      fontWeight: '500',
      slantAngle: 5,
      inkColor: '#1d4ed8',
      inkOpacity: 0.94,
      jitterIntensity: 0.35,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_it_datastruct',
    name: 'Информатика и IT (Структуры данных)',
    category: 'Университет',
    description: 'Чёрная гелевая ручка, ровный округлый почерк Kurale, алгоритмы, массивы, списки и O(1)/O(n)',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.programming,
    config: {
      fontFamily: 'Kurale',
      fontSize: 34,
      lineHeight: 70,
      letterSpacing: 1.2,
      fontWeight: 'normal',
      slantAngle: 0,
      inkColor: '#18181b',
      inkOpacity: 0.97,
      jitterIntensity: 0.22,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_mini_20px',
    name: 'Шпаргалка / Мелкий почерк (20 px)',
    category: 'Студент',
    description: 'Минимальный интервал 20 px, компактный размер шрифта 18 px для формул, определений и шпаргалок',
    isBuiltin: true,
    sampleText: `Краткие формулы к экзамену:
v = v₀ + at;  S = v₀t + at²/2;  v² - v₀² = 2aS.
F = ma;  F_тр = μN;  F_упр = -kx;  F_тяж = mg.
A = F·S·cos α;  N = A/t;  E_к = mv²/2;  E_п = mgh.
p = mv;  p₁ + p₂ = const (закон сохранения импульса).
P·V = (m/M)·R·T (ур-е Менделеева-Клапейрона).
Q = cmΔT;  Q = λm;  Q = Lm;  Q = qm.
I = U/R;  R = ρl/S;  P = UI = I²R = U²/R.
Q = I²Rt (закон Джоуля-Ленца).
F_Л = qvB sin α;  F_А = IBl sin α.`,
    config: {
      fontFamily: 'Caveat',
      fontSize: 20,
      lineHeight: 20,
      letterSpacing: 0.5,
      fontWeight: '500',
      slantAngle: 3,
      inkColor: '#0f172a',
      inkOpacity: 0.96,
      jitterIntensity: 0.2,
      textAlign: 'left',
      marginTop: 100,
      marginLeft: 120,
      marginRight: 80,
      marginBottom: 80,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: false,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_realistic_photo_3d',
    name: '3D Фото под углом (Трапеция + Бугор)',
    category: '3D Эффект',
    description: 'Реалистичный вид изогнутого листа сфотографированной тетради: перспектива +25%, изгиб листа +20 px',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.physics,
    config: {
      fontFamily: 'Marck Script',
      fontSize: 38,
      lineHeight: 70,
      letterSpacing: 1.2,
      fontWeight: 'normal',
      slantAngle: 6,
      inkColor: '#1e40af',
      inkOpacity: 0.92,
      jitterIntensity: 0.45,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 25,
      perspectiveX: 0,
      textRotation: -1,
      lineSlope: 1,
      pageBulge: 20,
      bulgeCenterX: -10,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
  {
    id: 'builtin_lecture_black_ink',
    name: 'Строгая лекция (Чёрная гелевая ручка)',
    category: 'Университет',
    description: 'Чёрные насыщенные чернила, шрифт Kelly Slab, ровные аккуратные строки',
    isBuiltin: true,
    sampleText: SAMPLE_TEXTS.math_uni,
    config: {
      fontFamily: 'Kelly Slab',
      fontSize: 36,
      lineHeight: 70,
      letterSpacing: 1.5,
      fontWeight: 'normal',
      slantAngle: 0,
      inkColor: '#111827',
      inkOpacity: 0.97,
      jitterIntensity: 0.2,
      textAlign: 'left',
      marginTop: 140,
      marginLeft: 290,
      marginRight: 90,
      marginBottom: 100,
      paragraphIndent: 0,
      enableParagraphIndent: false,
      perspectiveY: 0,
      perspectiveX: 0,
      textRotation: 0,
      lineSlope: 0,
      pageBulge: 0,
      preset: 'grid',
      gridSize: 35,
      showMarginLine: true,
      marginLineX: 260,
    },
  },
];

/**
 * Load all user-saved presets from localStorage
 */
export function getSavedUserPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('Failed to parse user presets:', e);
    return [];
  }
}

/**
 * Save a new user preset to localStorage
 */
export function saveUserPreset({ name, config, textBlocks }) {
  const currentPresets = getSavedUserPresets();
  const id = `user_preset_${Date.now()}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Extract config fields to save
  const configSnapshot = {
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    lineHeight: config.lineHeight,
    letterSpacing: config.letterSpacing,
    fontWeight: config.fontWeight,
    slantAngle: config.slantAngle,
    inkColor: config.inkColor,
    inkOpacity: config.inkOpacity,
    jitterIntensity: config.jitterIntensity,
    textAlign: config.textAlign,
    marginTop: config.marginTop,
    marginLeft: config.marginLeft,
    marginRight: config.marginRight,
    marginBottom: config.marginBottom,
    paragraphIndent: config.paragraphIndent,
    enableParagraphIndent: config.enableParagraphIndent,
    perspectiveY: config.perspectiveY,
    perspectiveX: config.perspectiveX,
    textRotation: config.textRotation,
    lineSlope: config.lineSlope,
    pageBulge: config.pageBulge,
    bulgeCenterX: config.bulgeCenterX,
    ovalCurvature: config.ovalCurvature,
    columnsCount: config.columnsCount,
    columnGap: config.columnGap,
    preset: config.preset,
    gridSize: config.gridSize,
    lineMeshEnabled: config.lineMeshEnabled,
    lineMesh: config.lineMesh,
  };

  // Optional: save structure of blocks (without huge text bodies, or with placeholder text)
  const blocksSnapshot = Array.isArray(textBlocks)
    ? textBlocks.map((b) => ({
        name: b.name,
        fontFamily: b.fontFamily,
        fontSize: b.fontSize,
        lineHeight: b.lineHeight,
        letterSpacing: b.letterSpacing,
        fontWeight: b.fontWeight,
        slantAngle: b.slantAngle,
        inkColor: b.inkColor,
        inkOpacity: b.inkOpacity,
        jitterIntensity: b.jitterIntensity,
        textAlign: b.textAlign,
        marginTop: b.marginTop,
        marginLeft: b.marginLeft,
        marginRight: b.marginRight,
        marginBottom: b.marginBottom,
        paragraphIndent: b.paragraphIndent,
        perspectiveY: b.perspectiveY,
        perspectiveX: b.perspectiveX,
        textRotation: b.textRotation,
        lineSlope: b.lineSlope,
        pageBulge: b.pageBulge,
        lineMeshEnabled: b.lineMeshEnabled,
        lineMesh: b.lineMesh,
      }))
    : null;

  const newPreset = {
    id,
    name: name.trim() || `Пресет от ${dateStr}`,
    createdAt: dateStr,
    isBuiltin: false,
    config: configSnapshot,
    blocksSnapshot,
  };

  const updatedList = [newPreset, ...currentPresets];
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedList));
  return newPreset;
}

/**
 * Delete a user preset by ID
 */
export function deleteUserPreset(presetId) {
  const currentPresets = getSavedUserPresets();
  const updated = currentPresets.filter((p) => p.id !== presetId);
  localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Export a preset to a downloadable JSON file
 */
export function exportPresetToFile(preset) {
  const data = JSON.stringify(preset, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const cleanName = (preset.name || 'preset').replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_');

  const link = document.createElement('a');
  link.href = url;
  link.download = `konspekt-preset-${cleanName}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import a preset from a JSON file
 */
export function importPresetFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed || typeof parsed !== 'object' || !parsed.config) {
          throw new Error('Файл не содержит корректных настроек пресета Konspekt');
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });

        const newPreset = {
          id: `imported_${Date.now()}`,
          name: parsed.name ? `${parsed.name} (Импорт)` : `Импортированный пресет ${dateStr}`,
          createdAt: dateStr,
          isBuiltin: false,
          config: parsed.config,
          blocksSnapshot: parsed.blocksSnapshot || null,
        };

        const current = getSavedUserPresets();
        const updated = [newPreset, ...current];
        localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
        resolve(newPreset);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
}
