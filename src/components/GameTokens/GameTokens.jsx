import React, { useId } from 'react';
import orbXpImg from '../../assets/illustrations/orb_xp.webp';
import coinVImg from '../../assets/illustrations/coin_v.webp';
import iconWatchImg from '../../assets/illustrations/icon_watch.webp';
import iconTasksImg from '../../assets/illustrations/icon_tasks.webp';
import iconReferImg from '../../assets/illustrations/icon_refer.webp';
import styles from './GameTokens.module.css';

/**
 * Ultra-premium, razor-sharp 3D tokens & icons.
 * Uses crisp 1024px keyed 3D renders for XpOrb, VeCoin, Watch, Tasks, and Refer,
 * and multi-layered 3D specular vector shaders for Gem, Flame, Magnet, Gamepad,
 * Star-XP, Target, Flag, and Quiz (zero blurry/pasted edges at any resolution).
 */

export function XpOrb({ size = 42, className = '' }) {
  return (
    <img
      src={orbXpImg}
      alt="XP"
      width={size}
      height={size}
      className={`${styles.token} ${className}`}
      draggable={false}
    />
  );
}

export function VeCoin({ size = 40, className = '' }) {
  return (
    <img
      src={coinVImg}
      alt="VE Coin"
      width={size}
      height={size}
      className={`${styles.token} ${className}`}
      draggable={false}
    />
  );
}

export function GemToken({ size = 42, variant = 'green', className = '' }) {
  const uid = useId();
  const isPurple = variant === 'purple';
  const c = isPurple
    ? {
        glow: '#a855f7',
        top: '#f3e8ff',
        light: '#c084fc',
        mid: '#9333ea',
        deep: '#581c87',
        dark: '#2e1065',
        rim: '#e9d5ff',
      }
    : {
        glow: '#22c55e',
        top: '#dcfce7',
        light: '#4ade80',
        mid: '#16a34a',
        deep: '#15803d',
        dark: '#052e16',
        rim: '#bbf7d0',
      };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${styles.token} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`gGlow_${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glow} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`gBody_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.top} />
          <stop offset="35%" stopColor={c.light} />
          <stop offset="70%" stopColor={c.mid} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`gCenter_${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.top} stopOpacity="0.9" />
          <stop offset="50%" stopColor={c.light} stopOpacity="0.75" />
          <stop offset="100%" stopColor={c.deep} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#gGlow_${uid})`} />
      {/* Outer hexagonal crystal */}
      <polygon
        points="32,5 55,18 55,46 32,59 9,46 9,18"
        fill={`url(#gBody_${uid})`}
        stroke={c.rim}
        strokeWidth="1.6"
      />
      {/* Top-left bright facet */}
      <polygon points="32,5 9,18 20,24 32,14" fill={c.top} opacity="0.82" />
      {/* Top-right mid facet */}
      <polygon points="32,5 55,18 44,24 32,14" fill={c.light} opacity="0.65" />
      {/* Left side facet */}
      <polygon points="9,18 20,24 20,40 9,46" fill={c.light} opacity="0.55" />
      {/* Right shadow facet */}
      <polygon points="55,18 44,24 44,40 55,46" fill={c.dark} opacity="0.65" />
      {/* Bottom facets */}
      <polygon points="9,46 20,40 32,50 32,59" fill={c.deep} opacity="0.8" />
      <polygon points="55,46 44,40 32,50 32,59" fill={c.dark} opacity="0.9" />
      {/* Inner table facet */}
      <polygon
        points="32,14 44,24 44,40 32,50 20,40 20,24"
        fill={`url(#gCenter_${uid})`}
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeOpacity="0.65"
      />
      {/* Specular star glint */}
      <circle cx="24" cy="21" r="2.3" fill="#ffffff" />
    </svg>
  );
}

export function GraphicIcon({ type, size = 44 }) {
  const uid = useId();
  const imgStyle = { width: size, height: size, objectFit: 'contain' };

  switch (type) {
    case 'watch':
      return (
        <img
          src={iconWatchImg}
          alt=""
          style={imgStyle}
          className={styles.token}
          draggable={false}
        />
      );

    case 'tasks':
    case 'tasks-green':
      return (
        <img
          src={iconTasksImg}
          alt=""
          style={imgStyle}
          className={styles.token}
          draggable={false}
        />
      );

    case 'refer':
    case 'refer-green':
      return (
        <img
          src={iconReferImg}
          alt=""
          style={imgStyle}
          className={styles.token}
          draggable={false}
        />
      );

    case 'star-xp':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className={styles.token}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`sxpFace_${uid}`} cx="35%" cy="25%" r="70%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="45%" stopColor="#9333ea" />
              <stop offset="85%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#2e1065" />
            </radialGradient>
            <linearGradient id={`sxpRim_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
            <linearGradient id={`sxpStar_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f3e8ff" />
              <stop offset="100%" stopColor="#d8b4fe" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill={`url(#sxpRim_${uid})`} />
          <circle cx="32" cy="32" r="24.5" fill={`url(#sxpFace_${uid})`} />
          <ellipse
            cx="24"
            cy="18"
            rx="11"
            ry="5"
            fill="rgba(255,255,255,0.34)"
            transform="rotate(-18 24 18)"
          />
          <polygon
            points="32,14 37.2,24.6 48.8,26.3 40.4,34.5 42.4,46 32,40.5 21.6,46 23.6,34.5 15.2,26.3 26.8,24.6"
            fill={`url(#sxpStar_${uid})`}
            stroke="#f5f3ff"
            strokeWidth="0.8"
          />
        </svg>
      );

    case 'flame':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className={`${styles.token} ${styles.flamePulse}`}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`flGlow_${uid}`} cx="50%" cy="58%" r="48%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`flOuter_${uid}`} x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="40%" stopColor="#fb923c" />
              <stop offset="80%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
            <linearGradient id={`flInner_${uid}`} x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="36" r="28" fill={`url(#flGlow_${uid})`} />
          <path
            d="M34 6C36 16 27 21 29 29C33 26 36 21 36 16C45 23 50 32 50 41C50 52 42 59 32 59C22 59 14 52 14 41C14 31 20 23 26 17C25 22 27 25 29 26C27 18 30 11 34 6Z"
            fill={`url(#flOuter_${uid})`}
            stroke="#fed7aa"
            strokeWidth="1"
          />
          <path
            d="M32 28C36 33 40 38 40 44C40 50 36.5 54 32 54C27.5 54 24 50 24 44C24 39 27 33 32 28Z"
            fill={`url(#flInner_${uid})`}
          />
          <ellipse cx="32" cy="47" rx="4" ry="5.5" fill="#ffffff" opacity="0.88" />
        </svg>
      );

    case 'magnet':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className={styles.token}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`mgBlue_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="45%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id={`mgTip_${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <radialGradient id={`mgCoin_${uid}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>
          <g transform="rotate(-18 32 34)">
            <path
              d="M15 18V35C15 45 22.5 52 32 52C41.5 52 49 45 49 35V18H39V35C39 39.2 36 42.5 32 42.5C28 42.5 25 39.2 25 35V18Z"
              fill={`url(#mgBlue_${uid})`}
              stroke="#bfdbfe"
              strokeWidth="1.4"
            />
            <rect
              x="14.5"
              y="12"
              width="11"
              height="7"
              rx="2.2"
              fill={`url(#mgTip_${uid})`}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <rect
              x="38.5"
              y="12"
              width="11"
              height="7"
              rx="2.2"
              fill={`url(#mgTip_${uid})`}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          </g>
          {/* Floating attracted gold orb */}
          <circle
            cx="45"
            cy="13"
            r="7.5"
            fill={`url(#mgCoin_${uid})`}
            stroke="#fef3c7"
            strokeWidth="1.2"
          />
          <circle cx="43" cy="10.5" r="2" fill="#ffffff" opacity="0.8" />
        </svg>
      );

    case 'gamepad':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className={styles.token}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`gpBody_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="40%" stopColor="#6366f1" />
              <stop offset="85%" stopColor="#3730a3" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
          <path
            d="M18 19H46C52.5 19 56.5 24 57.8 31.5L59.4 42.5C60.2 47.8 56.2 52 51.5 52C48.2 52 45.4 50.2 43.3 47L40.5 43H23.5L20.7 47C18.6 50.2 15.8 52 12.5 52C7.8 52 3.8 47.8 4.6 42.5L6.2 31.5C7.5 24 11.5 19 18 19Z"
            fill={`url(#gpBody_${uid})`}
            stroke="#c7d2fe"
            strokeWidth="1.6"
          />
          {/* Gloss highlight */}
          <ellipse cx="28" cy="24" rx="14" ry="3.5" fill="rgba(255,255,255,0.25)" />
          {/* 3D Gold D-Pad */}
          <path
            d="M20 26V36M15 31H25"
            stroke="#fde68a"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* Action buttons */}
          <circle cx="44" cy="27" r="2.7" fill="#fbbf24" />
          <circle cx="49" cy="31.5" r="2.7" fill="#4ade80" />
          <circle cx="39" cy="31.5" r="2.7" fill="#38bdf8" />
          <circle cx="44" cy="36" r="2.7" fill="#f472b6" />
        </svg>
      );

    case 'coin':
      return <VeCoin size={size} />;

    case 'target':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className={styles.token}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`tg_${uid}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="55%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#7c2d12" />
            </radialGradient>
          </defs>
          <circle
            cx="32"
            cy="32"
            r="26"
            fill={`url(#tg_${uid})`}
            stroke="#ffedd5"
            strokeWidth="2"
          />
          <circle cx="32" cy="32" r="17" fill="#18120b" stroke="#fdba74" strokeWidth="3.2" />
          <circle cx="32" cy="32" r="7.5" fill="#fde047" />
        </svg>
      );

    case 'flag':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className={styles.token}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`fg_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <line
            x1="18"
            y1="11"
            x2="18"
            y2="54"
            stroke="#fde68a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M20 13h29l-6 10.5 6 10.5H20z"
            fill={`url(#fg_${uid})`}
            stroke="#fef3c7"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'quiz':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          className={styles.token}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`qz_${uid}`} cx="35%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="55%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#713f12" />
            </radialGradient>
          </defs>
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="13"
            fill={`url(#qz_${uid})`}
            stroke="#fef9c3"
            strokeWidth="1.6"
          />
          <text
            x="32"
            y="42"
            textAnchor="middle"
            fill="#1c1917"
            fontFamily="Poppins, sans-serif"
            fontWeight="800"
            fontSize="28"
          >
            ?
          </text>
        </svg>
      );

    default:
      return <XpOrb size={size} />;
  }
}
