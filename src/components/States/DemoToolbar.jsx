import React from 'react';
import {
  AlertTriangle,
  Gamepad2,
  Inbox,
  Loader,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import styles from './DemoToolbar.module.css';

/**
 * Reviewer / Demo States Switcher drawer so the team lead can test every
 * required state from the PDF submission checklist in one click:
 *  - Normal Dashboard (6,420 / 8,000 XP)
 *  - Almost Level Up (7,970 / 8,000 XP → 1 claim triggers Level Up)
 *  - Level-Up Celebration Modal (Screen 5)
 *  - XP Catcher Mini-Game (Screens 2 & 3)
 *  - Earn & Level Up Drawer (Screen 4)
 *  - Skeleton Loading State (PDF §41)
 *  - Empty Activity + Unavailable Game State (PDF §40)
 *  - Friendly Error State (PDF §42)
 */
export default function DemoToolbar({ open, onClose }) {
  const { demoActions, setEarnDrawerOpen } = useDashboard();
  if (!open) return null;

  const run = (fn) => {
    fn();
    onClose();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Reviewer Demo States"
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <span className={styles.kicker}>TASK 16 · REVIEWER TOOLKIT</span>
            <h3 className={styles.title}>Inspect All Required States</h3>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close demo panel"
          >
            <X size={18} />
          </button>
        </div>

        <p className={styles.note}>
          All XP, VE &amp; Gem figures are clearly treated as development/demo data until
          connected to the official VELOOP backend.
        </p>

        <div className={styles.grid}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => run(demoActions.triggerLevelUpModal)}
          >
            <Trophy size={16} />
            <span>Preview Level-Up Celebration (Screen 5)</span>
          </button>

          <button
            type="button"
            className={styles.btn}
            onClick={() => run(demoActions.openGame)}
          >
            <Gamepad2 size={16} />
            <span>Launch XP Catcher Game (Screens 2 &amp; 3)</span>
          </button>

          <button
            type="button"
            className={styles.btn}
            onClick={() => run(() => setEarnDrawerOpen(true))}
          >
            <Sparkles size={16} />
            <span>Open Earn &amp; Level Up View (Screen 4)</span>
          </button>

          <button
            type="button"
            className={styles.btn}
            onClick={() => run(demoActions.setAlmostLevelUp)}
          >
            <Sparkles size={16} />
            <span>Set XP to 7,970 (1 task away from Level 05)</span>
          </button>

          <button
            type="button"
            className={styles.btn}
            onClick={() => run(demoActions.triggerLoading)}
          >
            <Loader size={16} />
            <span>Preview Skeleton Loading State (PDF §41)</span>
          </button>

          <button
            type="button"
            className={styles.btn}
            onClick={() => run(demoActions.triggerEmptyActivity)}
          >
            <Inbox size={16} />
            <span>Preview Empty Activity &amp; Unavailable Game (PDF §40)</span>
          </button>

          <button
            type="button"
            className={styles.btn}
            onClick={() => run(demoActions.triggerError)}
          >
            <AlertTriangle size={16} />
            <span>Preview Friendly Error State (PDF §42)</span>
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.resetBtn}`}
            onClick={() => run(demoActions.resetToDefault)}
          >
            <RotateCcw size={16} />
            <span>Reset Demo to Default (Level 04 · 6,420 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
