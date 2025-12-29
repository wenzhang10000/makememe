
import React, { useEffect, useRef } from 'react';
import { StickerConfig } from '../types';

interface Props {
  config: StickerConfig;
}

const StickerPreview: React.FC<Props> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = async () => {
      // Determine canvas size based on ratio
      let width = 800;
      let height = 450; // 16:9

      if (config.aspectRatio === '1:1') {
        width = 800;
        height = 800;
      } else if (config.aspectRatio === '9:16') {
        width = 450;
        height = 800;
      }

      canvas.width = width;
      canvas.height = height;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Background Box (Rounded Rectangle)
      const padding = 15;
      const bottomBuffer = 40;
      const boxWidth = width - (padding * 2);
      const boxHeight = height - (padding * 2) - bottomBuffer; 
      const radius = 40;

      ctx.save();
      ctx.fillStyle = config.bgColor;
      
      // Shadow for the bubble
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 10;

      ctx.beginPath();
      ctx.roundRect(padding, padding, boxWidth, boxHeight, radius);
      ctx.fill();
      ctx.restore();

      // 2. Draw Pointer
      if (config.showPointer) {
        ctx.save();
        ctx.fillStyle = config.bgColor;
        ctx.beginPath();
        const startX = padding + (width > height ? 80 : 60);
        ctx.moveTo(startX, padding + boxHeight);
        ctx.lineTo(startX + 40, padding + boxHeight + 40);
        ctx.lineTo(startX + 80, padding + boxHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Avatar
      if (config.avatarUrl) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = config.avatarUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; 
          });

          // Aspect ratio fitting with user-defined scale
          const baseTargetWidth = width * 0.55;
          const baseTargetHeight = height * 0.95; 
          
          const scale = Math.min(baseTargetWidth / img.width, baseTargetHeight / img.height) * config.avatarScale;
          const w = img.width * scale;
          const h = img.height * scale;
          
          // Position at bottom right
          const x = width - w - (padding + 5);
          const y = (padding + boxHeight) - h + 10; 

          ctx.drawImage(img, x, y, w, h);
        } catch (e) {
          console.error("Image loading failed", e);
        }
      }

      // 4. Draw "Artistic" Text
      const fontSize = config.fontSize;
      ctx.font = `900 ${fontSize}px 'Noto Sans SC', sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      
      const lines = config.text.split('\n');
      const textX = padding + (width > 500 ? 60 : 40);
      const textY = padding + (boxHeight / 2);
      const lineHeight = fontSize * 1.1;

      lines.forEach((line, index) => {
        const y = textY + (index - (lines.length - 1) / 2) * lineHeight;
        
        ctx.save();
        // a. Draw Stroke (Outline)
        ctx.lineJoin = 'round';
        ctx.lineWidth = fontSize * 0.18; 
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.strokeText(line, textX, y);

        // b. Draw Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 6;
        
        // c. Fill Text
        ctx.fillStyle = config.textColor;
        ctx.fillText(line, textX, y);
        ctx.restore();
      });
    };

    draw();
  }, [config]);

  return (
    <div className="flex justify-center bg-gray-200 p-2 rounded-2xl overflow-hidden shadow-inner min-h-[300px] items-center">
      <canvas 
        id="sticker-canvas"
        ref={canvasRef} 
        className="max-w-full max-h-[500px] object-contain shadow-2xl rounded-lg"
      />
    </div>
  );
};

export default StickerPreview;
