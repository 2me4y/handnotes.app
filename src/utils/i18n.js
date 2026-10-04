/**
 * Internationalization (i18n) module for handnotes.app
 * Provides complete English & Russian UI translations and localized sample texts
 */

export const SAMPLE_TEXTS_EN = {
  algebra: `Classwork
Topic: Quadratic Equations & Vieta's Formulas

Standard form of a quadratic equation:
ax² + bx + c = 0, where a ≠ 0.

Discriminant formula:
D = b² - 4ac

1) If D > 0 — two distinct real roots:
x₁,₂ = (-b ± √D) / (2a)

2) If D = 0 — one repeating real root:
x = -b / (2a)

3) If D < 0 — no real roots (complex roots).

Vieta's Formulas (for x² + px + q = 0):
x₁ + x₂ = -p
x₁ · x₂ = q

Example: x² - 5x + 6 = 0
D = 25 - 24 = 1 > 0
x₁ = (5 + 1) / 2 = 3;  x₂ = (5 - 1) / 2 = 2.
Answer: x₁ = 3; x₂ = 2.`,

  russian: `Homework
Essay Assignment: Literary Analysis

Theme: The Archetype of the Tragic Hero in Classic Literature

In literary analysis, the tragic hero represents a complex figure driven by ambition, pride, or a fatal flaw (hamartia).

Key Characteristics:
1. Noble stature and inherent greatness.
2. A tragic flaw leading to a reversal of fortune (peripeteia).
3. The moment of profound realization (anagnorisis).
4. Catharsis experienced by the audience upon the final catastrophe.

Assignment Tasks:
• Identify the core internal conflict of the protagonist.
• Trace the progression from flaw to downfall across three key scenes.
• Compose a critical evaluation of the resolution.`,

  physics: `Lecture 4: Fundamentals of Thermodynamics

1. The First Law of Thermodynamics
The heat Q added to a thermodynamic system equals the change in its internal energy ΔU plus the work W done by the system on its surroundings:
Q = ΔU + W

2. Gas Processes in Ideal Gases:
a) Isothermal process (T = const, Boyle's Law):
P · V = const, ΔU = 0, Q = W.

b) Isobaric process (P = const, Charles's Law):
V / T = const, W = P · ΔV.

c) Isochoric process (V = const, Gay-Lussac's Law):
P / T = const, W = 0, Q = ΔU.

Conclusion: in an isochoric heating process, all thermal energy directly increases the kinetic energy of the gas molecules.`,

  chemistry: `Chemistry: Hydrocarbons — Alkanes & Alkenes

1. Saturated Hydrocarbons (Alkanes):
General formula: CₙH₂ₙ₊₂
Hybridization of carbon: sp³ (tetrahedral bond angle 109°28').

Chemical properties of methane:
• Combustion: CH₄ + 2O₂ → CO₂ + 2H₂O + 890 kJ
• Free-radical halogenation (under UV light hν):
  CH₄ + Cl₂ → CH₃Cl + HCl (chloromethane)
  CH₃Cl + Cl₂ → CH₂Cl₂ + HCl (dichloromethane)

2. Unsaturated Hydrocarbons (Alkenes):
General formula: CₙH₂ₙ
Presence of double bond (1 σ-bond and 1 π-bond, sp² hybridization).
Qualitative tests:
• Decolorization of bromine water (Br₂ solution);
• Decolorization of potassium permanganate (KMnO₄, Baeyer's test).`,

  biology: `Biology: Eukaryotic Cell Structure & Function

1. Cell Surface Apparatus:
Plasma membrane (phospholipid bilayer embedded with proteins).
Functions: selective barrier, transport (endocytosis, diffusion), signaling.

2. Cytoplasm and Essential Organelles:
• Mitochondria: double-membrane organelle with cristae; synthesis of ATP via oxidative phosphorylation (powerhouse of the cell).
• Endoplasmic Reticulum (ER):
  - Rough ER (ribosome-studded) — protein synthesis and folding;
  - Smooth ER — lipid synthesis and detoxification.
• Golgi Apparatus: modification, sorting, and packaging of proteins.
• Lysosomes: hydrolytic enzymes for intracellular digestion.

3. Cell Nucleus: chromatin (DNA + histones), nucleolus (ribosome biogenesis).`,

  history: `Topic: The Age of Discovery (15th–17th Centuries)

Historical Background & Motives:
1. Need for alternative maritime trade routes to India bypassing Ottoman monopolies.
2. Development of the caravel ship and astrolabe navigational technology.
3. Advances in cartography and acceptance of spherical Earth geography.

Chronology of Key Expeditions:
• 1492 — Christopher Columbus expedition lands in the Bahamas (New World).
• 1498 — Vasco da Gama navigates the Cape route reaching Calicut, India.
• 1519–1522 — First global circumnavigation led by Ferdinand Magellan.

Global Consequences:
Emergence of worldwide trade networks, migration, cultural exchange, and the rise of modern global commerce.`,

  programming: `Lecture Notes: Introduction to Data Structures

1. Arrays
Contiguous memory collection with instant index access in O(1) time.
Advantages: rapid read performance.
Disadvantages: costly middle insertions and resizing in O(n).

2. Linked Lists
Composed of nodes, each containing a value and pointer to the next node.
Insertion at head: O(1).
Search complexity: O(n).

3. Stack (LIFO) and Queue (FIFO)
• Stack: Last-In, First-Out (push, pop operations).
• Queue: First-In, First-Out (enqueue, dequeue operations).

Applications: Depth-First Search (DFS), Breadth-First Search (BFS), recursion call stack management.`,

  math_uni: `Lecture 7: Linear Algebra & Matrix Theory

1. Definition: A matrix of dimension m × n is a rectangular array of numbers arranged into m rows and n columns.

2. Fundamental Matrix Operations:
• Addition A + B: element-wise; defined only for matrices of identical dimensions.
• Scalar Multiplication: k · A.
• Matrix Product: C = A · B. Valid only when column count of A equals row count of B!
• Transposition: rows swapped with columns (Aᵀ).

3. Determinant Properties (det A):
• det(A · B) = det(A) · det(B);
• Swapping any two rows reverses the sign of the determinant;
• Cramer's Rule: if det(A) ≠ 0, system has a unique solution: xᵢ = Δᵢ / Δ.`,

  english: `English Grammar: Mastering Verb Tenses

1. Present Simple vs Present Continuous
• Present Simple: habitual actions, universal truths.
  Formula: Subject + V₁(s/es)
  Example: Water boils at 100 degrees Celsius.
  Time markers: always, usually, often, every day.

• Present Continuous: actions in progress right now.
  Formula: Subject + am/is/are + V-ing
  Example: We are writing our lecture notes right now.
  Time markers: now, at the moment, currently.

2. Present Perfect: past action with present relevance!
  Formula: Subject + have/has + V₃(ed)
  Example: I have already completed all the exercises!
  Time markers: already, yet, ever, never, recently.

Common Idioms:
- In a nutshell (briefly stated)
- Piece of cake (effortless task)
- On the same page (in mutual agreement)`,

  lab_work: `Laboratory Report 3

Topic: Investigating Simple Pendulum Oscillations.
Objective: Experimental determination of gravitational acceleration (g).

Apparatus & Equipment:
Support stand with clamp, fine thread, steel bob, digital stopwatch, measuring tape.

Theoretical Equation:
T = 2π · √(L / g)   ⇒   g = 4π² · L / T²

Experimental Procedure:
1. Pendulum length: L = 1.000 m ± 0.005 m.
2. Number of oscillations: N = 30.
3. Total elapsed time: t = 60.3 s.
4. Period: T = t / N = 2.01 s.
5. Calculated value: g = 4 · (3.1416)² · 1.00 / (2.01)² ≈ 9.77 m/s².

Conclusion: The experimental value g ≈ 9.8 m/s² closely matches the standard gravitational acceleration within measurement uncertainty limits.`,

  bujo: `★ WEEKLY PLANNER & HABIT TRACKER ★

Priority Objectives:
[✓] Complete project documentation (Section 1-2)
[✓] Finish database design assignment
[ ] Submit physics laboratory report
[ ] Prepare for mathematics colloquium

Schedule & Classes:
• Monday 10:00 — Advanced Calculus (Room 312)
• Wednesday 12:00 — Algorithms & Data Structures
• Friday 14:00 — Laboratory Workshop

Habit Tracker:
1. Drink 2L water:       Mon[+] Tue[+] Wed[+] Thu[ ] Fri[ ]
2. Read 30 minutes:      Mon[+] Tue[+] Wed[+] Thu[ ] Fri[ ]
3. Exercise / Workout:   Mon[+] Tue[+] Wed[ ] Thu[ ] Fri[ ]`,

  cursive_copybook: `Cursive Penmanship: Practice Sheet

Aa  Bb  Cc  Dd  Ee  Ff  Gg  Hh
Ii  Jj  Kk  Ll  Mm  Nn  Oo  Pp

The quick brown fox jumps over the lazy dog.
A gentle breeze whispered through the autumn trees.

Practice with rhythm, steady slant, and even spacing!
Patience and consistency create beautiful handwriting.`,
};

export const TRANSLATIONS = {
  ru: {
    // Header
    brandTitle: 'handnotes',
    brandDomain: '.app',
    brandBadge: 'STUDIO',
    pageIndicator: 'Стр. {current} из {total}',
    prevPage: 'Предыдущая страница',
    nextPage: 'Следующая страница',
    guidesBtn: 'Разметка',
    guidesHide: 'Скрыть разметку',
    guidesShow: 'Показать направляющие линии',
    zoomOut: 'Уменьшить масштаб',
    zoomIn: 'Увеличить масштаб',
    zoomFit: 'Вписать в экран',
    resetBtn: 'Сброс',
    resetTitle: 'Сбросить все настройки к начальным значениям',
    themeLight: 'Переключить на светлую тему',
    themeDark: 'Переключить на тёмную тему',
    downloadPng: 'Скачать PNG',
    downloadPdf: 'PDF',
    printBtn: 'Распечатать',
    sidebarToggleHide: 'Скрыть панель',
    sidebarToggleShow: 'Панель',
    sidebarToggleTitleHide: 'Скрыть боковую панель (Ctrl+B)',
    sidebarToggleTitleShow: 'Показать боковую панель (Ctrl+B)',
    floatingOpenSidebar: 'Панель настроек',
    langName: 'Язык',
    langToggleTitle: 'Switch to English / Переключить язык',

    // Tabs
    tabText: 'Текст',
    tabFont: 'Шрифт',
    tabPaper: 'Тетрадь',
    tabLayout: 'Поля',
    tabPresets: 'Пресеты',
    tabExport: 'Экспорт',

    // Tab 1: Text
    blocksTitle: 'Блоки текста',
    newBlockBtn: 'Новый блок',
    blockPlaceholder: 'Блок {num}',
    editingBlock: 'Редактируется:',
    renameBlockHint: 'Нажмите, чтобы переименовать этот блок',
    duplicateBlock: 'Копия',
    deleteBlock: 'Удалить',
    confirmDeleteBlock: 'Удалить "{name}"?',
    notesTextTitle: 'Текст конспекта',
    examplesLabel: 'Примеры:',
    sampleAlgebra: 'Алгебра',
    sampleRussian: 'Русский',
    samplePhysics: 'Физика',
    sampleChemistry: 'Химия',
    sampleBiology: 'Биология',
    sampleHistory: 'История',
    sampleProgramming: 'IT',
    sampleEnglish: 'English',
    sampleLab: 'Лаб. работа',
    sampleBujo: 'Планер',
    sampleCopybook: 'Прописи',
    textareaPlaceholder: 'Введите или вставьте сюда текст вашей лекции или конспекта...',
    templateShortcutTitle: 'Готовые шаблоны тетрадей ({count})',
    templateShortcutSub: 'Школа, университет, формулы, линейка, прописи, планер',
    statChars: 'Символов:',
    statWords: 'Слов:',
    statLines: 'Строк:',
    statPages: 'Страниц:',

    // Tab 2: Font
    fontSectionTitle: 'Параметры почерка и ручки',
    fontUploadBtn: 'Загрузить свой шрифт (.ttf, .otf, .woff)',
    fontSizeLabel: 'Размер шрифта',
    lineHeightLabel: 'Межстрочный интервал',
    letterSpacingLabel: 'Интервал букв',
    fontWeightLabel: 'Толщина линии',
    slantAngleLabel: 'Наклон почерка',
    inkColorLabel: 'Цвет чернил',
    inkOpacityLabel: 'Прозрачность пасты',
    jitterLabel: 'Естественное дрожание руки',
    alignLabel: 'Выравнивание',
    alignLeft: 'По левому краю',
    alignCenter: 'По центру',
    alignRight: 'По правому краю',
    alignJustify: 'По ширине',

    // Tab 3: Paper
    paperSectionTitle: 'Формат листа и фон',
    formatPortrait: '1 лист (A4)',
    formatSpread: '2 листа (Разворот)',
    formatAuto: 'По фото (100%)',
    uploadPhotoBtn: 'Загрузить фото своей тетради',
    removePhotoBtn: 'Удалить фото',
    photoFitContain: 'Вписать целиком (без обрезки)',
    photoFitCover: 'Заполнить холст (Cover)',
    builtinSheetsLabel: 'Встроенные тетрадные листы ({count})',
    marginLineLabel: 'Красная линия полей',
    adjustmentsLabel: 'Коррекция бумажного фона',
    adjustmentsPhotoLabel: 'Регулировка фото тетради',
    resetBtnSmall: 'Сбросить',
    brightnessLabel: 'Яркость (отбеливание)',
    contrastLabel: 'Контрастность',
    saturationLabel: 'Насыщенность',
    rotationLabel: 'Поворот фото',
    scaleLabel: 'Масштаб (зум фото)',
    panXLabel: 'Сдвиг по горизонтали (X)',
    panYLabel: 'Сдвиг по вертикали (Y)',

    // Tab 4: Layout
    layoutSectionTitle: 'Поля и отступы (px)',
    marginTopLabel: 'Верхнее поле',
    marginLeftLabel: 'Левое поле',
    marginRightLabel: 'Правое поле',
    marginBottomLabel: 'Нижнее поле',
    paragraphIndentLabel: 'Красная строка',
    enableParagraphIndent: 'Включить красную строку',
    spatialSectionTitle: '3D Перспектива и наклон листа',
    perspectiveYLabel: 'Трапеция (перспектива верх/низ)',
    perspectiveXLabel: 'Перспектива лево/право',
    rotationBlockLabel: 'Поворот всего текста',
    lineSlopeLabel: 'Наклон строк текста',
    bulgeSectionTitle: 'Изгиб и неровность тетради',
    pageBulgeLabel: 'Выпуклость листа (бугорок)',
    bulgeCenterLabel: 'Смещение центра изгиба',
    ovalCurvatureLabel: 'Овальное искривление',

    // Tab 5: Presets
    presetsSectionTitle: 'Сохранение и шаблоны',
    savePresetInputPlaceholder: 'Название пресета (например: Мой конспект)...',
    savePresetBtn: 'Сохранить пресет',
    presetSavedToast: 'Пресет успешно сохранён! Теперь он доступен в списке ниже.',
    mySavedPresets: 'Мои сохранённые пресеты ({count})',
    importJsonBtn: 'Импорт .json',
    noPresetsTitle: 'У вас пока нет сохранённых пресетов',
    noPresetsSub: 'Настройте стиль листа и нажмите «Сохранить пресет» выше!',
    applyBtn: 'Применить',
    appliedToast: 'Применён!',
    exportJsonBtn: 'Файл',
    deletePresetConfirm: 'Удалить пресет "{name}"?',
    builtinTemplatesTitle: 'Готовые встроенные шаблоны ({count})',
    catAll: 'Все шаблоны',
    catSchool: 'Школа',
    catUni: 'Университет',
    catScience: 'Наука',
    catLanguages: 'Языки',
    catPlanner: 'Планер',
    cat3D: '3D Эффект',
    applyAllBtn: 'Применить всё (стиль + текст)',
    applyStyleOnlyBtn: 'Только стиль',
    appliedAllToast: 'Шаблон и текст загружены!',
    appliedStyleToast: 'Стиль применён!',
    tagFont: 'Шрифт:',
    tagPaper: 'Лист:',
    tagLine: 'Строка:',
    paperGrid: 'Клетка',
    paperLined: 'Линейка',
    paperSlanted: 'Косая',
    paperDots: 'Точки',
    paperVintage: 'Крафт',
    paperBlank: 'Лист',

    // Tab 6: Export
    exportSectionTitle: 'Экспорт и сохранение',
    exportPngTitle: 'Скачать как PNG',
    exportPngDesc: 'Текущая страница в сверхвысоком разрешении (1400×1980 px)',
    exportJpgTitle: 'Скачать как JPG',
    exportJpgDesc: 'Оптимизированное сжатие для мессенджеров и соцсетей',
    exportPdfTitle: 'Сохранить весь конспект в PDF',
    exportPdfDesc: 'Все страницы документа в одном готовом PDF-файле A4',
    exportPrintTitle: 'Печать на принтере',
    exportPrintDesc: 'Прямая печать через диалоговое окно браузера (Ctrl+P)',

    // Canvas toolbar & HUD
    canvasBlocksLabel: 'Блоки ({count}):',
    canvasAddBlockBtn: 'Блок',
    canvasAddBlockTitle: 'Добавить ещё один независимый блок текста на этот лист',
    canvasSelectBlockTitle: 'Выбрать для редактирования: "{name}"',
    hudMove: 'Перемещение',
    hudPan: 'Рука (сдвиг)',
    hudResetZoom: 'Клик, чтобы сбросить в 100%',
    canvasPageTag: 'Лист {num}',
    resetAllConfirm: 'Сбросить все настройки текста, полей, наклона и перспективы к исходным значениям?',
    toolbarMoveText: 'Перемещать текст',
    toolbarMoveTextTitle: 'Зажмите и перетаскивайте текст мышью прямо по листу тетради',
    toolbarMovePhoto: 'Перемещать фото',
    toolbarMovePhotoTitle: 'Перетаскивать фото тетради мышью',
    toolbarLeftAlign: 'Влево',
    toolbarLeftAlignTitle: 'Прижать текст к левому краю листа (50px)',
    toolbarSchoolMargins: 'Школьные поля',
    toolbarSchoolMarginsTitle: 'Выровнять по школьным полям тетради (290px)',
    toolbarTrapezoid: 'Трапеция',
    toolbarTrapezoidTitle: 'Переключить 3D перспективу (Трапеция: верх уже, низ шире)',
    toolbarBulge: 'Бугорок',
    toolbarBulgeTitle: 'Переключить изгиб строк (Бугорок листа +25px)',
    toolbarMeshCalib: 'Калибровка строк',
    toolbarMeshCalibTitle: 'Калибровка строк по точкам: совместите линии со строками на фото тетради',
    toolbarSheet1: '1 лист',
    toolbarSheet1Title: 'Переключить на 1 лист (Портрет 1400×1980)',
    toolbarSheet2: '2 листа',
    toolbarSheet2Title: 'Переключить на 2 листа (Разворот 2400×1600)',
    toolbarPhoto100: '100% фото',
    toolbarPhoto100Title: 'Вписать фото 100% без обрезки',
    toolbarLeftSheet: '◀ Левый',
    toolbarLeftSheetTitle: 'Поместить текст на левый лист',
    toolbarBothSheets: 'Оба листа',
    toolbarBothSheetsTitle: 'Текст на оба листа разворота (2 колонки)',
    toolbarRightSheet: 'Правый ▶',
    toolbarRightSheetTitle: 'Поместить текст на правый лист',
    toolbarResetBtn: 'Сброс',
    toolbarResetTitle: 'Сбросить все параметры и наклон текста',
    calibBannerTitle: 'Калибровка строк по фото:',
    calibBannerText: 'Перетаскивайте точки прямо на строки тетради:',
    calibTagLeft: '🔴 Слева',
    calibTagMid: '🟡 В центре (изгиб/бугор)',
    calibTagRight: '🟢 Справа',
    calibBannerSuffix: '— текст автоматически ложится на эти линии!',
    calibResetMesh: 'Сбросить сетку',
    calibResetMeshTitle: 'Вернуть исходную ровную сетку',
    calibDone: 'Готово',
    calibDoneTitle: 'Применить и скрыть направляющие',
    hudHand: 'Рука',
    hudHandTitle: 'Инструмент «Рука» (или зажмите Пробел и тяните мышь)',
    hudZoomOutTitle: 'Уменьшить масштаб (Ctrl + Колёсико вниз)',
    hudZoomInTitle: 'Увеличить масштаб (Ctrl + Колёсико вверх)',
    hudResetZoomTitle: 'Нажмите, чтобы сбросить на 100%',
    hudFitBtn: 'Вписать',
    hudFitTitle: 'Вписать весь лист в экран',
    hudResetCenterTitle: 'Вернуть лист в центр',
    sheetPageNumber: 'Страница {num}',
    resizeWidthHint: 'Потяните, чтобы изменить ширину текста (правое поле)',
    resizeBottomHint: 'Потяните, чтобы изменить нижнюю границу',

    // Sidebar text & font & paper & layout details
    baseFontsTitle: 'Базовые рукописные шрифты',
    fontPreviewSample: 'Конспект лекции',
    loadedFontTag: 'Загружен',
    deleteFontTitle: 'Удалить шрифт',
    slantStraight: 'Прямо (0°)',
    slantLeft: '← Влево',
    slantRight: 'Вправо →',
    quick20Dense: '20 px (Мин)',
    quick35Cell: '35 px (1 кл.)',
    quick70Cell: '70 px (2 кл.)',
    lineHeightHint: 'Совет: 20 px — плотные строки, 35 px — 1 клетка, 70 px — 2 клетки',
    weightNormal: 'Обычная',
    weightMedium: 'Средняя',
    weightBold: 'Жирная',
    reset3dBtn: 'Сбросить 3D',
    perspTrapezoidTitle: '3D Перспектива и ракурс (Трапеция)',
    perspTrapezoidLabel: 'Трапеция (Верх уже / Низ шире)',
    perspTrapezoidHint: 'Верх текста сужается, а низ расширяется для соответствия фото тетради на столе',
    perspStraight: 'Прямо (0%)',
    perspModerate: 'Умеренный (+20%)',
    perspDesk: 'Стол (+35%)',
    textRotationLabel: 'Поворот текста (по строкам фото)',
    lineSlopeLabel: 'Наклон строк вверх / вниз',
    perspSideLabel: 'Боковая перспектива (Сдвиг)',
    curvatureSectionTitle: 'Искривление листа и бугорки (Неровная бумага)',
    flattenBtn: 'Выпрямить',
    curvatureArcLabel: 'Бугорок / Прогиб строк (Дуга)',
    curvatureArcHint: 'Выгибает строки дугой: вверх (бугорок на столе) или вниз (прогиб листа)',
    curvatureStraight: 'Прямо (0)',
    curvatureBulge20: 'Бугорок (+20px)',
    curvatureBulge35: 'Выпуклый (+35px)',
    curvatureSag20: 'Прогиб (-20px)',
    bulgeApexLabel: 'Смещение вершины изгиба (Корешок)',
    spineLeft: '← Корешок слева (-30%)',
    spineCenter: 'Центр (0%)',
    spineRight: 'Справа (+30%) →',
    ovalBarrelLabel: 'Овал страницы (Бочка)',
    ovalBarrelHint: 'Широкие строки в середине страницы и сужение к краям (овальный контур)',
    inkOpacityLabel2: 'Плотность нажима чернил',
    jitterTitle: 'Живой почерк (неровности)',
    jitterHint: 'Имитирует дрожание руки, живую вариацию угла букв и высоты строк',
    photoYourActive: 'Ваше фото активно',
    photoReplace: 'Заменить',
    photoDelete: 'Удалить',
    photoDeleteTitle: 'Удалить фото и вернуться к пресетам',
    photoDropTitle: 'Нажмите или перетащите фото сюда',
    photoDropSub: 'JPG, PNG, WebP (фото настоящего тетрадного листа)',
    photoFormatTitle: 'Формат тетради',
    photoFormat1Sheet: '📄 1 лист',
    photoFormat1SheetTitle: 'Один вертикальный лист (1400×1980)',
    photoFormatSpread: '📖 2 листа (Разворот)',
    photoFormatSpreadTitle: 'Разворот на 2 страницы (2400×1600)',
    photoFormatAuto: '📷 По фото (100%)',
    photoFormatAutoTitle: 'Адаптировать холст под пропорции загруженного фото без обрезки',
    photoFitLabel: 'Отображение фото',
    photoFitCanvasBtn: 'Подогнать холст под фото',
    photoFitContainTitle: 'Вписать целиком (100% без обрезки)',
    photoFitCoverTitle: 'Заполнить холст (Cover)',
    photoBrightnessLabel: 'Яркость (отбеливание)',
    photoContrastLabel: 'Контраст',
    photoSaturationLabel: 'Насыщенность',
    photoRotationLabel: 'Поворот фото (выравнивание)',
    photoScaleLabel: 'Масштаб фото (Зум)',
    photoOffsetXLabel: 'Смещение по горизонтали (X)',
    photoOffsetYLabel: 'Смещение по вертикали (Y)',
    dragTextAdvice: 'Совет: Вы можете просто зажать и перетаскивать текст мышью прямо по листу тетради!',
    colsSpreadLabel: 'Колонки текста (Разворот)',
    cols1Col: '1 колонка',
    cols2Col: '📖 2 колонки (Разворот)',
    leftSheetTitle: 'Разместить текст только на левой странице',
    bothSheetsTitle: 'Текст на оба листа разворота',
    rightSheetTitle: 'Разместить текст только на правой странице',
    gutterLabel: 'Зазор между страницами (Корешок)',
    marginSchoolChip: 'Школьные поля (290px)',
    marginLeftChip: 'К левому краю (40px)',
    marginsPresetSchool: 'Стандартная школьная тетрадь',
    marginsPresetNarrow: 'Узкие поля (А4)',
    quickMarginsLabel: 'Быстрые пресеты полей:',
    resetAllDefaults: 'Сбросить все настройки по умолчанию',
    resetAllDefaultsTitle: 'Сбросить все настройки текста, полей и наклона к начальным',
    saveCurrentAsPresetTitle: 'Сохранить текущие настройки как пресет',
    savePresetExpl: 'Сохраните текущий шрифт, межстрочный интервал, цвет чернил, поля и 3D-наклон. В будущем вы сможете применить этот стиль в 1 клик!',
    pleaseEnterPresetName: 'Пожалуйста, введите название пресета',
    clearTextBtn: 'Очистить текст',
  },

  en: {
    // Header
    brandTitle: 'handnotes',
    brandDomain: '.app',
    brandBadge: 'STUDIO',
    pageIndicator: 'Page {current} of {total}',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    guidesBtn: 'Guides',
    guidesHide: 'Hide layout guides',
    guidesShow: 'Show layout guide lines',
    zoomOut: 'Zoom out',
    zoomIn: 'Zoom in',
    zoomFit: 'Fit to screen',
    resetBtn: 'Reset',
    resetTitle: 'Reset all settings to default values',
    themeLight: 'Switch to light theme',
    themeDark: 'Switch to dark theme',
    downloadPng: 'Download PNG',
    downloadPdf: 'PDF',
    printBtn: 'Print',
    sidebarToggleHide: 'Hide panel',
    sidebarToggleShow: 'Sidebar',
    sidebarToggleTitleHide: 'Hide sidebar panel (Ctrl+B)',
    sidebarToggleTitleShow: 'Show sidebar panel (Ctrl+B)',
    floatingOpenSidebar: 'Settings panel',
    langName: 'Language',
    langToggleTitle: 'Переключить на русский / Switch language',

    // Tabs
    tabText: 'Text',
    tabFont: 'Font',
    tabPaper: 'Paper',
    tabLayout: 'Layout',
    tabPresets: 'Presets',
    tabExport: 'Export',

    // Tab 1: Text
    blocksTitle: 'Text Blocks',
    newBlockBtn: 'New block',
    blockPlaceholder: 'Block {num}',
    editingBlock: 'Editing:',
    renameBlockHint: 'Click to rename this block',
    duplicateBlock: 'Copy',
    deleteBlock: 'Delete',
    confirmDeleteBlock: 'Delete "{name}"?',
    notesTextTitle: 'Notes Content',
    examplesLabel: 'Examples:',
    sampleAlgebra: 'Algebra',
    sampleRussian: 'Essay',
    samplePhysics: 'Physics',
    sampleChemistry: 'Chemistry',
    sampleBiology: 'Biology',
    sampleHistory: 'History',
    sampleProgramming: 'CompSci',
    sampleEnglish: 'Grammar',
    sampleLab: 'Lab Report',
    sampleBujo: 'Planner',
    sampleCopybook: 'Cursive',
    textareaPlaceholder: 'Type or paste your lecture notes or study material here...',
    templateShortcutTitle: 'Ready Notebook Templates ({count})',
    templateShortcutSub: 'School, university, formulas, ruled paper, penmanship, planner',
    statChars: 'Characters:',
    statWords: 'Words:',
    statLines: 'Lines:',
    statPages: 'Pages:',

    // Tab 2: Font
    fontSectionTitle: 'Handwriting & Pen Settings',
    fontUploadBtn: 'Upload custom font (.ttf, .otf, .woff)',
    fontSizeLabel: 'Font size',
    lineHeightLabel: 'Line spacing (leading)',
    letterSpacingLabel: 'Letter spacing',
    fontWeightLabel: 'Pen thickness',
    slantAngleLabel: 'Slant / tilt angle',
    inkColorLabel: 'Ink color',
    inkOpacityLabel: 'Ink opacity',
    jitterLabel: 'Natural hand tremor',
    alignLabel: 'Alignment',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    alignJustify: 'Justify',

    // Tab 3: Paper
    paperSectionTitle: 'Sheet Format & Background',
    formatPortrait: '1 Sheet (A4)',
    formatSpread: '2 Sheets (Spread)',
    formatAuto: 'Auto Fit Photo (100%)',
    uploadPhotoBtn: 'Upload photo of your notebook',
    removePhotoBtn: 'Remove photo',
    photoFitContain: 'Fit entire image (no cropping)',
    photoFitCover: 'Fill canvas (Cover)',
    builtinSheetsLabel: 'Built-in Notebook Sheets ({count})',
    marginLineLabel: 'Red margin line',
    adjustmentsLabel: 'Paper Background Adjustments',
    adjustmentsPhotoLabel: 'Notebook Photo Adjustments',
    resetBtnSmall: 'Reset',
    brightnessLabel: 'Brightness (whitening)',
    contrastLabel: 'Contrast',
    saturationLabel: 'Saturation',
    rotationLabel: 'Photo rotation',
    scaleLabel: 'Scale (photo zoom)',
    panXLabel: 'Horizontal offset (X)',
    panYLabel: 'Vertical offset (Y)',

    // Tab 4: Layout
    layoutSectionTitle: 'Margins & Padding (px)',
    marginTopLabel: 'Top margin',
    marginLeftLabel: 'Left margin',
    marginRightLabel: 'Right margin',
    marginBottomLabel: 'Bottom margin',
    paragraphIndentLabel: 'Paragraph indent',
    enableParagraphIndent: 'Enable paragraph indent',
    spatialSectionTitle: '3D Perspective & Spatial Tilt',
    perspectiveYLabel: 'Keystone / vertical perspective',
    perspectiveXLabel: 'Horizontal perspective',
    rotationBlockLabel: 'Overall text block rotation',
    lineSlopeLabel: 'Line skew slope',
    bulgeSectionTitle: 'Sheet Curvature & Page Arch',
    pageBulgeLabel: 'Vertical page bulge',
    bulgeCenterLabel: 'Bulge center shift',
    ovalCurvatureLabel: 'Oval middle curvature',

    // Tab 5: Presets
    presetsSectionTitle: 'Saved Presets & Templates',
    savePresetInputPlaceholder: 'Preset title (e.g. My Physics Notes)...',
    savePresetBtn: 'Save preset',
    presetSavedToast: 'Preset saved successfully! It is now available below.',
    mySavedPresets: 'My Saved Presets ({count})',
    importJsonBtn: 'Import .json',
    noPresetsTitle: 'No saved presets yet',
    noPresetsSub: 'Customize your sheet style and click "Save preset" above!',
    applyBtn: 'Apply',
    appliedToast: 'Applied!',
    exportJsonBtn: 'File',
    deletePresetConfirm: 'Delete preset "{name}"?',
    builtinTemplatesTitle: 'Built-in Ready Templates ({count})',
    catAll: 'All Templates',
    catSchool: 'School',
    catUni: 'University',
    catScience: 'Science',
    catLanguages: 'Languages',
    catPlanner: 'Planner',
    cat3D: '3D Effect',
    applyAllBtn: 'Apply all (style + text)',
    applyStyleOnlyBtn: 'Style only',
    appliedAllToast: 'Template and text applied!',
    appliedStyleToast: 'Style applied!',
    tagFont: 'Font:',
    tagPaper: 'Sheet:',
    tagLine: 'Line:',
    paperGrid: 'Grid',
    paperLined: 'Lined',
    paperSlanted: 'Slanted',
    paperDots: 'Dots',
    paperVintage: 'Kraft',
    paperBlank: 'Blank',

    // Tab 6: Export
    exportSectionTitle: 'Export & Download',
    exportPngTitle: 'Download as PNG',
    exportPngDesc: 'Current page in ultra-high resolution (1400×1980 px)',
    exportJpgTitle: 'Download as JPG',
    exportJpgDesc: 'Optimized compression for messengers and social sharing',
    exportPdfTitle: 'Save full document as PDF',
    exportPdfDesc: 'All pages combined into a print-ready multi-page A4 PDF',
    exportPrintTitle: 'Print on paper',
    exportPrintDesc: 'Direct printing via browser print dialog (Ctrl+P)',

    // Canvas toolbar & HUD
    canvasBlocksLabel: 'Blocks ({count}):',
    canvasAddBlockBtn: 'Block',
    canvasAddBlockTitle: 'Add another independent text block to this sheet',
    canvasSelectBlockTitle: 'Select to edit: "{name}"',
    hudMove: 'Move Block',
    hudPan: 'Hand (Pan)',
    hudResetZoom: 'Click to reset zoom to 100%',
    canvasPageTag: 'Sheet {num}',
    resetAllConfirm: 'Reset all text, margins, slant, and 3D perspective settings to defaults?',
    toolbarMoveText: 'Move text',
    toolbarMoveTextTitle: 'Hold and drag text with mouse directly on the sheet',
    toolbarMovePhoto: 'Move photo',
    toolbarMovePhotoTitle: 'Drag notebook photo with mouse',
    toolbarLeftAlign: 'To left',
    toolbarLeftAlignTitle: 'Align text to left sheet edge (50px)',
    toolbarSchoolMargins: 'School margins',
    toolbarSchoolMarginsTitle: 'Align with classic school margins (290px)',
    toolbarTrapezoid: 'Keystone',
    toolbarTrapezoidTitle: 'Toggle 3D perspective (Keystone: top narrower, bottom wider)',
    toolbarBulge: 'Bulge',
    toolbarBulgeTitle: 'Toggle sheet bulge (+25px)',
    toolbarMeshCalib: 'Line calibration',
    toolbarMeshCalibTitle: 'Point-based line calibration: align guide points with lines on your photo',
    toolbarSheet1: '1 sheet',
    toolbarSheet1Title: 'Switch to single sheet (Portrait 1400×1980)',
    toolbarSheet2: '2 sheets',
    toolbarSheet2Title: 'Switch to 2-sheet spread (2400×1600)',
    toolbarPhoto100: '100% photo',
    toolbarPhoto100Title: 'Fit photo 100% without cropping',
    toolbarLeftSheet: '◀ Left',
    toolbarLeftSheetTitle: 'Place text on left sheet only',
    toolbarBothSheets: 'Both sheets',
    toolbarBothSheetsTitle: 'Flow text across both sheets (2 columns)',
    toolbarRightSheet: 'Right ▶',
    toolbarRightSheetTitle: 'Place text on right sheet only',
    toolbarResetBtn: 'Reset',
    toolbarResetTitle: 'Reset all text parameters and slant',
    calibBannerTitle: 'Line calibration by photo:',
    calibBannerText: 'Drag anchor points directly onto notebook lines:',
    calibTagLeft: '🔴 Left',
    calibTagMid: '🟡 Middle (curve/bulge)',
    calibTagRight: '🟢 Right',
    calibBannerSuffix: '— text automatically conforms to these lines!',
    calibResetMesh: 'Reset mesh',
    calibResetMeshTitle: 'Restore initial flat grid',
    calibDone: 'Done',
    calibDoneTitle: 'Apply and hide guides',
    hudHand: 'Hand',
    hudHandTitle: 'Hand Tool (or hold Space and drag mouse)',
    hudZoomOutTitle: 'Zoom out (Ctrl + Scroll down)',
    hudZoomInTitle: 'Zoom in (Ctrl + Scroll up)',
    hudResetZoomTitle: 'Click to reset to 100%',
    hudFitBtn: 'Fit',
    hudFitTitle: 'Fit entire sheet to screen',
    hudResetCenterTitle: 'Reset sheet to center',
    sheetPageNumber: 'Page {num}',
    resizeWidthHint: 'Drag to change text width (right margin)',
    resizeBottomHint: 'Drag to change bottom boundary',

    // Sidebar text & font & paper & layout details
    baseFontsTitle: 'Built-in Handwriting Fonts',
    fontPreviewSample: 'Lecture Notes',
    loadedFontTag: 'Custom',
    deleteFontTitle: 'Delete font',
    slantStraight: 'Upright (0°)',
    slantLeft: '← Left',
    slantRight: 'Right →',
    quick20Dense: '20 px (Dense)',
    quick35Cell: '35 px (1 cell)',
    quick70Cell: '70 px (2 cells)',
    lineHeightHint: 'Tip: 20 px dense lines, 35 px single grid cell, 70 px two grid cells',
    weightNormal: 'Regular',
    weightMedium: 'Medium',
    weightBold: 'Bold',
    reset3dBtn: 'Reset 3D',
    perspTrapezoidTitle: '3D Perspective & Spatial Angle',
    perspTrapezoidLabel: 'Keystone (Top narrower / Bottom wider)',
    perspTrapezoidHint: 'Top narrows and bottom widens to match angled notebook photos taken on a desk',
    perspStraight: 'Straight (0%)',
    perspModerate: 'Moderate (+20%)',
    perspDesk: 'Desk (+35%)',
    textRotationLabel: 'Text rotation (align with photo)',
    lineSlopeLabel: 'Line skew slope up / down',
    perspSideLabel: 'Side perspective (X Shift)',
    curvatureSectionTitle: 'Sheet Curvature & Page Arch (Uneven paper)',
    flattenBtn: 'Flatten',
    curvatureArcLabel: 'Page bulge / Line sag (Arc)',
    curvatureArcHint: 'Bends lines into an arc: upward (bulge) or downward (sag)',
    curvatureStraight: 'Straight (0)',
    curvatureBulge20: 'Bulge (+20px)',
    curvatureBulge35: 'Convex (+35px)',
    curvatureSag20: 'Sag (-20px)',
    bulgeApexLabel: 'Bulge apex shift (Notebook spine)',
    spineLeft: '← Left spine (-30%)',
    spineCenter: 'Center (0%)',
    spineRight: 'Right spine (+30%) →',
    ovalBarrelLabel: 'Page oval (Barrel distortion)',
    ovalBarrelHint: 'Wider lines in the center, tapering toward top and bottom edges',
    inkOpacityLabel2: 'Ink pressure density',
    jitterTitle: 'Natural handwriting jitter',
    jitterHint: 'Simulates hand tremor, slight angle variation, and baseline jitter',
    photoYourActive: 'Your photo is active',
    photoReplace: 'Replace',
    photoDelete: 'Delete',
    photoDeleteTitle: 'Remove photo and restore presets',
    photoDropTitle: 'Click or drag notebook photo here',
    photoDropSub: 'JPG, PNG, WebP (photo of real notebook paper)',
    photoFormatTitle: 'Notebook format',
    photoFormat1Sheet: '📄 1 sheet',
    photoFormat1SheetTitle: 'Single vertical sheet (1400×1980)',
    photoFormatSpread: '📖 2 sheets (Spread)',
    photoFormatSpreadTitle: '2-page spread (2400×1600)',
    photoFormatAuto: '📷 Auto (Photo 100%)',
    photoFormatAutoTitle: 'Fit canvas aspect ratio to uploaded photo without cropping',
    photoFitLabel: 'Photo fitting',
    photoFitCanvasBtn: 'Fit canvas to photo',
    photoFitContainTitle: 'Fit entire photo (100% no cropping)',
    photoFitCoverTitle: 'Fill canvas (Cover)',
    photoBrightnessLabel: 'Brightness (whitening)',
    photoContrastLabel: 'Contrast',
    photoSaturationLabel: 'Saturation',
    photoRotationLabel: 'Photo rotation',
    photoScaleLabel: 'Scale (Photo zoom)',
    photoOffsetXLabel: 'Horizontal offset (X)',
    photoOffsetYLabel: 'Vertical offset (Y)',
    dragTextAdvice: 'Tip: You can simply hold and drag text with your mouse directly on the sheet!',
    colsSpreadLabel: 'Text columns (Spread)',
    cols1Col: '1 column',
    cols2Col: '📖 2 columns (Spread)',
    leftSheetTitle: 'Place text on left page only',
    bothSheetsTitle: 'Place text across both spread pages',
    rightSheetTitle: 'Place text on right page only',
    gutterLabel: 'Page gutter (Spine gap)',
    marginSchoolChip: 'School margin (290px)',
    marginLeftChip: 'Left edge (40px)',
    marginsPresetSchool: 'Standard school notebook',
    marginsPresetNarrow: 'Narrow margins (A4)',
    quickMarginsLabel: 'Quick margin presets:',
    resetAllDefaults: 'Reset all settings to default',
    resetAllDefaultsTitle: 'Reset text, margins, and slant to defaults',
    saveCurrentAsPresetTitle: 'Save current settings as preset',
    savePresetExpl: 'Save font, line spacing, ink color, margins and 3D slant to apply anytime in 1 click!',
    pleaseEnterPresetName: 'Please enter a preset name',
    clearTextBtn: 'Clear text',
  },
};

/**
 * Automatically formats default block names depending on current UI language.
 * (e.g., 'Блок 1 (Основной текст)' -> 'Block 1 (Main Text)', 'Блок 2' -> 'Block 2')
 * Custom user-renamed blocks remain untouched.
 */
export function formatBlockName(nameOrBlock, idx = 0, lang = 'ru') {
  const rawName = (typeof nameOrBlock === 'object' && nameOrBlock !== null) ? nameOrBlock.name : nameOrBlock;
  if (!rawName) return lang === 'en' ? `Block ${idx + 1}` : `Блок ${idx + 1}`;

  if (lang === 'en') {
    if (rawName === 'Блок 1 (Основной текст)' || rawName === 'Block 1 (Main Text)') {
      return 'Block 1 (Main Text)';
    }
    const match = String(rawName).match(/^Блок\s+(\d+)(.*)$/i);
    if (match) {
      const suffix = (match[2] || '').replace(/\(Копия\)/gi, '(Copy)');
      return `Block ${match[1]}${suffix}`;
    }
  } else {
    if (rawName === 'Block 1 (Main Text)' || rawName === 'Блок 1 (Основной текст)') {
      return 'Блок 1 (Основной текст)';
    }
    const match = String(rawName).match(/^Block\s+(\d+)(.*)$/i);
    if (match) {
      const suffix = (match[2] || '').replace(/\(Copy\)/gi, '(Копия)');
      return `Блок ${match[1]}${suffix}`;
    }
  }
  return rawName;
}
