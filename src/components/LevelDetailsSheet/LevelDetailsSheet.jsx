import React from 'react';
import { Check, Lock, Sparkles, X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatReward, getLevelConfig, pad2 } from '../../data/levels';
import coinsImg from '../../assets/illustrations/coins.webp';
import gemsImg from '../../assets/illustrations/gems.webp';
import styles from './LevelDetailsSheet.module.css';

/**
 * Click-to-inspect Level Details sheet (PDF §43: "Level Roadmap: Click → display level details").
 */
export default function LevelDetailsSheet() {
  const { selectedLevel, setSelectedLevel, progress, demoActions } = useDashboard();
  if (!selectedLevel) return null;

  const cfg = getLevelConfig(selectedLevel);
  const num = pad2(cfg.level);
  const isCompleted = cfg.level < progress.currentLevel;
  const isCurrent = cfg.level === progress.currentLevel;
  const isNext = cfg.level === progress.nextLevel;
  const xpNeeded = Math.max(0, cfg.minXP - progress.currentXP);

  return (
    <div
      className={styles.backdrop}
      onClick={() => setSelectedLevel(null)}
      role="dialog"
      aria-modal="true"
      aria-label={`Level ${num} details`}
    >
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setSelectedLevel(null)}
          aria-label="Close level details"
        >
          <X size={18} />
        </button>

        <div className={styles.badgeHeader}>
          <img src={cfg.badge} alt={`Level ${num} badge`} className={styles.badge} />
          <div>
            <span className={styles.kicker}>
              {isCompleted
                ? '✓ COMPLETED LEVEL'
                : isCurrent
                ? '★ CURRENT LEVEL · YOU ARE HERE'
                : isNext
                ? 'NEXT GOAL LEVEL'
                : '🔒 LOCKED FUTURE LEVEL'}
            </span>
            <h3 className={styles.title}>
              Level {num} · <span>{cfg.name}</span>
            </h3>
            <p className={styles.threshold}>
              Threshold: <strong>{cfg.minXP.toLocaleString('en-IN')} XP</strong>
              {xpNeeded > 0 && ` (${xpNeeded.toLocaleString('en-IN')} XP remaining)`}
            </p>
          </div>
        </div>

        <div className={styles.block}>
          <h4 className={styles.blockTitle}>Level Rewards (Demo Configuration)</h4>
          <div className={styles.rewardGrid}>
            {cfg.rewards.map((r, i) => (
              <div key={i} className={styles.rewardBox}>
                <img
                  src={r.type === 'Gems' ? gemsImg : coinsImg}
                  alt={r.type}
                  className={styles.rewardImg}
                />
                <strong>+{formatReward(r)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.block}>
          <h4 className={styles.blockTitle}>Tier Privileges &amp; Unlocks</h4>
          <ul className={styles.perkList}>
            {cfg.perks.map((p, i) => (
              <li key={i}>
                {isCompleted || isCurrent ? (
                  <Check size={14} className={styles.checkIcon} />
                ) : (
                  <Lock size={13} className={styles.lockIcon} />
                )}
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => setSelectedLevel(null)}
          >
            <Sparkles size={15} />
            <span>Got It</span>
          </button>
          {isNext && (
            <button
              type="button"
              className={styles.previewUnlockBtn}
              onClick={() => {
                setSelectedLevel(null);
                demoActions.previewLevelUp(cfg.level);
              }}
            >
              Preview Level {num} Unlock Celebration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
