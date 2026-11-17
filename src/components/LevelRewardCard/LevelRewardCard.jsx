import React from 'react';
import { Check, Lock, Target } from 'lucide-react';
import { formatReward, pad2 } from '../../data/levels';
import lockSvg from '../../assets/badges/lock.svg';
import styles from './LevelRewardCard.module.css';

/**
 * Individual level node inside the Level Roadmap (PDF §19–21, §43).
 *
 * Visual states (PDF §20):
 *  - 'completed' → ✓ Completed
 *  - 'current'   → YOU ARE HERE (highlighted gold pill)
 *  - 'next'      → Next Goal (warm outline)
 *  - 'locked'    → Blurred badge + gold padlock overlay (copied from reference)
 */
export default function LevelRewardCard({ levelCfg, state, onSelect }) {
  const num = pad2(levelCfg.level);
  const isLocked = state === 'locked' || state === 'next';

  return (
    <button
      type="button"
      className={`${styles.card} ${styles[state]}`}
      onClick={() => onSelect(levelCfg.level)}
      aria-label={`Level ${num} ${levelCfg.name}, ${state}, rewards ${levelCfg.rewards
        .map(formatReward)
        .join(' and ')}`}
    >
      {/* Top status pill */}
      <div className={styles.statusRow}>
        {state === 'current' && <span className={styles.youAreHere}>YOU ARE HERE</span>}
        {state === 'completed' && (
          <span className={styles.completedTag}>
            <Check size={11} strokeWidth={3} /> Completed
          </span>
        )}
        {state === 'next' && (
          <span className={styles.nextTag}>
            <Target size={11} /> Next Goal
          </span>
        )}
        {state === 'locked' && (
          <span className={styles.lockedTag}>
            <Lock size={10} /> Locked
          </span>
        )}
      </div>

      {/* Reference Winged SVG Badge + Padlock overlay when locked */}
      <div className={styles.badgeStage}>
        <img
          src={levelCfg.badge}
          alt={`Level ${num}`}
          data-level={levelCfg.level}
          data-locked={isLocked}
          className={`${styles.badgeImg} ${isLocked ? styles.badgeLocked : ''}`}
        />
        {isLocked && (
          <img
            src={lockSvg}
            alt=""
            aria-hidden="true"
            className={styles.lockOverlay}
          />
        )}
      </div>

      {/* Level title & XP threshold */}
      <div className={styles.meta}>
        <span className={styles.lvlCode}>LEVEL {num}</span>
        <span className={styles.lvlName}>{levelCfg.name}</span>
        <span className={styles.xpThreshold}>
          {levelCfg.minXP === 0 ? 'Starter' : `${levelCfg.minXP.toLocaleString('en-IN')} XP`}
        </span>
      </div>

      {/* Level Rewards Roadmap pill (PDF §21) */}
      <div className={styles.rewardChip}>
        {state === 'completed' ? '✓ ' : isLocked ? '🔒 ' : ''}
        {levelCfg.rewards.map(formatReward).join(' + ')}
      </div>
    </button>
  );
}
