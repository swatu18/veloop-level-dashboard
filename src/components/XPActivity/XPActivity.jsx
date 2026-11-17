import React, { useMemo, useState } from 'react';
import { ChevronRight, Filter, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { ACTIVITY_FILTERS } from '../../data/activity.mock';
import { GraphicIcon, VeCoin, XpOrb } from '../GameTokens/GameTokens';
import styles from './XPActivity.module.css';

const formatTime = (ts) => {
  try {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${sameDay ? 'Today' : 'Yesterday'}, ${timeStr}`;
  } catch {
    return 'Today';
  }
};

/**
 * Recent Activity & Today's Summary (PDF §29–30, §40, Mockup Screen 6).
 *
 * Includes:
 *  - Filter button + category chips (All, Tasks, Games, Referrals, Streaks, Rewards)
 *  - Activity rows with 3D icons, green "+20 XP" / "+10 VEs", source title, timestamp
 *  - "Today's Summary" footer with XP Orb ("215 XP Total Earned") and V-Coin ("35 VEs Total Earned")
 *  - Meaningful Empty State ("No XP Activity — Your XP journey starts here." + "Start Earning XP →" CTA, PDF §40)
 */
export default function XPActivity({ limit = 5, showViewAll = true }) {
  const { activity, user, setEarnDrawerOpen } = useDashboard();
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    const list =
      activeFilter === 'all'
        ? activity
        : activity.filter((a) => a.category === activeFilter);
    return limit ? list.slice(0, limit) : list;
  }, [activity, activeFilter, limit]);

  const totalXpToday = user?.today?.xpEarned ?? 215;
  const totalVesToday = user?.today?.vesEarned ?? 35;

  return (
    <section className={styles.card} aria-label="Recent XP Activity">
      <div className={styles.header}>
        <h2 className={styles.title}>RECENT ACTIVITY</h2>
        <div className={styles.headerRight}>
          {showViewAll && (
            <Link to="/Lvl-Dashboard/activity" className={styles.viewAllLink}>
              View All ›
            </Link>
          )}
          <button
            type="button"
            className={`${styles.filterBtn} ${filterOpen ? styles.filterActive : ''}`}
            onClick={() => setFilterOpen((v) => !v)}
            aria-label="Filter activity by XP source"
            aria-expanded={filterOpen}
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {filterOpen && (
        <div className={styles.filterBar} role="tablist" aria-label="XP source categories">
          {ACTIVITY_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === f.id}
              className={`${styles.filterChip} ${
                activeFilter === f.id ? styles.filterChipActive : ''
              }`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Activity list or Empty State (PDF §40) */}
      {filtered.length === 0 ? (
        <div className={styles.emptyBox}>
          <XpOrb size={46} />
          <h3 className={styles.emptyTitle}>No XP Activity</h3>
          <p className={styles.emptyText}>Your XP journey starts here.</p>
          <button
            type="button"
            className={styles.emptyCta}
            onClick={() => setEarnDrawerOpen(true)}
          >
            <Sparkles size={14} />
            <span>Start Earning XP →</span>
          </button>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((item) => (
            <div key={item.id} className={styles.row}>
              <div className={styles.iconBox}>
                <GraphicIcon
                  type={item.icon === 'refer' ? 'refer-green' : item.icon}
                  size={38}
                />
              </div>

              <div className={styles.rowContent}>
                <span className={styles.amount}>
                  +{item.amount} {item.kind}
                </span>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.timestamp}>{formatTime(item.at)}</span>
              </div>

              <ChevronRight size={16} className={styles.chevron} />
            </div>
          ))}
        </div>
      )}

      {/* Today's Summary matching bottom of Screen 6 */}
      <div className={styles.summarySection}>
        <h3 className={styles.summaryTitle}>Today&apos;s Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryTile}>
            <XpOrb size={38} />
            <div>
              <strong className={styles.summaryVal}>
                {totalXpToday.toLocaleString('en-IN')} XP
              </strong>
              <span className={styles.summarySub}>Total Earned</span>
            </div>
          </div>

          <div className={styles.summaryTile}>
            <VeCoin size={38} />
            <div>
              <strong className={styles.summaryVal}>
                {totalVesToday.toLocaleString('en-IN')} VEs
              </strong>
              <span className={styles.summarySub}>Total Earned</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
