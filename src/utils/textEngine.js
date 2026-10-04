import { getLineAnchors, evaluateCurve, getCurveLength } from './meshEngine.js';

// Deterministic pseudo-random number generator for stable handwriting jitter
function createSeededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Splits text into pages and lines according to canvas width, height, margins,
 * line height, 3D perspective trapezoid, oval barrel curvature, and 2-column spread.
 */
export function layoutTextPages(text, ctx, config) {
  const {
    fontSize,
    lineHeight,
    letterSpacing = 0,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    enableParagraphIndent = false,
    paragraphIndent = 0,
    canvasWidth,
    canvasHeight,
    fontFamily = 'Caveat',
    fontWeight = '500',
    perspectiveY = 0, // -60 to +60: positive = top narrower, bottom wider
    ovalCurvature = 0, // -50 to +50: oval barrel curvature
    columnsCount = 1, // 1 or 2 (разворот тетради на 2 страницы)
    columnGap = 100, // зазор между страницами разворота
  } = config;

  const contentWidth = Math.max(100, canvasWidth - marginLeft - marginRight);
  const contentHeight = Math.max(100, canvasHeight - marginTop - marginBottom);

  const isTwoColumns = columnsCount === 2 && contentWidth > 500;
  const colWidth = isTwoColumns ? (contentWidth - columnGap) / 2 : contentWidth;

  const getColLeft = (col) => {
    if (!isTwoColumns) return marginLeft;
    return col === 0 ? marginLeft : marginLeft + colWidth + columnGap;
  };

  const paragraphs = text.split('\n');
  const allLines = [];

  let currentY = marginTop;
  let currentColumn = 0;
  let pageIndex = 0;

  const advanceLine = (effectiveLineH) => {
    currentY += effectiveLineH;
    if (currentY + effectiveLineH > marginTop + contentHeight) {
      if (isTwoColumns && currentColumn === 0) {
        currentColumn = 1;
        currentY = marginTop;
      } else {
        pageIndex++;
        currentColumn = 0;
        currentY = marginTop;
      }
    }
  };

  paragraphs.forEach((paragraph, pIdx) => {
    if (paragraph.trim() === '') {
      const t = Math.max(0, Math.min(1, (currentY - marginTop) / contentHeight));
      const v = (t - 0.5) * 2;
      const ovalScale = 1 + (ovalCurvature / 100) * (1 - v * v);
      const scale = Math.max(0.2, (1 + (perspectiveY / 100) * (t - 0.5) * 1.5) * ovalScale);
      const effectiveLineH = Math.max(15, lineHeight * scale);

      allLines.push({
        text: '',
        isParagraphStart: true,
        paragraphIndex: pIdx,
        isEmpty: true,
        t,
        scale,
        y: currentY,
        lineHeight: effectiveLineH,
        colLeft: getColLeft(currentColumn),
        colWidth,
        column: currentColumn,
        pageIndex,
      });

      advanceLine(effectiveLineH);
      return;
    }

    const words = paragraph.split(' ');
    let currentLine = '';
    let isFirstLineOfParagraph = true;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;

      const t = Math.max(0, Math.min(1, (currentY - marginTop) / contentHeight));
      const v = (t - 0.5) * 2;
      const ovalScale = 1 + (ovalCurvature / 100) * (1 - v * v);
      const scale = Math.max(0.2, (1 + (perspectiveY / 100) * (t - 0.5) * 1.5) * ovalScale);

      // Only apply indent if explicitly enabled
      const currentIndent = (enableParagraphIndent && isFirstLineOfParagraph) ? (paragraphIndent || 0) * scale : 0;
      const allowedWidth = colWidth * scale;
      const currentFontSize = Math.max(10, fontSize * scale);
      const effectiveLetterSpacing = letterSpacing * scale;
      const effectiveLineH = Math.max(15, lineHeight * scale);

      ctx.font = `${fontWeight} ${currentFontSize}px "${fontFamily}", cursive, sans-serif`;
      let measuredWidth = ctx.measureText(testLine).width;
      if (effectiveLetterSpacing > 0 && testLine.length > 1) {
        measuredWidth += (testLine.length - 1) * effectiveLetterSpacing;
      }

      if (measuredWidth + currentIndent <= allowedWidth || !currentLine) {
        currentLine = testLine;
      } else {
        let prevMeasuredWidth = ctx.measureText(currentLine).width;
        if (effectiveLetterSpacing > 0 && currentLine.length > 1) {
          prevMeasuredWidth += (currentLine.length - 1) * effectiveLetterSpacing;
        }

        allLines.push({
          text: currentLine,
          lineIndex: allLines.length,
          isParagraphStart: isFirstLineOfParagraph,
          isLastLineOfParagraph: false,
          paragraphIndex: pIdx,
          isEmpty: false,
          t,
          scale,
          y: currentY,
          lineHeight: effectiveLineH,
          lineWidth: allowedWidth,
          measuredWidth: prevMeasuredWidth,
          colLeft: getColLeft(currentColumn),
          colWidth,
          column: currentColumn,
          pageIndex,
        });

        advanceLine(effectiveLineH);
        currentLine = word;
        isFirstLineOfParagraph = false;
      }
    }

    if (currentLine) {
      const t = Math.max(0, Math.min(1, (currentY - marginTop) / contentHeight));
      const v = (t - 0.5) * 2;
      const ovalScale = 1 + (ovalCurvature / 100) * (1 - v * v);
      const scale = Math.max(0.2, (1 + (perspectiveY / 100) * (t - 0.5) * 1.5) * ovalScale);
      const allowedWidth = colWidth * scale;
      const currentFontSize = Math.max(10, fontSize * scale);
      const effectiveLetterSpacing = letterSpacing * scale;
      const effectiveLineH = Math.max(15, lineHeight * scale);

      ctx.font = `${fontWeight} ${currentFontSize}px "${fontFamily}", cursive, sans-serif`;
      let finalMeasuredWidth = ctx.measureText(currentLine).width;
      if (effectiveLetterSpacing > 0 && currentLine.length > 1) {
        finalMeasuredWidth += (currentLine.length - 1) * effectiveLetterSpacing;
      }

      allLines.push({
        text: currentLine,
        lineIndex: allLines.length,
        isParagraphStart: isFirstLineOfParagraph,
        isLastLineOfParagraph: true,
        paragraphIndex: pIdx,
        isEmpty: false,
        t,
        scale,
        y: currentY,
        lineHeight: effectiveLineH,
        lineWidth: allowedWidth,
        measuredWidth: finalMeasuredWidth,
        colLeft: getColLeft(currentColumn),
        colWidth,
        column: currentColumn,
        pageIndex,
      });

      advanceLine(effectiveLineH);
    }
  });

  // Group by pageIndex
  const pages = [];
  allLines.forEach((line) => {
    if (!pages[line.pageIndex]) {
      pages[line.pageIndex] = [];
    }
    pages[line.pageIndex].push(line);
  });

  if (pages.length === 0) {
    pages.push([]);
  }

  return {
    pages,
    totalLines: allLines.length,
    totalPages: pages.length,
  };
}

/**
 * Draws a single page of text with:
 * 1. 2-column spread support (разворот тетради на 2 страницы)
 * 2. 3D perspective trapezoid (narrow top, wide bottom)
 * 3. Sheet curvature & bulge (бугорок листа, прогиб строк, наложение как овал/дуга)
 * 4. Text block rotation & line slope
 * 5. Handwriting slant, letter-spacing, and micro-jitter.
 */
export function drawTextPage(ctx, lines, config, pageIndex = 0) {
  const {
    fontSize,
    lineHeight,
    fontFamily,
    fontWeight = 'normal',
    slantAngle = 0, // In degrees (-25 to +35)
    letterSpacing = 0,
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    canvasWidth,
    canvasHeight,
    enableParagraphIndent = false,
    paragraphIndent = 0,
    inkColor = '#1d4ed8',
    inkOpacity = 0.95,
    jitterIntensity = 0,
    perspectiveX = 0,
    textRotation = 0, // -45 to +45 deg
    lineSlope = 0, // -15 to +15 deg
    pageBulge = 0, // -80px to +80px: vertical arch/bulge in the center
    bulgeCenterX = 0, // -50% to +50%: horizontal shift of curve apex (корешок тетради)
    textAlign = 'left',
  } = config;

  if (!lines || lines.length === 0) return;

  const contentWidth = canvasWidth - marginLeft - marginRight;
  const contentHeight = canvasHeight - marginTop - marginBottom;
  const centerX = marginLeft + contentWidth / 2;
  const centerY = marginTop + contentHeight / 2;

  const slantRad = (slantAngle * Math.PI) / 180;
  const lineSlopeRad = (lineSlope * Math.PI) / 180;
  const rng = createSeededRandom(1337 + pageIndex * 997);

  ctx.save();

  // 1. Overall text block rotation (to match tilted notebook photos)
  if (textRotation !== 0) {
    ctx.translate(centerX, centerY);
    ctx.rotate((textRotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
  }

  ctx.fillStyle = inkColor;
  ctx.globalAlpha = inkOpacity;
  ctx.textBaseline = 'alphabetic';

  lines.forEach((lineObj) => {
    if (lineObj.isEmpty) return;

    const scale = lineObj.scale || 1;
    const currentFontSize = Math.max(10, fontSize * scale);
    const effectiveLetterSpacing = letterSpacing * scale;
    const effectiveLineH = lineObj.lineHeight || lineHeight * scale;

    ctx.font = `${fontWeight} ${currentFontSize}px "${fontFamily}", cursive, sans-serif`;

    // Column positioning (left or right page of spread)
    const colLeft = lineObj.colLeft !== undefined ? lineObj.colLeft : marginLeft;
    const colWidth = lineObj.colWidth !== undefined ? lineObj.colWidth : contentWidth;
    const isFirstLine = lineObj.isParagraphStart;
    const currentIndent = (enableParagraphIndent && isFirstLine) ? (paragraphIndent || 0) * scale : 0;

    // Actual measured text width
    let measuredLineWidth = lineObj.measuredWidth;
    if (!measuredLineWidth) {
      measuredLineWidth = ctx.measureText(lineObj.text).width;
      if (effectiveLetterSpacing > 0 && lineObj.text.length > 1) {
        measuredLineWidth += (lineObj.text.length - 1) * effectiveLetterSpacing;
      }
    }

    // Perspective / camera tilt skew shift (horizontal trapezoid angle)
    const marginSlopeShift = (perspectiveX / 100) * (lineObj.t - 0.5) * colWidth;

    // Determine startX according to alignment:
    let startX = colLeft;

    if (textAlign === 'center') {
      const colCenterX = colLeft + colWidth / 2;
      startX = colCenterX - (measuredLineWidth + currentIndent) / 2 + currentIndent + marginSlopeShift;
    } else if (textAlign === 'right') {
      const colRight = colLeft + colWidth * scale + marginSlopeShift;
      startX = colRight - measuredLineWidth;
    } else {
      // Default: 'left' (and 'justify') - firmly anchored to the notebook left margin!
      // This guarantees lines never start in the middle or drift outwards unexpectedly.
      startX = colLeft + marginSlopeShift + currentIndent;
    }

    // Support justification for handwriting (distribute extra space among words)
    let extraSpacePerWord = 0;
    if (textAlign === 'justify' && !lineObj.isLastLineOfParagraph) {
      const spaceCount = (lineObj.text.match(/ /g) || []).length;
      const targetWidth = colWidth * scale;
      if (spaceCount > 0 && targetWidth > measuredLineWidth + currentIndent) {
        extraSpacePerWord = (targetWidth - (measuredLineWidth + currentIndent)) / spaceCount;
      }
    }

    // ==================== 3D LINE MESH RENDERING ====================
    if (config.lineMeshEnabled && config.lineMesh) {
      const lineIdx = lineObj.lineIndex !== undefined ? lineObj.lineIndex : 0;
      const anchors = getLineAnchors(lineIdx, lines.length, config.lineMesh, config, lineObj.t);
      const curveLength = Math.max(100, getCurveLength(anchors.left, anchors.mid, anchors.right));

      let startDist = currentIndent;
      if (textAlign === 'center') {
        startDist = Math.max(0, (curveLength - measuredLineWidth) / 2);
      } else if (textAlign === 'right') {
        startDist = Math.max(0, curveLength - measuredLineWidth);
      }

      let currentDist = startDist;
      const chars = Array.from(lineObj.text);

      chars.forEach((char) => {
        const charWidth = ctx.measureText(char).width;

        let charDisplaceY = 0;
        let charDisplaceX = 0;
        let charExtraTilt = 0;
        let charAlphaVariation = 0;

        if (jitterIntensity > 0) {
          charDisplaceY = (rng() - 0.5) * jitterIntensity * 2.0 * scale;
          charDisplaceX = (rng() - 0.5) * jitterIntensity * 0.8 * scale;
          charExtraTilt = ((rng() - 0.5) * 4 * jitterIntensity * Math.PI) / 180;
          charAlphaVariation = (rng() - 0.5) * 0.15 * jitterIntensity;
        }

        const centerDist = currentDist + charWidth * 0.5;
        const u = curveLength > 0 ? centerDist / curveLength : 0;
        const pt = evaluateCurve(anchors.left, anchors.mid, anchors.right, u);

        ctx.save();
        ctx.translate(pt.x + charDisplaceX, pt.y + charDisplaceY);

        // Rotate along curve tangent + handwriting slant
        ctx.rotate(pt.angle);
        const totalSlant = -Math.tan(slantRad + charExtraTilt);
        ctx.transform(1, 0, totalSlant, 1, 0, 0);

        const effectiveAlpha = Math.max(0.4, Math.min(1.0, inkOpacity + charAlphaVariation));
        ctx.globalAlpha = effectiveAlpha;

        ctx.fillText(char, -charWidth * 0.5, 0);
        ctx.restore();

        const wordExtra = char === ' ' ? extraSpacePerWord : 0;
        currentDist += charWidth + effectiveLetterSpacing + wordExtra;
      });

      return;
    }

    const hw = Math.max(50, (colWidth * scale) / 2);
    const lineMidX = colLeft + (colWidth * scale) / 2;
    const peakX = lineMidX + (bulgeCenterX / 100) * hw;

    let currentX = startX;

    // Line baseline with vertical micro-waviness
    const lineWaviness = jitterIntensity > 0 ? (rng() - 0.5) * jitterIntensity * 2.5 * scale : 0;
    const effectiveBaseY = lineObj.y + effectiveLineH * 0.85 + lineWaviness;

    const chars = Array.from(lineObj.text);

    chars.forEach((char) => {
      const charWidth = ctx.measureText(char).width;

      // Realistic handwriting micro-variations
      let charDisplaceY = 0;
      let charDisplaceX = 0;
      let charExtraTilt = 0;
      let charAlphaVariation = 0;

      if (jitterIntensity > 0) {
        charDisplaceY = (rng() - 0.5) * jitterIntensity * 2.2 * scale;
        charDisplaceX = (rng() - 0.5) * jitterIntensity * 0.8 * scale;
        charExtraTilt = ((rng() - 0.5) * 4 * jitterIntensity * Math.PI) / 180;
        charAlphaVariation = (rng() - 0.5) * 0.15 * jitterIntensity;
      }

      // Vertical displacement along line slope (skew)
      const slopeOffsetY = Math.tan(lineSlopeRad) * (currentX - startX);

      // Sheet curvature & bulge displacement (бугорок листа / прогиб)
      let curveLiftY = 0;
      let curveSlopeRad = 0;

      if (pageBulge !== 0) {
        const u = Math.max(-1.5, Math.min(1.5, (currentX - peakX) / hw));
        // Parabolic arc: lifted in center when pageBulge > 0
        curveLiftY = -pageBulge * (1 - u * u);
        // Tangent slope of the curved surface so characters rotate with the bend
        curveSlopeRad = Math.atan((2 * pageBulge * u) / hw);
      }

      ctx.save();
      const drawX = currentX + charDisplaceX;
      const drawY = effectiveBaseY + charDisplaceY + slopeOffsetY + curveLiftY;

      ctx.translate(drawX, drawY);

      // Apply cursive italic slant + line slope + surface curvature
      const combinedSlope = lineSlopeRad + curveSlopeRad;
      const totalSlant = -Math.tan(slantRad + charExtraTilt);
      ctx.transform(1, Math.tan(combinedSlope), totalSlant, 1, 0, 0);

      const effectiveAlpha = Math.max(0.4, Math.min(1.0, inkOpacity + charAlphaVariation));
      ctx.globalAlpha = effectiveAlpha;

      ctx.fillText(char, 0, 0);
      ctx.restore();

      const wordExtra = char === ' ' ? extraSpacePerWord : 0;
      currentX += charWidth + effectiveLetterSpacing + wordExtra;
    });
  });

  ctx.restore();
}
