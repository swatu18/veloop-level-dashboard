import React, { useEffect, useState } from 'react';
import { Check, Flame, HelpCircle, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { GemToken, GraphicIcon, VeCoin, XpOrb } from '../GameTokens/GameTokens';
import styles from './InteractiveModals.module.css';

/* ==========================================================================
   1. VE Vault Memory Match Mini-Game Modal ("Mini Games" -> +75 XP & +15 VEs)
   ========================================================================== */
const CARD_SYMBOLS = [
  { kind: 'orb', label: 'XP Orb' },
  { kind: 'coin', label: 'VE Coin' },
  { kind: 'gem-green', label: 'Emerald' },
  { kind: 'gem-purple', label: 'Amethyst' },
  { kind: 'flame', label: 'Streak' },
  { kind: 'star', label: 'Star Boost' },
];

const buildDeck = () =>
  [...CARD_SYMBOLS, ...CARD_SYMBOLS]
    .map((item, idx) => ({ ...item, uid: `${item.kind}_${idx}`, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort);

export function MemoryGameModal() {
  const { activeModal, setActiveModal, handleCompleteMiniGame } = useDashboard();
  const [deck, setDeck] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]); // indices
  const [matched, setMatched] = useState([]); // kinds
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  const isOpen = activeModal === 'mini-games';

  useEffect(() => {
    if (isOpen) {
      setDeck(buildDeck());
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setCompleted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onCardClick = (idx) => {
    if (flipped.length >= 2 || flipped.includes(idx)) return;
    const card = deck[idx];
    if (matched.includes(card.kind)) return;

    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      if (deck[firstIdx].kind === deck[secondIdx].kind) {
        const nextMatched = [...matched, deck[firstIdx].kind];
        setMatched(nextMatched);
        setFlipped([]);
        if (nextMatched.length === CARD_SYMBOLS.length) {
          setTimeout(() => setCompleted(true), 350);
        }
      } else {
        setTimeout(() => setFlipped([]), 650);
      }
    }
  };

  const renderSymbol = (kind) => {
    switch (kind) {
      case 'orb':
        return <XpOrb size={38} />;
      case 'coin':
        return <VeCoin size={38} />;
      case 'gem-green':
        return <GemToken size={38} variant="green" />;
      case 'gem-purple':
        return <GemToken size={38} variant="purple" />;
      case 'flame':
        return <GraphicIcon type="flame" size={38} />;
      default:
        return <GraphicIcon type="star-xp" size={38} />;
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="VE Vault Memory Match Mini-Game"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setActiveModal(null)}
          aria-label="Close Mini-Game"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <span className={styles.kicker}>MINI GAMES · SKILL CHALLENGE</span>
          <h2 className={styles.title}>VE Vault Memory Match</h2>
          <p className={styles.sub}>
            Match all 6 pairs of VELOOP reward tokens to earn{' '}
            <strong>+75 XP &amp; +15 VEs</strong>!
          </p>
        </div>

        <div className={styles.metaBar}>
          <span>
            Pairs Matched: <strong>{matched.length} / 6</strong>
          </span>
          <span>
            Moves: <strong>{moves}</strong>
          </span>
          <button
            type="button"
            className={styles.resetLink}
            onClick={() => {
              setDeck(buildDeck());
              setFlipped([]);
              setMatched([]);
              setMoves(0);
              setCompleted(false);
            }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {!completed ? (
          <div className={styles.cardGrid}>
            {deck.map((card, idx) => {
              const isUp = flipped.includes(idx) || matched.includes(card.kind);
              const isDone = matched.includes(card.kind);
              return (
                <button
                  key={card.uid}
                  type="button"
                  className={`${styles.memCard} ${isUp ? styles.memCardUp : ''} ${
                    isDone ? styles.memCardDone : ''
                  }`}
                  onClick={() => onCardClick(idx)}
                  aria-label={isUp ? card.label : 'Hidden reward card'}
                >
                  {isUp ? (
                    renderSymbol(card.kind)
                  ) : (
                    <span className={styles.memBack}>V</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className={styles.winBox}>
            <Trophy size={44} className={styles.winIcon} />
            <h3 className={styles.winTitle}>Vault Unlocked in {moves} Moves!</h3>
            <p className={styles.winSub}>You matched every reward pair.</p>
            <div className={styles.rewardPills}>
              <span className={styles.rewardPill}>+75 XP</span>
              <span className={styles.rewardPill}>+15 VEs</span>
            </div>
            <button
              type="button"
              className={styles.claimBtn}
              onClick={() => {
                handleCompleteMiniGame({ xp: 75, ves: 15, title: 'Mini Game Win' });
                setActiveModal(null);
              }}
            >
              Claim +75 XP &amp; +15 VEs →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   2. 7-Day Streak Check-In & Bonus Modal ("Streak Bonus" -> +25 XP & +10 VEs)
   ========================================================================== */
const STREAK_DAYS = [
  { day: 1, reward: '+10 XP', done: true },
  { day: 2, reward: '+15 XP', done: true },
  { day: 3, reward: '+15 XP', done: true },
  { day: 4, reward: '+20 XP', done: true },
  { day: 5, reward: '+20 XP', done: true },
  { day: 6, reward: '+25 XP', done: true },
  { day: 7, reward: '+25 XP + 10 VEs', today: true },
];

export function StreakModal() {
  const { activeModal, setActiveModal, user, cooldowns, handleClaimStreak } = useDashboard();
  if (activeModal !== 'streak') return null;

  const alreadyClaimed = (cooldowns.streak ?? 0) > Date.now();
  const streakCount = user?.today?.streakDays ?? 7;

  return (
    <div
      className={styles.backdrop}
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="7-Day Streak Bonus"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setActiveModal(null)}
          aria-label="Close Streak Bonus"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <GraphicIcon type="flame" size={56} />
          <span className={styles.kicker}>DAILY ENGAGEMENT STREAK</span>
          <h2 className={styles.title}>{streakCount}-Day Active Streak!</h2>
          <p className={styles.sub}>
            Check in daily to multiply your XP and unlock bonus VEs.
          </p>
        </div>

        <div className={styles.streakGrid}>
          {STREAK_DAYS.map((d) => (
            <div
              key={d.day}
              className={`${styles.streakDay} ${d.done ? styles.streakDone : ''} ${
                d.today ? styles.streakToday : ''
              }`}
            >
              <span className={styles.dayLabel}>Day {d.day}</span>
              <div className={styles.dayIcon}>
                {d.done ? <Check size={16} /> : <Flame size={16} />}
              </div>
              <span className={styles.dayReward}>{d.reward}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.claimBtn}
          disabled={alreadyClaimed}
          onClick={() => {
            handleClaimStreak();
            setActiveModal(null);
          }}
        >
          <Sparkles size={16} />
          <span>
            {alreadyClaimed
              ? 'Today’s Streak Bonus Claimed ✓'
              : 'Claim Day 7 Bonus (+25 XP & +10 VEs) →'}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. VELOOP Quick Quiz Modal ("Quick Quiz" -> +40 XP & +5 VEs)
   ========================================================================== */
const QUIZ_QUESTIONS = [
  {
    q: 'How many total XP are required to unlock Level 05 (Ascendant)?',
    options: ['5,000 XP', '8,000 XP', '12,000 XP'],
    answer: 1,
  },
  {
    q: 'What reward is unlocked inside the Level 05 Reward Chest?',
    options: ['+500 VEs & +25 Gems', '+50 VEs only', '1 Free Spin'],
    answer: 0,
  },
  {
    q: 'How many points does a Green Emerald Gem award in XP Catcher?',
    options: ['+5 pts', '+10 pts', '+15 pts'],
    answer: 2,
  },
];

export function QuickQuizModal() {
  const { activeModal, setActiveModal, handleCompleteMiniGame } = useDashboard();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (activeModal === 'quiz') {
      setStep(0);
      setSelected(null);
      setDone(false);
    }
  }, [activeModal]);

  if (activeModal !== 'quiz') return null;

  const cur = QUIZ_QUESTIONS[step];

  const onAnswer = (idx) => {
    setSelected(idx);
    setTimeout(() => {
      if (step + 1 < QUIZ_QUESTIONS.length) {
        setStep((s) => s + 1);
        setSelected(null);
      } else {
        setDone(true);
      }
    }, 450);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="VELOOP Quick Quiz"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setActiveModal(null)}
          aria-label="Close Quick Quiz"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <GraphicIcon type="quiz" size={50} />
          <span className={styles.kicker}>QUICK QUIZ · QUESTION {step + 1} OF 3</span>
          <h2 className={styles.title}>VELOOP Rewards Trivia</h2>
        </div>

        {!done ? (
          <div className={styles.quizBody}>
            <p className={styles.quizQuestion}>
              <HelpCircle size={16} className={styles.goldInline} /> {cur.q}
            </p>
            <div className={styles.quizOptions}>
              {cur.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.quizOption} ${
                    selected === idx ? styles.quizSelected : ''
                  }`}
                  onClick={() => onAnswer(idx)}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.winBox}>
            <Trophy size={42} className={styles.winIcon} />
            <h3 className={styles.winTitle}>Quiz Completed!</h3>
            <div className={styles.rewardPills}>
              <span className={styles.rewardPill}>+40 XP</span>
              <span className={styles.rewardPill}>+5 VEs</span>
            </div>
            <button
              type="button"
              className={styles.claimBtn}
              onClick={() => {
                handleCompleteMiniGame({ xp: 40, ves: 5, title: 'Quick Quiz Completed' });
                setActiveModal(null);
              }}
            >
              Claim +40 XP &amp; +5 VEs →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
