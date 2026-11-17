import React, { useId } from 'react';
import orbXpImg from '../../assets/illustrations/orb_xp.webp';
import coinVImg from '../../assets/illustrations/coin_v.webp';
import gemGreenImg from '../../assets/illustrations/gem_green.webp';
import gemsPurpleImg from '../../assets/illustrations/gems.webp';
import iconWatchImg from '../../assets/illustrations/icon_watch.webp';
import iconTasksImg from '../../assets/illustrations/icon_tasks.webp';
import iconReferImg from '../../assets/illustrations/icon_refer.webp';
import iconMagnetImg from '../../assets/illustrations/icon_magnet.webp';
import iconGamepadImg from '../../assets/illustrations/icon_gamepad.webp';
import iconFlameImg from '../../assets/illustrations/icon_flame.webp';
import iconStarXpImg from '../../assets/illustrations/icon_star_xp.webp';
import styles from './GameTokens.module.css';

/**
 * Ultra-premium 3D-rendered tokens & icons matching the sample screenshots:
 *  - XpOrb      → 3D royal-purple energy sphere with silver rim & "XP"
 *  - VeCoin     → 3D metallic gold embossed "V" coin
 *  - GemToken   → 3D faceted emerald/amethyst crystal gem
 *  - GraphicIcon→ 3D glossy icons (Watch, Tasks, Refer, Magnet, Gamepad, Flame, Star-XP)
 */

export function XpOrb({ size = 42, className = '' }) {
  return (
    <img
      src={orbXpImg}
      alt="XP"
      width={size}
      height={size}
      className={`${styles.token} ${className}`}
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
    />
  );
}

export function GemToken({ size = 42, variant = 'green', className = '' }) {
  return (
    <img
      src={variant === 'purple' ? gemsPurpleImg : gemGreenImg}
      alt="Gem"
      width={size}
      height={size}
      className={`${styles.token} ${className}`}
    />
  );
}

export function GraphicIcon({ type, size = 44 }) {
  const uid = useId();
  const imgStyle = { width: size, height: size, objectFit: 'contain' };

  switch (type) {
    case 'star-xp':
      return <img src={iconStarXpImg} alt="" style={imgStyle} className={styles.token} />;

    case 'watch':
      return <img src={iconWatchImg} alt="" style={imgStyle} className={styles.token} />;

    case 'tasks':
    case 'tasks-green':
      return <img src={iconTasksImg} alt="" style={imgStyle} className={styles.token} />;

    case 'refer':
    case 'refer-green':
      return <img src={iconReferImg} alt="" style={imgStyle} className={styles.token} />;

    case 'magnet':
      return <img src={iconMagnetImg} alt="" style={imgStyle} className={styles.token} />;

    case 'gamepad':
      return <img src={iconGamepadImg} alt="" style={imgStyle} className={styles.token} />;

    case 'flame':
      return <img src={iconFlameImg} alt="" style={imgStyle} className={styles.token} />;

    case 'coin':
      return <VeCoin size={size} />;

    case 'target':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={styles.token} aria-hidden="true">
          <defs>
            <radialGradient id={`tg_${uid}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="55%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="26" fill={`url(#tg_${uid})`} stroke="#fed7aa" strokeWidth="2" />
          <circle cx="32" cy="32" r="17" fill="#18120b" stroke="#fdba74" strokeWidth="3.2" />
          <circle cx="32" cy="32" r="7.5" fill="#fb923c" />
        </svg>
      );

    case 'flag':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" className={styles.token} aria-hidden="true">
          <defs>
            <linearGradient id={`fg_${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <line x1="18" y1="11" x2="18" y2="54" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" />
          <path d="M20 13h29l-6 10.5 6 10.5H20z" fill={`url(#fg_${uid})`} stroke="#fef3c7" strokeWidth="1.5" />
        </svg>
      );

    default:
      return <XpOrb size={size} />;
  }
}
