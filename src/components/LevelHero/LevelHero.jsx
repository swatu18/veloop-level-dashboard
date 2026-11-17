import React from 'react';
import { Bell, Menu, SlidersHorizontal, Sparkles } from 'lucide-react';
import LevelInfo from '../LevelInfo/LevelInfo';
import { useDashboard } from '../../context/DashboardContext';
import { VeCoin } from '../GameTokens/GameTokens';
import styles from './LevelHero.module.css';

/**
 * Top Level Hero bar + greeting (PDF §9, Mockup Screen 1).
 *
 * Every button navigates to its exact section/tab — never opening the game
 * unless the user explicitly clicks "XP Catcher".
 */
export default function LevelHero({ onOpenDemo }) {
  const { user, activeTab, setActiveTab, setGameOpen, setEarnDrawerOpen } = useDashboard();

  return (
    <header className={styles.header}>
      {/* Top navigation bar */}
      <div className={styles.topBar}>
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

        <nav className={styles.desktopNav} aria-label="Dashboard sections">
          <button
            type="button"
            className={`${styles.navLink} ${activeTab === 'home' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={`${styles.navLink} ${activeTab === 'earn' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('earn')}
          >
            Earn
          </button>
          <button
            type="button"
            className={`${styles.navLink} ${activeTab === 'rewards' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            Rewards
          </button>
          <button
            type="button"
            className={`${styles.navLink} ${activeTab === 'wallet' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            Wallet
          </button>
          <button
            type="button"
            className={`${styles.navLink} ${activeTab === 'profile' ? styles.navActive : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </nav>

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
            className={styles.demoBtn}
            onClick={onOpenDemo}
            title="Toggle Demo / Review States (Loading, Empty, Error, Level-Up)"
          >
            <SlidersHorizontal size={15} />
            <span>Demo States</span>
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
