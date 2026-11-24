import React, { useEffect, useRef } from 'react';
import styles from './ConfettiRain.module.css';

const COLORS = [
  '#fde047', // bright gold
  '#f59e0b', // warm amber gold
  '#fbbf24', // metallic gold
  '#a855f7', // royal purple
  '#c084fc', // soft lavender
  '#4ade80', // emerald green
  '#ffffff', // diamond glint
];

/**
 * Full-Screen 60fps Canvas Reward Confetti Rain Animation (`<ConfettiRain />`).
 *
 * Rains down metallic gold ribbons, royal purple & emerald sparkles, and
 * 4-point star glints whenever `triggerKey` increments (on completing XP Catcher,
 * winning a Mini Game, claiming Watch & Earn / Daily Missions / Refer & Earn,
 * or Leveling Up).
 */
export default function ConfettiRain({ triggerKey }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!triggerKey) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Spawn 115 confetti ribbons, coins, and star sparkles
    const particles = Array.from({ length: 115 }, (_, i) => {
      const fromBurst = i < 45;
      return {
        x: fromBurst ? width * (0.12 + Math.random() * 0.76) : Math.random() * width,
        y: fromBurst ? height * 0.08 : -20 - Math.random() * height * 0.55,
        vx: (Math.random() - 0.5) * (fromBurst ? 9 : 3.2),
        vy: fromBurst ? -4 - Math.random() * 6 : 2.8 + Math.random() * 4.5,
        gravity: 0.14 + Math.random() * 0.06,
        w: 7 + Math.random() * 7,
        h: 4 + Math.random() * 6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.18,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.06 + Math.random() * 0.07,
        shape: i % 5 === 0 ? 'coin' : i % 4 === 0 ? 'star' : 'ribbon',
        color: COLORS[i % COLORS.length],
        opacity: 1,
      };
    });

    let rafId;
    const startTime = performance.now();
    const duration = 3600;

    const drawStar = (cx, cy, r) => {
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const rad = k % 2 === 0 ? r : r * 0.38;
        const a = (k * Math.PI) / 4;
        const px = cx + Math.cos(a) * rad;
        const py = cy + Math.sin(a) * rad;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const tick = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const fadeProgress = elapsed > duration - 900 ? (duration - elapsed) / 900 : 1;

      for (const p of particles) {
        p.vy = Math.min(7.5, p.vy + p.gravity);
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 1.1;
        p.y += p.vy;
        p.angle += p.spin;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity * fadeProgress));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        if (p.shape === 'coin') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.w * 0.65, p.w * 0.65 * Math.abs(Math.cos(p.wobble)), 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (p.shape === 'star') {
          drawStar(0, 0, p.w * 0.75);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.wobble)));
        }

        ctx.restore();
      }

      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [triggerKey]);

  if (!triggerKey) return null;

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
