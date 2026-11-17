import React from 'react';
import styles from './Skeletons.module.css';

/**
 * Skeleton loading states for all 6 required dashboard areas (PDF §41):
 *  - Current level
 *  - XP
 *  - Next reward
 *  - Level roadmap
 *  - Game
 *  - Earning features
 */
export default function DashboardSkeleton() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading level progress">
      <div className={styles.topRow}>
        {/* Current Level + XP skeleton */}
        <div className={styles.card}>
          <div className={styles.heroFlex}>
            <div className={`skeleton ${styles.hexSkel}`} />
            <div className={styles.xpLines}>
              <div className={`skeleton ${styles.lineSm}`} />
              <div className={`skeleton ${styles.lineLg}`} />
              <div className={`skeleton ${styles.lineMd}`} />
            </div>
          </div>
          <div className={`skeleton ${styles.barSkel}`} />
        </div>

        {/* Next-Level Reward skeleton */}
        <div className={styles.card}>
          <div className={`skeleton ${styles.lineSm}`} />
          <div className={styles.rewardFlex}>
            <div className={styles.xpLines}>
              <div className={`skeleton ${styles.lineMd}`} />
              <div className={`skeleton ${styles.lineSm}`} />
              <div className={`skeleton ${styles.btnSkel}`} />
            </div>
            <div className={`skeleton ${styles.chestSkel}`} />
          </div>
          <div className={`skeleton ${styles.barSkel}`} />
        </div>
      </div>

      {/* Level Roadmap skeleton */}
      <div className={styles.card}>
        <div className={`skeleton ${styles.lineMd}`} />
        <div className={styles.badgeRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`skeleton ${styles.badgeSkel}`} />
          ))}
        </div>
      </div>

      {/* Game + Activity skeleton */}
      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={`skeleton ${styles.lineMd}`} />
          <div className={`skeleton ${styles.gameStageSkel}`} />
        </div>
        <div className={styles.card}>
          <div className={`skeleton ${styles.lineMd}`} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`skeleton ${styles.activityRowSkel}`} />
          ))}
        </div>
      </div>

      {/* Earning features skeleton */}
      <div className={styles.card}>
        <div className={`skeleton ${styles.lineMd}`} />
        <div className={styles.earnRow}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`skeleton ${styles.earnCardSkel}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
