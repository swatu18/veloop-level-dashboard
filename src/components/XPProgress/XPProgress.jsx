import React, { useEffect, useState } from 'react';
import styles from './XPProgress.module.css';

/**
 * Animated golden XP progress bar (PDF §12–13, §43).
 *
 * Animates subtly from 0 → `percent` when the page loads and whenever XP updates.
 */
export default function XPProgress({
  currentXP,
  requiredXP,
  xpRemaining,
  percent,
  nextLevelLabel,
  showMeta = true,
  compact = false,
}) {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFill(percent));
    return () => cancelAnimationFrame(id);
  }, [percent]);

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`XP progress ${percent}%`}
      >
        <div className={styles.bar} style={{ width: `${fill}%` }}>
          <span className={styles.shine} aria-hidden="true" />
        </div>
      </div>

      {showMeta && (
        <div className={styles.captionRow}>
          <span className={styles.xpNeeded}>
            {xpRemaining > 0
              ? `${xpRemaining.toLocaleString('en-IN')} XP remaining${
                  nextLevelLabel ? ` to ${nextLevelLabel}` : ''
                }`
              : 'Max level reached'}
          </span>
          <span className={styles.xpFraction}>
            {currentXP.toLocaleString('en-IN')} / {requiredXP.toLocaleString('en-IN')} XP
          </span>
          <span className={styles.percentBadge}>{percent}%</span>
        </div>
      )}
    </div>
  );
}
