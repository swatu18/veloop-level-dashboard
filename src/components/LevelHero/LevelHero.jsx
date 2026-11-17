import React from 'react';
import { Bell, Menu, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LevelInfo from '../LevelInfo/LevelInfo';
import { useDashboard } from '../../context/DashboardContext';
import { VeCoin } from '../GameTokens/GameTokens';
import styles from './LevelHero.module.css';

/**
 * Top Level Hero bar + greeting (PDF §9, Mockup Screen 1).
 *
 * Mobile: matches Screen 1 header (menu icon, notification bell with orange dot,
 *         "Good Morning, VeLooper! 👋", subtitle).
 * Desktop: adds VELOOP brand emblem, nav links, wallet pill, and Quick Demo switch.
 */
export default function LevelHero({ onOpenDemo }) {
  const { user, setGameOpen, setEarnDrawerOpen } = useDashboard();
  const location = useLocation();

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

        <Link to="/Lvl-Dashboard" className={styles.brand}>
          <span className={styles.brandHex} aria-hidden="true">
            V
          </span>
          <span className={styles.brandText}>
            VELOOP <small>REWARDS</small>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Dashboard sections">
          <Link
            to="/Lvl-Dashboard"
            className={`${styles.navLink} ${
              location.pathname !== '/Lvl-Dashboard/activity' ? styles.navActive : ''
            }`}
          >
            Dashboard
          </Link>
          <button
            type="button"
            className={styles.navLink}
            onClick={() => setEarnDrawerOpen(true)}
          >
            Earn &amp; Level Up
          </button>
          <button type="button" className={styles.navLink} onClick={() => setGameOpen(true)}>
            XP Catcher
          </button>
          <Link
            to="/Lvl-Dashboard/activity"
            className={`${styles.navLink} ${
              location.pathname === '/Lvl-Dashboard/activity' ? styles.navActive : ''
            }`}
          >
            Recent Activity
          </Link>
        </nav>

        <div className={styles.rightCluster}>
          <div className={styles.walletPill} title="Demo wallet balance">
            <VeCoin size={20} />
            <span>{(user?.wallet?.VEs ?? 1240).toLocaleString('en-IN')} VEs</span>
          </div>

          <button
            type="button"
            className={styles.demoBtn}
            onClick={onOpenDemo}
            title="Toggle Demo / Review States (Loading, Empty, Error, Level-Up)"
          >
            <SlidersHorizontal size={15} />
            <span>Demo States</span>
          </button>

          <Link
            to="/Lvl-Dashboard/activity"
            className={styles.bellBtn}
            aria-label="Recent XP notifications"
          >
            <Bell size={21} />
            <span className={styles.bellDot} aria-hidden="true" />
          </Link>
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
