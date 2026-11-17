import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { pad2 } from '../../data/levels';
import styles from './Recommendation.module.css';

/**
 * Personalized Recommendation & Progress-to-Next-Level CTA banner (PDF §25–26).
 *
 * Dynamically adapts its message and recommended action based on the user's
 * remaining XP to the next level.
 */
export default function Recommendation() {
  const { progress, setGameOpen, handleClaimEarning, setEarnDrawerOpen } = useDashboard();

  if (progress.isMaxLevel) return null;

  const rem = progress.xpRemaining;
  const nextNum = pad2(progress.nextLevel);

  let headline = `You're ${rem.toLocaleString('en-IN')} XP away from Level ${nextNum}.`;
  let sub = 'Play XP Catcher or complete a daily mission to move closer to your next reward.';
  let ctaLabel = 'Play XP Catcher';
  let onAction = () => setGameOpen(true);

  if (rem <= 50) {
    headline = `Almost there! Only ${rem} XP left to reach Level ${nextNum}!`;
    sub = 'Complete one Watch & Earn or Daily Mission right now to unlock your Level-Up chest.';
    ctaLabel = 'Watch & Earn (+50 XP)';
    onAction = () => handleClaimEarning('watch');
  } else if (rem <= 350) {
    headline = `You're only ${rem} XP away from Level ${nextNum}.`;
    sub = 'Complete a referral or a couple of quick challenges to reach your next level today.';
    ctaLabel = 'View Ways to Earn';
    onAction = () => setEarnDrawerOpen(true);
  }

  return (
    <section className={styles.banner} aria-label="Recommended next action">
      <div className={styles.left}>
        <span className={styles.badge}>
          <Compass size={13} />
          <span>RECOMMENDED FOR YOU</span>
        </span>
        <h3 className={styles.headline}>{headline}</h3>
        <p className={styles.sub}>{sub}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={onAction}>
          <span>{ctaLabel}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}
