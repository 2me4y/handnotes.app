import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PanelLeftOpen } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotebookCanvas from './components/NotebookCanvas';
import { DEFAULT_CONFIG, SAMPLE_TEXTS } from './utils/constants';
import { layoutTextPages, drawTextPage } from './utils/textEngine';
import { drawPaperBackground } from './utils/paperEngine';
import {
  getSavedUserPresets,
  saveUserPreset,
  deleteUserPreset,
  exportPresetToFile,
  importPresetFromFile,
} from './utils/presetManager';
import { TRANSLATIONS, SAMPLE_TEXTS_EN, translateSampleText } from './utils/i18n';
import { detectInitialLanguage } from './utils/localeDetector';
import jsPDF from 'jspdf';

function createInitialBlock(initialText, initialConfig, lang = 'ru') {
  const defaultText = lang === 'en' ? SAMPLE_TEXTS_EN.physics : SAMPLE_TEXTS.physics;
  const text = translateSampleText(initialText || defaultText, lang);
  return {
    id: 'block_1',
    name: lang === 'en' ? 'Block 1 (Main Text)' : 'Блок 1 (Основной текст)',
    text,
    fontFamily: initialConfig?.fontFamily || 'Caveat',
    fontSize: initialConfig?.fontSize || 42,
    lineHeight: initialConfig?.lineHeight || 70,
    letterSpacing: initialConfig?.letterSpacing ?? 1.5,
    fontWeight: initialConfig?.fontWeight || '500',
    slantAngle: initialConfig?.slantAngle ?? 5,
    inkColor: initialConfig?.inkColor || '#1d4ed8',
    inkOpacity: initialConfig?.inkOpacity ?? 0.94,
    jitterIntensity: initialConfig?.jitterIntensity ?? 0.35,
    textAlign: initialConfig?.textAlign || 'left',
    marginTop: initialConfig?.marginTop ?? 140,
    marginLeft: initialConfig?.marginLeft ?? 290,
    marginRight: initialConfig?.marginRight ?? 90,
    marginBottom: initialConfig?.marginBottom ?? 100,
    paragraphIndent: initialConfig?.paragraphIndent ?? 0,
    enableParagraphIndent: initialConfig?.enableParagraphIndent ?? false,
    perspectiveY: initialConfig?.perspectiveY ?? 0,
    perspectiveX: initialConfig?.perspectiveX ?? 0,
    textRotation: initialConfig?.textRotation ?? 0,
    lineSlope: initialConfig?.lineSlope ?? 0,
    pageBulge: initialConfig?.pageBulge ?? 0,
    bulgeCenterX: initialConfig?.bulgeCenterX ?? 0,
    ovalCurvature: initialConfig?.ovalCurvature ?? 0,
    columnsCount: initialConfig?.columnsCount ?? 1,
    columnGap: initialConfig?.columnGap ?? 100,
    lineMeshEnabled: initialConfig?.lineMeshEnabled ?? false,
    lineMesh: initialConfig?.lineMesh || null,
  };
}

export default function App() {
  // Language state (auto-detects CIS vs Global with localStorage persistence)
  const [lang, setLang] = useState(() => {
    return detectInitialLanguage();
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.ru;

  const handleToggleLang = () => {
    setLang((prev) => {
      const next = prev === 'ru' ? 'en' : 'ru';
      localStorage.setItem('handnotes_lang', next);

      // Automatically translate sample text if current block has default sample
      setTextBlocks((blocks) =>
        blocks.map((b) => ({
          ...b,
          text: translateSampleText(b.text, next),
        }))
      );
      setText((cur) => translateSampleText(cur, next));

      return next;
    });
  };

  // Sync document language, title and SEO meta tags dynamically
  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === 'en') {
      document.title = 'handnotes.app — Realistic Handwritten Notes Generator';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute(
          'content',
          'Free online handwriting generator. Convert typed text into authentic handwritten notebook pages in Russian and English. Export high-resolution PDF and images.'
        );
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', 'handnotes.app — Realistic Handwritten Notes Generator');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', 'Turn digital text into realistic handwritten notebook pages. Support for cursive fonts, lined & squared sheets, and multi-page PDF export.');
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.setAttribute('content', 'en_US');
    } else {
      document.title = 'handnotes.app — Генератор рукописного конспекта в тетради онлайн';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute(
          'content',
          'Бесплатный онлайн-генератор рукописных конспектов в школьной и студенческой тетради. Реалистичные почерки, клетка, линейка, поля, экспорт в PDF и фото.'
        );
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', 'handnotes.app — Генератор рукописного конспекта в тетради онлайн');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', 'Перевод печатного текста в реалистичный рукописный конспект. Тетради в клетку и линейку, реалистичные чернила, наклон строк и экспорт в PDF.');
      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.setAttribute('content', 'ru_RU');
    }
  }, [lang]);

  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('konspekt_theme') || 'dark';
  });

  // Base configuration (fonts, spacing, paper, photo filters)
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('konspekt_config');
    if (saved) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  // Multi-block text state
  const [textBlocks, setTextBlocks] = useState(() => {
    const initialLang = detectInitialLanguage();
    const saved = localStorage.getItem('konspekt_text_blocks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b) => ({
            ...b,
            text: translateSampleText(b.text, initialLang),
          }));
        }
      } catch (e) {}
    }
    const legacyText = localStorage.getItem('konspekt_text');
    return [createInitialBlock(legacyText, config, initialLang)];
  });

  const [activeBlockId, setActiveBlockId] = useState(() => {
    return textBlocks[0]?.id || 'block_1';
  });

  // Active block text mirror for seamless textarea binding
  const activeBlock = useMemo(() => {
    return textBlocks.find((b) => b.id === activeBlockId) || textBlocks[0];
  }, [textBlocks, activeBlockId]);

  const [text, setText] = useState(activeBlock?.text || '');

  // User presets state
  const [userPresets, setUserPresets] = useState(() => getSavedUserPresets());

  // Custom user uploaded fonts
  const [userFonts, setUserFonts] = useState([]);

  // Custom photo
  const [customImage, setCustomImage] = useState(null);
  const [loadedImageObj, setLoadedImageObj] = useState(null);

  // Pagination & view
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(0.42);
  const [showGuides, setShowGuides] = useState(false);

  // Sidebar visibility state
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('konspekt_sidebar_open');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('konspekt_sidebar_open', String(next));
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B' || e.key === 'и' || e.key === 'И')) {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          return;
        }
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Canvas ref for drawing and exporting
  const canvasRef = useRef(null);

  // Synchronize theme with body data-attribute and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('konspekt_theme', theme);
  }, [theme]);

  // Persist text blocks and config
  useEffect(() => {
    localStorage.setItem('konspekt_text_blocks', JSON.stringify(textBlocks));
  }, [textBlocks]);

  useEffect(() => {
    localStorage.setItem('konspekt_config', JSON.stringify(config));
  }, [config]);

  // Decode custom uploaded image into an Image element for canvas rendering
  useEffect(() => {
    if (!customImage) {
      setLoadedImageObj(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLoadedImageObj(img);
    };
    img.src = customImage;
  }, [customImage]);

  // Track font readiness so canvas refreshes when Google Fonts download
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsReady(true);
      });
    }
  }, []);

  // Calculate text layout for EACH block and find total pages
  const textBlocksWithLayout = useMemo(() => {
    const scratchCanvas = document.createElement('canvas');
    const scratchCtx = scratchCanvas.getContext('2d');

    return textBlocks.map((block) => {
      const blockConfig = {
        ...config,
        ...block,
      };
      scratchCtx.font = `${blockConfig.fontWeight || 'normal'} ${blockConfig.fontSize || 40}px "${blockConfig.fontFamily || 'Caveat'}", cursive, sans-serif`;
      const layout = layoutTextPages(block.text || '', scratchCtx, blockConfig);
      return {
        ...block,
        pages: layout.pages,
        totalLines: layout.totalLines,
        totalPages: layout.totalPages,
      };
    });
  }, [textBlocks, config, fontsReady]);

  const totalPages = useMemo(() => {
    return Math.max(1, ...textBlocksWithLayout.map((b) => b.totalPages || 1));
  }, [textBlocksWithLayout]);

  const totalLines = useMemo(() => {
    return textBlocksWithLayout.reduce((acc, b) => acc + (b.totalLines || 0), 0);
  }, [textBlocksWithLayout]);

  // Clamp current page if total pages decreased
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  // ==================== CONFIG & TEXT UPDATES ====================

  const handleUpdateText = (newText) => {
    const val = typeof newText === 'function' ? newText(text) : newText;
    setText(val);
    setTextBlocks((blocks) =>
      blocks.map((b) => (b.id === activeBlockId ? { ...b, text: val } : b))
    );
  };

  const handleUpdateConfig = (keyOrFn, val) => {
    if (typeof keyOrFn === 'function') {
      setConfig((prev) => {
        const next = keyOrFn(prev);
        syncBlockFromConfig(next);
        return next;
      });
    } else {
      setConfig((prev) => {
        const next = { ...prev, [keyOrFn]: val };
        syncBlockFromConfig(next);
        return next;
      });
    }
  };

  const syncBlockFromConfig = (updatedConfig) => {
    const blockKeys = [
      'fontFamily', 'fontSize', 'lineHeight', 'letterSpacing', 'fontWeight',
      'slantAngle', 'inkColor', 'inkOpacity', 'jitterIntensity', 'textAlign',
      'marginTop', 'marginLeft', 'marginRight', 'marginBottom', 'paragraphIndent',
      'enableParagraphIndent', 'perspectiveY', 'perspectiveX', 'textRotation',
      'lineSlope', 'pageBulge', 'bulgeCenterX', 'ovalCurvature', 'columnsCount',
      'columnGap', 'lineMeshEnabled', 'lineMesh'
    ];
    setTextBlocks((blocks) =>
      blocks.map((b) => {
        if (b.id !== activeBlockId) return b;
        const diff = {};
        blockKeys.forEach((k) => {
          if (updatedConfig[k] !== undefined && updatedConfig[k] !== b[k]) {
            diff[k] = updatedConfig[k];
          }
        });
        return Object.keys(diff).length > 0 ? { ...b, ...diff } : b;
      })
    );
  };

  // ==================== MULTI-BLOCK MANAGEMENT ====================

  const handleSelectBlock = (blockId) => {
    setActiveBlockId(blockId);
    const target = textBlocks.find((b) => b.id === blockId);
    if (target) {
      setText(target.text || '');
      setConfig((prev) => ({
        ...prev,
        ...target,
      }));
    }
  };

  const handleAddBlock = () => {
    const newId = `block_${Date.now()}`;
    const count = textBlocks.length + 1;
    const currentActive = textBlocks.find((b) => b.id === activeBlockId) || textBlocks[textBlocks.length - 1];

    // Calculate intelligent position below previous block
    let maxBottomY = 140;
    textBlocksWithLayout.forEach((b) => {
      const linesCount = b.pages?.[currentPage]?.length || (b.text ? b.text.split('\n').length : 3);
      const bottomY = (b.marginTop || 140) + linesCount * (b.lineHeight || 40) + 40;
      if (bottomY > maxBottomY) maxBottomY = bottomY;
    });

    const nextTop = Math.min((config.canvasHeight || 1980) - 350, Math.round(maxBottomY + 40));
    const newText = lang === 'en'
      ? `New text block ${count}...\nYou can write your next lecture section or formulas here.`
      : `Новый блок текста ${count}...\nЗдесь можно написать следующий пункт конспекта или формулу.`;

    const newBlock = {
      ...currentActive,
      id: newId,
      name: lang === 'en' ? `Block ${count}` : `Блок ${count}`,
      text: newText,
      marginTop: nextTop,
      marginBottom: Math.max(80, (config.canvasHeight || 1980) - nextTop - 250),
      lineMeshEnabled: false,
      lineMesh: null,
    };

    const updated = [...textBlocks, newBlock];
    setTextBlocks(updated);
    setActiveBlockId(newId);
    setText(newText);
    setConfig((prev) => ({
      ...prev,
      marginTop: nextTop,
      marginBottom: newBlock.marginBottom,
      lineMeshEnabled: false,
      lineMesh: null,
    }));
  };

  const handleDeleteBlock = (blockId) => {
    if (textBlocks.length <= 1) return;
    const updated = textBlocks.filter((b) => b.id !== blockId);
    setTextBlocks(updated);
    if (activeBlockId === blockId) {
      handleSelectBlock(updated[0].id);
    }
  };

  const handleDuplicateBlock = (blockId) => {
    const block = textBlocks.find((b) => b.id === blockId);
    if (!block) return;
    const newId = `block_${Date.now()}`;
    const copySuffix = lang === 'en' ? '(Copy)' : '(Копия)';
    const newBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: newId,
      name: `${block.name} ${copySuffix}`,
      marginTop: Math.min((config.canvasHeight || 1980) - 250, (block.marginTop || 140) + 120),
      marginLeft: Math.min((config.canvasWidth || 1400) - 250, (block.marginLeft || 290) + 30),
    };
    const updated = [...textBlocks, newBlock];
    setTextBlocks(updated);
    handleSelectBlock(newId);
  };

  const handleRenameBlock = (blockId, newName) => {
    setTextBlocks((blocks) =>
      blocks.map((b) => (b.id === blockId ? { ...b, name: newName } : b))
    );
  };

  // ==================== USER PRESETS MANAGEMENT ====================

  const handleSavePreset = (presetName) => {
    const saved = saveUserPreset({
      name: presetName,
      config,
      textBlocks,
    });
    setUserPresets(getSavedUserPresets());
    return saved;
  };

  const handleApplyPreset = (preset, applyText = false) => {
    if (!preset || !preset.config) return;
    setConfig((prev) => ({
      ...prev,
      ...preset.config,
    }));
    // If preset contains text and user requested applying text
    if (applyText && preset.sampleText) {
      setText(preset.sampleText);
    }
    // Also apply to active block
    setTextBlocks((blocks) =>
      blocks.map((b) => {
        if (b.id !== activeBlockId) return b;
        return {
          ...b,
          ...preset.config,
          ...(applyText && preset.sampleText ? { text: preset.sampleText } : {}),
        };
      })
    );
  };

  const handleDeletePreset = (id) => {
    deleteUserPreset(id);
    setUserPresets(getSavedUserPresets());
  };

  const handleExportPreset = (preset) => {
    exportPresetToFile(preset);
  };

  const handleImportPreset = async (file) => {
    try {
      const imported = await importPresetFromFile(file);
      setUserPresets(getSavedUserPresets());
      handleApplyPreset(imported);
      alert(lang === 'en' ? `Preset "${imported.name}" successfully imported and applied!` : `Пресет "${imported.name}" успешно импортирован и применён!`);
    } catch (err) {
      alert(lang === 'en' ? 'Error importing preset: ' + err.message : 'Ошибка при импорте пресета: ' + err.message);
    }
  };

  // ==================== FONT & PHOTO HANDLERS ====================

  // Upload custom font file (.ttf, .otf, .woff, .woff2)
  const handleUploadFont = async (file) => {
    try {
      const buffer = await file.arrayBuffer();
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\u0400-\u04FF]/g, '_');
      const uniqueId = `Font_${cleanName}_${Date.now()}`;

      const fontFace = new FontFace(uniqueId, buffer);
      await fontFace.load();
      document.fonts.add(fontFace);

      const newFont = {
        id: uniqueId,
        name: file.name.replace(/\.[^/.]+$/, ''),
      };

      setUserFonts((prev) => [...prev, newFont]);
      handleUpdateConfig('fontFamily', uniqueId);
    } catch (err) {
      console.error('Failed to load custom font:', err);
      alert(lang === 'en' ? 'Failed to load font. Please ensure file is in .ttf, .otf, or .woff format.' : 'Не удалось загрузить шрифт. Убедитесь, что файл имеет формат .ttf, .otf или .woff');
    }
  };

  const handleRemoveUserFont = (fontId) => {
    setUserFonts((prev) => prev.filter((f) => f.id !== fontId));
    if (config.fontFamily === fontId) {
      handleUpdateConfig('fontFamily', 'Caveat');
    }
  };

  // Upload custom notebook image with automatic aspect ratio detection (1 page vs 2-page spread)
  const handleUploadPhoto = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setCustomImage(dataUrl);

      const tempImg = new Image();
      tempImg.onload = () => {
        const imgW = tempImg.naturalWidth || tempImg.width;
        const imgH = tempImg.naturalHeight || tempImg.height;
        const aspect = imgW / imgH;

        let newWidth, newHeight;
        if (aspect >= 1.0) {
          newWidth = 2400;
          newHeight = Math.round(2400 / aspect);
        } else {
          newHeight = 1980;
          newWidth = Math.round(1980 * aspect);
        }

        const isSpread = aspect >= 1.15;

        handleUpdateConfig((prev) => ({
          ...prev,
          canvasWidth: newWidth,
          canvasHeight: newHeight,
          pageFormat: isSpread ? 'spread' : 'portrait',
          columnsCount: isSpread ? 2 : 1,
          photoFit: 'contain',
          photoScale: 1.0,
          photoOffsetX: 0,
          photoOffsetY: 0,
          photoRotation: 0,
          marginLeft: Math.round(newWidth * 0.06),
          marginRight: Math.round(newWidth * 0.06),
          marginTop: Math.round(newHeight * 0.07),
          marginBottom: Math.round(newHeight * 0.07),
        }));

        if (isSpread) {
          setZoom(0.35);
        }
      };
      tempImg.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setCustomImage(null);
    setLoadedImageObj(null);
  };

  const handleResetPhotoAdjustments = () => {
    handleUpdateConfig((prev) => ({
      ...prev,
      photoBrightness: 100,
      photoContrast: 100,
      photoSaturation: 100,
      photoRotation: 0,
      photoScale: 1.0,
      photoOffsetX: 0,
      photoOffsetY: 0,
    }));
  };

  // Change page layout format: 1 sheet, 2-sheet spread, or adapt to photo
  const handleSetPageFormat = (format) => {
    if (format === 'auto' && loadedImageObj) {
      const imgW = loadedImageObj.naturalWidth || loadedImageObj.width;
      const imgH = loadedImageObj.naturalHeight || loadedImageObj.height;
      const aspect = imgW / imgH;
      const newWidth = aspect >= 1.0 ? 2400 : Math.round(1980 * aspect);
      const newHeight = aspect >= 1.0 ? Math.round(2400 / aspect) : 1980;
      const isSpread = aspect >= 1.15;
      handleUpdateConfig((prev) => ({
        ...prev,
        canvasWidth: newWidth,
        canvasHeight: newHeight,
        pageFormat: 'auto',
        columnsCount: isSpread ? 2 : 1,
        photoFit: 'contain',
        photoScale: 1.0,
        photoOffsetX: 0,
        photoOffsetY: 0,
        marginLeft: Math.round(newWidth * 0.06),
        marginRight: Math.round(newWidth * 0.06),
        marginTop: Math.round(newHeight * 0.07),
        marginBottom: Math.round(newHeight * 0.07),
      }));
      if (isSpread) setZoom(0.35);
    } else if (format === 'spread') {
      handleUpdateConfig((prev) => ({
        ...prev,
        canvasWidth: 2400,
        canvasHeight: 1600,
        pageFormat: 'spread',
        columnsCount: 2,
        photoFit: 'contain',
        marginLeft: 140,
        marginRight: 140,
        marginTop: 120,
        marginBottom: 100,
      }));
      setZoom(0.35);
    } else {
      // 'portrait'
      handleUpdateConfig((prev) => ({
        ...prev,
        canvasWidth: 1400,
        canvasHeight: 1980,
        pageFormat: 'portrait',
        columnsCount: 1,
        photoFit: 'contain',
        marginLeft: 290,
        marginRight: 90,
        marginTop: 140,
        marginBottom: 100,
      }));
      setZoom(0.42);
    }
  };

  // Helper to render a specific page with all text blocks onto any canvas context
  const renderPageToContext = (ctx, pageIdx) => {
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
      loadedImageObj
    );
    // 2. Draw each text block for this page
    textBlocksWithLayout.forEach((block) => {
      const linesForPage = block.pages[pageIdx] || [];
      if (linesForPage.length > 0) {
        drawTextPage(ctx, linesForPage, { ...config, ...block }, pageIdx);
      }
    });
  };

  // Export current page as PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `konspekt-page-${currentPage + 1}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Export current page as JPG
  const handleExportJPG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `konspekt-page-${currentPage + 1}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  // Export all pages as PDF
  const handleExportPDF = async () => {
    try {
      const isLandscape = config.canvasWidth > config.canvasHeight;
      const doc = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = config.canvasWidth;
      exportCanvas.height = config.canvasHeight;
      const exportCtx = exportCanvas.getContext('2d');

      const count = Math.max(1, totalPages);

      for (let i = 0; i < count; i++) {
        if (i > 0) {
          doc.addPage('a4', isLandscape ? 'landscape' : 'portrait');
        }
        exportCtx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
        renderPageToContext(exportCtx, i);

        const imgData = exportCanvas.toDataURL('image/jpeg', 0.92);
        if (isLandscape) {
          doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);
        } else {
          doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
        }
      }

      doc.save('konspekt.pdf');
    } catch (e) {
      console.error('PDF export error:', e);
      alert(lang === 'en' ? 'Error saving PDF: ' + e.message : 'Ошибка при сохранении PDF: ' + e.message);
    }
  };

  // Print current page
  const handlePrint = () => {
    window.print();
  };

  // Reset all parameters
  const handleResetAll = () => {
    if (window.confirm(t.resetAllConfirm || 'Сбросить все настройки текста, полей, наклона и перспективы к исходным значениям?')) {
      localStorage.removeItem('konspekt_config');
      localStorage.removeItem('konspekt_text_blocks');
      const resetConfig = {
        ...DEFAULT_CONFIG,
        canvasWidth: loadedImageObj ? config.canvasWidth : DEFAULT_CONFIG.canvasWidth,
        canvasHeight: loadedImageObj ? config.canvasHeight : DEFAULT_CONFIG.canvasHeight,
        pageFormat: loadedImageObj ? config.pageFormat : DEFAULT_CONFIG.pageFormat,
        columnsCount: loadedImageObj ? config.columnsCount : DEFAULT_CONFIG.columnsCount,
      };
      setConfig(resetConfig);
      const initialBlocks = [createInitialBlock(null, resetConfig, lang)];
      setTextBlocks(initialBlocks);
      setActiveBlockId(initialBlocks[0].id);
      setText(initialBlocks[0].text);
      setCurrentPage(0);
    }
  };

  return (
    <div className="app-container">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        theme={theme}
        setTheme={setTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        zoom={zoom}
        setZoom={setZoom}
        showGuides={showGuides}
        setShowGuides={setShowGuides}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        onResetAll={handleResetAll}
        lang={lang}
        onToggleLang={handleToggleLang}
        t={t}
      />

      <main className="app-main">
        {/* Floating reopen button when sidebar is collapsed */}
        {!sidebarOpen && (
          <button
            className="floating-sidebar-toggle"
            onClick={handleToggleSidebar}
            title={t.sidebarToggleTitleShow || 'Открыть боковую панель настроек (Ctrl+B)'}
          >
            <PanelLeftOpen size={16} />
            <span>{t.floatingOpenSidebar || 'Панель настроек'}</span>
          </button>
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          text={text}
          setText={handleUpdateText}
          config={config}
          setConfig={handleUpdateConfig}
          textBlocks={textBlocksWithLayout}
          activeBlockId={activeBlockId}
          onSelectBlock={handleSelectBlock}
          onAddBlock={handleAddBlock}
          onDeleteBlock={handleDeleteBlock}
          onDuplicateBlock={handleDuplicateBlock}
          onRenameBlock={handleRenameBlock}
          userPresets={userPresets}
          onSavePreset={handleSavePreset}
          onApplyPreset={handleApplyPreset}
          onDeletePreset={handleDeletePreset}
          onExportPreset={handleExportPreset}
          onImportPreset={handleImportPreset}
          userFonts={userFonts}
          onUploadFont={handleUploadFont}
          onRemoveUserFont={handleRemoveUserFont}
          customImage={customImage}
          onUploadPhoto={handleUploadPhoto}
          onRemovePhoto={handleRemovePhoto}
          onResetPhotoAdjustments={handleResetPhotoAdjustments}
          onSetPageFormat={handleSetPageFormat}
          onExportPNG={handleExportPNG}
          onExportJPG={handleExportJPG}
          onExportPDF={handleExportPDF}
          onPrint={handlePrint}
          onResetAll={handleResetAll}
          totalPages={totalPages}
          totalLines={totalLines}
          lang={lang}
          t={t}
        />

        <NotebookCanvas
          config={config}
          setConfig={handleUpdateConfig}
          textBlocks={textBlocksWithLayout}
          activeBlockId={activeBlockId}
          onSelectBlock={handleSelectBlock}
          onAddBlock={handleAddBlock}
          currentPage={currentPage}
          loadedImage={loadedImageObj}
          showGuides={showGuides}
          zoom={zoom}
          setZoom={setZoom}
          canvasRef={canvasRef}
          onUploadPhoto={handleUploadPhoto}
          onSetPageFormat={handleSetPageFormat}
          onResetAll={handleResetAll}
          lang={lang}
          t={t}
        />
      </main>
    </div>
  );
}
