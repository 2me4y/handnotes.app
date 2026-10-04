/**
 * meshEngine.js
 * 
 * 3D Line Mesh & Calibration System for Notebook Paper Photos.
 * Allows users to place and drag Left, Middle (bulge apex), and Right points
 * across notebook lines to form a real 3D curved surface matching uneven photos.
 */

/**
 * Creates default calibration mesh coordinates for a given canvas size and margins.
 */
export function createDefaultMesh(canvasWidth, canvasHeight, marginLeft = 290, marginRight = 90, marginTop = 140, marginBottom = 100) {
  const contentWidth = Math.max(100, canvasWidth - marginLeft - marginRight);
  const midX = marginLeft + contentWidth / 2;
  const rightX = canvasWidth - marginRight;

  const topY = marginTop;
  const centerY = marginTop + (canvasHeight - marginTop - marginBottom) / 2;
  const bottomY = canvasHeight - marginBottom;

  return {
    top: {
      left: { x: marginLeft, y: topY },
      mid: { x: midX, y: topY },
      right: { x: rightX, y: topY },
    },
    center: {
      left: { x: marginLeft, y: centerY },
      mid: { x: midX, y: centerY },
      right: { x: rightX, y: centerY },
    },
    bottom: {
      left: { x: marginLeft, y: bottomY },
      mid: { x: midX, y: bottomY },
      right: { x: rightX, y: bottomY },
    },
    customLines: {},
  };
}

/**
 * Translates all mesh control points by (dx, dy).
 */
export function translateMesh(mesh, dx, dy) {
  if (!mesh || (dx === 0 && dy === 0)) return mesh;
  const shift = (pt) => ({
    x: Math.round(pt.x + dx),
    y: Math.round(pt.y + dy),
  });

  const nextMesh = {
    top: {
      left: shift(mesh.top.left),
      mid: shift(mesh.top.mid),
      right: shift(mesh.top.right),
    },
    center: {
      left: shift(mesh.center.left),
      mid: shift(mesh.center.mid),
      right: shift(mesh.center.right),
    },
    bottom: {
      left: shift(mesh.bottom.left),
      mid: shift(mesh.bottom.mid),
      right: shift(mesh.bottom.right),
    },
  };

  if (mesh.customLines && typeof mesh.customLines === 'object') {
    nextMesh.customLines = {};
    for (const [k, line] of Object.entries(mesh.customLines)) {
      if (line && line.left && line.mid && line.right) {
        nextMesh.customLines[k] = {
          left: shift(line.left),
          mid: shift(line.mid),
          right: shift(line.right),
        };
      }
    }
  }

  return nextMesh;
}

/**
 * Scales mesh horizontally by shifting right edge by deltaW and middle edge by deltaW * 0.5.
 */
export function scaleMeshWidth(mesh, deltaW) {
  if (!mesh || deltaW === 0) return mesh;
  const shiftCol = (pt, factor) => ({
    x: Math.round(pt.x + deltaW * factor),
    y: pt.y,
  });

  const nextMesh = {
    top: {
      left: { ...mesh.top.left },
      mid: shiftCol(mesh.top.mid, 0.5),
      right: shiftCol(mesh.top.right, 1.0),
    },
    center: {
      left: { ...mesh.center.left },
      mid: shiftCol(mesh.center.mid, 0.5),
      right: shiftCol(mesh.center.right, 1.0),
    },
    bottom: {
      left: { ...mesh.bottom.left },
      mid: shiftCol(mesh.bottom.mid, 0.5),
      right: shiftCol(mesh.bottom.right, 1.0),
    },
  };

  if (mesh.customLines && typeof mesh.customLines === 'object') {
    nextMesh.customLines = {};
    for (const [k, line] of Object.entries(mesh.customLines)) {
      if (line && line.left && line.mid && line.right) {
        nextMesh.customLines[k] = {
          left: { ...line.left },
          mid: shiftCol(line.mid, 0.5),
          right: shiftCol(line.right, 1.0),
        };
      }
    }
  }

  return nextMesh;
}

/**
 * Scales mesh vertically by shifting bottom edge by deltaH and center edge by deltaH * 0.5.
 */
export function scaleMeshHeight(mesh, deltaH) {
  if (!mesh || deltaH === 0) return mesh;
  const shiftRow = (pt, factor) => ({
    x: pt.x,
    y: Math.round(pt.y + deltaH * factor),
  });

  const nextMesh = {
    top: {
      left: { ...mesh.top.left },
      mid: { ...mesh.top.mid },
      right: { ...mesh.top.right },
    },
    center: {
      left: shiftRow(mesh.center.left, 0.5),
      mid: shiftRow(mesh.center.mid, 0.5),
      right: shiftRow(mesh.center.right, 0.5),
    },
    bottom: {
      left: shiftRow(mesh.bottom.left, 1.0),
      mid: shiftRow(mesh.bottom.mid, 1.0),
      right: shiftRow(mesh.bottom.right, 1.0),
    },
  };

  if (mesh.customLines && typeof mesh.customLines === 'object') {
    nextMesh.customLines = {};
    for (const [k, line] of Object.entries(mesh.customLines)) {
      if (line && line.left && line.mid && line.right) {
        nextMesh.customLines[k] = {
          left: shiftRow(line.left, 0.5),
          mid: shiftRow(line.mid, 0.5),
          right: shiftRow(line.right, 0.5),
        };
      }
    }
  }

  return nextMesh;
}

/**
 * Calculates bounding box [minX, minY, width, height] enclosing all master control points.
 */
export function getMeshBoundingBox(mesh) {
  if (!mesh || !mesh.top || !mesh.center || !mesh.bottom) return null;
  const pts = [
    mesh.top.left, mesh.top.mid, mesh.top.right,
    mesh.center.left, mesh.center.mid, mesh.center.right,
    mesh.bottom.left, mesh.bottom.mid, mesh.bottom.right,
  ].filter(Boolean);

  if (pts.length === 0) return null;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  pts.forEach((p) => {
    if (typeof p.x === 'number') {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    }
    if (typeof p.y === 'number') {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  });

  if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) {
    return null;
  }

  return {
    x: minX,
    y: minY,
    width: Math.max(40, maxX - minX),
    height: Math.max(40, maxY - minY),
  };
}

/**
 * Quadratic interpolation between 3 values/points (top at v=0, center at v=0.5, bottom at v=1).
 */
export function interpolateQuad(p0, p1, p2, v) {
  const a = 2 * (p0 - 2 * p1 + p2);
  const b = 4 * p1 - 3 * p0 - p2;
  const c = p0;
  return a * v * v + b * v + c;
}

export function interpolatePoint(pt0, pt1, pt2, v) {
  return {
    x: interpolateQuad(pt0.x, pt1.x, pt2.x, v),
    y: interpolateQuad(pt0.y, pt1.y, pt2.y, v),
  };
}

/**
 * Gets the Left, Mid, Right control points for a specific line index.
 */
export function getLineAnchors(lineIndex, totalLines, mesh, config, lineT = null) {
  if (!mesh) {
    const ml = config.marginLeft || 290;
    const mr = config.marginRight || 90;
    const mt = config.marginTop || 140;
    const mb = config.marginBottom || 100;
    const cw = config.canvasWidth || 1400;
    const ch = config.canvasHeight || 1980;
    mesh = createDefaultMesh(cw, ch, ml, mr, mt, mb);
  }

  // Check if there is an individual line override
  if (mesh.customLines && mesh.customLines[lineIndex]) {
    return mesh.customLines[lineIndex];
  }

  // If normalized vertical position lineT (0 to 1) is provided, use it directly!
  let v = 0;
  if (typeof lineT === 'number' && isFinite(lineT)) {
    v = Math.max(0, Math.min(1, lineT));
  } else {
    const count = Math.max(1, totalLines);
    v = count > 1 ? Math.max(0, Math.min(1, lineIndex / (count - 1))) : 0;
  }

  const left = interpolatePoint(mesh.top.left, mesh.center.left, mesh.bottom.left, v);
  const mid = interpolatePoint(mesh.top.mid, mesh.center.mid, mesh.bottom.mid, v);
  const right = interpolatePoint(mesh.top.right, mesh.center.right, mesh.bottom.right, v);

  return { left, mid, right };
}

/**
 * Evaluates position (X, Y) and tangent angle (in radians) on the quadratic curve
 * passing through Left (u=0), Mid (u=0.5), and Right (u=1).
 * Smoothly extrapolates along tangent lines when u < 0 or u > 1 so characters NEVER stack on top of each other!
 */
export function evaluateCurve(left, mid, right, u) {
  // Polynomial coefficients for X(t) and Y(t)
  const ax = 2 * (left.x - 2 * mid.x + right.x);
  const bx = 4 * mid.x - 3 * left.x - right.x;
  const cx = left.x;

  const ay = 2 * (left.y - 2 * mid.y + right.y);
  const by = 4 * mid.y - 3 * left.y - right.y;
  const cy = left.y;

  if (u >= 0 && u <= 1) {
    const t = u;
    const x = ax * t * t + bx * t + cx;
    const y = ay * t * t + by * t + cy;

    const dx = 2 * ax * t + bx;
    const dy = 2 * ay * t + by;
    const angle = Math.atan2(dy, dx);

    return { x, y, dx, dy, angle };
  } else if (u > 1) {
    // Extrapolate past Right endpoint along end tangent
    const endX = ax + bx + cx;
    const endY = ay + by + cy;
    const endDx = 2 * ax + bx;
    const endDy = 2 * ay + by;
    const angle = Math.atan2(endDy, endDx);
    const chord = Math.hypot(right.x - left.x, right.y - left.y) || 100;
    const dist = (u - 1) * chord;

    return {
      x: endX + dist * Math.cos(angle),
      y: endY + dist * Math.sin(angle),
      dx: endDx,
      dy: endDy,
      angle,
    };
  } else {
    // Extrapolate before Left endpoint along start tangent
    const startX = cx;
    const startY = cy;
    const startDx = bx;
    const startDy = by;
    const angle = Math.atan2(startDy, startDx);
    const chord = Math.hypot(right.x - left.x, right.y - left.y) || 100;
    const dist = u * chord;

    return {
      x: startX + dist * Math.cos(angle),
      y: startY + dist * Math.sin(angle),
      dx: startDx,
      dy: startDy,
      angle,
    };
  }
}

/**
 * Calculates approximate curve arc length from Left to Right.
 */
export function getCurveLength(left, mid, right, steps = 16) {
  let length = 0;
  let prev = left;
  for (let i = 1; i <= steps; i++) {
    const pt = evaluateCurve(left, mid, right, i / steps);
    const dx = pt.x - prev.x;
    const dy = pt.y - prev.y;
    length += Math.hypot(dx, dy);
    prev = pt;
  }
  return length;
}

/**
 * Renders the interactive 3D line mesh overlay onto canvas or SVG layer.
 */
export function drawMeshGuides(ctx, mesh, config, totalLines = 25, activePoint = null) {
  if (!mesh) return;

  ctx.save();

  const linesCount = Math.max(2, totalLines);

  // 1. Draw all interpolated line curves faintly
  for (let i = 0; i < linesCount; i++) {
    const { left, mid, right } = getLineAnchors(i, linesCount, mesh, config);
    const isMasterRow = i === 0 || i === Math.floor(linesCount / 2) || i === linesCount - 1;

    ctx.beginPath();
    ctx.strokeStyle = isMasterRow ? 'rgba(56, 189, 248, 0.85)' : 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = isMasterRow ? 2.5 : 1.2;
    if (!isMasterRow) {
      ctx.setLineDash([6, 4]);
    } else {
      ctx.setLineDash([]);
    }

    const steps = 30;
    for (let s = 0; s <= steps; s++) {
      const pt = evaluateCurve(left, mid, right, s / steps);
      if (s === 0) {
        ctx.moveTo(pt.x, pt.y);
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();
  }

  // 2. Draw vertical boundary curves connecting Left, Mid, Right points
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1.5;

  // Left margin curve
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // Red like notebook margin
  ctx.beginPath();
  for (let s = 0; s <= 30; s++) {
    const pt = interpolatePoint(mesh.top.left, mesh.center.left, mesh.bottom.left, s / 30);
    if (s === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  // Middle bulge spine
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
  ctx.beginPath();
  for (let s = 0; s <= 30; s++) {
    const pt = interpolatePoint(mesh.top.mid, mesh.center.mid, mesh.bottom.mid, s / 30);
    if (s === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  // Right edge curve
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)'; // Emerald
  ctx.beginPath();
  for (let s = 0; s <= 30; s++) {
    const pt = interpolatePoint(mesh.top.right, mesh.center.right, mesh.bottom.right, s / 30);
    if (s === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  ctx.setLineDash([]);

  // 3. Draw 9 Master Anchor Points
  const masterPoints = [
    { row: 'top', col: 'left', pt: mesh.top.left, color: '#ef4444', label: 'Верх Слева' },
    { row: 'top', col: 'mid', pt: mesh.top.mid, color: '#f59e0b', label: 'Верх Центр (Изгиб)' },
    { row: 'top', col: 'right', pt: mesh.top.right, color: '#10b981', label: 'Верх Справа' },

    { row: 'center', col: 'left', pt: mesh.center.left, color: '#ef4444', label: 'Центр Слева' },
    { row: 'center', col: 'mid', pt: mesh.center.mid, color: '#f59e0b', label: 'Центр (Бугорок)' },
    { row: 'center', col: 'right', pt: mesh.center.right, color: '#10b981', label: 'Центр Справа' },

    { row: 'bottom', col: 'left', pt: mesh.bottom.left, color: '#ef4444', label: 'Низ Слева' },
    { row: 'bottom', col: 'mid', pt: mesh.bottom.mid, color: '#f59e0b', label: 'Низ Центр (Изгиб)' },
    { row: 'bottom', col: 'right', pt: mesh.bottom.right, color: '#10b981', label: 'Низ Справа' },
  ];

  masterPoints.forEach(({ row, col, pt, color }) => {
    const isHovered = activePoint && activePoint.row === row && activePoint.col === col;
    const radius = isHovered ? 14 : 10;

    // Outer glow
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = isHovered ? 'rgba(56, 189, 248, 0.5)' : 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    // Main circle
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Center crosshair / dot
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });

  ctx.restore();
}
