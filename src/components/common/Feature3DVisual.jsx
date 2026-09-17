import React, { useEffect, useRef } from 'react';

export const Feature3DVisual = ({ type = 'academic' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = (canvas.width = 64);
    const height = (canvas.height = 64);
    let time = 0;

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.save();

      switch (type) {
        case 'academic': // 3D Data Bars & Analytical Nodes
          for (let i = 0; i < 3; i++) {
            const h = 14 + Math.sin(time + i * 1.2) * 8;
            const x = cx - 14 + i * 14;
            const y = cy + 10 - h;

            // Bar fill
            ctx.fillStyle = i === 1 ? '#0F766E' : '#A3E635';
            ctx.fillRect(x, y, 8, h);

            // 3D Top Cap
            ctx.fillStyle = '#14B8A6';
            ctx.fillRect(x, y - 3, 8, 3);
          }
          break;

        case 'skill-gap': // 3D Dual Comparison Ring
          ctx.beginPath();
          ctx.arc(cx, cy, 18, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(15, 118, 110, 0.2)';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, 18, time, time + Math.PI * 1.2);
          ctx.strokeStyle = '#0F766E';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, 10, -time, -time + Math.PI * 0.9);
          ctx.strokeStyle = '#A3E635';
          ctx.lineWidth = 3;
          ctx.stroke();
          break;

        case 'pathway': // 3D Connected Nodes Pathway
          const n1x = cx - 16 + Math.sin(time) * 3;
          const n1y = cy - 10;
          const n2x = cx + 16 - Math.sin(time) * 3;
          const n2y = cy + 10;

          ctx.beginPath();
          ctx.moveTo(n1x, n1y);
          ctx.lineTo(cx, cy);
          ctx.lineTo(n2x, n2y);
          ctx.strokeStyle = '#0F766E';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          [ { x: n1x, y: n1y }, { x: cx, y: cy }, { x: n2x, y: n2y } ].forEach((pt, idx) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, idx === 1 ? 6 : 4, 0, Math.PI * 2);
            ctx.fillStyle = idx === 1 ? '#A3E635' : '#0F766E';
            ctx.fill();
          });
          break;

        case 'code': // 3D Code Brackets & Pulsing Syntax Node
        case 'placement-prep':
          const rot = Math.sin(time) * 0.2;
          ctx.translate(cx, cy);
          ctx.rotate(rot);

          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = '#0F766E';
          ctx.fillText('<', -18, 5);
          ctx.fillStyle = '#A3E635';
          ctx.fillText('/>', 4, 5);
          break;

        case 'progress': // 3D Velocity Pulse & Speedometer
          const angle = (Math.sin(time) + 1) * Math.PI * 0.75 - Math.PI * 0.75;
          ctx.beginPath();
          ctx.arc(cx, cy + 4, 16, Math.PI, 0);
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy + 4, 16, Math.PI, Math.PI + angle);
          ctx.strokeStyle = '#0F766E';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Needle
          const nx = cx + Math.cos(angle) * 12;
          const ny = cy + 4 + Math.sin(angle) * 12;
          ctx.beginPath();
          ctx.moveTo(cx, cy + 4);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = '#A3E635';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          break;

        case 'employability': // 3D Verified Shield Emblem
        default:
          ctx.beginPath();
          ctx.moveTo(cx, cy - 18);
          ctx.lineTo(cx + 14, cy - 10);
          ctx.lineTo(cx + 14, cy + 6);
          ctx.lineTo(cx, cy + 18);
          ctx.lineTo(cx - 14, cy + 6);
          ctx.lineTo(cx - 14, cy - 10);
          ctx.closePath();
          ctx.fillStyle = 'rgba(204, 251, 241, 0.8)';
          ctx.fill();
          ctx.strokeStyle = '#0F766E';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#A3E635';
          ctx.fill();
          break;
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [type]);

  return <canvas ref={canvasRef} className="w-12 h-12 shrink-0 pointer-events-none" />;
};

export default Feature3DVisual;
