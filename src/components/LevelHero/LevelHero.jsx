import React from 'react';
import { Bell, Menu, Sparkles } from 'lucide-react';
import LevelInfo from '../LevelInfo/LevelInfo';
import { useDashboard } from '../../context/DashboardContext';
import { VeCoin } from '../GameTokens/GameTokens';
import styles from './LevelHero.module.css';

/**
 * Top Level Hero bar + greeting (PDF §9, Mockup Screen 1).
 *
 * Clean production header matching Screen 1:
 *  - Left: Menu button (opens Earn & Level Up list) + VELOOP brand
 *  - Right: Wallet VE balance pill + Notification Bell with orange badge dot
 *  - No top tab bar (Home · Earn · Rewards · Wallet · Profile stay strictly at the bottom)
 *  - No artificial "Demo States" button
 */
export default function LevelHero() {
  const { user, setActiveTab, setGameOpen, setEarnDrawerOpen } = useDashboard();

  return (
    <header className={styles.header}>
      {/* Top navigation bar matching Screen 1 */}
      <div className={styles.topBar}>
        <div className={styles.leftCluster}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setEarnDrawerOpen(true)}
            aria-label="Open Earn & Level Up menu"
          >
            <Menu size={22} />
          </button>

          <button
            type="button"
            className={styles.brand}
            onClick={() => setActiveTab('home')}
          >
            <span className={styles.brandHex} aria-hidden="true">
              V
            </span>
            <span className={styles.brandText}>
              VELOOP <small>REWARDS</small>
            </span>
          </button>
        </div>

        <div className={styles.rightCluster}>
          <button
            type="button"
            className={styles.walletPill}
            onClick={() => setActiveTab('wallet')}
            title="Open Wallet"
          >
            <VeCoin size={22} />
            <span>{(user?.wallet?.VEs ?? 1240).toLocaleString('en-IN')} VEs</span>
          </button>

          <button
            type="button"
            className={styles.bellBtn}
            onClick={() => setActiveTab('wallet')}
            aria-label="Recent XP Activity & Notifications"
          >
            <Bell size={21} />
            <span className={styles.bellDot} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Greeting row matching Screen 1 */}
      <div className={styles.greetingRow}>
        <div>
          <div className={styles.greetingTitleRow}>
            <h1 className={styles.greetingTitle}>
              Good Morning, {user?.name ?? 'VeLooper'}!{' '}
              <span className={styles.wave} role="img" aria-label="wave">
                👋
              </span>
            </h1>
            <LevelInfo variant="level" align="left" />
          </div>
          <p className={styles.greetingSub}>
            Level up your journey and unlock epic rewards every day.
          </p>
        </div>

        <button
          type="button"
          className={styles.quickPlayChip}
          onClick={() => setGameOpen(true)}
        >
          <Sparkles size={16} />
          <span>Play XP Catcher</span>
        </button>
      </div>
    </header>
  );
}
