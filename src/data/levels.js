/**
 * Level configuration – kept separate from the UI (PDF §50).
 *
 * ⚠️ DEVELOPMENT / DEMO VALUES.
 * Level names, XP thresholds and rewards below are placeholders until the
 * official VELOOP level/reward configuration is provided by the backend.
 * Level 05 (8,000 XP, 500 VEs) and Level 06 (11,000 XP, 2 Spins) follow the
 * values used in the task brief / reference build.
 *
 * `minXP` is the total XP at which the level is reached.
 */
import lvl1 from '../assets/badges/lvl-1.svg';
import lvl2 from '../assets/badges/lvl-2.svg';
import lvl3 from '../assets/badges/lvl-3.svg';
import lvl4 from '../assets/badges/lvl-4.svg';
import lvl5 from '../assets/badges/lvl-5.svg';
import lvl6 from '../assets/badges/lvl-6.svg';
import lvl7 from '../assets/badges/lvl-7.svg';
import lvl8 from '../assets/badges/lvl-8.svg';
import lvl9 from '../assets/badges/lvl-9.svg';
import lvl10 from '../assets/badges/lvl-10.svg';

export const LEVELS = [
  {
    level: 1,
    name: 'Rookie',
    minXP: 0,
    badge: lvl1,
    rewards: [{ type: 'VEs', amount: 50 }],
    perks: ['Access to daily tasks', 'Welcome bonus'],
  },
  {
    level: 2,
    name: 'Explorer',
    minXP: 500,
    badge: lvl2,
    rewards: [{ type: 'VEs', amount: 100 }],
    perks: ['Watch & Earn unlocked', 'Referral rewards'],
  },
  {
    level: 3,
    name: 'Achiever',
    minXP: 1500,
    badge: lvl3,
    rewards: [{ type: 'VEs', amount: 100 }],
    perks: ['Daily missions', 'XP streak tracking'],
  },
  {
    level: 4,
    name: 'Challenger',
    minXP: 3500,
    badge: lvl4,
    rewards: [{ type: 'Gems', amount: 10 }],
    perks: ['XP Catcher mini-game', 'Bonus missions'],
  },
  {
    level: 5,
    name: 'Ascendant',
    minXP: 8000,
    badge: lvl5,
    rewards: [
      { type: 'VEs', amount: 500 },
      { type: 'Gems', amount: 25 },
    ],
    perks: ['Higher daily XP limit', 'Access to new challenges', 'Better reward opportunities'],
  },
  {
    level: 6,
    name: 'Elite',
    minXP: 11000,
    badge: lvl6,
    rewards: [{ type: 'Spins', amount: 2 }],
    perks: ['Exclusive game modes', 'Priority support'],
  },
  {
    level: 7,
    name: 'Master',
    minXP: 15000,
    badge: lvl7,
    rewards: [
      { type: 'VEs', amount: 750 },
      { type: 'SVEs', amount: 1 },
    ],
    perks: ['Weekly quest boosts', 'Premium reward catalogue'],
  },
  {
    level: 8,
    name: 'Champion',
    minXP: 20000,
    badge: lvl8,
    rewards: [{ type: 'Gems', amount: 40 }],
    perks: ['Seasonal events', 'Champion profile frame'],
  },
  {
    level: 9,
    name: 'Legend',
    minXP: 26000,
    badge: lvl9,
    rewards: [{ type: 'VEs', amount: 1500 }],
    perks: ['Legend-only challenges', 'Faster withdrawals'],
  },
  {
    level: 10,
    name: 'Mythic',
    minXP: 33000,
    badge: lvl10,
    rewards: [
      { type: 'SVEs', amount: 5 },
      { type: 'Tokens', amount: 10 },
    ],
    perks: ['Mythic badge & frame', 'All perks unlocked'],
  },
];

export const MAX_LEVEL = LEVELS[LEVELS.length - 1].level;

export const getLevelConfig = (level) =>
  LEVELS.find((l) => l.level === level) ?? LEVELS[LEVELS.length - 1];

/** Level the user is on for a given total XP. */
export const getLevelForXP = (xp) => {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXP) current = l;
  }
  return current;
};

/**
 * Derived progression snapshot in the shape described in PDF §50:
 * { currentLevel, currentXP, nextLevel, requiredXP, nextLevelReward }
 */
export const getProgress = (xp) => {
  const current = getLevelForXP(xp);
  const next = LEVELS.find((l) => l.level === current.level + 1) ?? null;
  const requiredXP = next ? next.minXP : current.minXP;
  const xpRemaining = next ? Math.max(0, next.minXP - xp) : 0;
  // Progress shown as total XP / next-level XP (6,420 / 8,000 → 80%), as in the brief.
  const percent = next ? Math.min(100, Math.floor((xp / next.minXP) * 100)) : 100;
  return {
    currentLevel: current.level,
    currentLevelConfig: current,
    currentXP: xp,
    nextLevel: next?.level ?? null,
    nextLevelConfig: next,
    requiredXP,
    xpRemaining,
    percent,
    nextLevelReward: next?.rewards ?? [],
    isMaxLevel: !next,
  };
};

export const pad2 = (n) => String(n).padStart(2, '0');

export const formatReward = (r) => `${r.amount.toLocaleString('en-IN')} ${r.type}`;
