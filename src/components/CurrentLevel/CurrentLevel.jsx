import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useCountUp } from '../../hooks/useCountUp';
import { pad2 } from '../../data/levels';
import XPProgress from '../XPProgress/XPProgress';
import styles from './CurrentLevel.module.css';

/**
 * Prominent Current Level + XP Hero Card (PDF §10–14, Mockup Screen 1).
 *
 * Includes:
 *  - Metallic gold hexagon badge ("LEVEL 04") + winged SVG emblem
 *  - Level name ("Challenger") + Next Level pill ("Level 04 → Level 05")
 *  - Animated Current XP readout ("6,420 XP")
 *  - Explicit "1,580 XP needed to reach Level 05" so the user never calculates it
 *  - Animated golden XP progress bar + "6,420 / 8,000 XP (80%)"
 */
export default function CurrentLevel() {
  const { progress, setSelectedLevel } = useDashboard();
  const animatedXP = useCountUp(progress.currentXP, 700);
  const animatedRemaining = useCountUp(progress.xpRemaining, 700);

  const curNum = pad2(progress.currentLevel);
  const nextNum = progress.nextLevel ? pad2(progress.nextLevel) : null;

  return (
    <section className={styles.card} aria-label="Current level and XP progress">
      <div className={styles.topSection}>
        {/* Gold Hexagon Level Emblem (matching Screen 1) + Winged Reference Badge */}
        <button
          type="button"
          className={styles.hexButton}
          onClick={() => setSelectedLevel(progress.currentLevel)}
          title={`View Level ${curNum} (${progress.currentLevelConfig.name}) details`}
        >
          <div className={styles.hexOuter}>
            <div className={styles.hexInner}>
              <span className={styles.hexLabel}>LEVEL</span>
              <span className={styles.hexNumber}>{curNum}</span>
            </div>
          </div>
          <span className={styles.tierTag}>{progress.currentLevelConfig.name}</span>
        </button>

        {/* Right XP readout */}
        <div className={styles.xpColumn}>
          <div className={styles.progressionPill}>
            <span className={styles.currentChip}>Current · Level {curNum}</span>
            {nextNum && (
              <>
                <ArrowRight size={13} className={styles.arrowIcon} />
                <span className={styles.nextChip}>Next · Level {nextNum}</span>
              </>
            )}
          </div>

          <div className={styles.xpBig} aria-live="polite">
            {animatedXP.toLocaleString('en-IN')} <span>XP</span>
          </div>

          <p className={styles.xpSub}>
            {nextNum ? (
              <>
                <strong>{animatedRemaining.toLocaleString('en-IN')} XP needed</strong> to reach{' '}
                <span className={styles.goldAccent}>Level {nextNum}</span>
              </>
            ) : (
              <span className={styles.goldAccent}>Maximum level unlocked!</span>
            )}
          </p>
        </div>

        {/* Reference Winged Badge displayed alongside on tablet/desktop */}
        <button
          type="button"
          className={styles.wingedBadgeWrap}
          onClick={() => setSelectedLevel(progress.currentLevel)}
          aria-label={`Inspect Level ${curNum} badge`}
        >
          <img
            src={progress.currentLevelConfig.badge}
            alt={`Level ${curNum} badge`}
            className={styles.wingedBadge}
          />
        </button>
      </div>

      {/* Golden Progress Bar + centered fraction matching Screen 1 */}
      <div className={styles.progressSection}>
        <XPProgress
          currentXP={progress.currentXP}
          requiredXP={progress.requiredXP}
          xpRemaining={progress.xpRemaining}
          percent={progress.percent}
          nextLevelLabel={nextNum ? `Level ${nextNum}` : ''}
          showMeta={false}
        />

        <div className={styles.fractionRow}>
          <span className={styles.neededInline}>
            {nextNum
              ? `${progress.xpRemaining.toLocaleString('en-IN')} XP remaining`
              : 'All levels complete'}
          </span>
          <span className={styles.fractionCenter}>
            {progress.currentXP.toLocaleString('en-IN')} /{' '}
            {progress.requiredXP.toLocaleString('en-IN')} XP
          </span>
          <span className={styles.percentRight}>{progress.percent}%</span>
        </div>
      </div>
    </section>
  );
}
