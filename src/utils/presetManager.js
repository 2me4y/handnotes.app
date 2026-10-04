/**
 * Preset Manager for Konspekt
 * Handles saving, loading, exporting, and importing user presets
 */

export const PRESETS_STORAGE_KEY = 'konspekt_user_presets';

import { SAMPLE_TEXTS } from './constants';
import { SAMPLE_TEXTS_EN } from './i18n';

export const BUILTIN_TEMPLATE_DEFINITIONS = [
  {
    id: 'builtin_school_math',
    nameRu: 'Школьная математика (2 клетки)',
    nameEn: 'School Math (2 cells)',
    catRu: 'Школа',
    catEn: 'School',
    descRu: 'Классическая тетрадь в клетку 35 px, синяя ручка, шаг строк 70 px (через клетку), школьные поля 290 px',
    descEn: 'Classic 5mm grid notebook, blue pen, 70px line height, school margin line',
    sampleTextRu: SAMPLE_TEXTS.algebra,
    sampleTextEn: SAMPLE_TEXTS_EN.algebra,
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
    nameRu: 'Русский язык (Тетрадь в линейку)',
    nameEn: 'Literary Essay (Ruled Paper)',
    catRu: 'Школа',
    catEn: 'School',
    descRu: 'Школьная линейка 50 px с полями, каллиграфический почерк Marck Script, аккуратная домашняя работа',
    descEn: 'Ruled school paper (50px lines) with margin line, elegant cursive script, neat homework',
    sampleTextRu: SAMPLE_TEXTS.russian,
    sampleTextEn: SAMPLE_TEXTS_EN.russian,
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
    nameRu: 'Прописи (Косая линейка)',
    nameEn: 'Cursive Penmanship (Slanted Lines)',
    catRu: 'Школа',
    catEn: 'School',
    descRu: 'Тетрадь в частую косую линейку для чистописания 1–2 класса, каллиграфические буквы с правильным наклоном',
    descEn: 'Narrow calligraphy practice lines with 65° slant guidelines, elegant script letters',
    sampleTextRu: SAMPLE_TEXTS.cursive_copybook,
    sampleTextEn: SAMPLE_TEXTS_EN.cursive_copybook,
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
    nameRu: 'Плотный студенческий конспект (1 клетка)',
    nameEn: 'Dense University Notes (1 cell)',
    catRu: 'Университет',
    catEn: 'University',
    descRu: 'Каждая строка в клетку: 35 px межстрочный, мелкий беглый почерк 28 px, тёмно-синяя ручка',
    descEn: 'Every grid line written (35px height), fine 28px handwriting, dark blue ink',
    sampleTextRu: SAMPLE_TEXTS.math_uni,
    sampleTextEn: SAMPLE_TEXTS_EN.math_uni,
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
    nameRu: 'Лекция по физике (Термодинамика)',
    nameEn: 'Physics Lecture (Thermodynamics)',
    catRu: 'Университет',
    catEn: 'University',
    descRu: 'Стандартный конспект с формулами, законами и выводами, синяя паста, школьная сетка 35 px',
    descEn: 'Standard science lecture notes with equations and laws, blue pen, 35px grid notebook',
    sampleTextRu: SAMPLE_TEXTS.physics,
    sampleTextEn: SAMPLE_TEXTS_EN.physics,
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
    nameRu: 'Химия (Органические реакции)',
    nameEn: 'Organic Chemistry (Reactions)',
    catRu: 'Наука',
    catEn: 'Science',
    descRu: 'Чёрная гелевая ручка, рукописный шрифт Neucha, тетрадь в клетку с химическими свойствами',
    descEn: 'Black gel pen, neat Neucha script, grid paper with molecular properties and reactions',
    sampleTextRu: SAMPLE_TEXTS.chemistry,
    sampleTextEn: SAMPLE_TEXTS_EN.chemistry,
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
    nameRu: 'Биология (Цитология и клетка)',
    nameEn: 'Cell Biology & Cytology',
    catRu: 'Наука',
    catEn: 'Science',
    descRu: 'Тетрадь в линейку, аккуратный студенческий почерк Bad Script, синяя паста, понятная структура',
    descEn: 'Ruled notebook, student handwriting Bad Script, blue ballpoint pen, structured notes',
    sampleTextRu: SAMPLE_TEXTS.biology,
    sampleTextEn: SAMPLE_TEXTS_EN.biology,
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
    nameRu: 'Лабораторная работа (Физика)',
    nameEn: 'Physics Laboratory Report',
    catRu: 'Лабораторная',
    catEn: 'Lab Report',
    descRu: 'Строгий технический печатный почерк Kelly Slab, тёмно-синяя ручка, формулы погрешностей и вывод',
    descEn: 'Clean technical print style Kelly Slab, dark blue ink, measurement errors and conclusions',
    sampleTextRu: SAMPLE_TEXTS.lab_work,
    sampleTextEn: SAMPLE_TEXTS_EN.lab_work,
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
    nameRu: 'Bullet Journal (Точечный планер)',
    nameEn: 'Bullet Journal (Dot Grid Planner)',
    catRu: 'Планер',
    catEn: 'Planner',
    descRu: 'Тетрадь в точку (Dot Grid 35 px), современный почерк Shantell Sans, черная гелевая ручка, чек-листы',
    descEn: 'Dot grid paper (35px), modern clean handwriting Shantell Sans, black gel pen, habit trackers',
    sampleTextRu: SAMPLE_TEXTS.bujo,
    sampleTextEn: SAMPLE_TEXTS_EN.bujo,
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
    nameRu: 'Английский язык (Grammar & Rules)',
    nameEn: 'Grammar & Vocabulary Rules',
    catRu: 'Языки',
    catEn: 'Languages',
    descRu: 'Тетрадь в линейку, насыщенные фиолетовые чернила, шрифт Caveat, правила времен и полезные идиомы',
    descEn: 'Ruled paper, rich purple fountain pen ink, Caveat font, verb tenses and common idioms',
    sampleTextRu: SAMPLE_TEXTS.english,
    sampleTextEn: SAMPLE_TEXTS_EN.english,
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
    nameRu: 'История (Хронология и даты)',
    nameEn: 'World History (Age of Discovery)',
    catRu: 'Школа',
    catEn: 'School',
    descRu: 'Школьная клетка, синяя паста, даты, тезисы и ключевые географические открытия',
    descEn: 'Grid paper, blue pen, timeline dates, key expeditions and global outcomes',
    sampleTextRu: SAMPLE_TEXTS.history,
    sampleTextEn: SAMPLE_TEXTS_EN.history,
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
    nameRu: 'Информатика и IT (Структуры данных)',
    nameEn: 'Computer Science (Data Structures)',
    catRu: 'Университет',
    catEn: 'University',
    descRu: 'Чёрная гелевая ручка, ровный округлый почерк Kurale, алгоритмы, массивы, списки и O(1)/O(n)',
    descEn: 'Black gel pen, clean rounded script Kurale, algorithms, arrays, lists and O(1)/O(n)',
    sampleTextRu: SAMPLE_TEXTS.programming,
    sampleTextEn: SAMPLE_TEXTS_EN.programming,
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
    nameRu: 'Шпаргалка / Мелкий почерк (20 px)',
    nameEn: 'Compact Exam Cheat Sheet (20px)',
    catRu: 'Студент',
    catEn: 'Student',
    descRu: 'Минимальный интервал 20 px, компактный размер шрифта 18 px для формул, определений и шпаргалок',
    descEn: 'Minimal 20px line spacing, tiny 18px font size for formulas, definitions and exam prep',
    sampleTextRu: `Краткие формулы к экзамену:
v = v₀ + at;  S = v₀t + at²/2;  v² - v₀² = 2aS.
F = ma;  F_тр = μN;  F_упр = -kx;  F_тяж = mg.
A = F·S·cos α;  N = A/t;  E_к = mv²/2;  E_п = mgh.
p = mv;  p₁ + p₂ = const (закон сохранения импульса).
P·V = (m/M)·R·T (ур-е Менделеева-Клапейрона).
Q = cmΔT;  Q = λm;  Q = Lm;  Q = qm.
I = U/R;  R = ρl/S;  P = UI = I²R = U²/R.
Q = I²Rt (закон Джоуля-Ленца).
F_Л = qvB sin α;  F_А = IBl sin α.`,
    sampleTextEn: `Physics Formula Quick Sheet:
v = v₀ + at;  s = v₀t + ½at²;  v² - v₀² = 2as.
F = ma;  f_k = μN;  F_s = -kx;  F_g = mg.
W = F·d·cos θ;  P = W/t;  K = ½mv²;  U = mgh.
p = mv;  p₁ + p₂ = const (conservation of momentum).
PV = nRT (Ideal Gas Equation).
Q = mcΔT;  Q = mL (latent heat).
V = IR;  R = ρL/A;  P = IV = I²R = V²/R.
F_B = qvB sin θ (Lorentz magnetic force).`,
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
    nameRu: '3D Фото под углом (Трапеция + Бугор)',
    nameEn: '3D Angle Photo (Keystone + Bulge)',
    catRu: '3D Эффект',
    catEn: '3D Effect',
    descRu: 'Реалистичный вид изогнутого листа сфотографированной тетради: перспектива +25%, изгиб листа +20 px',
    descEn: 'Realistic tilted notebook photo: +25% perspective tilt and +20px sheet curvature bulge',
    sampleTextRu: SAMPLE_TEXTS.physics,
    sampleTextEn: SAMPLE_TEXTS_EN.physics,
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
    nameRu: 'Строгая лекция (Чёрная гелевая ручка)',
    nameEn: 'Formal Lecture (Black Gel Pen)',
    catRu: 'Университет',
    catEn: 'University',
    descRu: 'Чёрные насыщенные чернила, шрифт Kelly Slab, ровные аккуратные строки',
    descEn: 'Deep black ink, straight Kelly Slab print font, perfectly spaced lines',
    sampleTextRu: SAMPLE_TEXTS.math_uni,
    sampleTextEn: SAMPLE_TEXTS_EN.math_uni,
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

export function getBuiltinPresets(lang = 'ru') {
  const isEn = lang === 'en';
  return BUILTIN_TEMPLATE_DEFINITIONS.map((p) => ({
    id: p.id,
    name: isEn ? p.nameEn : p.nameRu,
    category: isEn ? p.catEn : p.catRu,
    description: isEn ? p.descEn : p.descRu,
    sampleText: isEn ? p.sampleTextEn : p.sampleTextRu,
    isBuiltin: true,
    config: p.config,
  }));
}

export const BUILTIN_PRESETS = getBuiltinPresets('ru');

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
