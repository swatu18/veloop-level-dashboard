import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getLevelConfig, getProgress, LEVELS } from '../data/levels';
import { EARNINGS } from '../data/earnings';
import { GAME_CONFIG } from '../data/game.config';
import { fetchLevelProgress } from '../services/levelService';
import { claimEarning, claimLevelReward, submitGameResult } from '../services/rewardService';

// Bumped storage key to v2 so stale test state (e.g. 7/8 tasks) resets cleanly to 4/8 & Level 04
const STORAGE_KEY = 'veloop_lvl_dashboard_v2';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'earn' | 'rewards' | 'wallet' | 'profile'
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [cooldowns, setCooldowns] = useState({}); // { [earningId]: timestampMs }
  const [claimingId, setClaimingId] = useState(null);

  // Game & interactive modals state
  const [gameOpen, setGameOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'mini-games' | 'streak' | 'quiz' | null
  const [gameAvailable, setGameAvailable] = useState(true);
  const [playsLeft, setPlaysLeft] = useState(GAME_CONFIG.playsPerDay);
  const [bestScore, setBestScore] = useState(92);

  // Modals / sheets / confetti rain
  const [levelUpModal, setLevelUpModal] = useState(null); // { levelConfig, fromLevel } | null
  const [selectedLevel, setSelectedLevel] = useState(null); // level number for roadmap details sheet
  const [earnDrawerOpen, setEarnDrawerOpen] = useState(false); // Screen 4 full view
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [toast, setToast] = useState(null);

  const fireConfetti = useCallback(() => {
    setConfettiTrigger((k) => k + 1);
  }, []);

  const showToast = useCallback((msg, tone = 'gold') => {
    setToast({ id: Date.now(), msg, tone });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 2600 ? null : prev));
    }, 2700);
  }, []);

  // Load initial data (always starts on Home with Level 04 · 6,420 XP · 4/8 tasks on first visit)
  const loadData = useCallback(async (opts = {}) => {
    setStatus('loading');
    try {
      const data = await fetchLevelProgress(opts);
      const savedRaw = !opts.ignoreStorage ? localStorage.getItem(STORAGE_KEY) : null;
      if (savedRaw && !opts.emptyActivity) {
        try {
          const saved = JSON.parse(savedRaw);
          setUser(saved.user ?? data.user);
          setActivity(saved.activity ?? data.activity);
          setCooldowns(saved.cooldowns ?? {});
          setPlaysLeft(saved.playsLeft ?? GAME_CONFIG.playsPerDay);
          setBestScore(saved.bestScore ?? 92);
        } catch {
          setUser(data.user);
          setActivity(data.activity);
        }
      } else {
        setUser(data.user);
        setActivity(data.activity);
        if (opts.ignoreStorage) {
          setCooldowns({});
          setPlaysLeft(GAME_CONFIG.playsPerDay);
          setBestScore(92);
        }
      }
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Persist changes
  useEffect(() => {
    if (status !== 'ready' || !user) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, activity, cooldowns, playsLeft, bestScore })
      );
    } catch {
      // ignore storage errors
    }
  }, [status, user, activity, cooldowns, playsLeft, bestScore]);

  const progress = useMemo(() => getProgress(user?.currentXP ?? 6420), [user?.currentXP]);

  // Award XP & VEs helper + automatic level-up detection
  const awardRewards = useCallback(
    ({
      xp = 0,
      ves = 0,
      gems = 0,
      title,
      icon = 'tasks',
      category = 'tasks',
      countTask = false,
      incrementStreak = false,
    }) => {
      setUser((prev) => {
        if (!prev) return prev;
        const oldProgress = getProgress(prev.currentXP);
        const nextXP = prev.currentXP + xp;
        const newProgress = getProgress(nextXP);

        if (newProgress.currentLevel > oldProgress.currentLevel) {
          const reachedConfig = getLevelConfig(newProgress.currentLevel);
          setTimeout(() => {
            setLevelUpModal({
              fromLevel: oldProgress.currentLevel,
              levelConfig: reachedConfig,
            });
          }, 350);
        }

        return {
          ...prev,
          currentXP: nextXP,
          wallet: {
            ...prev.wallet,
            VEs: (prev.wallet?.VEs ?? 0) + ves,
            Gems: (prev.wallet?.Gems ?? 0) + gems,
          },
          today: {
            ...prev.today,
            xpEarned: (prev.today?.xpEarned ?? 0) + xp,
            vesEarned: (prev.today?.vesEarned ?? 0) + ves,
            tasksDone: countTask
              ? Math.min(prev.today.tasksTotal, (prev.today.tasksDone ?? 0) + 1)
              : prev.today.tasksDone,
            streakDays: incrementStreak
              ? (prev.today?.streakDays ?? 7) + 1
              : prev.today?.streakDays ?? 7,
          },
        };
      });

      const entries = [];
      const now = Date.now();
      if (xp > 0) {
        entries.push({
          id: `xp_${now}_${Math.random().toString(36).slice(2, 6)}`,
          kind: 'XP',
          amount: xp,
          title,
          icon,
          category,
          at: now,
        });
      }
      if (ves > 0) {
        entries.push({
          id: `ve_${now}_${Math.random().toString(36).slice(2, 6)}`,
          kind: 'VEs',
          amount: ves,
          title: `${title} Reward`,
          icon: 'coin',
          category: 'rewards',
          at: now,
        });
      }
      if (entries.length) {
        setActivity((prev) => [...entries, ...prev]);
      }
    },
    []
  );

  // Claim or open any earning opportunity
  const handleClaimEarning = useCallback(
    async (earningId) => {
      const earning = EARNINGS.find((e) => e.id === earningId);
      if (!earning) return;

      // Open interactive modals/games for watch, daily, refer, game, mini-game, streak, and quiz
      if (earning.status === 'game') {
        setGameOpen(true);
        return;
      }
      if (
        earning.status === 'watch' ||
        earning.status === 'daily' ||
        earning.status === 'refer' ||
        earning.status === 'mini-game' ||
        earning.status === 'streak' ||
        earning.status === 'quiz'
      ) {
        if ((cooldowns[earningId] ?? 0) > Date.now() && earning.status !== 'mini-game') {
          showToast(`${earning.title} is on cooldown!`, 'muted');
          return;
        }
        setActiveModal(earning.status === 'mini-game' ? 'mini-games' : earning.status);
        return;
      }

      if ((cooldowns[earningId] ?? 0) > Date.now()) return;

      setClaimingId(earningId);
      try {
        const res = await claimEarning(earning);
        if (earning.cooldownMs > 0) {
          setCooldowns((prev) => ({ ...prev, [earningId]: Date.now() + earning.cooldownMs }));
        }
        awardRewards({
          xp: res.xp,
          ves: earning.ves ?? res.ves ?? 0,
          title: earning.source,
          icon: earning.icon,
          category: earning.id === 'refer' ? 'referrals' : 'tasks',
          countTask: true,
        });
        fireConfetti();
        showToast(
          `🎉 +${res.xp} XP${earning.ves ? ` & +${earning.ves} VEs` : ''} earned from ${
            earning.title
          }!`,
          'gold'
        );
      } finally {
        setClaimingId(null);
      }
    },
    [awardRewards, cooldowns, fireConfetti, showToast]
  );

  // Complete Watch & Earn Video, Daily Missions Checklist, or Refer & Earn Modal
  const handleCompleteActionModal = useCallback(
    ({ earningId, xp, ves = 0, title, icon = 'tasks', category = 'tasks' }) => {
      const earning = EARNINGS.find((e) => e.id === earningId);
      if (earning?.cooldownMs > 0) {
        setCooldowns((prev) => ({ ...prev, [earningId]: Date.now() + earning.cooldownMs }));
      }
      awardRewards({
        xp,
        ves,
        title,
        icon,
        category,
        countTask: true,
      });
      fireConfetti();
      showToast(`🎉 +${xp} XP & +${ves} VEs unlocked from ${title}!`, 'gold');
    },
    [awardRewards, fireConfetti, showToast]
  );

  // Complete XOX Tic-Tac-Toe, VE Vault Memory Match, Vault Sprint, or Quick Quiz
  const handleCompleteMiniGame = useCallback(
    ({ xp = 75, ves = 15, title = 'Mini Game Win' }) => {
      awardRewards({
        xp,
        ves,
        title,
        icon: 'gamepad',
        category: 'games',
        countTask: true,
      });
      fireConfetti();
      showToast(`🎉 +${xp} XP & +${ves} VEs unlocked from ${title}!`, 'gold');
    },
    [awardRewards, fireConfetti, showToast]
  );

  // Claim 7-Day Streak Bonus
  const handleClaimStreak = useCallback(() => {
    if ((cooldowns.streak ?? 0) > Date.now()) return;
    setCooldowns((prev) => ({ ...prev, streak: Date.now() + 24 * 60 * 60 * 1000 }));
    awardRewards({
      xp: 25,
      ves: 10,
      title: 'Streak Bonus',
      icon: 'flame',
      category: 'streaks',
      countTask: true,
      incrementStreak: false,
    });
    fireConfetti();
    showToast('🔥 +25 XP & +10 VEs claimed from 7-Day Streak Bonus!', 'gold');
  }, [awardRewards, cooldowns, fireConfetti, showToast]);

  // Complete an XP Catcher mini-game run
  const handleCompleteGame = useCallback(
    async ({ score, coinsCollected }) => {
      const res = await submitGameResult({ score });
      const totalVes = res.ves + Math.min(10, Math.floor(coinsCollected / 2));
      const isNewBest = score > bestScore;
      if (isNewBest) setBestScore(score);
      setPlaysLeft((p) => Math.max(0, p - 1));

      awardRewards({
        xp: res.xp,
        ves: totalVes,
        title: 'XP Catcher Win',
        icon: 'gamepad',
        category: 'games',
        countTask: false,
      });
      fireConfetti();

      return {
        score,
        xp: res.xp,
        ves: totalVes,
        title: res.title,
        isNewBest,
      };
    },
    [awardRewards, bestScore, fireConfetti]
  );

  // Claim level-up modal rewards
  const handleClaimLevelUp = useCallback(async () => {
    if (!levelUpModal) return;
    const cfg = levelUpModal.levelConfig;
    await claimLevelReward(cfg);
    let ves = 0;
    let gems = 0;
    for (const r of cfg.rewards) {
      if (r.type === 'VEs') ves += r.amount;
      if (r.type === 'Gems') gems += r.amount;
    }
    setUser((prev) =>
      prev
        ? {
            ...prev,
            wallet: {
              ...prev.wallet,
              VEs: (prev.wallet?.VEs ?? 0) + ves,
              Gems: (prev.wallet?.Gems ?? 0) + gems,
            },
            today: {
              ...prev.today,
              vesEarned: (prev.today?.vesEarned ?? 0) + ves,
            },
          }
        : prev
    );
    fireConfetti();
    showToast(`🎉 Level ${String(cfg.level).padStart(2, '0')} rewards claimed!`, 'gold');
    setLevelUpModal(null);
  }, [levelUpModal, fireConfetti, showToast]);

  const demoActions = useMemo(
    () => ({
      resetToDefault: () => {
        localStorage.removeItem(STORAGE_KEY);
        setGameAvailable(true);
        loadData({ ignoreStorage: true });
        showToast('Progress reset to Level 04 · 6,420 XP · 4/8 Tasks', 'gold');
      },
    }),
    [loadData, showToast]
  );

  const value = useMemo(
    () => ({
      status,
      activeTab,
      setActiveTab,
      user,
      progress,
      levels: LEVELS,
      earnings: EARNINGS,
      activity,
      cooldowns,
      claimingId,
      gameOpen,
      setGameOpen,
      activeModal,
      setActiveModal,
      gameAvailable,
      setGameAvailable,
      playsLeft,
      bestScore,
      levelUpModal,
      setLevelUpModal,
      selectedLevel,
      setSelectedLevel,
      earnDrawerOpen,
      setEarnDrawerOpen,
      confettiTrigger,
      fireConfetti,
      toast,
      handleClaimEarning,
      handleCompleteActionModal,
      handleCompleteMiniGame,
      handleClaimStreak,
      handleCompleteGame,
      handleClaimLevelUp,
      retryLoad: () => loadData(),
      demoActions,
    }),
    [
      status,
      activeTab,
      user,
      progress,
      activity,
      cooldowns,
      claimingId,
      gameOpen,
      activeModal,
      gameAvailable,
      playsLeft,
      bestScore,
      levelUpModal,
      selectedLevel,
      earnDrawerOpen,
      confettiTrigger,
      fireConfetti,
      toast,
      handleClaimEarning,
      handleCompleteActionModal,
      handleCompleteMiniGame,
      handleClaimStreak,
      handleCompleteGame,
      handleClaimLevelUp,
      loadData,
      demoActions,
    ]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};
