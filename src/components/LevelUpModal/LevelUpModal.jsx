import React from 'react';
import { Gift, Target, TrendingUp, X } from 'lucide-react';
import { FaCrown } from 'react-icons/fa';
import { useDashboard } from '../../context/DashboardContext';
import { pad2 } from '../../data/levels';
import { GemToken, VeCoin } from '../GameTokens/GameTokens';
import podiumImg from '../../assets/illustrations/podium.webp';
import coinsImg from '../../assets/illustrations/coins.webp';
import gemsImg from '../../assets/illustrations/gems.webp';
import styles from './LevelUpModal.module.css';

/**
 * Golden laurel branch SVG flanking the Level Hexagon (matching Mockup Screen 5).
 */
function LaurelBranch({ flip = false }) {
  return (
    <svg
      width="42"
      height="78"
      viewBox="0 0 42 78"
      className={`${styles.laurel} ${flip ? styles.laurelRight : styles.laurelLeft}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={flip ? 'lgR' : 'lgL'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff4bf" />
          <stop offset="50%" stopColor="#e8b847" />
          <stop offset="100%" stopColor="#946514" />
        </linearGradient>
      </defs>
      <g transform={flip ? 'translate(42,0) scale(-1,1)' : undefined} fill={`url(#${flip ? 'lgR' : 'lgL'})`}>
        <path d="M32 72C16 62 10 42 15 16" fill="none" stroke={`url(#${flip ? 'lgR' : 'lgL'})`} strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="14" cy="14" rx="4.5" ry="9" transform="rotate(-18 14 14)" />
        <ellipse cx="9" cy="27" rx="4.8" ry="9.5" transform="rotate(-38 9 27)" />
        <ellipse cx="19" cy="28" rx="4.2" ry="8.5" transform="rotate(24 19 28)" />
        <ellipse cx="9" cy="42" rx="4.8" ry="9.5" transform="rotate(-48 9 42)" />
        <ellipse cx="20" cy="43" rx="4.4" ry="8.5" transform="rotate(18 20 43)" />
        <ellipse cx="14" cy="56" rx="4.6" ry="9" transform="rotate(-55 14 56)" />
        <ellipse cx="25" cy="57" rx="4.2" ry="8.2" transform="rotate(12 25 57)" />
      </g>
    </svg>
  );
}

/**
 * "LEVEL UP!" Celebration Modal matching Mockup Screen 5 (PDF §27–28):
 *  - Heading: "LEVEL UP! · You've reached"
 *  - Gold Hexagon "LEVEL 05" emblem flanked by golden laurel wreaths on 3D golden podium
 *    + floating 3D VE Coins & Amethyst Gems
 *  - Two reward showcase cards: "+500 VEs" (3D V-coin stack) & "+25 Gems" (3D amethyst cluster)
 *  - 3 privilege rows (Higher daily XP limit, Access to new challenges, Better reward opportunities)
 *  - Full-width golden "Claim Rewards" CTA button
 */
export default function LevelUpModal() {
  const { levelUpModal, setLevelUpModal, handleClaimLevelUp } = useDashboard();
  if (!levelUpModal) return null;

  const cfg = levelUpModal.levelConfig;
  const lvlNum = pad2(cfg.level);
  const veReward = cfg.rewards.find((r) => r.type === 'VEs')?.amount ?? 500;
  const gemReward = cfg.rewards.find((r) => r.type === 'Gems')?.amount ?? 25;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Level Up! You reached Level ${lvlNum}`}
    >
      <div className={styles.modalCard}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setLevelUpModal(null)}
          aria-label="Close celebration modal"
        >
          <X size={18} />
        </button>

        {/* Subtle particles & floating coins/gems matching Screen 5 */}
        <div className={styles.particles} aria-hidden="true">
          <span className={`${styles.floatAsset} ${styles.fa1}`}>
            <GemToken size={28} variant="purple" />
          </span>
          <span className={`${styles.floatAsset} ${styles.fa2}`}>
            <VeCoin size={30} />
          </span>
          <span className={`${styles.floatAsset} ${styles.fa3}`}>
            <VeCoin size={34} />
          </span>
          <span className={`${styles.floatAsset} ${styles.fa4}`}>
            <GemToken size={26} variant="purple" />
          </span>
          <span className={`${styles.spark} ${styles.s1}`} />
          <span className={`${styles.spark} ${styles.s2}`} />
          <span className={`${styles.spark} ${styles.s3}`} />
          <span className={`${styles.spark} ${styles.s4}`} />
        </div>

        <div className={styles.heading}>
          <span className={styles.crownPill}>
            <FaCrown size={12} /> ACHIEVEMENT UNLOCKED
          </span>
          <h2 className={styles.title}>LEVEL UP!</h2>
          <p className={styles.subtitle}>
            You&apos;ve reached <span>Tier {lvlNum} ({cfg.name})</span>
          </p>
        </div>

        {/* Gold Hexagon Level 05 flanked by Golden Laurels on 3D Golden Podium (Screen 5) */}
        <div className={styles.podiumStage}>
          <span className={styles.stageGlow} aria-hidden="true" />
          <div className={styles.emblemRow}>
            <LaurelBranch />
            <div className={styles.hexBadge}>
              <div className={styles.hexInner}>
                <span className={styles.hexWord}>LEVEL</span>
                <strong className={styles.hexDigits}>{lvlNum}</strong>
              </div>
            </div>
            <LaurelBranch flip />
          </div>
          <img src={podiumImg} alt="" aria-hidden="true" className={styles.podiumImg} />
        </div>

        {/* +500 VEs and +25 Gems cards matching Screen 5 */}
        <div className={styles.rewardGrid}>
          <div className={styles.rewardCard}>
            <strong className={styles.rewardHeading}>+{veReward} VEs</strong>
            <img src={coinsImg} alt={`${veReward} VEs`} className={styles.rewardArt} />
          </div>

          <div className={styles.rewardCard}>
            <strong className={styles.rewardHeading}>+{gemReward} Gems</strong>
            <img src={gemsImg} alt={`${gemReward} Gems`} className={styles.rewardArt} />
          </div>
        </div>

        {/* Unlocked Privileges list matching Screen 5 */}
        <ul className={styles.perksList}>
          <li className={styles.perkItem}>
            <TrendingUp size={18} className={styles.perkIconBlue} />
            <span>Higher daily XP limit</span>
          </li>
          <li className={styles.perkItem}>
            <Target size={18} className={styles.perkIconOrange} />
            <span>Access to new challenges</span>
          </li>
          <li className={styles.perkItem}>
            <Gift size={18} className={styles.perkIconGold} />
            <span>Better reward opportunities</span>
          </li>
        </ul>

        <button
          type="button"
          className={styles.claimBtn}
          onClick={handleClaimLevelUp}
        >
          Claim Rewards
        </button>
      </div>
    </div>
  );
}
