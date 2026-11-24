import React from 'react';
import { ArrowRight, BarChart3, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { EARNINGS, EARN_LIST_IDS, QUICK_EARN_IDS } from '../../data/earnings';
import { useCooldown } from '../../hooks/useCooldown';
import { formatReward, pad2 } from '../../data/levels';
import LevelInfo from '../LevelInfo/LevelInfo';
import XPProgress from '../XPProgress/XPProgress';
import { GraphicIcon, VeCoin, XpOrb } from '../GameTokens/GameTokens';
import walletImg from '../../assets/illustrations/wallet.webp';
import styles from './EarnMoreXP.module.css';

/**
 * Single Earning Row / Card with live cooldown & Coming Soon support.
 */
function EarningListRow({ item, cooldownUntil, claiming, onSelect }) {
  const cd = useCooldown(cooldownUntil);
  const isSoon = item.status === 'coming-soon';

  return (
    <button
      type="button"
      className={`${styles.listRow} ${isSoon ? styles.rowComingSoon : ''}`}
      onClick={() => onSelect(item.id)}
      disabled={cd.active || claiming}
    >
      <div className={styles.rowIconWrap}>
        <GraphicIcon type={item.icon} size={42} />
      </div>

      <div className={styles.rowBody}>
        <div className={styles.rowTitleLine}>
          <span className={styles.rowTitle}>{item.title}</span>
          {isSoon ? (
            <span className={styles.soonBadge}>Coming Soon</span>
          ) : (
            item.ves > 0 && <span className={styles.veBonusBadge}>+{item.ves} VEs</span>
          )}
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
 * Interactive Desktop Feature Card (PDF §24, §47).
 */
function EarningFeatureCard({ item, cooldownUntil, claiming, onSelect }) {
  const cd = useCooldown(cooldownUntil);
  const isSoon = item.status === 'coming-soon';

  return (
    <article className={`${styles.featureCard} ${isSoon ? styles.cardSoon : ''}`}>
      <div className={styles.cardTop}>
        <div className={styles.cardIconBox}>
          <GraphicIcon type={item.icon} size={42} />
        </div>
        <div className={styles.cardMeta}>
          <div className={styles.cardTitleRow}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            {isSoon && <span className={styles.soonBadge}>Coming Soon</span>}
          </div>
          <span className={styles.cardXpPill}>
            {isSoon
              ? `Concept · ${item.xpLabel}`
              : `Earn ${item.xpLabel}${item.ves ? ` · +${item.ves} VEs` : ''}`}
          </span>
        </div>
      </div>

      <p className={styles.cardDesc}>{item.longDescription}</p>

      <button
        type="button"
        className={`${styles.cardCta} ${cd.active || isSoon ? styles.cardCtaDisabled : ''}`}
        onClick={() => onSelect(item.id)}
        disabled={cd.active || claiming}
      >
        <span>
          {isSoon
            ? 'Coming Soon'
            : cd.active
            ? cd.label
            : claiming
            ? 'Claiming...'
            : `${item.cta} →`}
        </span>
      </button>
    </article>
  );
}

/**
 * Quick 3×2 "EARN MORE" icon grid from Mockup Screen 1.
 */
export function QuickEarnGrid() {
  const { handleClaimEarning, setEarnDrawerOpen, cooldowns } = useDashboard();
  const quickItems = QUICK_EARN_IDS.map((id) => EARNINGS.find((e) => e.id === id)).filter(Boolean);

  return (
    <section className={styles.quickCard} aria-label="Earn More quick actions">
      <div className={styles.quickHeader}>
        <div>
          <h2 className={styles.quickTitle}>EARN MORE</h2>
          <p className={styles.quickSub}>
            Explore fun activities and earn exciting rewards.
          </p>
        </div>

        <button
          type="button"
          className={styles.arrowCircle}
          onClick={() => setEarnDrawerOpen(true)}
          aria-label="Open full Earn & Level Up list"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      <div className={styles.quickGrid}>
        {quickItems.map((item) => {
          const onCd = (cooldowns[item.id] ?? 0) > Date.now();
          return (
            <button
              key={item.id}
              type="button"
              className={styles.quickTile}
              onClick={() => handleClaimEarning(item.id)}
            >
              {onCd && <span className={styles.quickCornerTag}>Done ✓</span>}
              <GraphicIcon type={item.icon} size={44} />
              <span className={styles.quickLabel}>{item.short}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Full "EARN MORE XP & REWARDS" Action Hub (PDF §22–25, §36, §47).
 * On mobile, displays the Screen 4 ("EARN & LEVEL UP") list cleanly first,
 * followed by the Action Hub wallet card; on desktop, shows side-by-side.
 */
export default function EarnMoreXP({ mobileListFirst = false }) {
  const {
    progress,
    cooldowns,
    claimingId,
    handleClaimEarning,
  } = useDashboard();

  const listItems = EARN_LIST_IDS.map((id) => EARNINGS.find((e) => e.id === id)).filter(Boolean);
  const nextNum = pad2(progress.nextLevel ?? progress.currentLevel);
  const nextRewardsText = progress.nextLevelReward.map(formatReward).join(' + ');

  return (
    <section className={styles.section} aria-label="Earn More XP and Rewards">
      <div className={styles.sectionHeader}>
        <div className={styles.titleRow}>
          <h2 className={styles.sectionTitle}>
            {mobileListFirst ? 'EARN & LEVEL UP' : 'EARN MORE XP & REWARDS'}
          </h2>
          <LevelInfo variant="earn" align="left" />
        </div>
        <p className={styles.sectionSub}>
          Complete activities. Earn XP. Climb levels. Get rewards.
        </p>
      </div>

      <div
        className={`${styles.desktopLayout} ${
          mobileListFirst ? styles.mobileListFirst : ''
        }`}
      >
        {/* Left Summary / Action Hub Card with Animated Coins Flowing into Treasure Wallet (PDF §36) */}
        <aside className={styles.summaryCard}>
          <span className={styles.summaryKicker}>
            <Sparkles size={12} /> ACTION HUB
          </span>
          <h3 className={styles.summaryTitle}>COMPLETE TASKS TO LEVEL UP</h3>
          <p className={styles.summaryCopy}>
            {progress.isMaxLevel ? (
              'You have unlocked the highest level!'
            ) : (
              <>
                <strong>{progress.xpRemaining.toLocaleString('en-IN')} XP needed</strong> for
                Level {nextNum} — unlocking{' '}
                <span className={styles.goldHighlight}>{nextRewardsText}</span>!
              </>
            )}
          </p>

          <XPProgress
            currentXP={progress.currentXP}
            requiredXP={progress.requiredXP}
            xpRemaining={progress.xpRemaining}
            percent={progress.percent}
            showMeta={false}
            compact
          />

          <div className={styles.waysPills}>
            <span>Play</span>
            <span>Watch</span>
            <span>Complete</span>
            <span>Refer</span>
            <span>Earn</span>
          </div>

          {/* Animated Coins & XP Orbs Flowing into the Treasure Wallet (PDF §36) */}
          <div className={styles.walletStage}>
            <span className={styles.walletAura} aria-hidden="true" />
            <div className={styles.walletStream} aria-hidden="true">
              <span className={`${styles.streamCoin} ${styles.sc1}`}>
                <VeCoin size={22} />
              </span>
              <span className={`${styles.streamCoin} ${styles.sc2}`}>
                <XpOrb size={20} />
              </span>
              <span className={`${styles.streamCoin} ${styles.sc3}`}>
                <VeCoin size={19} />
              </span>
              <span className={`${styles.streamCoin} ${styles.sc4}`}>
                <VeCoin size={23} />
              </span>
            </div>
            <img
              src={walletImg}
              alt="VELOOP treasure wallet with gold coins and purple gems"
              className={styles.walletArt}
            />
          </div>

          <div className={styles.keepGoingFooter}>
            <span>Keep going! You&apos;re doing great!</span>
            <BarChart3 size={22} className={styles.barsIcon} />
          </div>
        </aside>

        {/* Right: Screen 4 style rows on mobile/tablet + interactive feature cards grid */}
        <div className={styles.earnContent}>
          <div className={styles.screen4List}>
            {listItems.map((item) => (
              <EarningListRow
                key={item.id}
                item={item}
                cooldownUntil={cooldowns[item.id]}
                claiming={claimingId === item.id}
                onSelect={handleClaimEarning}
              />
            ))}
            <div className={styles.keepGoingBar}>
              <span>Keep going! You&apos;re doing great!</span>
              <BarChart3 size={22} className={styles.barsIcon} />
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {EARNINGS.map((item) => (
              <EarningFeatureCard
                key={item.id}
                item={item}
                cooldownUntil={cooldowns[item.id]}
                claiming={claimingId === item.id}
                onSelect={handleClaimEarning}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
