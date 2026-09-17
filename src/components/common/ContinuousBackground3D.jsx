import React, { useEffect, useRef } from 'react';

/**
 * ContinuousBackground3D
 *
 * A full-canvas animated 3D background matching the hero's neural particle network.
 * Paints its own dark gradient base so it replaces white sections entirely.
 *
 * Props:
 *   variant: 'hero-transition' | 'mid' | 'cta' | 'dark'
 *     - hero-transition: Slate-900 base, transitions FROM the hero dark into lighter sections
 *     - mid:             Deep navy/slate base mid-page sections
 *     - cta:             Teal-tinted dark for CTA section
 *     - dark:            Slate-950 base for career cards section
 */
export const ContinuousBackground3D = ({ variant = 'mid' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const parent = canvas.parentElement;
    let width  = (canvas.width  = parent?.clientWidth  || window.innerWidth);
    let height = (canvas.height = parent?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width  = canvas.width  = parent?.clientWidth  || window.innerWidth;
      height = canvas.height = parent?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Scroll-based parallax
    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Subtle mouse parallax
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, rawX: -9999, rawY: -9999 };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.rawX = e.clientX - rect.left;
      mouse.rawY = e.clientY - rect.top;
      mouse.tx = (e.clientX - rect.left - width / 2) * 0.14;
      mouse.ty = (e.clientY - rect.top  - height / 2) * 0.14;
    };
    const onMouseLeave = () => {
      mouse.rawX = -9999;
      mouse.rawY = -9999;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // --- Background gradient colours by variant ---
    const BG_STOPS = {
      'hero-transition': [
        { pos: 0.0, color: 'rgba(15, 23, 42, 1.00)' },   // slate-900 — matches hero bottom
        { pos: 0.5, color: 'rgba(10, 21, 40, 0.98)' },
        { pos: 1.0, color: 'rgba(8,  20, 38, 0.97)' },
      ],
      mid: [
        { pos: 0.0, color: 'rgba(10, 18, 36, 0.97)' },
        { pos: 0.5, color: 'rgba(13, 22, 42, 0.98)' },
        { pos: 1.0, color: 'rgba(10, 18, 36, 0.97)' },
      ],
      cta: [
        { pos: 0.0, color: 'rgba(8, 18, 34, 0.98)'  },
        { pos: 0.5, color: 'rgba(10, 25, 40, 0.97)' },
        { pos: 1.0, color: 'rgba(6, 16, 30, 0.98)'  },
      ],
      dark: [
        { pos: 0.0, color: 'rgba(4, 14, 28, 0.98)' },
        { pos: 1.0, color: 'rgba(8, 20, 38, 0.97)' },
      ],
    };

    const stops = BG_STOPS[variant] ?? BG_STOPS.mid;

    // --- Particle palette matching hero ---
    const COLORS = [
      { r: 163, g: 230, b: 53  },  // #A3E635 Electric Lime
      { r: 20,  g: 184, b: 166 },  // #14B8A6 Teal Glow
      { r: 56,  g: 189, b: 248 },  // #38BDF8 Cyan Pulse
      { r: 255, g: 255, b: 255 },  // White
      { r: 45,  g: 212, b: 191 },  // Light Teal
    ];

    const PARTICLE_COUNT = Math.min(90, Math.floor((width * height) / 8800));
    const FOCAL  = 420;
    const DEPTH  = 520;
    const CDIST  = 155;

    // 3D Particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = Math.random() * Math.PI * 2;
      const spd   = Math.random() * 0.55 + 0.35;
      return {
        x:  (Math.random() - 0.5) * width  * 1.5,
        y:  (Math.random() - 0.5) * height * 1.5,
        z:  (Math.random() - 0.5) * DEPTH  * 2,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        vz: (Math.random() - 0.5) * 0.65,
        r:  Math.random() * 2.4 + 1.4,
        color,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    // Data-packet sparks
    const packets = Array.from({ length: 26 }, () => ({
      t:     Math.random(),
      spd:   Math.random() * 0.016 + 0.008,
      color: COLORS[Math.floor(Math.random() * 3)],
    }));

    // Wireframe floating shapes
    const shapes = Array.from({ length: 7 }, () => ({
      x:    (Math.random() - 0.5) * width  * 0.95,
      y:    (Math.random() - 0.5) * height * 0.95,
      z:    Math.random() * 360 - 180,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      vrX:  (Math.random() - 0.5) * 0.009,
      vrY:  (Math.random() - 0.5) * 0.011,
      size: Math.random() * 30 + 22,
      type: Math.random() > 0.5 ? 'cube' : 'tetra',
    }));

    const render = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      const scrollShift = scrollY * 0.055;

      // ── Draw dark gradient background fill ──────────────────────────────
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      stops.forEach(s => grad.addColorStop(s.pos, s.color));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Faint radial glow center accent
      const radial = ctx.createRadialGradient(
        width * 0.5, height * 0.4, 0,
        width * 0.5, height * 0.4, width * 0.65
      );
      radial.addColorStop(0, 'rgba(14, 165, 233, 0.045)');
      radial.addColorStop(0.5, 'rgba(20, 184, 166, 0.025)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // ── Project particles ────────────────────────────────────────────────
      const cx = width / 2;
      const cy = height / 2;
      const proj = [];

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.pulse += 0.028;

        const bX = width  * 0.8;
        const bY = height * 0.8;
        if (p.x < -bX) p.x = bX; if (p.x > bX) p.x = -bX;
        if (p.y < -bY) p.y = bY; if (p.y > bY) p.y = -bY;
        if (p.z < -DEPTH) p.z = DEPTH; if (p.z > DEPTH) p.z = -DEPTH;

        const ez = p.z + FOCAL;
        if (ez <= 10) continue;

        const sc = FOCAL / ez;
        let sx = cx + (p.x + mouse.x * sc) * sc;
        let sy = cy + (p.y - scrollShift + mouse.y * sc) * sc;

        // Subtle proximity repel: gently move away from cursor
        const dmx = sx - mouse.rawX;
        const dmy = sy - mouse.rawY;
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        const REPEL_RADIUS = 90;
        if (distMouse < REPEL_RADIUS && distMouse > 0.1) {
          const repelForce = Math.pow(1 - distMouse / REPEL_RADIUS, 1.4) * 20 * Math.min(1.2, sc);
          sx += (dmx / distMouse) * repelForce;
          sy += (dmy / distMouse) * repelForce;
        }

        const r  = Math.max(0.9, p.r * sc + Math.sin(p.pulse) * 0.5);

        const da    = Math.min(1, Math.max(0.18, (p.z + DEPTH) / (DEPTH * 1.8)));
        const alpha = da * Math.min(1, sc) * 0.82;

        proj.push({ p, sx, sy, r, alpha, sc });
      }

      // ── Connection lines ─────────────────────────────────────────────────
      const conns = [];
      for (let i = 0; i < proj.length; i++) {
        const a = proj[i];
        for (let j = i + 1; j < proj.length; j++) {
          const b = proj[j];
          const dx = a.p.x - b.p.x;
          const dy = a.p.y - b.p.y;
          const dz = a.p.z - b.p.z;
          const d3 = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (d3 < CDIST) {
            const la = (1 - d3 / CDIST) * Math.min(a.alpha, b.alpha) * 0.45;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = `rgba(${a.p.color.r},${a.p.color.g},${a.p.color.b},${la})`;
            ctx.lineWidth = Math.max(0.4, 1.2 * Math.min(a.sc, b.sc));
            ctx.stroke();
            conns.push({ a, b, la });
          }
        }
      }

      // ── Data-packet sparks ───────────────────────────────────────────────
      if (conns.length > 0) {
        for (let k = 0; k < packets.length; k++) {
          const pk  = packets[k];
          const cn  = conns[k % conns.length];
          if (!cn) continue;

          pk.t += pk.spd;
          if (pk.t > 1) pk.t = 0;

          const px = cn.a.sx + (cn.b.sx - cn.a.sx) * pk.t;
          const py = cn.a.sy + (cn.b.sy - cn.a.sy) * pk.t;
          const pa = Math.min(1, cn.la * 2.6);

          ctx.beginPath();
          ctx.arc(px, py, 2.6 * Math.min(cn.a.sc, cn.b.sc), 0, Math.PI * 2);
          ctx.fillStyle   = `rgba(${pk.color.r},${pk.color.g},${pk.color.b},${pa})`;
          ctx.shadowColor = `rgba(${pk.color.r},${pk.color.g},${pk.color.b},0.9)`;
          ctx.shadowBlur  = 7;
          ctx.fill();
          ctx.shadowBlur  = 0;
        }
      }

      // ── Wireframe shapes ─────────────────────────────────────────────────
      const CUBE_V = [
        [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
        [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],
      ];
      const CUBE_E = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      const TETRA_V = [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]];
      const TETRA_E = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];

      for (const s of shapes) {
        s.rotX += s.vrX;
        s.rotY += s.vrY;

        const ez = s.z + FOCAL;
        if (ez <= 10) continue;

        const sc = FOCAL / ez;
        const sx = cx + (s.x + mouse.x * sc) * sc;
        const sy = cy + (s.y - scrollShift * 0.4 + mouse.y * sc) * sc;
        const sz = s.size * sc;

        const verts = (s.type === 'cube' ? CUBE_V : TETRA_V).map(([vx, vy, vz]) => {
          // Rotate X
          const y1 = vy * Math.cos(s.rotX) - vz * Math.sin(s.rotX);
          const z1 = vy * Math.sin(s.rotX) + vz * Math.cos(s.rotX);
          // Rotate Y
          const x2 = vx * Math.cos(s.rotY) + z1 * Math.sin(s.rotY);
          return { x: sx + x2 * (sz / 2), y: sy + y1 * (sz / 2) };
        });

        const edges = s.type === 'cube' ? CUBE_E : TETRA_E;
        ctx.beginPath();
        for (const [e1, e2] of edges) {
          ctx.moveTo(verts[e1].x, verts[e1].y);
          ctx.lineTo(verts[e2].x, verts[e2].y);
        }
        ctx.strokeStyle = s.type === 'cube'
          ? 'rgba(20, 184, 166, 0.20)'
          : 'rgba(163, 230, 53, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ── Glowing particle nodes ───────────────────────────────────────────
      for (const { p, sx, sy, r, alpha } of proj) {
        // Outer glow
        ctx.beginPath();
        ctx.arc(sx, sy, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha * 0.22})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
        ctx.fill();
      }

      // ── Top edge fade so sections blend with section above ───────────────
      const topFade = ctx.createLinearGradient(0, 0, 0, 80);
      topFade.addColorStop(0, 'rgba(0,0,0,0.55)');
      topFade.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, 80);

      // ── Bottom edge fade for smooth transition into next section ─────────
      const btmFade = ctx.createLinearGradient(0, height - 80, 0, height);
      btmFade.addColorStop(0, 'rgba(0,0,0,0)');
      btmFade.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = btmFade;
      ctx.fillRect(0, height - 80, width, 80);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ContinuousBackground3D;
