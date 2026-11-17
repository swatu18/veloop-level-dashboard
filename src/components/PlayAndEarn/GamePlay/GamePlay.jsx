import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Rocket, Timer } from 'lucide-react';
import { GAME_CONFIG } from '../../../data/game.config';
import LevelInfo from '../../LevelInfo/LevelInfo';
import { GemToken, VeCoin, XpOrb } from '../../GameTokens/GameTokens';
import basketImg from '../../../assets/illustrations/basket.webp';
import styles from '../Game.module.css';

/**
 * Interactive "XP CATCHER" gameplay screen matching Mockup Screen 2:
 *  - Header: Back arrow, "XP CATCHER (i)", timer pill ("⏱ 00:18")
 *  - Subtitle: "Catch XP orbs & coins · Score high for better rewards!"
 *  - Vertical glowing light trails + falling XP orbs, V-coins, green gems, and 2X rockets
 *  - Draggable / touch / mouse / keyboard golden wire-mesh collector basket
 *  - Floating "+10 XP" / "+5" catch popups
 *  - Bottom scoreboard: "YOUR SCORE 120" + "+5 VEs | 🚀 2X Multiplier"
 */
export default function GamePlay({ onFinish, onExit }) {
  const [countdown, setCountdown] = useState(GAME_CONFIG.countdownSec);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.durationSec);
  const [score, setScore] = useState(0);
  const [coinsCaught, setCoinsCaught] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [basketX, setBasketX] = useState(50); // percentage 10..90
  const [items, setItems] = useState([]);
  const [popups, setPopups] = useState([]);

  const stageRef = useRef(null);
  const basketXRef = useRef(50);
  const scoreRef = useRef(0);
  const coinsRef = useRef(0);
  const multRef = useRef(1);
  const multUntilRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const finishedRef = useRef(false);

  const updateBasket = useCallback((pct) => {
    const clamped = Math.max(11, Math.min(89, pct));
    basketXRef.current = clamped;
    setBasketX(clamped);
  }, []);

  // 3-2-1 start countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 850);
    return () => clearTimeout(id);
  }, [countdown]);

  // 20-second game timer
  useEffect(() => {
    if (countdown > 0) return;
    if (timeLeft <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        onFinish({ score: scoreRef.current, coinsCollected: coinsRef.current });
      }
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, timeLeft, onFinish]);

  // Keyboard arrow / A-D controls
  useEffect(() => {
    const onDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === 'Escape') onExit();
    };
    const onUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [onExit]);

  // Main 60fps spawn + physics + catch detection loop
  useEffect(() => {
    if (countdown > 0) return;

    let rafId;
    let lastTime = performance.now();
    let spawnTimer = 0;

    const pickKind = () => {
      const r = Math.random() * 100;
      if (r < 45) return 'coin';
      if (r < 78) return 'orb';
      if (r < 94) return 'gem';
      return 'rocket';
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Keyboard movement
      if (keysRef.current.left) updateBasket(basketXRef.current - 62 * dt);
      if (keysRef.current.right) updateBasket(basketXRef.current + 62 * dt);

      // Expire 2X multiplier
      if (multRef.current > 1 && now > multUntilRef.current) {
        multRef.current = 1;
        setMultiplier(1);
      }

      // Spawn falling items
      spawnTimer += dt;
      if (spawnTimer >= 0.42) {
        spawnTimer = 0;
        const kind = pickKind();
        const x = 12 + Math.random() * 76;
        const speed = 34 + Math.random() * 20;
        setItems((prev) => [
          ...prev,
          {
            id: `${now}_${Math.random()}`,
            kind,
            x,
            y: -6,
            speed,
          },
        ]);
      }

      // Advance items & detect catches around basket rim (y: 66..79%)
      setItems((prev) => {
        const next = [];
        for (const it of prev) {
          const ny = it.y + it.speed * dt;
          const inVerticalZone = ny >= 65 && ny <= 79;
          const inHorizontalZone = Math.abs(it.x - basketXRef.current) <= 13.5;

          if (inVerticalZone && inHorizontalZone) {
            if (it.kind === 'rocket') {
              multRef.current = 2;
              multUntilRef.current = now + 5000;
              setMultiplier(2);
              setPopups((p) => [
                ...p.slice(-5),
                { id: it.id, x: it.x, y: 65, text: '2X BOOST!' },
              ]);
            } else {
              const base = GAME_CONFIG.items[it.kind]?.points ?? 5;
              const gained = base * multRef.current;
              scoreRef.current += gained;
              setScore(scoreRef.current);
              if (it.kind === 'coin') {
                coinsRef.current += 1;
                setCoinsCaught(coinsRef.current);
              }
              const label =
                it.kind === 'orb'
                  ? `+${gained} XP`
                  : it.kind === 'gem'
                  ? `+${gained} GEM`
                  : `+${gained} VE`;
              setPopups((p) => [...p.slice(-5), { id: it.id, x: it.x, y: 65, text: label }]);
            }
            continue;
          }

          if (ny < 94) {
            next.push({ ...it, y: ny });
          }
        }
        return next;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [countdown, updateBasket]);

  const handlePointerMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    updateBasket(pct);
  };

  const vesPreview = Math.max(1, Math.min(12, Math.floor(coinsCaught / 2) + 3));

  return (
    <div className={styles.gameScreen}>
      {/* Top bar matching Screen 2 */}
      <div className={styles.gameHeader}>
        <button
          type="button"
          className={styles.gameIconBtn}
          onClick={onExit}
          aria-label="Exit XP Catcher"
        >
          <ArrowLeft size={20} />
        </button>

        <div className={styles.timerPill} aria-live="polite">
          <Timer size={15} className={styles.timerIcon} />
          <span>00:{String(timeLeft).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Title & subtitle */}
      <div className={styles.gameTitleBlock}>
        <div className={styles.gameTitleRow}>
          <h2 className={styles.gameScreenTitle}>XP CATCHER</h2>
          <LevelInfo variant="game" align="right" />
        </div>
        <p className={styles.gameScreenSub}>
          Catch XP orbs &amp; coins
          <br />
          Score high for better rewards!
        </p>
      </div>

      {/* Interactive Catch Arena (Touch + Mouse + Keyboard) */}
      <div
        ref={stageRef}
        className={styles.arena}
        onPointerDown={handlePointerMove}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === 'touch' || e.pointerType === 'mouse') {
            handlePointerMove(e);
          }
        }}
        onTouchMove={handlePointerMove}
      >
        {/* 3-2-1 Countdown Overlay */}
        {countdown > 0 && (
          <div className={styles.countdownOverlay}>
            <span className={styles.countdownNum}>{countdown}</span>
            <span className={styles.countdownHint}>Move basket with finger, mouse or ← →</span>
          </div>
        )}

        {/* Falling items with vertical glow streaks matching Screen 2 */}
        {items.map((it) => (
          <div
            key={it.id}
            className={`${styles.fallingWrap} ${styles[`streak_${it.kind}`]}`}
            style={{ left: `${it.x}%`, top: `${it.y}%` }}
          >
            <span className={styles.lightStreak} aria-hidden="true" />
            {it.kind === 'orb' && <XpOrb size={44} />}
            {it.kind === 'coin' && <VeCoin size={42} />}
            {it.kind === 'gem' && <GemToken size={42} variant="green" />}
            {it.kind === 'rocket' && (
              <span className={styles.rocketBubble}>
                <Rocket size={24} />
              </span>
            )}
          </div>
        ))}

        {/* Catch popups ("+10 XP") */}
        {popups.map((p) => (
          <span
            key={p.id}
            className={styles.catchPopup}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.text}
          </span>
        ))}

        {/* Golden Basket Collector */}
        <div className={styles.basketActor} style={{ left: `${basketX}%` }}>
          <img src={basketImg} alt="Collector basket" className={styles.basketImg} />
          <span className={styles.basketFloorRing} aria-hidden="true" />
        </div>
      </div>

      {/* Bottom Scoreboard matching Screen 2 */}
      <div className={styles.scoreboard}>
        <div className={styles.scoreCard}>
          <span className={styles.scoreLabel}>YOUR SCORE</span>
          <strong className={styles.scoreValue}>{score}</strong>
        </div>

        <div className={styles.boostRow}>
          <div className={styles.boostCell}>
            <VeCoin size={24} />
            <span>+{vesPreview} VEs</span>
          </div>
          <div
            className={`${styles.boostCell} ${
              multiplier > 1 ? styles.boostActive : ''
            }`}
          >
            <span className={styles.rocketEmoji} role="img" aria-label="rocket">
              🚀
            </span>
            <span>{multiplier > 1 ? '2X Active!' : '2X Multiplier'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
