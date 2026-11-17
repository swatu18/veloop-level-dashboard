import React from 'react';
import {
  Award,
  CheckCircle2,
  Flame,
  Gamepad2,
  Gift,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatReward, pad2 } from '../../data/levels';
import XPProgress from '../XPProgress/XPProgress';
import LevelRoadmap from '../LevelRoadmap/LevelRoadmap';
import XPActivity from '../XPActivity/XPActivity';
import walletImg from '../../assets/illustrations/wallet.webp';
import coinsImg from '../../assets/illustrations/coins.webp';
import gemsImg from '../../assets/illustrations/gems.webp';
import trophyImg from '../../assets/illustrations/trophy.webp';
import styles from './TabViews.module.css';

/**
 * Dedicated Wallet View (`activeTab === 'wallet'`)
 * Shows the user's VELOOP Wallet balances (VEs, Gems, SVEs, Spins), today's earnings,
 * level bonus rate, and full XP/VE transaction history.
 */
export function WalletView() {
  const { user, progress, setActiveTab } = useDashboard();
  const ves = user?.wallet?.VEs ?? 1240;
  const gems = user?.wallet?.Gems ?? 32;
  const spins = user?.wallet?.Spins ?? 2;
  const sves = user?.wallet?.SVEs ?? 0;

  return (
    <div className={styles.viewWrap}>
      <section className={styles.heroBanner}>
        <div className={styles.bannerCopy}>
          <span className={styles.kicker}>VELOOP REWARDS WALLET</span>
          <h2 className={styles.title}>Your Earned Balances</h2>
          <p className={styles.sub}>
            Track your VEs, Gems and XP earnings unlocked from missions and level-ups.
          </p>

          <div className={styles.balanceGrid}>
            <div className={styles.balanceTile}>
              <img src={coinsImg} alt="VEs" className={styles.tileImg} />
              <div>
                <span className={styles.tileLabel}>VE Balance</span>
                <strong className={styles.tileVal}>{ves.toLocaleString('en-IN')} VEs</strong>
              </div>
            </div>

            <div className={styles.balanceTile}>
              <img src={gemsImg} alt="Gems" className={styles.tileImg} />
              <div>
                <span className={styles.tileLabel}>Gem Vault</span>
                <strong className={styles.tileVal}>{gems.toLocaleString('en-IN')} Gems</strong>
              </div>
            </div>

            <div className={styles.balanceTile}>
              <div className={styles.tileBadgeIcon}>
                <Sparkles size={22} />
              </div>
              <div>
                <span className={styles.tileLabel}>Bonus Spins &amp; SVEs</span>
                <strong className={styles.tileVal}>
                  {spins} Spins · {sves} SVEs
                </strong>
              </div>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button
              type="button"
              className={styles.goldBtn}
              onClick={() => setActiveTab('earn')}
            >
              Earn More VEs &amp; XP →
            </button>
            <button
              type="button"
              className={styles.ghostBtn}
              onClick={() => setActiveTab('home')}
            >
              Back to Home
            </button>
          </div>
        </div>

        <img src={walletImg} alt="VELOOP leather wallet with gold coins" className={styles.heroArt} />
      </section>

      <section className={styles.infoStrip}>
        <div>
          <span className={styles.stripLabel}>Current Level Tier</span>
          <strong className={styles.stripVal}>
            Level {pad2(progress.currentLevel)} · {progress.currentLevelConfig.name}
          </strong>
        </div>
        <div>
          <span className={styles.stripLabel}>Next Level Unlock</span>
          <strong className={styles.stripVal}>
            {progress.nextLevelReward.map(formatReward).join(' + ') || 'Max Level'}
          </strong>
        </div>
        <div>
          <span className={styles.stripLabel}>Today&apos;s XP Earned</span>
          <strong className={styles.stripVal}>
            +{(user?.today?.xpEarned ?? 215).toLocaleString('en-IN')} XP
          </strong>
        </div>
      </section>

      <XPActivity limit={0} showViewAll={false} />
    </div>
  );
}

/**
 * Dedicated Profile View (`activeTab === 'profile'`)
 * Shows the VeLooper user profile, current level badge, lifetime stats, unlocked badges
 * showcase, current privileges, and quick actions.
 */
export function ProfileView() {
  const {
    user,
    progress,
    levels,
    bestScore,
    playsLeft,
    setSelectedLevel,
    setActiveTab,
    demoActions,
  } = useDashboard();

  const curNum = pad2(progress.currentLevel);

  return (
    <div className={styles.viewWrap}>
      {/* Profile Hero Card */}
      <section className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarStage}>
            <img
              src={progress.currentLevelConfig.badge}
              alt={`Level ${curNum} badge`}
              className={styles.profileBadge}
            />
            <span className={styles.verifiedPill}>
              <ShieldCheck size={12} /> Verified VeLooper
            </span>
          </div>

          <div className={styles.profileInfo}>
            <span className={styles.kicker}>MEMBER PROFILE &amp; ACHIEVEMENTS</span>
            <h2 className={styles.profileName}>{user?.name ?? 'VeLooper'}</h2>
            <p className={styles.profileTier}>
              Tier {curNum} · <strong>{progress.currentLevelConfig.name}</strong> ·{' '}
              {progress.currentXP.toLocaleString('en-IN')} Total XP
            </p>

            <div className={styles.profileProgressWrap}>
              <XPProgress
                currentXP={progress.currentXP}
                requiredXP={progress.requiredXP}
                xpRemaining={progress.xpRemaining}
                percent={progress.percent}
                nextLevelLabel={
                  progress.nextLevel ? `Level ${pad2(progress.nextLevel)}` : ''
                }
              />
            </div>
          </div>

          <img
            src={trophyImg}
            alt="Achievement Trophy"
            className={styles.profileTrophy}
          />
        </div>

        {/* 4 Stat Counters */}
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <TrendingUp size={18} className={styles.statIcon} />
            <span className={styles.statLabel}>Current Level</span>
            <strong className={styles.statValue}>Level {curNum}</strong>
          </div>

          <div className={styles.statBox}>
            <Flame size={18} className={styles.statIcon} />
            <span className={styles.statLabel}>Active Streak</span>
            <strong className={styles.statValue}>
              {user?.today?.streakDays ?? 7} Days
            </strong>
          </div>

          <div className={styles.statBox}>
            <Gamepad2 size={18} className={styles.statIcon} />
            <span className={styles.statLabel}>XP Catcher Best</span>
            <strong className={styles.statValue}>
              {bestScore} pts ({playsLeft} left)
            </strong>
          </div>

          <div className={styles.statBox}>
            <Gift size={18} className={styles.statIcon} />
            <span className={styles.statLabel}>Tasks Completed</span>
            <strong className={styles.statValue}>
              {user?.today?.tasksDone ?? 4} / {user?.today?.tasksTotal ?? 8} Today
            </strong>
          </div>
        </div>
      </section>

      {/* Active Tier Privileges */}
      <section className={styles.privilegesCard}>
        <div className={styles.secHeader}>
          <Award size={18} className={styles.goldIcon} />
          <h3 className={styles.secTitle}>
            Unlocked Tier Privileges (Level {curNum} · {progress.currentLevelConfig.name})
          </h3>
        </div>

        <div className={styles.perkPills}>
          {levels
            .filter((l) => l.level <= progress.currentLevel)
            .flatMap((l) => l.perks.map((p) => ({ level: l.level, perk: p })))
            .map((item, idx) => (
              <div key={idx} className={styles.perkChip}>
                <CheckCircle2 size={15} className={styles.greenIcon} />
                <span>{item.perk}</span>
                <small>L{pad2(item.level)}</small>
              </div>
            ))}
        </div>

        <div className={styles.btnRow}>
          <button
            type="button"
            className={styles.goldBtn}
            onClick={() => setSelectedLevel(progress.nextLevel ?? progress.currentLevel)}
          >
            Inspect Next Level Perks
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={demoActions.resetToDefault}
          >
            <RotateCcw size={14} /> Reset Demo Progress
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setActiveTab('home')}
          >
            Back to Home
          </button>
        </div>
      </section>

      {/* Full Badge Collection */}
      <LevelRoadmap />
    </div>
  );
}
