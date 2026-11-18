import React, { useCallback, useState } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import GameStart from '../GameStart/GameStart';
import GamePlay from '../GamePlay/GamePlay';
import GameResult from '../GameResult/GameResult';
import styles from '../Game.module.css';

/**
 * Orchestrates all XP Catcher game states (PDF §44):
 *  - Start state (inline dashboard promo + rules card)
 *  - Gameplay state (full-screen phone-framed modal matching Screen 2)
 *  - Completion & Reward result state (matching Screen 3)
 *  - Reset / Replay state
 */
export default function GameContainer() {
  const { gameOpen, setGameOpen, handleCompleteGame, fireConfetti, lastResultSeen } = useDashboard();
  const [phase, setPhase] = useState('play'); // 'play' | 'result'
  const [lastResult, setLastResult] = useState(null);
  const [runKey, setRunKey] = useState(1);

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

  return (
    <>
      <GameStart />

      {gameOpen && (
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
      )}
    </>
  );
}
