import React, { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatReward, pad2 } from '../../data/levels';
import LevelInfo from '../LevelInfo/LevelInfo';
import XPProgress from '../XPProgress/XPProgress';
import chestImg from '../../assets/illustrations/chest.webp';
import coinsImg from '../../assets/illustrations/coins.webp';
import gemsImg from '../../assets/illustrations/gems.webp';
import styles from './NextLevelReward.module.css';

/**
 * Next-Level Reward & Partially-Locked Vault Card (PDF §15–17, §32, §43, Mockup Screen 1).
 *
 * Shows:
 *  - "Level 05 Rewards — Amazing rewards await you!"
 *  - 3D treasure chest + purple amethyst gems illustration
 *  - Partially-locked reward pills (+500 VEs, +25 Gems) with hover/click preview
 *  - "Reach Level 05 to unlock · 80%" progress bar
 *  - [i] transparent reward info tooltip (PDF §32)
 *  - "View Rewards" button opening the Level 05 reward breakdown
 */
export default function NextLevelReward() {
  const { progress, setSelectedLevel, demoActions } = useDashboard();
  const [revealed, setRevealed] = useState(false);

  const targetLevel = progress.nextLevel ?? progress.currentLevel;
  const targetNum = pad2(targetLevel);
  const rewards = progress.nextLevelReward.length
    ? progress.nextLevelReward
    : progress.currentLevelConfig.rewards;

  return (
    <section
      className={styles.card}
      aria-label={`Next level reward for Level ${targetNum}`}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
    >
      <div className={styles.headerRow}>
        <span className={styles.kicker}>
          <Lock size={13} />
          <span>NEXT LEVEL REWARD</span>
        </span>
        <LevelInfo variant="reward" align="right" />
      </div>

      <div className={styles.mainRow}>
        <div className={styles.copyCol}>
          <h2 className={styles.title}>Level {targetNum} Rewards</h2>
          <p className={styles.subtitle}>
            {progress.isMaxLevel
              ? 'You have unlocked every level reward!'
              : `Amazing rewards await you! Reach Level ${targetNum} to unlock:`}
          </p>

          {/* Reward pills (+500 VEs, +25 Gems) */}
          <div className={styles.rewardPills}>
            {rewards.map((r, i) => (
              <div
                key={`${r.type}_${i}`}
                className={`${styles.rewardPill} ${revealed ? styles.pillGlow : ''}`}
              >
                <img
                  src={r.type === 'Gems' ? gemsImg : coinsImg}
                  alt={r.type}
                  className={styles.pillIcon}
                />
                <span>+{formatReward(r)}</span>
              </div>
            ))}
          </div>

          <div className={styles.btnRow}>
            <button
              type="button"
              className={styles.viewBtn}
              onClick={() => setSelectedLevel(targetLevel)}
            >
              View Rewards
            </button>
            <button
              type="button"
              className={styles.previewCelebrationBtn}
              onClick={demoActions.triggerLevelUpModal}
              title="Preview the Level-Up Celebration screen"
            >
              <Sparkles size={13} />
              <span>Preview Level-Up</span>
            </button>
          </div>
        </div>

        {/* 3D Treasure Chest & Amethyst Gems (matching Screen 1 bottom card) */}
        <button
          type="button"
          className={styles.chestWrap}
          onClick={() => setSelectedLevel(targetLevel)}
          aria-label={`Inspect Level ${targetNum} reward chest`}
        >
          <span className={styles.chestGlow} aria-hidden="true" />
          <img
            src={chestImg}
            alt="Golden reward chest with amethyst gems"
            className={styles.chestImg}
          />
        </button>
      </div>

      {/* Partially locked progress footer (PDF §17) */}
      <div className={styles.lockedFooter}>
        <div className={styles.lockedHeader}>
          <span className={styles.unlockHint}>
            <Lock size={12} />
            {progress.isMaxLevel
              ? 'Unlocked'
              : `Reach Level ${targetNum} to unlock (${progress.xpRemaining.toLocaleString(
                  'en-IN'
                )} XP left)`}
          </span>
          <strong className={styles.unlockPct}>{progress.percent}%</strong>
        </div>
        <XPProgress
          currentXP={progress.currentXP}
          requiredXP={progress.requiredXP}
          xpRemaining={progress.xpRemaining}
          percent={progress.percent}
          showMeta={false}
          compact
        />
      </div>
    </section>
  );
}
