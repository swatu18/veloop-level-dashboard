import React from 'react';
import { Clock, Play, Sparkles, Trophy } from 'lucide-react';
import { useDashboard } from '../../../context/DashboardContext';
import { GAME_CONFIG } from '../../../data/game.config';
import LevelInfo from '../../LevelInfo/LevelInfo';
import { GemToken, VeCoin, XpOrb } from '../../GameTokens/GameTokens';
import basketImg from '../../../assets/illustrations/basket.webp';
import styles from '../Game.module.css';

/**
 * Dashboard promo & rules card for the mandatory XP Catcher mini-game (PDF §3–7, §40).
 *
 * Clearly explains:
 *  - How to play & Objective
 *  - Time limit (20s) & plays remaining today
 *  - Item scoring (+10 XP Orb, +5 VE Coin, +15 Gem, 2X Booster)
 *  - Demo Reward Tiers
 *  - Empty state when the game is temporarily unavailable ("New challenge coming soon." PDF §40)
 */
export default function GameStart() {
  const { gameAvailable, setGameOpen, playsLeft, bestScore, setGameAvailable } = useDashboard();

  if (!gameAvailable) {
    return (
      <section className={styles.promoCard} aria-label="Play and Earn Mini-Game">
        <div className={styles.promoTop}>
          <span className={styles.kicker}>PLAY &amp; EARN · LEVEL-UP ARCADE</span>
          <LevelInfo variant="game" />
        </div>
        <div className={styles.unavailableBox}>
          <Clock size={34} className={styles.unavailIcon} />
          <h3 className={styles.unavailTitle}>No Available Game</h3>
          <p className={styles.unavailText}>New challenge coming soon.</p>
          <button
            type="button"
            className={styles.restoreBtn}
            onClick={() => setGameAvailable(true)}
          >
            Re-enable XP Catcher (Demo)
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.promoCard} aria-label="XP Catcher Mini-Game">
      <div className={styles.promoTop}>
        <div className={styles.titleCluster}>
          <span className={styles.kicker}>PLAY &amp; EARN · LEVEL-UP ARCADE</span>
          <div className={styles.titleLine}>
            <h2 className={styles.promoTitle}>XP CATCHER</h2>
            <LevelInfo variant="game" align="left" />
          </div>
          <p className={styles.promoSub}>
            Catch falling XP orbs, VE coins &amp; gems in 20 seconds. Score high for better
            rewards!
          </p>
        </div>

        <div className={styles.statsBadges}>
          <span className={styles.statChip}>
            <Trophy size={13} /> Best: <strong>{bestScore}</strong>
          </span>
          <span className={styles.statChip}>
            <Clock size={13} /> {GAME_CONFIG.durationSec}s · {playsLeft}/{GAME_CONFIG.playsPerDay}{' '}
            plays left
          </span>
        </div>
      </div>

      {/* Visual stage preview with floating XP orbs, V-coins, gems & golden basket */}
      <div className={styles.stagePreview} onClick={() => setGameOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setGameOpen(true)}>
        <div className={styles.floatingItems} aria-hidden="true">
          <span className={`${styles.floatItem} ${styles.f1}`}>
            <XpOrb size={36} />
          </span>
          <span className={`${styles.floatItem} ${styles.f2}`}>
            <VeCoin size={34} />
          </span>
          <span className={`${styles.floatItem} ${styles.f3}`}>
            <GemToken size={34} variant="green" />
          </span>
          <span className={`${styles.floatItem} ${styles.f4}`}>
            <XpOrb size={32} />
          </span>
          <span className={`${styles.floatItem} ${styles.f5}`}>
            <VeCoin size={32} />
          </span>
        </div>

        <img
          src={basketImg}
          alt="Golden collector basket"
          className={styles.previewBasket}
        />

        <button
          type="button"
          className={styles.playNowBtn}
          onClick={(e) => {
            e.stopPropagation();
            setGameOpen(true);
          }}
        >
          <Play size={16} fill="currentColor" />
          <span>PLAY NOW</span>
        </button>
      </div>

      {/* Transparent Game Rules & Demo Reward Tiers (PDF §6–7) */}
      <div className={styles.rulesGrid}>
        <div className={styles.ruleBox}>
          <span className={styles.ruleLabel}>HOW TO PLAY</span>
          <p className={styles.ruleVal}>
            Drag with finger/mouse or use ← → arrow keys to move the golden basket.
          </p>
        </div>

        <div className={styles.ruleBox}>
          <span className={styles.ruleLabel}>SCORING</span>
          <p className={styles.ruleVal}>
            VE Coin <strong>+5</strong> · XP Orb <strong>+10</strong> · Gem{' '}
            <strong>+15</strong> · 🚀 <strong>2X</strong> (5s)
          </p>
        </div>

        <div className={styles.ruleBox}>
          <span className={styles.ruleLabel}>REWARDS (DEMO VALUES)</span>
          <p className={styles.ruleVal}>
            Score 60+ → <strong>+20 XP &amp; +5 VEs</strong> · Score 90+ →{' '}
            <strong>+30 XP &amp; +12 VEs</strong>
          </p>
        </div>

        <div className={styles.ruleBox}>
          <span className={styles.ruleLabel}>ELIGIBILITY &amp; LIMIT</span>
          <p className={styles.ruleVal}>
            All VELOOP users · {GAME_CONFIG.playsPerDay} skill runs per day (unlimited demo
            replays).
          </p>
        </div>
      </div>
    </section>
  );
}
