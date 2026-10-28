import { useCallback, useEffect, useRef, useState } from 'react';
import { LEVELS, PLAYER, INITIAL_ACTIVITY } from '../data/levelData';

export function levelIndex(xp) {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.startXP) idx = i; });
  return idx;
}

export function deriveProgress(xp) {
  const idx = levelIndex(xp);
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1] ?? null;
  return {
    level: cur.level,
    name: cur.name,
    xp,
    nextLevel: next?.level ?? null,
    nextName: next?.name ?? null,
    nextXP: next?.startXP ?? null,
    nextReward: next?.reward ?? null,
    xpToNext: next ? next.startXP - xp : 0,
    percent: next ? ((xp - cur.startXP) / (next.startXP - cur.startXP)) * 100 : 100,
    isMax: !next,
  };
}

/**
 * Single source of truth for the dashboard.
 * Today it serves demo data; swap the timeout for a real fetch later.
 * `forced` lets you preview UI states: loading | error | empty | nogame.
 */
export default function useLevelProgress(forced) {
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);
  const [player, setPlayer] = useState(PLAYER);
  const [activity, setActivity] = useState(forced === 'empty' ? [] : INITIAL_ACTIVITY);
  const [levelUp, setLevelUp] = useState(null);
  const playerRef = useRef(player);
  playerRef.current = player;

  useEffect(() => {
    setStatus('loading');
    if (forced === 'loading') return undefined;
    const t = setTimeout(() => {
      setStatus(forced === 'error' && attempt === 0 ? 'error' : 'ready');
    }, 900);
    return () => clearTimeout(t);
  }, [forced, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  const applyReward = useCallback(({ xp = 0, ve = 0, title, icon = 'game' }) => {
    const p = playerRef.current;
    const newXP = p.xp + xp;
    const before = levelIndex(p.xp);
    const after = levelIndex(newXP);
    setPlayer({ ...p, xp: newXP, ve: p.ve + ve });
    setActivity((a) => [{ id: `n${Date.now()}`, icon, title, xp, ve, time: 'Just now' }, ...a]);
    if (after > before) {
      const reward = LEVELS.slice(before + 1, after + 1).reduce(
        (s, l) => ({ ve: s.ve + (l.reward?.ve ?? 0), gems: s.gems + (l.reward?.gems ?? 0) }),
        { ve: 0, gems: 0 },
      );
      setLevelUp({ level: LEVELS[after].level, name: LEVELS[after].name, reward });
    }
  }, []);

  const claimLevelUp = useCallback(() => {
    const lu = levelUp;
    if (lu) setPlayer((p) => ({ ...p, ve: p.ve + lu.reward.ve, gems: p.gems + lu.reward.gems }));
    setLevelUp(null);
  }, [levelUp]);

  const progress = deriveProgress(player.xp);
  const todayXP = activity.reduce((s, a) => s + a.xp, 0);
  const todayVE = activity.reduce((s, a) => s + a.ve, 0);

  return {
    status, retry, player, progress, activity, levelUp,
    applyReward, claimLevelUp, todayXP, todayVE,
    gameAvailable: forced !== 'nogame',
  };
}
