import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import LevelInfo from '../LevelInfo/LevelInfo';
import LevelRewardCard from '../LevelRewardCard/LevelRewardCard';
import styles from './LevelRoadmap.module.css';

/**
 * 10-Level Progression & Rewards Roadmap (PDF §18–21, Reference App badges).
 *
 * Uses the exact 10 winged SVG badges + padlock overlay copied from
 * `ve-loop-client.vercel.app`, enhanced with:
 *  - 4 clear visual states (Completed ✓, YOU ARE HERE, Next Goal, Locked 🔒)
 *  - Per-level reward tags (Level 03: 100 VEs, Level 04: 10 Gems, Level 05: 500 VEs + 25 Gems, Level 06: 2 Spins, etc.)
 *  - Click-to-inspect level details modal (PDF §43)
 *  - Horizontal touch scroll on mobile; 5×2 grid on desktop (matching reference)
 */
export default function LevelRoadmap() {
  const { levels, progress, setSelectedLevel } = useDashboard();

  const getState = (lvl) => {
    if (lvl < progress.currentLevel) return 'completed';
    if (lvl === progress.currentLevel) return 'current';
    if (lvl === progress.nextLevel) return 'next';
    return 'locked';
  };

  return (
    <section className={styles.section} aria-label="Level progression roadmap">
      <div className={styles.header}>
        <div className={styles.titleCluster}>
          <h2 className={styles.title}>LEVEL PROGRESSION</h2>
          <LevelInfo
            variant="level"
            title="Level Progression Roadmap"
            text="Track your journey across all 10 VELOOP levels. Click any badge to inspect its XP threshold, rewards and privileges."
            align="left"
          />
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <i className={`${styles.dot} ${styles.dotDone}`} /> Completed
          </span>
          <span className={styles.legendItem}>
            <i className={`${styles.dot} ${styles.dotCurrent}`} /> Current
          </span>
          <span className={styles.legendItem}>
            <i className={`${styles.dot} ${styles.dotNext}`} /> Next Goal
          </span>
          <span className={styles.legendItem}>
            <i className={`${styles.dot} ${styles.dotLocked}`} /> Locked
          </span>
        </div>
      </div>

      <div className={`${styles.rail} no-scrollbar`}>
        {levels.map((l) => (
          <LevelRewardCard
            key={l.level}
            levelCfg={l}
            state={getState(l.level)}
            onSelect={setSelectedLevel}
          />
        ))}
      </div>
    </section>
  );
}
