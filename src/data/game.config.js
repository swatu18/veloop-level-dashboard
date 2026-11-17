/**
 * XP Catcher – game configuration (PDF §5–8, §44–46).
 *
 * Every rule here is shown to the player on the start screen – there are
 * no hidden mechanics. Reward values are ⚠️ DEMO values until the product
 * team approves real reward rules.
 */
export const GAME_CONFIG = {
  id: 'xp-catcher',
  name: 'XP Catcher',
  durationSec: 20,
  countdownSec: 3,
  playsPerDay: 5,
  /** Falling items. `weight` = relative spawn chance. */
  items: {
    coin: { label: 'VE Coin', points: 5, ves: 1, weight: 46 },
    orb: { label: 'XP Orb', points: 10, ves: 0, weight: 32 },
    gem: { label: 'Gem', points: 15, ves: 0, weight: 16 },
    rocket: { label: '2X Booster', points: 0, ves: 0, weight: 6, boostSec: 5 },
  },
  /** Reward tiers by final score (highest matching tier wins). */
  rewardTiers: [
    { minScore: 120, xp: 30, ves: 12, title: 'Outstanding!' },
    { minScore: 90, xp: 30, ves: 12, title: 'Outstanding!' },
    { minScore: 60, xp: 20, ves: 5, title: 'Great Job!' },
    { minScore: 30, xp: 10, ves: 2, title: 'Nice Work!' },
    { minScore: 0, xp: 5, ves: 0, title: 'Good Try!' },
  ],
};

export const getRewardTier = (score) =>
  GAME_CONFIG.rewardTiers.find((t) => score >= t.minScore) ??
  GAME_CONFIG.rewardTiers[GAME_CONFIG.rewardTiers.length - 1];
