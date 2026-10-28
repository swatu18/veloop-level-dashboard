/**
 * DEMO DATA: every value in this file is a development placeholder.
 * Replace the exports with the backend response when the API is ready
 * (keep the same shapes and the UI will not need changes).
 */

// Each level: where it starts (total XP) and the reward granted for reaching it.
export const LEVELS = [
  { level: 1, name: 'Starter', startXP: 0, reward: null },
  { level: 2, name: 'Explorer', startXP: 500, reward: { ve: 100, gems: 0 } },
  { level: 3, name: 'Collector', startXP: 1500, reward: { ve: 150, gems: 5 } },
  { level: 4, name: 'Achiever', startXP: 3200, reward: { ve: 300, gems: 10 } },
  { level: 5, name: 'Trailblazer', startXP: 5200, reward: { ve: 500, gems: 25 } },
  { level: 6, name: 'Champion', startXP: 8000, reward: { ve: 750, gems: 30 } },
  { level: 7, name: 'Elite', startXP: 11000, reward: { ve: 1000, gems: 40 } },
  { level: 8, name: 'Master', startXP: 15000, reward: { ve: 1500, gems: 60 } },
];

export const PLAYER = {
  name: 'VeLooper',
  xp: 6420,
  ve: 1280,
  gems: 35,
  streak: 7,
  tasksDone: 4,
  tasksTotal: 8,
};

export const LEVEL_PERKS = [
  { icon: 'trend', text: 'Higher daily XP limit' },
  { icon: 'target', text: 'Access to new challenges' },
  { icon: 'gift', text: 'Better reward opportunities' },
];

export const INITIAL_ACTIVITY = [
  { id: 'a1', icon: 'referral', title: 'Referral Bonus', xp: 20, ve: 0, time: 'Today, 10:45 AM' },
  { id: 'a2', icon: 'mission', title: 'Daily Mission Completed', xp: 50, ve: 0, time: 'Today, 09:12 AM' },
  { id: 'a3', icon: 'game', title: 'Mini Game Win', xp: 75, ve: 0, time: 'Today, 08:30 AM' },
  { id: 'a4', icon: 'catcher', title: 'XP Catcher Reward', xp: 10, ve: 10, time: 'Today, 07:50 AM' },
  { id: 'a5', icon: 'streak', title: 'Streak Bonus', xp: 25, ve: 0, time: 'Today, 07:20 AM' },
  { id: 'a6', icon: 'watch', title: 'Watch & Earn', xp: 35, ve: 25, time: 'Today, 07:05 AM' },
];

/* ---------- XP Catcher (frontend prototype) ---------- */
export const GAME_CONFIG = {
  isDemo: true, // values below are NOT official reward rules
  name: 'XP Catcher',
  durationSec: 20,
  dailyAttempts: 3,
  demoBest: 74,
  streakForMultiplier: 6,
  multiplier: 2,
  points: { xp: 6, coin: 4, gem: 10 },
  // highest matching `min` wins
  rewardTiers: [
    { min: 120, xp: 40, ve: 20 },
    { min: 80, xp: 30, ve: 12 },
    { min: 40, xp: 15, ve: 5 },
    { min: 0, xp: 5, ve: 0 },
  ],
};

const MAX_GAME_XP = Math.max(...GAME_CONFIG.rewardTiers.map((t) => t.xp));

/*
 * status: 'live' = existing/approved route, 'soon' = concept, not yet supported.
 * Flip `status` when the product team approves a feature.
 */
export const EARN_FEATURES = [
  { id: 'watch', icon: 'watch', tone: 'purple', title: 'Watch & Earn', desc: 'Watch ads and earn', reward: '+50 XP', status: 'live' },
  { id: 'daily', icon: 'tasks', tone: 'green', title: 'Daily Missions', desc: 'Complete daily tasks', reward: '+30 XP', status: 'live' },
  { id: 'refer', icon: 'refer', tone: 'gold', title: 'Refer & Earn', desc: 'Invite friends and earn', reward: '+100 XP', status: 'live' },
  { id: 'catcher', icon: 'catcher', tone: 'blue', title: 'XP Catcher', desc: 'Catch orbs and coins', reward: `Up to +${MAX_GAME_XP} XP`, status: 'live', action: 'game' },
  { id: 'streak', icon: 'streak', tone: 'orange', title: 'Streak Bonus', desc: 'Keep your streak alive', reward: '+25 XP', status: 'live' },
  { id: 'games', icon: 'game', tone: 'blue', title: 'Mini Games', desc: 'More games are on the way', reward: '+75 XP', status: 'soon' },
  { id: 'quiz', icon: 'quiz', tone: 'purple', title: 'Quick Quiz', desc: 'Answer a few questions', reward: 'XP', status: 'soon' },
  { id: 'weekly', icon: 'weekly', tone: 'green', title: 'Weekly Quest', desc: 'Finish a weekly objective', reward: 'XP + VEs', status: 'soon' },
  { id: 'hunt', icon: 'hunt', tone: 'gold', title: 'Reward Hunt', desc: 'Find hidden rewards', reward: 'VEs', status: 'soon' },
];
