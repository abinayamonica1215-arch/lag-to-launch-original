import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor
 * 
 * Interactive Cursor Suite:
 * 1. Cursor Spotlight: Soft, transparent circular glow behind main UI content (z-[1])
 *    that smoothly trails the cursor with a slight delay.
 * 2. Micro-Sparkles: Minimal, elegant digital particles (1.2px-2.4px) that shimmer,
 *    rotate, and smoothly fade out during cursor motion (strictly restrained, non-distracting).
 * 3. Interactive Elements Proximity: Subtle 1–2% scale, magnetic pull (2–3px),
 *    and soft highlight on buttons, links, cards, and CTAs.
 * 4. Zero Interference: Normal cursor preserved, pointer-events: none,
 *    touch-disabled, and prefers-reduced-motion supported.
 */
export const CustomCursor = () => {
  const spotlightRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Guard against touch / mobile devices
    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouchDevice) return;

    // 2. Accessibility: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;

    // Canvas DPR sizing
    let dpr = window.devicePixelRatio || 1;
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Coordinates for smooth spotlight lag
    const mouse = { x: -500, y: -500 };
    const spotlight = { x: -500, y: -500 };
    let lastSparkleX = -500;
    let lastSparkleY = -500;

    // Digital Sparkle Particle Pool (strict cap for subtle minimalism)
    const sparkles = [];
    const MAX_SPARKLES = 18;

    const SPARKLE_COLORS = [
      { r: 255, g: 255, b: 255 }, // Diamond white
      { r: 163, g: 230, b: 53 },  // Electric lime (#A3E635)
      { r: 20,  g: 184, b: 166 }, // Soft teal (#14B8A6)
      { r: 56,  g: 189, b: 248 }, // Cyan pulse (#38BDF8)
    ];

    const addSparkle = (x, y, vx, vy) => {
      if (prefersReducedMotion) return;
      if (sparkles.length >= MAX_SPARKLES) {
        sparkles.shift();
      }

      const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      const type = Math.random() > 0.4 ? 'star' : 'diamond';
      const offsetAngle = Math.random() * Math.PI * 2;
      const offsetDist = Math.random() * 8 + 3;

      sparkles.push({
        x: x + Math.cos(offsetAngle) * offsetDist,
        y: y + Math.sin(offsetAngle) * offsetDist,
        vx: vx * 0.12 + (Math.random() - 0.5) * 0.4,
        vy: vy * 0.12 + (Math.random() - 0.5) * 0.4 - 0.1,
        radius: Math.random() * 1.0 + 1.2, // Tiny 1.2px - 2.2px
        color,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.03, // Fades smoothly in ~25-35 frames (~0.5s)
        twinklePhase: Math.random() * Math.PI * 2,
      });
    };

    // Active hovered interactive element tracking
    let currentInteractiveEl = null;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
        spotlight.x = e.clientX;
        spotlight.y = e.clientY;
      }

      // Check distance moved since last sparkle
      const dSparkleX = e.clientX - lastSparkleX;
      const dSparkleY = e.clientY - lastSparkleY;
      const distFromLast = Math.sqrt(dSparkleX * dSparkleX + dSparkleY * dSparkleY);

      // Restrained emission: only 1 subtle sparkle every ~28px of motion with 50% chance
      if (distFromLast > 28 && Math.random() < 0.5) {
        addSparkle(e.clientX, e.clientY, -dSparkleX * 0.08, -dSparkleY * 0.08);
        lastSparkleX = e.clientX;
        lastSparkleY = e.clientY;
      }

      // Proximity magnetic interaction for buttons / cards / links
      if (currentInteractiveEl && !prefersReducedMotion) {
        const rect = currentInteractiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pullX = Math.max(-3, Math.min(3, (e.clientX - centerX) * 0.05));
        const pullY = Math.max(-3, Math.min(3, (e.clientY - centerY) * 0.05));

        currentInteractiveEl.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) scale(1.015)`;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      resetInteractiveEl();
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const resetInteractiveEl = () => {
      if (currentInteractiveEl) {
        currentInteractiveEl.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)';
        currentInteractiveEl.style.transform = '';
        currentInteractiveEl = null;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, select, textarea, [role="button"], [role="link"], .cursor-pointer, [data-interactive]'
      );

      if (interactive && interactive !== currentInteractiveEl) {
        resetInteractiveEl();
        currentInteractiveEl = interactive;
        currentInteractiveEl.style.transition = 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)';

        // Emit a subtle digital sparkle upon approaching interactive elements
        if (Math.random() < 0.4) {
          addSparkle(mouse.x, mouse.y, 0, -0.3);
        }
      }
    };

    const handleMouseOut = (e) => {
      if (!currentInteractiveEl) return;
      if (!e.relatedTarget || !currentInteractiveEl.contains(e.relatedTarget)) {
        resetInteractiveEl();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // Drawing helper: 4-pointed micro star
    const drawStar = (cx, cy, r, rot) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.quadraticCurveTo(0, 0, 0, r);
      ctx.quadraticCurveTo(0, 0, -r, 0);
      ctx.quadraticCurveTo(0, 0, 0, -r);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Drawing helper: micro diamond
    const drawDiamond = (cx, cy, r, rot) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.6, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Animation Loop
    const animate = () => {
      // 1. Smooth lerp for Spotlight Glow
      const lerpFactor = prefersReducedMotion ? 1 : 0.08;
      spotlight.x += (mouse.x - spotlight.x) * lerpFactor;
      spotlight.y += (mouse.y - spotlight.y) * lerpFactor;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${spotlight.x}px, ${spotlight.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Render Micro-Sparkles Canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life -= s.decay;

        if (s.life <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotSpeed;
        s.twinklePhase += 0.2;

        const twinkle = 0.7 + Math.sin(s.twinklePhase) * 0.3;
        const currentRadius = s.radius * twinkle * s.life;
        const currentAlpha = Math.max(0, s.life * twinkle * 0.85);

        if (currentRadius <= 0.2 || currentAlpha <= 0) continue;

        ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha})`;
        ctx.shadowColor = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${currentAlpha * 0.6})`;
        ctx.shadowBlur = 4;

        if (s.type === 'star') {
          drawStar(s.x, s.y, currentRadius, s.rotation);
        } else {
          drawDiamond(s.x, s.y, currentRadius, s.rotation);
        }

        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      resetInteractiveEl();
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };
  }, [isVisible]);

  return (
    <>
      {/* 1. CURSOR SPOTLIGHT: Soft circular ambient glow behind main UI content (z-[1]) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[1] overflow-hidden transition-opacity duration-700 select-none"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div
          ref={spotlightRef}
          className="absolute top-0 left-0 w-[480px] h-[480px] rounded-full will-change-transform pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 240px at center, rgba(20, 184, 166, 0.08) 0%, rgba(163, 230, 53, 0.035) 40%, rgba(15, 23, 42, 0) 70%)',
            filter: 'blur(32px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* 2. MICRO-SPARKLES CANVAS: Delicate, non-intrusive digital sparkles overlay */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9999] select-none"
        style={{
          width: '100vw',
          height: '100vh',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </>
  );
};

export default CustomCursor;
