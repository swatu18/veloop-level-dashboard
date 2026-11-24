import React, { useCallback, useEffect, useState } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import GameStart from '../GameStart/GameStart';
import GamePlay from '../GamePlay/GamePlay';
import GameResult from '../GameResult/GameResult';
import styles from '../Game.module.css';

/**
 * Full-screen / phone-framed XP Catcher overlay modal (Screens 2 & 3).
 * Mounted globally so launching XP Catcher works from ANY tab or drawer.
 */
export function GameModal() {
  const { gameOpen, setGameOpen, handleCompleteGame, fireConfetti } = useDashboard();
  const [phase, setPhase] = useState('play'); // 'play' | 'result'
  const [lastResult, setLastResult] = useState(null);
  const [runKey, setRunKey] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (gameOpen && params.get('game') === 'result' && !lastResult) {
      setLastResult({
        score: 92,
        xp: 30,
        ves: 12,
        title: 'Outstanding!',
        isNewBest: true,
      });
      setPhase('result');
      fireConfetti();
    }
  }, [gameOpen, lastResult, fireConfetti]);

  const onFinish = useCallback(
    async ({ score, coinsCollected }) => {
      const res = await handleCompleteGame({ score, coinsCollected });
      setLastResult(res);
      setPhase('result');
    },
    [handleCompleteGame]
  );

  const handleClose = useCallback(() => {
    setGameOpen(false);
    if (phase === 'result') {
      fireConfetti();
    }
    setPhase('play');
  }, [setGameOpen, phase, fireConfetti]);

  const handleReplay = useCallback(() => {
    setRunKey((k) => k + 1);
    setPhase('play');
  }, []);

  if (!gameOpen) return null;

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="XP Catcher Mini-Game"
    >
      <div className={styles.phoneFrame}>
        {phase === 'play' ? (
          <GamePlay key={runKey} onFinish={onFinish} onExit={handleClose} />
        ) : (
          <GameResult
            result={lastResult}
            onReplay={handleReplay}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Inline XP Catcher Start & Rules card for the Dashboard & Earn views (PDF §44).
 */
export default function GameContainer() {
  return <GameStart />;
}
