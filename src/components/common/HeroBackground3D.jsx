import React, { useEffect, useRef } from 'react';

export const HeroBackground3D = () => {
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

    // Mouse tracking for 3D parallax tilt & slight displacement
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, rawX: -9999, rawY: -9999 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.rawX = clientX;
      mouse.rawY = clientY;
      mouse.targetX = (clientX - width / 2) * 0.22;
      mouse.targetY = (clientY - height / 2) * 0.22;
    };

    const handleMouseLeave = () => {
      mouse.rawX = -9999;
      mouse.rawY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Config parameters
    const PARTICLE_COUNT = Math.min(95, Math.floor((width * height) / 9500));
    const FOCAL_LENGTH = 450;
    const MAX_DEPTH = 550;
    const CONNECT_DIST = 155;

    const COLORS = [
      { r: 163, g: 230, b: 53 },  // #A3E635 (Electric Lime)
      { r: 20,  g: 184, b: 166 }, // #14B8A6 (Teal Glow)
      { r: 56,  g: 189, b: 248 }, // #38BDF8 (Cyan Pulse)
      { r: 255, g: 255, b: 255 }, // White Node
    ];

    // Create 3D particles with active velocities
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const baseSpeed = Math.random() * 0.65 + 0.45;
      const angle = Math.random() * Math.PI * 2;

      return {
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: (Math.random() - 0.5) * MAX_DEPTH * 2,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        vz: (Math.random() - 0.5) * 0.8,
        baseRadius: Math.random() * 2.2 + 1.4,
        color,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    // Traveling Data Packets / Pulses along connection lines
    const pulses = Array.from({ length: 28 }, () => ({
      i: 0,
      j: 0,
      t: Math.random(),
      speed: Math.random() * 0.018 + 0.008,
      color: COLORS[Math.floor(Math.random() * 3)],
    }));

    // Main render loop
    let globalTime = 0;

    const render = () => {
      globalTime += 0.02;

      // Smooth mouse lerp for interactive 3D parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      const projected = [];

      // 1. Update & Project Particles in 3D
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Active 3D motion scaled by depth position
        const speedMult = 1 + (p.z / MAX_DEPTH) * 0.3;
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;
        p.z += p.vz;
        p.pulse += 0.03;

        // Wrap boundaries cleanly
        const boundsX = width * 0.85;
        const boundsY = height * 0.85;
        if (p.x < -boundsX) p.x = boundsX;
        if (p.x > boundsX) p.x = -boundsX;
        if (p.y < -boundsY) p.y = boundsY;
        if (p.y > boundsY) p.y = -boundsY;
        if (p.z < -MAX_DEPTH) p.z = MAX_DEPTH;
        if (p.z > MAX_DEPTH) p.z = -MAX_DEPTH;

        const effectiveZ = p.z + FOCAL_LENGTH;
        if (effectiveZ <= 10) continue;

        const scale = FOCAL_LENGTH / effectiveZ;
        let screenX = centerX + (p.x + mouse.x * scale) * scale;
        let screenY = centerY + (p.y + mouse.y * scale) * scale;

        // Subtle proximity repel: nearby particles gently move away from cursor
        const dmx = screenX - mouse.rawX;
        const dmy = screenY - mouse.rawY;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        const REPEL_RADIUS = 95;
        if (distMouse < REPEL_RADIUS && distMouse > 0.1) {
          const repelForce = Math.pow(1 - distMouse / REPEL_RADIUS, 1.4) * 24 * Math.min(1.2, scale);
          screenX += (dmx / distMouse) * repelForce;
          screenY += (dmy / distMouse) * repelForce;
        }

        const radius = Math.max(0.9, p.baseRadius * scale + Math.sin(p.pulse) * 0.45);

        const depthAlpha = Math.min(1, Math.max(0.2, (p.z + MAX_DEPTH) / (MAX_DEPTH * 1.8)));
        const alpha = depthAlpha * Math.min(1, scale);

        projected.push({
          p,
          screenX,
          screenY,
          radius,
          alpha,
          scale,
        });
      }

      // Active Connection Pair Tracking
      const activeConnections = [];

      // 2. Draw Connected Data Network Lines
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];

          const dx = p1.p.x - p2.p.x;
          const dy = p1.p.y - p2.p.y;
          const dz = p1.p.z - p2.p.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < CONNECT_DIST) {
            const lineAlpha = (1 - dist3D / CONNECT_DIST) * Math.min(p1.alpha, p2.alpha) * 0.38;

            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);

            const strokeColor = `rgba(${p1.p.color.r}, ${p1.p.color.g}, ${p1.p.color.b}, ${lineAlpha})`;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = Math.max(0.5, 1.3 * Math.min(p1.scale, p2.scale));
            ctx.stroke();

            activeConnections.push({ p1, p2, alpha: lineAlpha });
          }
        }
      }

      // 3. Animate Flowing Data Pulses Along Connections
      if (activeConnections.length > 0) {
        for (let k = 0; k < pulses.length; k++) {
          const pulse = pulses[k];
          const conn = activeConnections[k % activeConnections.length];
          if (!conn) continue;

          pulse.t += pulse.speed;
          if (pulse.t > 1) {
            pulse.t = 0;
          }

          const pulseX = conn.p1.screenX + (conn.p2.screenX - conn.p1.screenX) * pulse.t;
          const pulseY = conn.p1.screenY + (conn.p2.screenY - conn.p1.screenY) * pulse.t;
          const pulseAlpha = Math.min(1, conn.alpha * 2.2);

          // Glowing traveling packet spark
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.5 * Math.min(conn.p1.scale, conn.p2.scale), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, ${pulseAlpha})`;
          ctx.shadowColor = `rgba(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b}, 0.8)`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // reset glow
        }
      }

      // 4. Draw Particle Nodes
      for (let i = 0; i < projected.length; i++) {
        const { p, screenX, screenY, radius, alpha } = projected[i];

        // Outer ambient glow
        const glowRadius = radius * 3.2;
        const gradient = ctx.createRadialGradient(
          screenX, screenY, radius * 0.2,
          screenX, screenY, glowRadius
        );
        gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.9})`);
        gradient.addColorStop(0.45, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.35})`);
        gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(screenX, screenY, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner solid core node
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.3)})`;
        ctx.fill();
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
      style={{ opacity: 0.95 }}
    />
  );
};

export default HeroBackground3D;
