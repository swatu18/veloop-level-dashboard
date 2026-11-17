import React from 'react';
import { DollarSign, Gift, Home, User, Wallet } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import styles from './BottomNav.module.css';

/**
 * Mobile & App Bottom Navigation Bar matching Mockup Screen 1:
 *   Home · Earn · Rewards · Wallet · Profile
 *
 * Each tab opens its dedicated view (Home Dashboard, Earn & Level Up,
 * Rewards Catalog & Roadmap, Wallet & Activity, or User Profile) — never
 * hijacking clicks to launch the game unexpectedly.
 */
export default function BottomNav() {
  const { activeTab, setActiveTab, setEarnDrawerOpen } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  const selectTab = (tab) => {
    setEarnDrawerOpen(false);
    setActiveTab(tab);
    if (location.pathname !== '/Lvl-Dashboard') {
      navigate('/Lvl-Dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={styles.nav} aria-label="Primary tab navigation">
      <button
        type="button"
        className={`${styles.item} ${activeTab === 'home' ? styles.active : ''}`}
        onClick={() => selectTab('home')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        type="button"
        className={`${styles.item} ${activeTab === 'earn' ? styles.active : ''}`}
        onClick={() => selectTab('earn')}
      >
        <DollarSign size={20} />
        <span>Earn</span>
      </button>

      <button
        type="button"
        className={`${styles.item} ${activeTab === 'rewards' ? styles.active : ''}`}
        onClick={() => selectTab('rewards')}
      >
        <Gift size={20} />
        <span>Rewards</span>
      </button>

      <button
        type="button"
        className={`${styles.item} ${activeTab === 'wallet' ? styles.active : ''}`}
        onClick={() => selectTab('wallet')}
      >
        <Wallet size={20} />
        <span>Wallet</span>
      </button>

      <button
        type="button"
        className={`${styles.item} ${activeTab === 'profile' ? styles.active : ''}`}
        onClick={() => selectTab('profile')}
      >
        <User size={20} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
