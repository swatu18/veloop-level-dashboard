import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import LevelHero from '../../components/LevelHero/LevelHero';
import CurrentLevel from '../../components/CurrentLevel/CurrentLevel';
import TodayBoost from '../../components/TodayBoost/TodayBoost';
import { QuickEarnGrid } from '../../components/EarnMoreXP/EarnMoreXP';
import NextLevelReward from '../../components/NextLevelReward/NextLevelReward';
import LevelRoadmap from '../../components/LevelRoadmap/LevelRoadmap';
import GameContainer from '../../components/PlayAndEarn/GameContainer/GameContainer';
import XPActivity from '../../components/XPActivity/XPActivity';
import Recommendation from '../../components/Recommendation/Recommendation';
import EarnMoreXP from '../../components/EarnMoreXP/EarnMoreXP';
import LevelDetailsSheet from '../../components/LevelDetailsSheet/LevelDetailsSheet';
import LevelUpModal from '../../components/LevelUpModal/LevelUpModal';
import DashboardSkeleton from '../../components/Skeletons/DashboardSkeleton';
import ErrorState from '../../components/States/ErrorState';
import DemoToolbar from '../../components/States/DemoToolbar';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './LevelDashboard.module.css';

/**
 * Complete Level-Up Dashboard Page (`/Lvl-Dashboard`, PDF §37–39).
 *
 * Mobile hierarchy (320px+ — iOS & Android):
 *   Matches Mockup Screen 1 first (Greeting → Current Level + XP → Today's Boost →
 *   Earn More 3×2 Grid → Level 05 Rewards Chest Card) followed by the Level Progression
 *   Roadmap, XP Catcher Arcade, Recent Activity, Recommended CTA, and Full Earn More XP.
 *
 * Desktop composition (1280px+ / 1440px+ / 1920px+):
 *   Row 1: Left column (Current Level + XP + Today's Boost) | Right column (Next-Level Reward + Quick Earn More)
 *   Row 2: Full-width 10-Level Progression & Rewards Roadmap (5×2 badge grid)
 *   Row 3: Left column (XP Catcher Arcade) | Right column (Recent XP Activity + Today's Summary)
 *   Row 4: Personalized Recommendation Banner + Full "Earn More XP & Rewards" Action Hub
 */
export default function LevelDashboard() {
  const { status, retryLoad, toast } = useDashboard();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className={styles.page}>
      <a href="#main-dashboard" className="visually-hidden-focusable">
        Skip to main content
      </a>

      <div className={styles.container}>
        <LevelHero onOpenDemo={() => setDemoOpen(true)} />

        <main id="main-dashboard" className={styles.main}>
          {status === 'loading' && <DashboardSkeleton />}

          {status === 'error' && <ErrorState onRetry={retryLoad} />}

          {status === 'ready' && (
            <>
              {/* Row 1: Hero progression + Today's Boost + Quick Earn More + Next Level Reward Chest */}
              <div className={styles.heroGrid}>
                <div className={styles.heroLeftCol}>
                  <CurrentLevel />
                  <TodayBoost />
                </div>

                <div className={styles.heroRightCol}>
                  <QuickEarnGrid />
                  <NextLevelReward />
                </div>
              </div>

              {/* Row 2: 10-Level Progression Roadmap with reference winged badges */}
              <LevelRoadmap />

              {/* Row 3: Play & Earn (XP Catcher) + Recent XP Activity */}
              <div className={styles.arcadeActivityGrid}>
                <GameContainer />
                <XPActivity limit={5} showViewAll />
              </div>

              {/* Row 4: Dynamic Recommendation + Full Earn More XP & Rewards Hub */}
              <Recommendation />
              <EarnMoreXP />
            </>
          )}
        </main>

        <footer className={styles.footer}>
          <span>VELOOP Rewards · Gamified Level Progression &amp; Engagement Hub</span>
          <span className={styles.demoTag}>
            Development / Demo Configuration · Body #161827
          </span>
        </footer>
      </div>

      {/* Overlays / Modals / Mobile Nav */}
      <LevelDetailsSheet />
      <LevelUpModal />
      <DemoToolbar open={demoOpen} onClose={() => setDemoOpen(false)} />
      <BottomNav />

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
