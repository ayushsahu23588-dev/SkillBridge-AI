import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Upload,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

interface AvatarCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export const AvatarCropperModal: React.FC<AvatarCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Reset parameters when image changes or modal opens
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setIsImageLoaded(false);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imageRef.current = img;
        setIsImageLoaded(true);
      };
    }
  }, [isOpen, imageSrc]);

  // Draw the image on the interactive canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !isImageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    // Move to center of canvas
    ctx.translate(width / 2, height / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply pan & zoom
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Calculate scale to cover canvas
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;

    let drawWidth = width;
    let drawHeight = height;

    if (imgAspect > canvasAspect) {
      drawHeight = height;
      drawWidth = height * imgAspect;
    } else {
      drawWidth = width;
      drawHeight = width / imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Draw circular mask overlay
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.arc(width / 2, height / 2, width * 0.44, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw circular guideline border
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.44, 0, Math.PI * 2);
    ctx.strokeStyle = '#D4F73C';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Subtle grid guides
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    const radius = width * 0.44;
    const third = (radius * 2) / 3;

    ctx.beginPath();
    // Horizontal lines
    ctx.moveTo(width / 2 - radius, height / 2 - radius + third);
    ctx.lineTo(width / 2 + radius, height / 2 - radius + third);
    ctx.moveTo(width / 2 - radius, height / 2 + radius - third);
    ctx.lineTo(width / 2 + radius, height / 2 + radius - third);
    // Vertical lines
    ctx.moveTo(width / 2 - radius + third, height / 2 - radius);
    ctx.lineTo(width / 2 - radius + third, height / 2 + radius);
    ctx.moveTo(width / 2 + radius - third, height / 2 - radius);
    ctx.lineTo(width / 2 + radius - third, height / 2 + radius);
    ctx.stroke();

    ctx.restore();
  }, [isImageLoaded, zoom, rotation, pan]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse / Touch handlers for dragging/panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && e.touches[0]) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !e.touches[0]) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  // Generate the cropped output image
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    // Create high-res offscreen canvas for crisp export
    const outputCanvas = document.createElement('canvas');
    const outputSize = 320;
    outputCanvas.width = outputSize;
    outputCanvas.height = outputSize;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    // Circular clipping
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Map canvas scale to output size
    const canvas = canvasRef.current;
    const canvasWidth = canvas?.width || 320;
    const ratio = outputSize / canvasWidth;

    ctx.translate(pan.x * ratio, pan.y * ratio);
    ctx.scale(zoom, zoom);

    // Base dimensions
    const imgAspect = img.width / img.height;
    const canvasAspect = 1;

    let drawWidth = outputSize;
    let drawHeight = outputSize;

    if (imgAspect > canvasAspect) {
      drawHeight = outputSize;
      drawWidth = outputSize * imgAspect;
    } else {
      drawWidth = outputSize;
      drawHeight = outputSize / imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    const dataUrl = outputCanvas.toDataURL('image/png', 0.95);
    onCropComplete(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      id="avatar-cropper-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#14151B] p-6 shadow-2xl space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cropper-title"
        id="avatar-cropper-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D4F73C]/20 text-[#2d4b06] dark:text-[#D4F73C] flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 id="cropper-title" className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                Crop & Adjust Profile Picture
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Drag to reposition, zoom or rotate to frame your avatar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Display Area */}
        <div className="relative flex items-center justify-center bg-gray-950 rounded-2xl overflow-hidden aspect-square border border-gray-800 shadow-inner">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="cursor-grab active:cursor-grabbing w-full h-full object-contain touch-none"
            id="avatar-cropper-canvas"
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950 text-xs text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Loading image preview...
            </div>
          )}
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3 pt-1">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.2))}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="flex-1 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Zoom</span>
              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#D4F73C] cursor-pointer"
                id="avatar-zoom-slider"
              />
              <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 w-9 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              id="cropper-rotate-btn"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90°</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setPan({ x: 0, y: 0 });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              id="cropper-reset-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            id="cropper-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c3e630] text-[#121316] text-xs font-bold shadow-xs transition-all cursor-pointer"
            id="cropper-apply-btn"
          >
            <Check className="w-4 h-4" />
            <span>Apply Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
};
