import React from 'react';
import { ArrowLeft, BarChart3, ChevronRight, Clock } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { EARNINGS, EARN_LIST_IDS } from '../../data/earnings';
import { useCooldown } from '../../hooks/useCooldown';
import { GraphicIcon } from '../GameTokens/GameTokens';
import styles from './EarnMoreXP.module.css';

function DrawerRow({ item, cooldownUntil, claiming, onSelect }) {
  const cd = useCooldown(cooldownUntil);

  return (
    <button
      type="button"
      className={styles.listRow}
      onClick={() => onSelect(item.id)}
      disabled={cd.active || claiming}
    >
      <div className={styles.rowIconWrap}>
        <GraphicIcon type={item.icon} size={42} />
      </div>

      <div className={styles.rowBody}>
        <div className={styles.rowTitleLine}>
          <span className={styles.rowTitle}>{item.title}</span>
          {item.ves > 0 && <span className={styles.veBonusBadge}>+{item.ves} VEs</span>}
        </div>
        <span className={styles.rowDesc}>{item.description}</span>
        <span className={styles.rowXp}>
          {cd.active ? (
            <span className={styles.cooldownInline}>
              <Clock size={11} /> {cd.label}
            </span>
          ) : claiming ? (
            'Claiming...'
          ) : (
            item.xpLabel
          )}
        </span>
      </div>

      <ChevronRight size={18} className={styles.rowChevron} />
    </button>
  );
}

/**
 * Standalone Screen 4 ("EARN & LEVEL UP") drawer modal mounted globally
 * so clicking the top-left Menu (☰) or "Start Earning XP →" works from
 * EVERY tab (Home, Earn, Rewards, Wallet, Profile) and from /activity.
 */
export default function EarnDrawer() {
  const {
    cooldowns,
    claimingId,
    handleClaimEarning,
    earnDrawerOpen,
    setEarnDrawerOpen,
  } = useDashboard();

  if (!earnDrawerOpen) return null;

  const listItems = EARN_LIST_IDS.map((id) => EARNINGS.find((e) => e.id === id)).filter(Boolean);

  return (
    <div
      className={styles.drawerBackdrop}
      onClick={() => setEarnDrawerOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Earn and Level Up"
    >
      <div className={styles.drawerPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.drawerHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setEarnDrawerOpen(false)}
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className={styles.drawerTitleBlock}>
            <h2 className={styles.drawerTitle}>EARN &amp; LEVEL UP</h2>
            <p className={styles.drawerSub}>
              Complete activities. Earn XP. Climb levels. Get rewards.
            </p>
          </div>
        </div>

        <div className={styles.drawerList}>
          {listItems.map((item) => (
            <DrawerRow
              key={item.id}
              item={item}
              cooldownUntil={cooldowns[item.id]}
              claiming={claimingId === item.id}
              onSelect={(id) => {
                setEarnDrawerOpen(false);
                handleClaimEarning(id);
              }}
            />
          ))}
        </div>

        <div className={styles.keepGoingBar}>
          <span>Keep going! You&apos;re doing great!</span>
          <BarChart3 size={24} className={styles.barsIcon} />
        </div>
      </div>
    </div>
  );
}
