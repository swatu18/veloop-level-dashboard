import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useCountUp } from '../../hooks/useCountUp';
import { GraphicIcon } from '../GameTokens/GameTokens';
import styles from './TodayBoost.module.css';

/**
 * "⚡ TODAY'S BOOST" 3-tile strip from Mockup Screen 1:
 *  1. XP Earned (215 XP)   → switches to Wallet / Activity breakdown
 *  2. Tasks Done (4 / 8)   → opens Earn & Level Up tasks list
 *  3. Streak (7 Days)      → toggles the inline 7-Day Streak tracker banner
 */
export default function TodayBoost() {
  const { user, setActiveTab, setEarnDrawerOpen } = useDashboard();
  const [showStreakInfo, setShowStreakInfo] = useState(false);

  const xpToday = useCountUp(user?.today?.xpEarned ?? 215, 600);
  const tasksDone = user?.today?.tasksDone ?? 4;
  const tasksTotal = user?.today?.tasksTotal ?? 8;
  const streakDays = user?.today?.streakDays ?? 7;

  return (
    <section className={styles.card} aria-label="Today's Boost">
      <div className={styles.titleRow}>
        <Zap size={16} className={styles.zapIcon} />
        <h2 className={styles.title}>TODAY&apos;S BOOST</h2>
      </div>

      <div className={styles.grid}>
        <button
          type="button"
          className={styles.tile}
          onClick={() => setActiveTab('wallet')}
          title="View today's XP activity in Wallet"
        >
          <GraphicIcon type="star-xp" size={44} />
          <span className={styles.label}>XP Earned</span>
          <strong className={styles.value}>{xpToday.toLocaleString('en-IN')} XP</strong>
        </button>

        <button
          type="button"
          className={styles.tile}
          onClick={() => setEarnDrawerOpen(true)}
          title="View Daily Tasks"
        >
          <GraphicIcon type="tasks" size={44} />
          <span className={styles.label}>Tasks Done</span>
          <strong className={styles.value}>
            {tasksDone} / {tasksTotal}
          </strong>
        </button>

        <button
          type="button"
          className={styles.tile}
          onClick={() => setShowStreakInfo((v) => !v)}
          title="View 7-Day Streak status"
        >
          <GraphicIcon type="flame" size={44} />
          <span className={styles.label}>Streak</span>
          <strong className={styles.value}>{streakDays} Days</strong>
        </button>
      </div>

      {showStreakInfo && (
        <div className={styles.streakBanner}>
          <span>🔥 <strong>{streakDays}-Day Active Streak!</strong> Keep logging in daily to unlock Streak Bonus XP.</span>
        </div>
      )}
    </section>
  );
}
