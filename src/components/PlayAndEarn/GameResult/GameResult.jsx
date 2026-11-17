import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useDashboard } from '../../../context/DashboardContext';
import { useCountUp } from '../../../hooks/useCountUp';
import { pad2 } from '../../../data/levels';
import XPProgress from '../../XPProgress/XPProgress';
import trophyImg from '../../../assets/illustrations/trophy.webp';
import styles from '../Game.module.css';

/**
 * "CHALLENGE COMPLETE!" Result Screen matching Mockup Screen 3 (PDF §8, §44):
 *  - Header: Back arrow + Share icon
 *  - Heading: "CHALLENGE COMPLETE! · Outstanding!"
 *  - 3D Gold Hexagon Star Trophy with laurel wreath on pedestal + confetti particles
 *  - Final Score card: big golden number ("92") + "New Best!" badge
 *  - Two reward boxes: "+30 XP Experience" & "+12 VEs Your Reward"
 *  - Updated Level 04 → Level 05 progress bar ("6,420 / 8,000 XP")
 *  - Golden "Play Again" CTA + "Back to Dashboard" button
 */
export default function GameResult({ result, onReplay, onClose }) {
  const { progress } = useDashboard();
  const animatedScore = useCountUp(result?.score ?? 92, 650);

  const curNum = pad2(progress.currentLevel);
  const nextNum = pad2(progress.nextLevel ?? progress.currentLevel);

  return (
    <div className={styles.resultScreen}>
      {/* Top bar */}
      <div className={styles.gameHeader}>
        <button
          type="button"
          className={styles.gameIconBtn}
          onClick={onClose}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          type="button"
          className={styles.gameIconBtn}
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(
                `I scored ${result.score} in VELOOP XP Catcher!`
              );
            }
          }}
          aria-label="Share score"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Heading */}
      <div className={styles.resultHeading}>
        <h2 className={styles.completeTitle}>
          <span>CHALLENGE</span>
          <strong>COMPLETE!</strong>
        </h2>
        <p className={styles.completeSub}>{result?.title ?? 'Outstanding!'}</p>
      </div>

      {/* 3D Star Trophy on Pedestal */}
      <div className={styles.trophyStage}>
        <span className={styles.trophyGlow} aria-hidden="true" />
        <img
          src={trophyImg}
          alt="Golden star trophy with laurel wreath"
          className={styles.trophyImg}
        />
      </div>

      {/* Final Score + Reward Tiles Card */}
      <div className={styles.finalScoreCard}>
        <span className={styles.finalLabel}>FINAL SCORE</span>

        <div className={styles.finalScoreRow}>
          <strong className={styles.finalBig}>{animatedScore}</strong>
          {result?.isNewBest && <span className={styles.newBestTag}>New Best!</span>}
        </div>

        <div className={styles.rewardSplit}>
          <div className={styles.rewardTile}>
            <strong className={styles.rewardTileVal}>+{result?.xp ?? 30} XP</strong>
            <span className={styles.rewardTileSub}>Experience</span>
          </div>

          <div className={styles.rewardTile}>
            <strong className={styles.rewardTileVal}>+{result?.ves ?? 12} VEs</strong>
            <span className={styles.rewardTileSub}>Your Reward</span>
          </div>
        </div>
      </div>

      {/* Level progress strip */}
      <div className={styles.resultProgress}>
        <div className={styles.resultLvlLabels}>
          <span>Level {curNum}</span>
          <span>Level {nextNum}</span>
        </div>
        <XPProgress
          currentXP={progress.currentXP}
          requiredXP={progress.requiredXP}
          xpRemaining={progress.xpRemaining}
          percent={progress.percent}
          showMeta={false}
        />
        <div className={styles.resultXpCaption}>
          {progress.currentXP.toLocaleString('en-IN')} /{' '}
          {progress.requiredXP.toLocaleString('en-IN')} XP
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.resultButtons}>
        <button type="button" className={styles.playAgainBtn} onClick={onReplay}>
          Play Again
        </button>
        <button type="button" className={styles.backDashBtn} onClick={onClose}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
