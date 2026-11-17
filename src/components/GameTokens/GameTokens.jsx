import React, { useId } from 'react';
import styles from './GameTokens.module.css';

/**
 * Glossy 3D-styled SVG tokens matching the attached sample screenshots:
 *  - XpOrb      → purple glowing orb with bold "XP"
 *  - VeCoin     → golden embossed coin with bold "V"
 *  - GemToken   → faceted green/purple crystal gem
 *  - TaskTile   → 3D icon tiles for Watch & Earn, Daily Tasks, Refer & Earn,
 *                 XP Catcher magnet, Mini Games controller, Streak flame, etc.
 */

export function XpOrb({ size = 40, className = '' }) {
  const uid = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${styles.token} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`xpGlow_${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#7c3aed" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#3b0764" stopOpacity="1" />
        </radialGradient>
        <linearGradient id={`xpRim_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f3ff" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill={`url(#xpRim_${uid})`} />
      <circle cx="32" cy="32" r="25.5" fill={`url(#xpGlow_${uid})`} />
      <ellipse cx="24" cy="19" rx="12" ry="6" fill="rgba(255,255,255,0.28)" transform="rotate(-18 24 19)" />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="Poppins, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="0.5"
      >
        XP
      </text>
    </svg>
  );
}

export function VeCoin({ size = 40, className = '' }) {
  const uid = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${styles.token} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`veFace_${uid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="45%" stopColor="#f4be44" />
          <stop offset="100%" stopColor="#9e6408" />
        </radialGradient>
        <linearGradient id={`veRim_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill={`url(#veRim_${uid})`} />
      <circle cx="32" cy="32" r="24" fill={`url(#veFace_${uid})`} stroke="#fef08a" strokeWidth="1.2" />
      <ellipse cx="24" cy="18" rx="11" ry="5" fill="rgba(255,255,255,0.35)" transform="rotate(-18 24 18)" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fill="#fffbeb"
        stroke="#78350f"
        strokeWidth="1"
        fontFamily="Poppins, sans-serif"
        fontWeight="800"
        fontSize="25"
      >
        V
      </text>
    </svg>
  );
}

export function GemToken({ size = 40, variant = 'green', className = '' }) {
  const uid = useId();
  const palette =
    variant === 'purple'
      ? { top: '#e9d5ff', mid: '#9333ea', dark: '#4c1d95', stroke: '#f3e8ff' }
      : { top: '#bbf7d0', mid: '#22c55e', dark: '#14532d', stroke: '#dcfce7' };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${styles.token} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gem_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.top} />
          <stop offset="50%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.dark} />
        </linearGradient>
      </defs>
      <polygon
        points="32,5 55,19 55,45 32,59 9,45 9,19"
        fill={`url(#gem_${uid})`}
        stroke={palette.stroke}
        strokeWidth="1.5"
      />
      <polygon points="32,13 47,22 47,42 32,51 17,42 17,22" fill="rgba(255,255,255,0.18)" />
      <polyline
        points="9,19 32,32 55,19"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.3"
      />
      <line x1="32" y1="32" x2="32" y2="59" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" />
    </svg>
  );
}

/**
 * 3D glossy icon graphics matching the 6-screen mockup (Watch & Earn play button,
 * Daily Tasks clipboard, Refer & Earn golden users, XP Catcher magnet, Mini Games
 * gamepad, Streak flame, Star XP badge).
 */
export function GraphicIcon({ type, size = 44 }) {
  const uid = useId();
  switch (type) {
    case 'star-xp':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <radialGradient id={`sx_${uid}`} cx="35%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#ddd6fe" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3b0764" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="27" fill={`url(#sx_${uid})`} stroke="#c4b5fd" strokeWidth="2" />
          <polygon
            points="32,15 36.9,25 48,26.6 40,34.4 41.9,45.5 32,40.2 22.1,45.5 24,34.4 16,26.6 27.1,25"
            fill="#ffffff"
          />
        </svg>
      );

    case 'watch':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id={`wt_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="55%" stopColor="#6d28d9" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
          </defs>
          <rect x="8" y="13" width="48" height="38" rx="11" fill={`url(#wt_${uid})`} stroke="#c4b5fd" strokeWidth="1.6" />
          <polygon points="27,23 27,41 42,32" fill="#ffffff" />
        </svg>
      );

    case 'tasks':
    case 'tasks-green': {
      const green = type === 'tasks-green';
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id={`tk_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={green ? '#4ade80' : '#fde68a'} />
              <stop offset="100%" stopColor={green ? '#15803d' : '#b45309'} />
            </linearGradient>
          </defs>
          <rect
            x="13"
            y="12"
            width="38"
            height="44"
            rx="8"
            fill={`url(#tk_${uid})`}
            stroke={green ? '#bbf7d0' : '#fef3c7'}
            strokeWidth="1.5"
          />
          <rect x="18" y="18" width="28" height="33" rx="4" fill={green ? '#dcfce7' : '#fffbeb'} />
          <rect x="24" y="8" width="16" height="8" rx="3" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1.2" />
          <path d="M22 26 l3 3 l5 -5" stroke="#15803d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <line x1="33" y1="26" x2="42" y2="26" stroke="#475569" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M22 35 l3 3 l5 -5" stroke="#15803d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <line x1="33" y1="35" x2="42" y2="35" stroke="#475569" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="23" y1="43" x2="42" y2="43" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    }

    case 'refer':
    case 'refer-green': {
      const green = type === 'refer-green';
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id={`rf_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={green ? '#86efac' : '#fde68a'} />
              <stop offset="100%" stopColor={green ? '#15803d' : '#b45309'} />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="9" fill={`url(#rf_${uid})`} />
          <path d="M10 48c0-8 6.5-13 14-13s14 5 14 13" fill={`url(#rf_${uid})`} />
          <circle cx="42" cy="26" r="7.5" fill={`url(#rf_${uid})`} opacity="0.9" />
          <path d="M31 48c.5-6.5 5.5-11 12-11 6 0 11 4.2 11 11" fill={`url(#rf_${uid})`} opacity="0.9" />
        </svg>
      );
    }

    case 'magnet':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id={`mg_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          <path
            d="M18 16v16c0 8.5 6.3 15 14 15s14-6.5 14-15V16h-9v16c0 3.2-2.2 6-5 6s-5-2.8-5-6V16z"
            fill={`url(#mg_${uid})`}
            stroke="#93c5fd"
            strokeWidth="1.4"
          />
          <rect x="17" y="12" width="10" height="6" rx="2" fill="#e2e8f0" />
          <rect x="37" y="12" width="10" height="6" rx="2" fill="#e2e8f0" />
          <circle cx="42" cy="11" r="5" fill="#fbbf24" stroke="#fef3c7" strokeWidth="1.2" />
        </svg>
      );

    case 'gamepad':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id={`gp_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="55%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
          <path
            d="M17 20h30c6 0 10 5 11 12l1.5 11c.6 4.5-2.8 8-7 8-3 0-5.4-1.6-7.2-4.2L42 42H22l-3.3 4.8C16.9 49.4 14.5 51 11.5 51c-4.2 0-7.6-3.5-7-8L6 32c1-7 5-12 11-12z"
            fill={`url(#gp_${uid})`}
            stroke="#a5b4fc"
            strokeWidth="1.5"
          />
          <path d="M20 27v8M16 31h8" stroke="#e0e7ff" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="43" cy="29" r="2.4" fill="#fbbf24" />
          <circle cx="48" cy="33" r="2.4" fill="#34d399" />
          <circle cx="38" cy="33" r="2.4" fill="#f472b6" />
        </svg>
      );

    case 'flame':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id={`fl_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="55%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          <path
            d="M33 7c2 9-5 14-4 21 3-2 6-6 6-10 8 6 13 14 13 23 0 10-7.5 17-16 17S16 51 16 41c0-9 6-16 11-22 1 4 3 6 5 7-1-7 0-14 1-19z"
            fill={`url(#fl_${uid})`}
          />
          <path
            d="M32 33c3 4 6 8 6 13 0 5-3 8-6 8s-6-3-6-8c0-4 2-8 6-13z"
            fill="#fef08a"
          />
        </svg>
      );

    case 'coin':
      return <VeCoin size={size} />;

    case 'target':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="#7c2d12" stroke="#fb923c" strokeWidth="3" />
          <circle cx="32" cy="32" r="16" fill="#1e1b4b" stroke="#fdba74" strokeWidth="3" />
          <circle cx="32" cy="32" r="7" fill="#f97316" />
        </svg>
      );

    case 'flag':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
          <line x1="18" y1="12" x2="18" y2="54" stroke="#fde68a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M20 14h28l-5 10 5 10H20z" fill="#f59e0b" stroke="#fef3c7" strokeWidth="1.5" />
        </svg>
      );

    default:
      return <XpOrb size={size} />;
  }
}
