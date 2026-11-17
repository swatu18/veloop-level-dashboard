/**
 * ⚠️ DEMO XP history (PDF §29, §51). Replace with API data.
 * `minutesAgo` is converted to a real timestamp at load time so the list
 * always looks fresh in the demo.
 */
export const MOCK_ACTIVITY = [
  { id: 'a1', kind: 'XP', amount: 20, title: 'Referral Bonus', icon: 'refer', category: 'referrals', minutesAgo: 35 },
  { id: 'a2', kind: 'XP', amount: 50, title: 'Daily Mission Completed', icon: 'tasks', category: 'tasks', minutesAgo: 128 },
  { id: 'a3', kind: 'XP', amount: 75, title: 'Mini Game Win', icon: 'gamepad', category: 'games', minutesAgo: 170 },
  { id: 'a4', kind: 'VEs', amount: 10, title: 'XP Catcher Reward', icon: 'coin', category: 'games', minutesAgo: 210 },
  { id: 'a5', kind: 'XP', amount: 25, title: 'Streak Bonus', icon: 'flame', category: 'streaks', minutesAgo: 240 },
  { id: 'a6', kind: 'XP', amount: 100, title: 'Watch & Earn', icon: 'watch', category: 'tasks', minutesAgo: 60 * 26 },
  { id: 'a7', kind: 'XP', amount: 25, title: 'Game Challenge', icon: 'magnet', category: 'games', minutesAgo: 60 * 28 },
];

export const ACTIVITY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'games', label: 'Games' },
  { id: 'referrals', label: 'Referrals' },
  { id: 'streaks', label: 'Streaks' },
  { id: 'rewards', label: 'Rewards' },
];
