import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getLevelConfig, getProgress, LEVELS } from '../data/levels';
import { EARNINGS } from '../data/earnings';
import { GAME_CONFIG } from '../data/game.config';
import { fetchLevelProgress } from '../services/levelService';
import { claimEarning, claimLevelReward, submitGameResult } from '../services/rewardService';

const STORAGE_KEY = 'veloop_lvl_dashboard_v1';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'earn' | 'rewards' | 'wallet' | 'profile'
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [cooldowns, setCooldowns] = useState({}); // { [earningId]: timestampMs }
  const [claimingId, setClaimingId] = useState(null);

  // Game state
  const [gameOpen, setGameOpen] = useState(false);
  const [gameAvailable, setGameAvailable] = useState(true); // toggleable for Empty State (PDF §40)
  const [playsLeft, setPlaysLeft] = useState(GAME_CONFIG.playsPerDay);
  const [bestScore, setBestScore] = useState(92);

  // Modals / sheets
  const [levelUpModal, setLevelUpModal] = useState(null); // { levelConfig, fromLevel } | null
  const [selectedLevel, setSelectedLevel] = useState(null); // level number for roadmap details sheet
  const [earnDrawerOpen, setEarnDrawerOpen] = useState(false); // Screen 4 full view
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, tone = 'gold') => {
    setToast({ id: Date.now(), msg, tone });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 2600 ? null : prev));
    }, 2700);
  }, []);

  // Load initial data (checks localStorage first after initial skeleton so user sees loading state)
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
    ({ xp = 0, ves = 0, gems = 0, title, icon = 'tasks', category = 'tasks', countTask = false }) => {
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

  // Claim an earning card
  const handleClaimEarning = useCallback(
    async (earningId) => {
      const earning = EARNINGS.find((e) => e.id === earningId);
      if (!earning) return;
      if (earning.status === 'game') {
        setGameOpen(true);
        return;
      }
      if (earning.status !== 'active') {
        showToast(`${earning.title} is coming soon!`, 'muted');
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
          ves: res.ves,
          title: earning.source,
          icon: earning.icon,
          category: earning.id === 'refer' ? 'referrals' : 'tasks',
          countTask: true,
        });
        showToast(`+${res.xp} XP earned from ${earning.title}!`, 'gold');
      } finally {
        setClaimingId(null);
      }
    },
    [awardRewards, cooldowns, showToast]
  );

  // Complete a mini-game run
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

      return {
        score,
        xp: res.xp,
        ves: totalVes,
        title: res.title,
        isNewBest,
      };
    },
    [awardRewards, bestScore]
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
    showToast(`Level ${ String(cfg.level).padStart(2, '0') } rewards claimed!`, 'gold');
    setLevelUpModal(null);
  }, [levelUpModal, showToast]);

  // Demo helpers for testing & screenshot checklist (PDF §56–57)
  const demoActions = useMemo(
    () => ({
      resetToDefault: () => {
        localStorage.removeItem(STORAGE_KEY);
        setGameAvailable(true);
        loadData({ ignoreStorage: true });
      },
      setAlmostLevelUp: () => {
        setUser((prev) => (prev ? { ...prev, currentXP: 7970 } : prev));
        showToast('Demo: XP set to 7,970 / 8,000 (1 claim to Level 05)', 'gold');
      },
      triggerLevelUpModal: () => {
        const nextLvl = getLevelConfig(5);
        setLevelUpModal({ fromLevel: 4, levelConfig: nextLvl });
      },
      triggerLoading: () => {
        setStatus('loading');
        setTimeout(() => setStatus('ready'), 2400);
      },
      triggerError: () => setStatus('error'),
      triggerEmptyActivity: () => {
        setActivity([]);
        setGameAvailable(false);
        setStatus('ready');
        showToast('Demo: Empty activity & unavailable game state enabled', 'muted');
      },
      restoreActivity: () => {
        setGameAvailable(true);
        loadData({ ignoreStorage: true });
      },
      openGame: () => setGameOpen(true),
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
      toast,
      handleClaimEarning,
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
      gameAvailable,
      playsLeft,
      bestScore,
      levelUpModal,
      selectedLevel,
      earnDrawerOpen,
      toast,
      handleClaimEarning,
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
