import React, { useEffect, useRef } from 'react';

export const FeatureBackground3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, rawX: -9999, rawY: -9999 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.rawX = e.clientX - rect.left;
      mouse.rawY = e.clientY - rect.top;
      mouse.targetX = (e.clientX - rect.left - width / 2) * 0.12;
      mouse.targetY = (e.clientY - rect.top - height / 2) * 0.12;
    };
    const handleMouseLeave = () => {
      mouse.rawX = -9999;
      mouse.rawY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // 3D Nodes & Flow Streams connecting from Hero
    const NODE_COUNT = Math.min(45, Math.floor((width * height) / 18000));
    const FOCAL_LENGTH = 400;
    const MAX_DEPTH = 400;

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * width * 1.3,
      y: (Math.random() - 0.5) * height * 1.3,
      z: (Math.random() - 0.5) * MAX_DEPTH * 2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.2 + 1.2,
      color: Math.random() > 0.5 ? 'rgba(15, 118, 110,' : 'rgba(163, 230, 53,',
    }));

    // Data streams flowing downwards
    const streams = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 60 + 40,
      speed: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.25 + 0.1,
    }));

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Render 3D Network Nodes
      const projected = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        if (n.x < -width * 0.7) n.x = width * 0.7;
        if (n.x > width * 0.7) n.x = -width * 0.7;
        if (n.y < -height * 0.7) n.y = height * 0.7;
        if (n.y > height * 0.7) n.y = -height * 0.7;
        if (n.z < -MAX_DEPTH) n.z = MAX_DEPTH;
        if (n.z > MAX_DEPTH) n.z = -MAX_DEPTH;

        const effectiveZ = n.z + FOCAL_LENGTH;
        if (effectiveZ <= 10) continue;

        const scale = FOCAL_LENGTH / effectiveZ;
        let screenX = centerX + (n.x + mouse.x * scale) * scale;
        let screenY = centerY + (n.y + mouse.y * scale) * scale;

        // Subtle proximity repel: gently move away from cursor
        const dmx = screenX - mouse.rawX;
        const dmy = screenY - mouse.rawY;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        const REPEL_RADIUS = 90;
        if (distMouse < REPEL_RADIUS && distMouse > 0.1) {
          const repelForce = Math.pow(1 - distMouse / REPEL_RADIUS, 1.4) * 20 * Math.min(1.2, scale);
          screenX += (dmx / distMouse) * repelForce;
          screenY += (dmy / distMouse) * repelForce;
        }

        const r = Math.max(0.8, n.radius * scale);
        const alpha = Math.min(0.4, (n.z + MAX_DEPTH) / (MAX_DEPTH * 2.2));

        projected.push({ n, screenX, screenY, r, alpha, scale });
      }

      // Draw 3D Connection Lines
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.n.x - p2.n.x;
          const dy = p1.n.y - p2.n.y;
          const dz = p1.n.z - p2.n.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * Math.min(p1.alpha, p2.alpha) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            ctx.strokeStyle = `${p1.n.color} ${lineAlpha})`;
            ctx.lineWidth = Math.max(0.4, 0.9 * Math.min(p1.scale, p2.scale));
            ctx.stroke();
          }
        }
      }

      // Draw 3D Data Streams
      for (let i = 0; i < streams.length; i++) {
        const s = streams[i];
        s.y += s.speed;
        if (s.y > height + s.len) {
          s.y = -s.len;
          s.x = Math.random() * width;
        }

        const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.len);
        grad.addColorStop(0, 'rgba(15, 118, 110, 0)');
        grad.addColorStop(0.5, `rgba(163, 230, 53, ${s.alpha})`);
        grad.addColorStop(1, 'rgba(15, 118, 110, 0)');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: 0.6 }}
    />
  );
};

export default FeatureBackground3D;
