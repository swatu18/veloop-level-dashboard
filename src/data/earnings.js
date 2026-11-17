/**
 * Earning opportunities (PDF §22–24, §47).
 *
 * status:
 *  - 'active'      → existing / supported earning route (preserved from current dashboard)
 *  - 'game'        → opens the XP Catcher mini-game
 *  - 'coming-soon' → new concept, NOT yet supported by the product team
 *
 * ⚠️ XP amounts are DEMO values – not official reward rules.
 */
export const EARNINGS = [
  {
    id: 'watch',
    title: 'Watch & Earn',
    short: 'Watch & Earn',
    description: 'Watch ads and earn',
    longDescription: 'Watch short sponsored videos to earn XP.',
    xp: 50,
    xpLabel: '+50 XP',
    icon: 'watch',
    status: 'active',
    cta: 'Start Watching',
    cooldownMs: 5 * 60 * 60 * 1000,
    source: 'Watch & Earn',
  },
  {
    id: 'daily',
    title: 'Daily Missions',
    short: 'Daily Tasks',
    description: 'Complete daily tasks',
    longDescription: "Complete today's daily activities.",
    xp: 30,
    xpLabel: '+30 XP',
    icon: 'tasks',
    status: 'active',
    cta: 'Claim Mission',
    cooldownMs: 24 * 60 * 60 * 1000,
    source: 'Daily Mission',
  },
  {
    id: 'refer',
    title: 'Refer & Earn',
    short: 'Refer & Earn',
    description: 'Invite friends & earn',
    longDescription: 'Invite friends and earn XP for every successful referral.',
    xp: 100,
    xpLabel: '+100 XP',
    icon: 'refer',
    status: 'active',
    cta: 'Invite Friends',
    cooldownMs: 0,
    source: 'Referral Bonus',
  },
  {
    id: 'xp-catcher',
    title: 'XP Catcher',
    short: 'XP Catcher',
    description: 'Catch orbs & coins',
    longDescription: '20-second skill game. Score high for better rewards.',
    xp: 30,
    xpLabel: 'Up to +30 XP',
    icon: 'magnet',
    status: 'game',
    cta: 'Play Now',
    source: 'XP Catcher',
  },
  {
    id: 'mini-games',
    title: 'Mini Games',
    short: 'Mini Games',
    description: 'Play games & win',
    longDescription: 'More skill-based mini-games are on the way.',
    xp: 75,
    xpLabel: '+75 XP',
    icon: 'gamepad',
    status: 'coming-soon',
    cta: 'Coming Soon',
    source: 'Mini Game',
  },
  {
    id: 'streak',
    title: 'Streak Bonus',
    short: 'Streak Bonus',
    description: 'Maintain your streak',
    longDescription: 'Keep your daily streak alive for bonus XP.',
    xp: 25,
    xpLabel: '+25 XP',
    icon: 'flame',
    status: 'coming-soon',
    cta: 'Coming Soon',
    source: 'Streak Bonus',
  },
  {
    id: 'daily-challenge',
    title: 'Daily Challenge',
    short: 'Daily Challenge',
    description: "Complete today's challenge",
    longDescription: "Complete today's special challenge.",
    xp: 50,
    xpLabel: 'Up to +50 XP',
    icon: 'target',
    status: 'coming-soon',
    cta: 'Coming Soon',
    source: 'Daily Challenge',
  },
  {
    id: 'weekly-quest',
    title: 'Weekly Quest',
    short: 'Weekly Quest',
    description: 'Complete a weekly objective',
    longDescription: 'Complete weekly quests for big XP rewards.',
    xp: 200,
    xpLabel: 'Up to +200 XP',
    icon: 'flag',
    status: 'coming-soon',
    cta: 'Coming Soon',
    source: 'Weekly Quest',
  },
  {
    id: 'quiz',
    title: 'Quick Quiz',
    short: 'Quick Quiz',
    description: 'Answer a few questions',
    longDescription: 'Answer a few quick questions to earn XP.',
    xp: 20,
    xpLabel: '+20 XP',
    icon: 'quiz',
    status: 'coming-soon',
    cta: 'Coming Soon',
    source: 'Quick Quiz',
  },
];

/** The six quick actions shown in the mobile "Earn More" grid (design screen 1). */
export const QUICK_EARN_IDS = ['watch', 'daily', 'refer', 'xp-catcher', 'mini-games', 'streak'];

/** The rows shown on the "Earn & Level Up" list (design screen 4). */
export const EARN_LIST_IDS = ['watch', 'daily', 'refer', 'mini-games', 'streak', 'xp-catcher'];

export const getEarning = (id) => EARNINGS.find((e) => e.id === id);
