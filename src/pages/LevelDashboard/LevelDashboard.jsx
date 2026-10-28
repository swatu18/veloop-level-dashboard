import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useLevelProgress from '../../hooks/useLevelProgress';
import { EARN_FEATURES, GAME_CONFIG, LEVELS } from '../../data/levelData';
import { scrollToId } from '../../utils/format';
import LevelHero from '../../components/LevelHero/LevelHero';
import NextLevelReward from '../../components/NextLevelReward/NextLevelReward';
import LevelRoadmap from '../../components/LevelRoadmap/LevelRoadmap';
import GameContainer from '../../components/PlayAndEarn/GameContainer';
import EarnMoreXP from '../../components/EarnMoreXP/EarnMoreXP';
import XPActivity from '../../components/XPActivity/XPActivity';
import LevelUpModal from '../../components/LevelUpModal/LevelUpModal';
import ErrorState from '../../components/States/ErrorState';
import DashboardSkeleton from '../../components/States/DashboardSkeleton';
import BottomNav from '../../components/BottomNav/BottomNav';
import styles from './LevelDashboard.module.css';

const MAX_GAME_XP = Math.max(...GAME_CONFIG.rewardTiers.map((t) => t.xp));

/**
 * Preview UI states with a query string:
 *   ?state=loading | error | empty | nogame      ?demo=1 shows the demo bar
 */
export default function LevelDashboard() {
  const [params] = useSearchParams();
  const forced = params.get('state');
  const demo = params.get('demo') === '1';
  const lp = useLevelProgress(forced);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const onFeature = useCallback((f) => {
    if (f.status === 'soon') return setToast(`${f.title} is coming soon.`);
    if (f.action === 'game') return scrollToId('play');
    return setToast(`${f.title}: connect this card to the existing route.`);
  }, []);

  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const playNow = () => scrollToId('play');

  return (
    <main className={styles.page}>
      <div className="container-xxl">
        {lp.status === 'loading' && <DashboardSkeleton />}
        {lp.status === 'error' && <ErrorState onRetry={lp.retry} />}
        {lp.status === 'ready' && (
          <div className={styles.grid}>
            <div className={styles.hero}>
              <LevelHero player={lp.player} progress={lp.progress} todayXP={lp.todayXP} maxGameXP={MAX_GAME_XP} onPlay={playNow} />
            </div>
            <div className={styles.reward}>
              <NextLevelReward progress={lp.progress} onViewRoadmap={() => scrollToId('roadmap')} />
            </div>
            <div className={styles.road}>
              <LevelRoadmap levels={LEVELS} currentLevel={lp.progress.level} />
            </div>
            <div className={styles.game}>
              <GameContainer config={GAME_CONFIG} gameAvailable={lp.gameAvailable} progress={lp.progress} onReward={lp.applyReward} onBackToTop={backToTop} />
            </div>
            <div className={styles.earn}>
              <EarnMoreXP features={EARN_FEATURES} onAction={onFeature} />
            </div>
            <div className={styles.act}>
              <XPActivity items={lp.activity} todayXP={lp.todayXP} todayVE={lp.todayVE} onStartEarning={playNow} />
            </div>
          </div>
        )}
      </div>

      {lp.status === 'ready' && demo && (
        <div className={styles.demoBar}>
          <span>Demo controls</span>
          <button type="button" onClick={() => lp.applyReward({ xp: lp.progress.xpToNext, title: 'Demo level-up', icon: 'game' })}>Trigger level up</button>
          <a href="?state=loading&demo=1">Loading</a>
          <a href="?state=error&demo=1">Error</a>
          <a href="?state=empty&demo=1">Empty</a>
          <a href="?state=nogame&demo=1">No game</a>
          <a href="?demo=1">Reset</a>
        </div>
      )}

      {toast && <div className={styles.toast} role="status">{toast}</div>}
      {lp.levelUp && <LevelUpModal levelUp={lp.levelUp} onClaim={lp.claimLevelUp} />}
      <BottomNav />
    </main>
  );
}
