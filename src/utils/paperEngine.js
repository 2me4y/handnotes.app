/**
 * Paper & Notebook Background Engine
 * Renders procedural notebook presets or user-uploaded photos with full image filter adjustments,
 * including 2-page spread (разворот тетради / 2 листа) and 100% uncropped contain/cover modes.
 */

export const PAPER_PRESETS_DATA = [
  {
    id: 'grid',
    nameRu: 'Тетрадь в клетку (5 мм)',
    nameEn: 'Squared Paper (5 mm)',
    icon: 'Grid',
    descRu: 'Классическая клетка 35 px',
    descEn: 'Classic 35 px square grid',
  },
  {
    id: 'dense_grid',
    nameRu: 'Мелкая клетка (инженерная)',
    nameEn: 'Dense Grid (Engineering)',
    icon: 'Grid',
    descRu: 'Плотная сетка 25 px',
    descEn: 'Dense 25 px grid',
  },
  {
    id: 'large_grid',
    nameRu: 'Крупная клетка',
    nameEn: 'Large Grid',
    icon: 'Grid',
    descRu: 'Укрупнённая клетка 50 px',
    descEn: 'Large 50 px square grid',
  },
  {
    id: 'lined',
    nameRu: 'Тетрадь в линейку',
    nameEn: 'Lined Notebook',
    icon: 'AlignLeft',
    descRu: 'Школьная линейка 50 px',
    descEn: 'Standard 50 px ruled lines',
  },
  {
    id: 'narrow_lined',
    nameRu: 'Узкая линейка',
    nameEn: 'Narrow Ruled',
    icon: 'AlignLeft',
    descRu: 'Частая линейка 35 px',
    descEn: 'Compact 35 px ruled lines',
  },
  {
    id: 'slanted',
    nameRu: 'Косая линейка (прописи)',
    nameEn: 'Slanted Ruled (Penmanship)',
    icon: 'Italic',
    descRu: 'Прописи для начальных классов',
    descEn: 'Calligraphy exercise guides',
  },
  {
    id: 'dots',
    nameRu: 'В точку (Bullet Journal)',
    nameEn: 'Dotted (Bullet Journal)',
    icon: 'Circle',
    descRu: 'Точечная разметка для планеров',
    descEn: 'Dot matrix for planners',
  },
  {
    id: 'vintage',
    nameRu: 'Крафт / Состаренный лист',
    nameEn: 'Vintage / Kraft Paper',
    icon: 'FileText',
    descRu: 'Винтажный тёплый пергамент',
    descEn: 'Warm antique parchment',
  },
  {
    id: 'blank',
    nameRu: 'Белый чистый лист',
    nameEn: 'Blank Sheet',
    icon: 'Square',
    descRu: 'Без линий и разметки',
    descEn: 'Clean unruled plain paper',
  },
];

export function getPaperPresets(lang = 'ru') {
  const isEn = lang === 'en';
  return PAPER_PRESETS_DATA.map((p) => ({
    id: p.id,
    name: isEn ? p.nameEn : p.nameRu,
    desc: isEn ? p.descEn : p.descRu,
    icon: p.icon,
  }));
}

export const PAPER_PRESETS = getPaperPresets('ru');

/**
 * Draws the paper background onto the canvas
 */
export function drawPaperBackground(ctx, config, loadedImage = null) {
  const {
    width,
    height,
    preset = 'grid',
    // Photo adjustments
    photoBrightness = 100,
    photoContrast = 100,
    photoSaturation = 100,
    photoRotation = 0,
    photoScale = 1.0,
    photoOffsetX = 0,
    photoOffsetY = 0,
    photoFit = 'contain', // 'contain' (100% без обрезки) | 'cover'
    // Paper settings
    gridSize = 35, // Size of grid cell in pixels (~5mm on canvas)
    lineSpacing = 50,
    marginLineX = 260, // Classic red margin line
    showMarginLine = true,
  } = config;

  ctx.save();

  const isSpread = width > height * 1.15; // 2-page spread (разворот на 2 листа)

  // If user uploaded a custom photo
  if (loadedImage) {
    // 1. Draw neutral background first
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    // 2. Set filters
    ctx.filter = `brightness(${photoBrightness}%) contrast(${photoContrast}%) saturate(${photoSaturation}%)`;

    // 3. Transform for zoom, rotate, pan
    ctx.save();
    ctx.translate(width / 2 + photoOffsetX, height / 2 + photoOffsetY);
    ctx.rotate((photoRotation * Math.PI) / 180);
    ctx.scale(photoScale, photoScale);

    // Compute aspect-ratio cover/contain
    const imgAspect = loadedImage.width / loadedImage.height;
    const canvasAspect = width / height;

    let drawW, drawH;
    if (photoFit === 'cover') {
      if (imgAspect > canvasAspect) {
        drawH = height;
        drawW = height * imgAspect;
      } else {
        drawW = width;
        drawH = width / imgAspect;
      }
    } else {
      // 'contain' mode: 100% of the photo is visible, NEVER cropped!
      if (imgAspect > canvasAspect) {
        drawW = width;
        drawH = width / imgAspect;
      } else {
        drawH = height;
        drawW = height * imgAspect;
      }
    }

    ctx.drawImage(loadedImage, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Reset filter
    ctx.filter = 'none';
    ctx.restore();
    return;
  }

  // Otherwise draw procedural realistic preset
  ctx.filter = 'none';

  // Base paper color (warm soft ivory, or kraft for vintage)
  ctx.fillStyle = preset === 'vintage' ? '#f6efe2' : preset === 'blank' ? '#fdfcf7' : '#fcfbfa';
  ctx.fillRect(0, 0, width, height);

  // Subtle paper grain/vignette effect
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.3,
    width / 2,
    height / 2,
    width * 0.8
  );
  if (preset === 'vintage') {
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(120, 85, 30, 0.12)');
  } else {
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.035)');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  if (preset === 'grid' || preset === 'dense_grid' || preset === 'large_grid') {
    // Russian notebook blue grid
    const effectiveGrid = preset === 'dense_grid' ? 25 : preset === 'large_grid' ? 50 : gridSize;
    ctx.strokeStyle = preset === 'dense_grid' ? 'rgba(164, 187, 218, 0.45)' : 'rgba(164, 187, 218, 0.55)';
    ctx.lineWidth = 1;

    // Vertical lines
    ctx.beginPath();
    for (let x = effectiveGrid; x < width; x += effectiveGrid) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
    }
    // Horizontal lines
    for (let y = effectiveGrid; y < height; y += effectiveGrid) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();

    // Red school margin line (on left page and right page if spread)
    if (showMarginLine) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginLineX + 0.5, 0);
      ctx.lineTo(marginLineX + 0.5, height);
      if (isSpread) {
        ctx.moveTo(width - marginLineX + 0.5, 0);
        ctx.lineTo(width - marginLineX + 0.5, height);
      }
      ctx.stroke();
    }
  } else if (preset === 'lined' || preset === 'narrow_lined') {
    // Horizontal lined paper
    const effectiveSpacing = preset === 'narrow_lined' ? 35 : lineSpacing;
    ctx.strokeStyle = 'rgba(160, 180, 215, 0.6)';
    ctx.lineWidth = 1.2;

    const startY = 120;
    ctx.beginPath();
    for (let y = startY; y < height - 60; y += effectiveSpacing) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();

    // Red margin line
    if (showMarginLine) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginLineX + 0.5, 0);
      ctx.lineTo(marginLineX + 0.5, height);
      if (isSpread) {
        ctx.moveTo(width - marginLineX + 0.5, 0);
        ctx.lineTo(width - marginLineX + 0.5, height);
      }
      ctx.stroke();
    }
  } else if (preset === 'slanted') {
    // Slanted cursive practice notebook lines (частая косая линия)
    ctx.strokeStyle = 'rgba(175, 195, 225, 0.55)';
    ctx.lineWidth = 1;

    const lineGap = 42;
    const startY = 100;

    // Main horizontal lines
    ctx.beginPath();
    for (let y = startY; y < height - 60; y += lineGap) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }
    ctx.stroke();

    // Slanted guide lines (~65 degree angle)
    ctx.strokeStyle = 'rgba(190, 205, 230, 0.38)';
    const slantDx = Math.tan((25 * Math.PI) / 180) * height;
    ctx.beginPath();
    for (let x = -width; x < width * 2; x += 35) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + slantDx, height);
    }
    ctx.stroke();

    // Margin line
    if (showMarginLine) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginLineX + 0.5, 0);
      ctx.lineTo(marginLineX + 0.5, height);
      if (isSpread) {
        ctx.moveTo(width - marginLineX + 0.5, 0);
        ctx.lineTo(width - marginLineX + 0.5, height);
      }
      ctx.stroke();
    }
  } else if (preset === 'dots') {
    // Bullet Journal dot grid
    const effectiveGrid = gridSize || 35;
    ctx.fillStyle = 'rgba(140, 165, 205, 0.7)';
    for (let x = effectiveGrid; x < width; x += effectiveGrid) {
      for (let y = effectiveGrid; y < height; y += effectiveGrid) {
        ctx.beginPath();
        ctx.arc(x + 0.5, y + 0.5, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (showMarginLine) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginLineX + 0.5, 0);
      ctx.lineTo(marginLineX + 0.5, height);
      if (isSpread) {
        ctx.moveTo(width - marginLineX + 0.5, 0);
        ctx.lineTo(width - marginLineX + 0.5, height);
      }
      ctx.stroke();
    }
  } else if (preset === 'vintage') {
    // Vintage kraft paper horizontal rules
    ctx.strokeStyle = 'rgba(175, 140, 95, 0.45)';
    ctx.lineWidth = 1.2;
    const startY = 120;
    ctx.beginPath();
    for (let y = startY; y < height - 60; y += lineSpacing || 50) {
      ctx.moveTo(40, y + 0.5);
      ctx.lineTo(width - 40, y + 0.5);
    }
    ctx.stroke();

    // Subtle edge border
    ctx.strokeStyle = 'rgba(150, 110, 60, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, width - 6, height - 6);
  } else if (preset === 'blank') {
    // Subtle border shadow for blank page
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
  }

  // If 2-page spread, draw central notebook crease / spine shadow
  if (isSpread) {
    const midX = width / 2;
    const foldGrad = ctx.createLinearGradient(midX - 45, 0, midX + 45, 0);
    foldGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    foldGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.08)');
    foldGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.16)');
    foldGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.08)');
    foldGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = foldGrad;
    ctx.fillRect(midX - 45, 0, 90, height);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(midX + 0.5, 0);
    ctx.lineTo(midX + 0.5, height);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws visual margin & line-height helper guides with 3D perspective trapezoid and 2-column spread support
 */
export function drawGuideOverlay(ctx, config) {
  const {
    width,
    height,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    lineHeight,
    perspectiveY = 0,
    perspectiveX = 0,
    textRotation = 0,
    lineSlope = 0,
    pageBulge = 0,
    bulgeCenterX = 0,
    columnsCount = 1,
    columnGap = 100,
  } = config;

  const contentWidth = width - marginLeft - marginRight;
  const contentHeight = height - marginTop - marginBottom;
  const centerX = marginLeft + contentWidth / 2;
  const centerY = marginTop + contentHeight / 2;

  ctx.save();

  // Apply block rotation
  if (textRotation !== 0) {
    ctx.translate(centerX, centerY);
    ctx.rotate((textRotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  const isTwoColumns = columnsCount === 2 && contentWidth > 500;
  const cols = isTwoColumns ? 2 : 1;
  const colW = isTwoColumns ? (contentWidth - columnGap) / 2 : contentWidth;

  for (let c = 0; c < cols; c++) {
    const colLeft = isTwoColumns ? (c === 0 ? marginLeft : marginLeft + colW + columnGap) : marginLeft;
    const colCenterX = colLeft + colW / 2;

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'; // Blue dashed trapezoid
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5;

    const scaleTop = Math.max(0.2, 1 + (perspectiveY / 100) * (-0.5) * 1.5);
    const scaleBottom = Math.max(0.2, 1 + (perspectiveY / 100) * (0.5) * 1.5);
    const wTop = colW * scaleTop;
    const wBottom = colW * scaleBottom;
    const shiftXTop = (perspectiveX / 100) * (-0.5) * colW;
    const shiftXBottom = (perspectiveX / 100) * (0.5) * colW;

    const xTL = colCenterX - wTop / 2 + shiftXTop;
    const xTR = colCenterX + wTop / 2 + shiftXTop;
    const yTop = marginTop;

    const xBL = colCenterX - wBottom / 2 + shiftXBottom;
    const xBR = colCenterX + wBottom / 2 + shiftXBottom;
    const yBottom = marginTop + contentHeight;

    // Draw boundary
    ctx.beginPath();
    ctx.moveTo(xTL, yTop);
    ctx.lineTo(xTR, yTop);
    ctx.lineTo(xBR, yBottom);
    ctx.lineTo(xBL, yBottom);
    ctx.closePath();
    ctx.stroke();

    // Subtle fill
    ctx.fillStyle = 'rgba(59, 130, 246, 0.04)';
    ctx.fill();

    // Baseline guides
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.4)';
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;

    const lineSlopeRad = (lineSlope * Math.PI) / 180;
    let currY = marginTop;

    while (currY < yBottom) {
      const t = Math.max(0, Math.min(1, (currY - marginTop) / contentHeight));
      const scale = Math.max(0.2, 1 + (perspectiveY / 100) * (t - 0.5) * 1.5);
      const lineW = colW * scale;
      const shiftX = (perspectiveX / 100) * (t - 0.5) * colW;

      const leftX = colCenterX - lineW / 2 + shiftX;
      const baseY = currY + lineHeight * scale * 0.85;

      const hw = Math.max(50, lineW / 2);
      const lineMidX = leftX + lineW / 2;
      const peakX = lineMidX + (bulgeCenterX / 100) * hw;

      ctx.beginPath();
      const steps = pageBulge !== 0 ? 24 : 1;
      for (let s = 0; s <= steps; s++) {
        const px = leftX + (lineW * s) / steps;
        const slopeOffsetY = Math.tan(lineSlopeRad) * (px - leftX);
        const u = Math.max(-1.5, Math.min(1.5, (px - peakX) / hw));
        const curveLiftY = pageBulge !== 0 ? -pageBulge * (1 - u * u) : 0;
        const py = baseY + slopeOffsetY + curveLiftY;

        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      currY += lineHeight * scale;
    }
  }

  ctx.restore();
}
