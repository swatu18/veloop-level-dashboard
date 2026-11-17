import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './LevelInfo.module.css';

/**
 * Accessible `[i]` info icon with hover + click + keyboard tooltip (PDF §31–32).
 *
 * Pre-configured presets:
 *  - variant="level"  (PDF §31)
 *  - variant="reward" (PDF §32)
 *  - variant="earn"
 *  - or pass a custom `text` / `title`.
 */
const PRESETS = {
  level: {
    title: 'About VELOOP Levels',
    text: "XP helps you progress through VELOOP Rewards levels. As you reach new levels, you may unlock additional rewards and experiences according to the platform's level system.",
  },
  reward: {
    title: 'Next-Level Reward Info',
    text: 'The displayed reward is associated with the next level according to the current reward configuration.',
  },
  earn: {
    title: 'Earning XP & Cooldowns',
    text: 'Complete eligible activities to earn XP toward your next level. Some activities reset after a cooldown period. Items marked Coming Soon are planned concepts.',
  },
  game: {
    title: 'XP Catcher Rules',
    text: 'Catch falling XP orbs, VE coins and gems inside the 20-second timer. Skill-based engagement challenge — demo reward values shown.',
  },
};

export default function LevelInfo({ variant = 'level', title, text, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const tooltipId = useId();
  const preset = PRESETS[variant] ?? PRESETS.level;
  const heading = title ?? preset.title;
  const body = text ?? preset.text;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span
      ref={wrapRef}
      className={styles.wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label={heading}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        i
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className={`${styles.popover} ${align === 'left' ? styles.alignLeft : styles.alignRight}`}
        >
          <strong className={styles.popoverTitle}>{heading}</strong>
          <span className={styles.popoverText}>{body}</span>
        </span>
      )}
    </span>
  );
}
