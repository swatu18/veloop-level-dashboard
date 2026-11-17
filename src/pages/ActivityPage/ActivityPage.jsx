import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { pad2 } from '../../data/levels';
import XPProgress from '../../components/XPProgress/XPProgress';
import XPActivity from '../../components/XPActivity/XPActivity';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './ActivityPage.module.css';

/**
 * Dedicated `/Lvl-Dashboard/activity` route (matches Reference App's View Activity route
 + Mockup Screen 6 full view).
 */
export default function ActivityPage() {
  const { progress } = useDashboard();
  const curNum = pad2(progress.currentLevel);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <Link to="/Lvl-Dashboard" className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Back to Level Dashboard</span>
          </Link>
        </div>

        {/* Compact Level & XP Banner matching Reference App's /Lvl-Dashboard/activity */}
        <section className={styles.summaryBanner}>
          <div className={styles.summaryTop}>
            <img
              src={progress.currentLevelConfig.badge}
              alt={`Level ${curNum} badge`}
              className={styles.badge}
            />
            <div>
              <span className={styles.lvlTag}>
                Level {curNum} · {progress.currentLevelConfig.name}
              </span>
              <h1 className={styles.xpBig}>
                {progress.currentXP.toLocaleString('en-IN')} XP
              </h1>
            </div>
          </div>

          <XPProgress
            currentXP={progress.currentXP}
            requiredXP={progress.requiredXP}
            xpRemaining={progress.xpRemaining}
            percent={progress.percent}
            nextLevelLabel={
              progress.nextLevel ? `Level ${pad2(progress.nextLevel)}` : ''
            }
          />
        </section>

        <XPActivity limit={0} showViewAll={false} />
      </div>

      <BottomNav />
    </div>
  );
}
