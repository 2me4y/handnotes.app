import React, { useEffect, useRef, useState } from 'react';
import { drawPaperBackground, drawGuideOverlay } from '../utils/paperEngine';
import { drawTextPage } from '../utils/textEngine';
import {
  createDefaultMesh,
  getLineAnchors,
  translateMesh,
  scaleMeshWidth,
  scaleMeshHeight,
  getMeshBoundingBox,
} from '../utils/meshEngine';
import {
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  BookOpen,
  Image as ImageIcon,
  Type,
  Maximize2,
  RotateCcw,
  Target,
  Check,
  Plus,
  Layers,
  Hand,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export default function NotebookCanvas({
  config,
  setConfig,
  pageLines,
  textBlocks,
  activeBlockId,
  onSelectBlock,
  onAddBlock,
  currentPage,
  loadedImage,
  showGuides,
  zoom,
  setZoom,
  canvasRef,
  onUploadPhoto,
  onSetPageFormat,
  onResetAll,
}) {
  const containerRef = useRef(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const [isResizingBottom, setIsResizingBottom] = useState(false);
  const [activeDragMode, setActiveDragMode] = useState('text'); // 'text' or 'photo'
  const [isCalibratingMesh, setIsCalibratingMesh] = useState(false);
  const [draggingMeshPoint, setDraggingMeshPoint] = useState(null);
  const [hoveredMeshPoint, setHoveredMeshPoint] = useState(null);

  // Free Pan & Zoom Navigation state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isHandToolActive, setIsHandToolActive] = useState(false);

  // Spacebar hotkey detection for panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const activeBlock = (textBlocks && textBlocks.find((b) => b.id === activeBlockId)) || textBlocks?.[0] || config;

  const activeMesh = activeBlock.lineMesh || config.lineMesh || createDefaultMesh(
    config.canvasWidth,
    config.canvasHeight,
    activeBlock.marginLeft ?? config.marginLeft,
    activeBlock.marginRight ?? config.marginRight,
    activeBlock.marginTop ?? config.marginTop,
    activeBlock.marginBottom ?? config.marginBottom
  );

  // Redraw canvas whenever parameters change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure high-res canvas size
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;

    // 1. Draw paper background (either preset grid/lines or custom uploaded photo)
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
      loadedImage
    );

    // 2. Draw handwritten text for each block
    if (textBlocks && textBlocks.length > 0) {
      textBlocks.forEach((block) => {
        const blockLines = block.pages?.[currentPage] || [];
        if (blockLines.length > 0) {
          drawTextPage(ctx, blockLines, { ...config, ...block }, currentPage);
        }
      });
    } else if (pageLines && pageLines.length > 0) {
      drawTextPage(ctx, pageLines, config, currentPage);
    }

    // 3. Draw guides if enabled
    if (showGuides) {
      drawGuideOverlay(ctx, {
        width: config.canvasWidth,
        height: config.canvasHeight,
        marginTop: activeBlock.marginTop ?? config.marginTop,
        marginLeft: activeBlock.marginLeft ?? config.marginLeft,
        marginRight: activeBlock.marginRight ?? config.marginRight,
        marginBottom: activeBlock.marginBottom ?? config.marginBottom,
        lineHeight: activeBlock.lineHeight ?? config.lineHeight,
        perspectiveY: activeBlock.perspectiveY ?? config.perspectiveY,
        perspectiveX: activeBlock.perspectiveX ?? config.perspectiveX,
        textRotation: activeBlock.textRotation ?? config.textRotation,
        lineSlope: activeBlock.lineSlope ?? config.lineSlope,
        pageBulge: activeBlock.pageBulge ?? config.pageBulge,
        bulgeCenterX: activeBlock.bulgeCenterX ?? config.bulgeCenterX,
        columnsCount: activeBlock.columnsCount ?? config.columnsCount,
        columnGap: activeBlock.columnGap ?? config.columnGap,
      });
    }
  }, [config, textBlocks, pageLines, currentPage, loadedImage, showGuides, activeBlock]);

  // Scaled dimensions for preview
  const previewWidth = config.canvasWidth * zoom;
  const previewHeight = config.canvasHeight * zoom;

  // Compute active text boundary box in scaled preview pixels
  const activeLines = activeBlock.pages?.[currentPage] || pageLines || [];
  const contentLinesCount = activeLines && activeLines.length > 0 ? activeLines.length : 4;

  let baseBoxLeft = activeBlock.marginLeft ?? config.marginLeft;
  let baseBoxTop = activeBlock.marginTop ?? config.marginTop;
  let baseBoxWidth = Math.max(120, config.canvasWidth - baseBoxLeft - (activeBlock.marginRight ?? config.marginRight));
  let baseBoxHeight = Math.max(80, Math.min(
    config.canvasHeight - baseBoxTop - (activeBlock.marginBottom ?? config.marginBottom),
    contentLinesCount * (activeBlock.lineHeight ?? config.lineHeight) + 40
  ));

  if (activeBlock.lineMeshEnabled && activeBlock.lineMesh) {
    const mb = getMeshBoundingBox(activeBlock.lineMesh);
    if (mb) {
      baseBoxLeft = mb.x;
      baseBoxTop = mb.y;
      baseBoxWidth = mb.width;
      baseBoxHeight = mb.height;
    }
  }

  const textX = baseBoxLeft * zoom;
  const textY = baseBoxTop * zoom;
  const textW = Math.max(80 * zoom, baseBoxWidth * zoom);
  const textH = Math.max(60 * zoom, baseBoxHeight * zoom);

  // Handle Mouse Wheel for Smooth Zoom (Ctrl+Wheel) and Free Pan (Shift / Normal)
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
      if (setZoom) {
        setZoom((prev) => Math.max(0.2, Math.min(2.5, Number((prev + zoomDelta).toFixed(2)))));
      }
    } else if (e.shiftKey) {
      e.preventDefault();
      setPan((p) => ({ ...p, x: Math.round(p.x - e.deltaY) }));
    } else if (isHandToolActive || isSpacePressed) {
      e.preventDefault();
      setPan((p) => ({ ...p, y: Math.round(p.y - e.deltaY) }));
    }
  };

  // Handle Panning the Viewport (Space+Drag, Middle Mouse, Hand tool, or clicking desk background)
  const handleMouseDownViewport = (e) => {
    const isMiddleClick = e.button === 1;
    const isSpaceOrHand = (e.button === 0 && (isSpacePressed || isHandToolActive));
    const isDeskBackground = e.target.classList.contains('canvas-workspace') ||
      e.target.classList.contains('canvas-viewport') ||
      e.target.classList.contains('canvas-pan-layer');

    if (!isMiddleClick && !isSpaceOrHand && !isDeskBackground) return;

    e.preventDefault();
    setIsPanning(true);

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startPanX = pan.x;
    const startPanY = pan.y;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startClientX;
      const dy = moveEvent.clientY - startClientY;
      setPan({
        x: Math.round(startPanX + dx),
        y: Math.round(startPanY + dy),
      });
    };

    const onMouseUp = () => {
      setIsPanning(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const viewW = containerRef.current.clientWidth - 80;
    const viewH = containerRef.current.clientHeight - 130;
    const scaleW = viewW / config.canvasWidth;
    const scaleH = viewH / config.canvasHeight;
    const bestFit = Math.max(0.2, Math.min(1.0, Math.min(scaleW, scaleH)));
    if (setZoom) setZoom(Number(bestFit.toFixed(2)));
    setPan({ x: 0, y: 0 });
  };

  const handleResetZoom100 = () => {
    if (setZoom) setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    if (setZoom) setZoom((z) => Math.min(2.5, Number((z + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    if (setZoom) setZoom((z) => Math.max(0.2, Number((z - 0.1).toFixed(2))));
  };

  // Handle Drag & Drop photo file onto workspace
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/') && onUploadPhoto) {
      onUploadPhoto(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ==================== MOUSE DRAG: TEXT BLOCK ====================
  const handleMouseDownTextDrag = (e) => {
    if (e.button !== 0) return; // Left mouse button only
    e.preventDefault();
    e.stopPropagation();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startMarginLeft = activeBlock.marginLeft ?? config.marginLeft;
    const startMarginTop = activeBlock.marginTop ?? config.marginTop;
    const startMarginRight = activeBlock.marginRight ?? config.marginRight;
    const startMarginBottom = activeBlock.marginBottom ?? config.marginBottom;

    const blockWidth = config.canvasWidth - startMarginLeft - startMarginRight;
    const blockHeight = config.canvasHeight - startMarginTop - startMarginBottom;

    const startMesh = (activeBlock.lineMeshEnabled && activeBlock.lineMesh)
      ? JSON.parse(JSON.stringify(activeBlock.lineMesh))
      : null;

    setIsDraggingText(true);

    const onMouseMove = (moveEvent) => {
      const rawDx = (moveEvent.clientX - startClientX) / zoom;
      const rawDy = (moveEvent.clientY - startClientY) / zoom;

      // Allow dragging freely across canvas while keeping at least 10px inside margins
      const minDx = 10 - startMarginLeft;
      const maxDx = (config.canvasWidth - 10) - (startMarginLeft + Math.min(blockWidth, 200));
      const dx = Math.round(Math.max(minDx, Math.min(maxDx, rawDx)));

      const minDy = 10 - startMarginTop;
      const maxDy = (config.canvasHeight - 10) - (startMarginTop + Math.min(blockHeight, 150));
      const dy = Math.round(Math.max(minDy, Math.min(maxDy, rawDy)));

      const newLeft = startMarginLeft + dx;
      const newTop = startMarginTop + dy;
      // Crucial: keep block width and height constant so text layout never collapses or squishes!
      const newRight = startMarginRight - dx;
      const newBottom = startMarginBottom - dy;

      const newMesh = startMesh ? translateMesh(startMesh, dx, dy) : null;

      if (setConfig) {
        setConfig((prev) => ({
          ...prev,
          marginLeft: newLeft,
          marginTop: newTop,
          marginRight: newRight,
          marginBottom: newBottom,
          ...(newMesh ? { lineMesh: newMesh } : {}),
        }));
      }
    };

    const onMouseUp = () => {
      setIsDraggingText(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // ==================== MOUSE RESIZE: RIGHT MARGIN ====================
  const handleMouseDownResizeRight = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startClientX = e.clientX;
    const startMarginRight = activeBlock.marginRight ?? config.marginRight;
    const startMarginLeft = activeBlock.marginLeft ?? config.marginLeft;
    const startMesh = (activeBlock.lineMeshEnabled && activeBlock.lineMesh)
      ? JSON.parse(JSON.stringify(activeBlock.lineMesh))
      : null;

    setIsResizingRight(true);

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startClientX) / zoom;
      const newRight = Math.round(
        Math.max(20, Math.min(config.canvasWidth - startMarginLeft - 100, startMarginRight - dx))
      );
      const deltaW = startMarginRight - newRight; // positive when expanding width

      const newMesh = startMesh ? scaleMeshWidth(startMesh, deltaW) : null;

      if (setConfig) {
        setConfig((prev) => ({
          ...prev,
          marginRight: newRight,
          ...(newMesh ? { lineMesh: newMesh } : {}),
        }));
      }
    };

    const onMouseUp = () => {
      setIsResizingRight(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // ==================== MOUSE RESIZE: BOTTOM MARGIN ====================
  const handleMouseDownResizeBottom = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startClientY = e.clientY;
    const startMarginBottom = activeBlock.marginBottom ?? config.marginBottom;
    const startMarginTop = activeBlock.marginTop ?? config.marginTop;
    const startMesh = (activeBlock.lineMeshEnabled && activeBlock.lineMesh)
      ? JSON.parse(JSON.stringify(activeBlock.lineMesh))
      : null;

    setIsResizingBottom(true);

    const onMouseMove = (moveEvent) => {
      const dy = (moveEvent.clientY - startClientY) / zoom;
      const newBottom = Math.round(
        Math.max(20, Math.min(config.canvasHeight - startMarginTop - 60, startMarginBottom - dy))
      );
      const deltaH = startMarginBottom - newBottom;

      const newMesh = startMesh ? scaleMeshHeight(startMesh, deltaH) : null;

      if (setConfig) {
        setConfig((prev) => ({
          ...prev,
          marginBottom: newBottom,
          ...(newMesh ? { lineMesh: newMesh } : {}),
        }));
      }
    };

    const onMouseUp = () => {
      setIsResizingBottom(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // ==================== MOUSE DRAG: PHOTO BACKGROUND ====================
  const handleMouseDownPhotoDrag = (e) => {
    if (!loadedImage || e.button !== 0) return;
    // Only drag photo if activeDragMode is photo or clicked outside text box
    e.preventDefault();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startOffsetX = config.photoOffsetX;
    const startOffsetY = config.photoOffsetY;

    setIsDraggingPhoto(true);

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startClientX) / zoom;
      const dy = (moveEvent.clientY - startClientY) / zoom;

      if (setConfig) {
        setConfig((prev) => ({
          ...prev,
          photoOffsetX: Math.round(startOffsetX + dx),
          photoOffsetY: Math.round(startOffsetY + dy),
        }));
      }
    };

    const onMouseUp = () => {
      setIsDraggingPhoto(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // ==================== MOUSE DRAG: 3D LINE MESH POINT ====================
  const handleMouseDownMeshPoint = (e, row, col) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const currentPt = { ...activeMesh[row][col] };

    setDraggingMeshPoint({ row, col });

    const onMouseMove = (moveEvent) => {
      const dx = (moveEvent.clientX - startClientX) / zoom;
      const dy = (moveEvent.clientY - startClientY) / zoom;

      const newX = Math.round(currentPt.x + dx);
      const newY = Math.round(currentPt.y + dy);

      if (setConfig) {
        setConfig((prev) => {
          const prevMesh = prev.lineMesh || activeMesh;
          const updatedMesh = {
            ...prevMesh,
            [row]: {
              ...prevMesh[row],
              [col]: { x: newX, y: newY },
            },
          };
          const b = getMeshBoundingBox(updatedMesh);
          return {
            ...prev,
            lineMeshEnabled: true,
            lineMesh: updatedMesh,
            marginLeft: b ? Math.round(b.x) : prev.marginLeft,
            marginTop: b ? Math.round(b.y) : prev.marginTop,
            marginRight: b ? Math.round(Math.max(20, prev.canvasWidth - (b.x + b.width))) : prev.marginRight,
            marginBottom: b ? Math.round(Math.max(20, prev.canvasHeight - (b.y + b.height))) : prev.marginBottom,
          };
        });
      }
    };

    const onMouseUp = () => {
      setDraggingMeshPoint(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleResetMeshToGrid = () => {
    const defaultMesh = createDefaultMesh(
      config.canvasWidth,
      config.canvasHeight,
      config.marginLeft,
      config.marginRight,
      config.marginTop,
      config.marginBottom
    );
    if (setConfig) {
      setConfig((prev) => ({
        ...prev,
        lineMesh: defaultMesh,
      }));
    }
  };

  return (
    <div
      className="canvas-workspace"
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Floating Toolbar above the sheet for quick position presets */}
      <div className="canvas-floating-toolbar">
        <div className="toolbar-pill">
          {/* Multi-block switcher bar */}
          {textBlocks && textBlocks.length > 0 && (
            <>
              <div className="canvas-blocks-switcher">
                <span className="blocks-switcher-label">
                  <Layers size={13} />
                  <span>Блоки ({textBlocks.length}):</span>
                </span>
                <div className="blocks-pills-row">
                  {textBlocks.map((b, idx) => (
                    <button
                      key={b.id}
                      className={`canvas-block-pill ${b.id === activeBlockId ? 'active' : ''}`}
                      onClick={() => onSelectBlock && onSelectBlock(b.id)}
                      title={`Выбрать для редактирования: "${b.name || `Блок ${idx + 1}`}"`}
                    >
                      <span>{b.name || `Блок ${idx + 1}`}</span>
                    </button>
                  ))}
                  <button
                    className="canvas-block-add-btn"
                    onClick={onAddBlock}
                    title="Добавить ещё один независимый блок текста на этот лист (+ Новый блок)"
                  >
                    <Plus size={13} />
                    <span>+ Блок</span>
                  </button>
                </div>
              </div>
              <div className="toolbar-divider" />
            </>
          )}

          <button
            className={`pill-btn ${activeDragMode === 'text' ? 'active' : ''}`}
            onClick={() => setActiveDragMode('text')}
            title="Зажмите и перетаскивайте текст мышью прямо по листу тетради"
          >
            <Type size={14} />
            <span>Перемещать текст</span>
          </button>

          {loadedImage && (
            <button
              className={`pill-btn ${activeDragMode === 'photo' ? 'active' : ''}`}
              onClick={() => setActiveDragMode('photo')}
              title="Перетаскивать фото тетради мышью"
            >
              <ImageIcon size={14} />
              <span>Перемещать фото</span>
            </button>
          )}

          <div className="toolbar-divider" />

          {/* Quick align buttons */}
          <button
            className="pill-btn mini-btn"
            onClick={() =>
              setConfig &&
              setConfig((c) => {
                const deltaX = 50 - c.marginLeft;
                const newMesh = c.lineMeshEnabled && c.lineMesh ? translateMesh(c.lineMesh, deltaX, 0) : c.lineMesh;
                return {
                  ...c,
                  marginLeft: 50,
                  ...(newMesh ? { lineMesh: newMesh } : {}),
                };
              })
            }
            title="Прижать текст к левому краю листа (50px)"
          >
            <AlignLeft size={14} />
            <span>Влево</span>
          </button>

          <button
            className="pill-btn mini-btn"
            onClick={() =>
              setConfig &&
              setConfig((c) => {
                const deltaX = 290 - c.marginLeft;
                const newMesh = c.lineMeshEnabled && c.lineMesh ? translateMesh(c.lineMesh, deltaX, 0) : c.lineMesh;
                return {
                  ...c,
                  marginLeft: 290,
                  ...(newMesh ? { lineMesh: newMesh } : {}),
                };
              })
            }
            title="Выровнять по школьным полям тетради (290px)"
          >
            <BookOpen size={14} />
            <span>Школьные поля</span>
          </button>

          {/* Text Alignment group */}
          <div className="toolbar-segmented">
            <button
              className={`pill-btn mini-btn icon-only ${(!config.textAlign || config.textAlign === 'left') ? 'active' : ''}`}
              onClick={() => setConfig && setConfig((c) => ({ ...c, textAlign: 'left' }))}
              title="Выравнивание: По левому краю (стандартно)"
            >
              <AlignLeft size={13} />
            </button>
            <button
              className={`pill-btn mini-btn icon-only ${config.textAlign === 'center' ? 'active' : ''}`}
              onClick={() => setConfig && setConfig((c) => ({ ...c, textAlign: 'center' }))}
              title="Выравнивание: По центру"
            >
              <AlignCenter size={13} />
            </button>
            <button
              className={`pill-btn mini-btn icon-only ${config.textAlign === 'right' ? 'active' : ''}`}
              onClick={() => setConfig && setConfig((c) => ({ ...c, textAlign: 'right' }))}
              title="Выравнивание: По правому краю"
            >
              <AlignRight size={13} />
            </button>
            <button
              className={`pill-btn mini-btn icon-only ${config.textAlign === 'justify' ? 'active' : ''}`}
              onClick={() => setConfig && setConfig((c) => ({ ...c, textAlign: 'justify' }))}
              title="Выравнивание: По ширине страницы"
            >
              <AlignJustify size={13} />
            </button>
          </div>

          <div className="toolbar-divider" />

          {/* Quick 3D Perspective button */}
          <button
            className={`pill-btn mini-btn ${config.perspectiveY ? 'active' : ''}`}
            onClick={() =>
              setConfig &&
              setConfig((c) => ({
                ...c,
                perspectiveY: c.perspectiveY ? 0 : 25,
              }))
            }
            title="Переключить 3D перспективу (Трапеция: верх уже, низ шире)"
          >
            <Maximize2 size={13} />
            <span>Трапеция: {config.perspectiveY ? `+${config.perspectiveY}%` : '0%'}</span>
          </button>

          {/* Quick Page Bulge button */}
          <button
            className={`pill-btn mini-btn ${config.pageBulge ? 'active' : ''}`}
            onClick={() =>
              setConfig &&
              setConfig((c) => ({
                ...c,
                pageBulge: c.pageBulge ? 0 : 25,
              }))
            }
            title="Переключить изгиб строк (Бугорок листа +25px)"
          >
            <span>🌊 Бугорок: {config.pageBulge ? `${config.pageBulge > 0 ? '+' : ''}${config.pageBulge}px` : '0'}</span>
          </button>

          {/* 3D Line Mesh Calibration button */}
          <button
            className={`pill-btn mini-btn ${isCalibratingMesh || config.lineMeshEnabled ? 'active' : ''}`}
            onClick={() => {
              const next = !isCalibratingMesh;
              setIsCalibratingMesh(next);
              if (next && setConfig) {
                setConfig((c) => ({
                  ...c,
                  lineMeshEnabled: true,
                  lineMesh: c.lineMesh || activeMesh,
                }));
              }
            }}
            title="Калибровка строк по точкам: совместите линии со строками на фото тетради"
          >
            <Target size={13} />
            <span>🎯 Калибровка строк</span>
          </button>

          {/* Page Format Toggle */}
          <button
            className={`pill-btn mini-btn ${config.pageFormat === 'portrait' ? 'active' : ''}`}
            onClick={() => onSetPageFormat && onSetPageFormat('portrait')}
            title="Переключить на 1 лист (Портрет 1400×1980)"
          >
            📄 1 лист
          </button>

          <button
            className={`pill-btn mini-btn ${
              config.pageFormat === 'spread' || config.canvasWidth > config.canvasHeight * 1.15
                ? 'active'
                : ''
            }`}
            onClick={() => onSetPageFormat && onSetPageFormat('spread')}
            title="Переключить на 2 листа (Разворот 2400×1600)"
          >
            📖 2 листа
          </button>

          {loadedImage && (
            <button
              className={`pill-btn mini-btn ${config.pageFormat === 'auto' ? 'active' : ''}`}
              onClick={() => onSetPageFormat && onSetPageFormat('auto')}
              title="Вписать фото 100% без обрезки"
            >
              📷 100% фото
            </button>
          )}

          {/* Quick page positioning if 2-page spread */}
          {config.canvasWidth > config.canvasHeight * 1.15 && (
            <>
              <div className="toolbar-divider" />
              <button
                className="pill-btn mini-btn"
                onClick={() =>
                  setConfig &&
                  setConfig((c) => ({
                    ...c,
                    columnsCount: 1,
                    marginLeft: Math.round(c.canvasWidth * 0.06),
                    marginRight: Math.round(c.canvasWidth / 2 + 50),
                  }))
                }
                title="Поместить текст на левый лист"
              >
                ◀ Левый
              </button>
              <button
                className={`pill-btn mini-btn ${config.columnsCount === 2 ? 'active' : ''}`}
                onClick={() =>
                  setConfig &&
                  setConfig((c) => ({
                    ...c,
                    columnsCount: 2,
                    marginLeft: Math.round(c.canvasWidth * 0.06),
                    marginRight: Math.round(c.canvasWidth * 0.06),
                  }))
                }
                title="Текст на оба листа разворота (2 колонки)"
              >
                Оба листа
              </button>
              <button
                className="pill-btn mini-btn"
                onClick={() =>
                  setConfig &&
                  setConfig((c) => ({
                    ...c,
                    columnsCount: 1,
                    marginLeft: Math.round(c.canvasWidth / 2 + 50),
                    marginRight: Math.round(c.canvasWidth * 0.06),
                  }))
                }
                title="Поместить текст на правый лист"
              >
                Правый ▶
              </button>
            </>
          )}

          <div className="toolbar-divider" />

          {/* Coordinates indicator */}
          <span className="coords-tag">
            X: <strong>{config.marginLeft}</strong>, Y: <strong>{config.marginTop}</strong> px
          </span>

          <div className="toolbar-divider" />

          <button
            className="pill-btn mini-btn pill-btn-danger"
            onClick={onResetAll}
            title="Сбросить все параметры и наклон текста"
          >
            <RotateCcw size={12} />
            <span>Сброс</span>
          </button>
        </div>
      </div>

      {/* 3D Line Mesh Calibration Banner */}
      {isCalibratingMesh && (
        <div className="mesh-calibration-banner">
          <div className="banner-left">
            <Target size={16} className="banner-icon" />
            <span>
              <strong>Калибровка строк по фото:</strong> Перетаскивайте точки прямо на строки тетради:
              <span className="tag-red">🔴 Слева</span>
              <span className="tag-amber">🟡 В центре (изгиб/бугор)</span>
              <span className="tag-green">🟢 Справа</span>
              — текст автоматически ложится на эти линии!
            </span>
          </div>
          <div className="banner-actions">
            <button className="banner-btn" onClick={handleResetMeshToGrid} title="Вернуть исходную ровную сетку">
              <RotateCcw size={13} />
              <span>Сбросить сетку</span>
            </button>
            <button className="banner-btn primary" onClick={() => setIsCalibratingMesh(false)} title="Применить и скрыть направляющие">
              <Check size={14} />
              <span>Готово</span>
            </button>
          </div>
        </div>
      )}

      {/* Free Pan & Zoom Navigation Viewport */}
      <div
        className={`canvas-viewport ${isSpacePressed || isHandToolActive ? 'pan-mode' : ''} ${isPanning ? 'panning' : ''}`}
        onMouseDown={handleMouseDownViewport}
        onWheel={handleWheel}
      >
        <div
          className="canvas-pan-layer"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          <div
            className="canvas-card"
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
              cursor: activeDragMode === 'photo' && loadedImage
                ? 'grab'
                : (isSpacePressed || isHandToolActive ? 'grab' : 'default'),
            }}
            onMouseDown={activeDragMode === 'photo' ? handleMouseDownPhotoDrag : undefined}
          >
            <canvas
              ref={canvasRef}
              className="notebook-canvas"
              style={{
                width: `${previewWidth}px`,
                height: `${previewHeight}px`,
              }}
            />

            {/* ==================== 3D LINE MESH & CALIBRATION OVERLAY ==================== */}
            {(isCalibratingMesh || (config.lineMeshEnabled && showGuides)) && (
              <svg
                className="mesh-calibration-svg"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`,
                  pointerEvents: 'none',
                  zIndex: 3,
                }}
              >
                {/* Guide curve paths across the sheet */}
                {Array.from({ length: Math.max(4, contentLinesCount) }).map((_, idx, arr) => {
                  const anchors = getLineAnchors(idx, arr.length, activeMesh, config);
                  const isMaster = idx === 0 || idx === Math.floor(arr.length / 2) || idx === arr.length - 1;
                  const Lx = anchors.left.x * zoom;
                  const Ly = anchors.left.y * zoom;
                  const Mx = anchors.mid.x * zoom;
                  const My = anchors.mid.y * zoom;
                  const Rx = anchors.right.x * zoom;
                  const Ry = anchors.right.y * zoom;
                  const Qx = 2 * Mx - 0.5 * (Lx + Rx);
                  const Qy = 2 * My - 0.5 * (Ly + Ry);

                  return (
                    <path
                      key={`mesh-line-${idx}`}
                      d={`M ${Lx} ${Ly} Q ${Qx} ${Qy} ${Rx} ${Ry}`}
                      fill="none"
                      stroke={isMaster ? 'rgba(56, 189, 248, 0.9)' : 'rgba(56, 189, 248, 0.4)'}
                      strokeWidth={isMaster ? 2.5 : 1.2}
                      strokeDasharray={isMaster ? undefined : '5,4'}
                    />
                  );
                })}

                {/* Vertical connector guide curves connecting Left, Mid, Right */}
                {['left', 'mid', 'right'].map((colKey) => {
                  const ptTop = activeMesh.top[colKey];
                  const ptCenter = activeMesh.center[colKey];
                  const ptBottom = activeMesh.bottom[colKey];
                  const T = { x: ptTop.x * zoom, y: ptTop.y * zoom };
                  const C = { x: ptCenter.x * zoom, y: ptCenter.y * zoom };
                  const B = { x: ptBottom.x * zoom, y: ptBottom.y * zoom };
                  const Qx = 2 * C.x - 0.5 * (T.x + B.x);
                  const Qy = 2 * C.y - 0.5 * (T.y + B.y);
                  const strokeColor =
                    colKey === 'left'
                      ? 'rgba(239, 68, 68, 0.7)'
                      : colKey === 'mid'
                      ? 'rgba(245, 158, 11, 0.75)'
                      : 'rgba(16, 185, 129, 0.7)';

                  return (
                    <path
                      key={`mesh-col-${colKey}`}
                      d={`M ${T.x} ${T.y} Q ${Qx} ${Qy} ${B.x} ${B.y}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={1.5}
                      strokeDasharray="4,4"
                    />
                  );
                })}
              </svg>
            )}

            {/* 9 Draggable Calibration Handles (Clean dots without blocking text labels) */}
            {isCalibratingMesh && (
              <div
                className="mesh-pins-layer"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`,
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              >
                {[
                  { row: 'top', col: 'left', name: 'Верх Слева', color: '#ef4444' },
                  { row: 'top', col: 'mid', name: 'Верх Изгиб', color: '#f59e0b' },
                  { row: 'top', col: 'right', name: 'Верх Справа', color: '#10b981' },

                  { row: 'center', col: 'left', name: 'Центр Слева', color: '#ef4444' },
                  { row: 'center', col: 'mid', name: 'Центр Бугор', color: '#f59e0b' },
                  { row: 'center', col: 'right', name: 'Центр Справа', color: '#10b981' },

                  { row: 'bottom', col: 'left', name: 'Низ Слева', color: '#ef4444' },
                  { row: 'bottom', col: 'mid', name: 'Низ Изгиб', color: '#f59e0b' },
                  { row: 'bottom', col: 'right', name: 'Низ Справа', color: '#10b981' },
                ].map(({ row, col, name, color }) => {
                  const pt = activeMesh[row][col];
                  const isDragging = draggingMeshPoint && draggingMeshPoint.row === row && draggingMeshPoint.col === col;
                  const isHovered = hoveredMeshPoint && hoveredMeshPoint.row === row && hoveredMeshPoint.col === col;

                  return (
                    <div
                      key={`pin-${row}-${col}`}
                      className={`mesh-point-pin ${isDragging ? 'dragging' : ''} ${isHovered ? 'hovered' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${pt.x * zoom}px`,
                        top: `${pt.y * zoom}px`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto',
                        cursor: 'grab',
                      }}
                      onMouseDown={(e) => handleMouseDownMeshPoint(e, row, col)}
                      onMouseEnter={() => setHoveredMeshPoint({ row, col })}
                      onMouseLeave={() => setHoveredMeshPoint(null)}
                      title={`${name}: зажмите и переместите на линию тетради`}
                    >
                      <div className="pin-pulse" style={{ borderColor: color }} />
                      <div className="pin-dot" style={{ backgroundColor: color }} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* ==================== INACTIVE TEXT BLOCKS OVERLAYS (Sleek, transparent, non-blocking) ==================== */}
            {activeDragMode === 'text' && !isCalibratingMesh && textBlocks && textBlocks.map((block) => {
              if (block.id === activeBlockId) return null;

              const bLines = block.pages?.[currentPage] || [];
              const bLinesCount = bLines.length > 0 ? bLines.length : (block.text ? block.text.split('\n').length : 3);
              const bLeft = (block.marginLeft ?? 290) * zoom;
              const bTop = (block.marginTop ?? 140) * zoom;
              const bWidth = Math.max(100 * zoom, (config.canvasWidth - (block.marginLeft ?? 290) - (block.marginRight ?? 90)) * zoom);
              const bHeight = Math.max(50 * zoom, Math.min(
                (config.canvasHeight - (block.marginTop ?? 140) - (block.marginBottom ?? 100)) * zoom,
                (bLinesCount * (block.lineHeight || 40) + 40) * zoom
              ));

              return (
                <div
                  key={`inactive-block-${block.id}`}
                  className="inactive-block-overlay"
                  style={{
                    position: 'absolute',
                    left: `${bLeft}px`,
                    top: `${bTop}px`,
                    width: `${bWidth}px`,
                    height: `${bHeight}px`,
                    transform: `rotate(${block.textRotation || 0}deg)`,
                    transformOrigin: 'center center',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    zIndex: 6,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBlock && onSelectBlock(block.id);
                  }}
                  title={`Нажмите, чтобы выбрать блок "${block.name || 'Блок'}"`}
                />
              );
            })}

            {/* ==================== INTERACTIVE TEXT DRAG BOX (ACTIVE BLOCK - Minimalist, unobtrusive) ==================== */}
            {activeDragMode === 'text' && !isCalibratingMesh && (
              <div
                className={`text-drag-box ${isDraggingText ? 'dragging' : ''} ${
                  isResizingRight || isResizingBottom ? 'resizing' : ''
                } ${activeBlock.perspectiveY ? 'has-perspective' : ''}`}
                style={{
                  left: `${textX}px`,
                  top: `${textY}px`,
                  width: `${textW}px`,
                  height: `${textH}px`,
                  transform: `rotate(${activeBlock.textRotation || 0}deg)`,
                  transformOrigin: 'center center',
                }}
                onMouseDown={handleMouseDownTextDrag}
              >
                {/* Minimal floating move pill ABOVE the text box (never covers text) */}
                <div
                  className="text-drag-pill"
                  title="Зажмите и тяните для перемещения текста по листу"
                >
                  <Move size={12} />
                </div>

                {/* Subtle corner grip indicators */}
                <div className="box-corner corner-tl" />
                <div className="box-corner corner-tr" />
                <div className="box-corner corner-bl" />
                <div className="box-corner corner-br" />

                {/* Resize handle right */}
                <div
                  className="resize-handle handle-right"
                  onMouseDown={handleMouseDownResizeRight}
                  title="Потяните, чтобы изменить ширину текста (правое поле)"
                />

                {/* Resize handle bottom */}
                <div
                  className="resize-handle handle-bottom"
                  onMouseDown={handleMouseDownResizeBottom}
                  title="Потяните, чтобы изменить нижнюю границу"
                />
              </div>
            )}

            <div className="sheet-page-tag">
              Страница {currentPage + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pan & Zoom HUD in bottom-right corner */}
      <div className="canvas-zoom-hud">
        <button
          className={`hud-btn ${isHandToolActive || isSpacePressed ? 'active' : ''}`}
          onClick={() => setIsHandToolActive(!isHandToolActive)}
          title="Инструмент «Рука» (или зажмите Пробел и тяните мышь)"
        >
          <Hand size={14} />
          <span>{isHandToolActive ? 'Рука' : 'Рука'}</span>
        </button>

        <div className="hud-divider" />

        <button className="hud-btn icon-only" onClick={handleZoomOut} title="Уменьшить масштаб (Ctrl + Колёсико вниз)">
          <ZoomOut size={14} />
        </button>

        <button className="hud-zoom-val" onClick={handleResetZoom100} title="Нажмите, чтобы сбросить на 100%">
          {Math.round(zoom * 100)}%
        </button>

        <button className="hud-btn icon-only" onClick={handleZoomIn} title="Увеличить масштаб (Ctrl + Колёсико вверх)">
          <ZoomIn size={14} />
        </button>

        <div className="hud-divider" />

        <button className="hud-btn" onClick={handleFitToScreen} title="Вписать весь лист в экран">
          <Maximize2 size={13} />
          <span>Вписать</span>
        </button>

        {(pan.x !== 0 || pan.y !== 0) && (
          <button
            className="hud-btn icon-only"
            onClick={() => setPan({ x: 0, y: 0 })}
            title="Вернуть лист в центр"
          >
            <RotateCcw size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
