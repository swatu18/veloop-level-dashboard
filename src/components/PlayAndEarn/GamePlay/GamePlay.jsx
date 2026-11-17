import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Rocket, Timer } from 'lucide-react';
import { GAME_CONFIG } from '../../../data/game.config';
import LevelInfo from '../../LevelInfo/LevelInfo';
import { GemToken, VeCoin, XpOrb } from '../../GameTokens/GameTokens';
import basketImg from '../../../assets/illustrations/basket.webp';
import styles from '../Game.module.css';

/**
 * Interactive "XP CATCHER" gameplay screen matching Mockup Screen 2:
 *  - Zero-Lag Direct DOM Basket Tracking: pointer, touch, and keyboard movement
 *    updates the golden bowl's CSS transform directly at 60–120fps without waiting
 *    for React re-renders, and listens on `window` so dragging never gets stuck.
 *  - Falling 3D XP Orbs, V-Coins, Emerald Gems & Rockets with vertical neon-gold,
 *    purple, and emerald light beams + ambient floating background particles.
 */
export default function GamePlay({ onFinish, onExit }) {
  const [countdown, setCountdown] = useState(GAME_CONFIG.countdownSec);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.durationSec);
  const [score, setScore] = useState(0);
  const [coinsCaught, setCoinsCaught] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [items, setItems] = useState([]);
  const [popups, setPopups] = useState([]);

  const stageRef = useRef(null);
  const basketDomRef = useRef(null);
  const basketXRef = useRef(50); // percentage 12..88
  const draggingRef = useRef(false);
  const scoreRef = useRef(0);
  const coinsRef = useRef(0);
  const multRef = useRef(1);
  const multUntilRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const finishedRef = useRef(false);

  // Instant direct-DOM basket position update (zero React re-render overhead)
  const applyBasketX = useCallback((pct) => {
    const clamped = Math.max(12, Math.min(88, pct));
    basketXRef.current = clamped;
    if (basketDomRef.current) {
      basketDomRef.current.style.left = `${clamped}%`;
    }
  }, []);

  // 3-2-1 start countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 800);
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

  // Window-level pointer, mouse, touch & keyboard tracking so basket NEVER gets stuck
  useEffect(() => {
    const moveFromClientX = (clientX) => {
      if (!stageRef.current || typeof clientX !== 'number') return;
      const rect = stageRef.current.getBoundingClientRect();
      if (!rect.width) return;
      const pct = ((clientX - rect.left) / rect.width) * 100;
      applyBasketX(pct);
    };

    const onPointerMove = (e) => {
      if (draggingRef.current || e.pointerType === 'mouse') {
        moveFromClientX(e.clientX);
      }
    };
    const onPointerUp = () => {
      draggingRef.current = false;
    };
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        moveFromClientX(e.touches[0].clientX);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === 'Escape') onExit();
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [applyBasketX, onExit]);

  // Main 60fps spawn + physics + catch detection loop
  useEffect(() => {
    if (countdown > 0) return;

    let rafId;
    let lastTime = performance.now();
    let spawnTimer = 0;
    let itemsList = [];

    const pickKind = () => {
      const r = Math.random() * 100;
      if (r < 44) return 'coin';
      if (r < 77) return 'orb';
      if (r < 94) return 'gem';
      return 'rocket';
    };

    const tick = (now) => {
      const dt = Math.min(0.045, (now - lastTime) / 1000);
      lastTime = now;

      // Smooth keyboard movement
      if (keysRef.current.left) applyBasketX(basketXRef.current - 68 * dt);
      if (keysRef.current.right) applyBasketX(basketXRef.current + 68 * dt);

      // Expire 2X multiplier
      if (multRef.current > 1 && now > multUntilRef.current) {
        multRef.current = 1;
        setMultiplier(1);
      }

      // Spawn falling items
      spawnTimer += dt;
      if (spawnTimer >= 0.4) {
        spawnTimer = 0;
        const kind = pickKind();
        const x = 13 + Math.random() * 74;
        const speed = 35 + Math.random() * 19;
        itemsList.push({
          id: `${now}_${Math.random()}`,
          kind,
          x,
          y: -6,
          speed,
        });
      }

      // Advance items & detect catches around the wide golden bowl rim
      const next = [];
      let caughtSomething = false;

      for (const it of itemsList) {
        const ny = it.y + it.speed * dt;
        const inVerticalZone = ny >= 65 && ny <= 83;
        const inHorizontalZone = Math.abs(it.x - basketXRef.current) <= 18;

        if (inVerticalZone && inHorizontalZone) {
          caughtSomething = true;
          if (it.kind === 'rocket') {
            multRef.current = 2;
            multUntilRef.current = now + 5000;
            setMultiplier(2);
            setPopups((p) => [
              ...p.slice(-5),
              { id: it.id, x: it.x, y: 64, text: '🚀 2X BOOST!' },
            ]);
          } else {
            const base = GAME_CONFIG.items[it.kind]?.points ?? 5;
            const gained = base * multRef.current;
            scoreRef.current += gained;
            if (it.kind === 'coin') {
              coinsRef.current += 1;
            }
            const label =
              it.kind === 'orb'
                ? `+${gained} XP`
                : it.kind === 'gem'
                ? `+${gained} GEM`
                : `+${gained} VE`;
            setPopups((p) => [...p.slice(-5), { id: it.id, x: it.x, y: 64, text: label }]);
          }
          continue;
        }

        if (ny < 95) {
          next.push({ ...it, y: ny });
        }
      }

      itemsList = next;
      setItems([...itemsList]);
      if (caughtSomething) {
        setScore(scoreRef.current);
        setCoinsCaught(coinsRef.current);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [countdown, applyBasketX]);

  const onArenaDown = (e) => {
    draggingRef.current = true;
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    applyBasketX(((clientX - rect.left) / rect.width) * 100);
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

      {/* Interactive Catch Arena with Ambient Background Orbs & Glowing Beams */}
      <div
        ref={stageRef}
        className={styles.arena}
        onPointerDown={onArenaDown}
        onTouchStart={onArenaDown}
      >
        {/* Ambient hovering background bokeh orbs */}
        <div className={styles.ambientBg} aria-hidden="true">
          <span className={`${styles.ambientOrb} ${styles.amb1}`} />
          <span className={`${styles.ambientOrb} ${styles.amb2}`} />
          <span className={`${styles.ambientOrb} ${styles.amb3}`} />
        </div>

        {/* 3-2-1 Countdown Overlay */}
        {countdown > 0 && (
          <div className={styles.countdownOverlay}>
            <span className={styles.countdownNum}>{countdown}</span>
            <span className={styles.countdownHint}>
              Slide anywhere with finger, mouse or ← → keys
            </span>
          </div>
        )}

        {/* Falling items with glowing vertical light trails matching Screen 2 */}
        {items.map((it) => (
          <div
            key={it.id}
            className={`${styles.fallingWrap} ${styles[`streak_${it.kind}`]}`}
            style={{ left: `${it.x}%`, top: `${it.y}%` }}
          >
            <span className={styles.lightStreak} aria-hidden="true" />
            <span className={styles.itemHalo} aria-hidden="true" />
            {it.kind === 'orb' && <XpOrb size={44} />}
            {it.kind === 'coin' && <VeCoin size={42} />}
            {it.kind === 'gem' && <GemToken size={44} variant="green" />}
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

        {/* Wide Shallow 3D Golden Bowl Collector */}
        <div
          ref={basketDomRef}
          className={styles.basketActor}
          style={{ left: '50%' }}
        >
          <img
            src={basketImg}
            alt="Golden collector bowl"
            className={styles.basketImg}
            draggable={false}
          />
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
