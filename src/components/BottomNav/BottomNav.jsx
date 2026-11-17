import React from 'react';
import { DollarSign, Gift, Home, User, Wallet } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import styles from './BottomNav.module.css';

/**
 * Mobile Bottom Navigation Bar matching Mockup Screen 1:
 *   Home · Earn · Rewards · Wallet · Profile
 *
 * Includes iOS safe-area bottom inset (`env(safe-area-inset-bottom)`) and
 * Android touch-ripple friendly 48px tap targets.
 */
export default function BottomNav() {
  const { setEarnDrawerOpen, setSelectedLevel, progress, setGameOpen } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  const isActivity = location.pathname === '/Lvl-Dashboard/activity';

  return (
    <nav className={styles.nav} aria-label="Mobile primary navigation">
      <button
        type="button"
        className={`${styles.item} ${!isActivity ? styles.active : ''}`}
        onClick={() => navigate('/Lvl-Dashboard')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        type="button"
        className={styles.item}
        onClick={() => setEarnDrawerOpen(true)}
      >
        <DollarSign size={20} />
        <span>Earn</span>
      </button>

      <button
        type="button"
        className={styles.item}
        onClick={() => setSelectedLevel(progress.nextLevel ?? progress.currentLevel)}
      >
        <Gift size={20} />
        <span>Rewards</span>
      </button>

      <button
        type="button"
        className={`${styles.item} ${isActivity ? styles.active : ''}`}
        onClick={() => navigate('/Lvl-Dashboard/activity')}
      >
        <Wallet size={20} />
        <span>Wallet</span>
      </button>

      <button
        type="button"
        className={styles.item}
        onClick={() => setGameOpen(true)}
      >
        <User size={20} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
