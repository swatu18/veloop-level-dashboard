import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import styles from './States.module.css';

/**
 * Friendly Error State (PDF §42):
 *  - "Unable to Load Level Progress"
 *  - "We couldn't load your level information right now."
 *  - CTA: "Try Again"
 *  - Never displays raw API/server errors.
 */
export default function ErrorState({ onRetry }) {
  return (
    <section className={styles.card} role="alert" aria-live="assertive">
      <div className={styles.iconCircle}>
        <AlertTriangle size={28} />
      </div>
      <h2 className={styles.title}>Unable to Load Level Progress</h2>
      <p className={styles.text}>
        We couldn&apos;t load your level information right now.
      </p>
      <button type="button" className={styles.retryBtn} onClick={onRetry}>
        <RotateCcw size={15} />
        <span>Try Again</span>
      </button>
    </section>
  );
}
