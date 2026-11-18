import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Flame,
  Gamepad2,
  Grid,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Send,
  Share2,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { GemToken, GraphicIcon, VeCoin, XpOrb } from '../GameTokens/GameTokens';
import walletImg from '../../assets/illustrations/wallet.webp';
import trophyImg from '../../assets/illustrations/trophy.webp';
import styles from './InteractiveModals.module.css';

/* ==========================================================================
   1. WATCH & EARN — Sample Promotional Video Player Modal (iOS, Android & Desktop)
   ========================================================================== */
const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
];

export function WatchVideoModal() {
  const { activeModal, setActiveModal, handleCompleteActionModal } = useDashboard();
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  const REQUIRED_SEC = 8;
  const isOpen = activeModal === 'watch';

  useEffect(() => {
    if (!isOpen) return;
    setSecondsWatched(0);
    setPlaying(true);
    setMuted(true);
    setVideoReady(false);
  }, [isOpen]);

  // Reliable timer that ticks whenever `playing` is true (works even if a network blocks external mp4)
  useEffect(() => {
    if (!isOpen || !playing) return;
    if (secondsWatched >= REQUIRED_SEC) return;
    const id = setInterval(() => {
      setSecondsWatched((s) => Math.min(REQUIRED_SEC, s + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isOpen, playing, secondsWatched]);

  if (!isOpen) return null;

  const togglePlay = () => {
    setPlaying((p) => {
      const next = !p;
      if (videoRef.current) {
        if (next) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      return next;
    });
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  const pct = Math.min(100, Math.round((secondsWatched / REQUIRED_SEC) * 100));
  const unlocked = secondsWatched >= REQUIRED_SEC;

  return (
    <div
      className={styles.backdrop}
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Watch and Earn Sample Video"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setActiveModal(null)}
          aria-label="Close Watch and Earn"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <GraphicIcon type="watch" size={48} />
          <span className={styles.kicker}>SPONSORED REWARD REEL · WATCH &amp; EARN</span>
          <h2 className={styles.title}>VELOOP Rewards Spotlight</h2>
          <p className={styles.sub}>
            Watch the sample reel for <strong>{REQUIRED_SEC} seconds</strong> to unlock{' '}
            <strong>+50 XP &amp; +5 VEs</strong>!
          </p>
        </div>

        {/* Responsive Video Player (iOS playsInline + Android + Desktop) */}
        <div className={styles.videoStage}>
          <video
            ref={videoRef}
            className={styles.videoElement}
            src={SAMPLE_VIDEOS[0]}
            autoPlay
            muted={muted}
            loop
            playsInline
            webkit-playsinline="true"
            onCanPlay={() => setVideoReady(true)}
          />

          {/* Animated VELOOP Branded Showcase Overlay inside the player */}
          <div className={`${styles.videoOverlayArt} ${videoReady ? styles.videoOverlaySubtle : ''}`}>
            <img src={walletImg} alt="" className={styles.videoCenterArt} />
            <div className={styles.videoPromoBadge}>
              <Sparkles size={13} />
              <span>VELOOP Tier 05 Ascendant · 500 VEs + 25 Gems</span>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className={styles.videoControls}>
            <button
              type="button"
              className={styles.vidCtrlBtn}
              onClick={togglePlay}
              aria-label={playing ? 'Pause video' : 'Play video'}
            >
              {playing ? <Pause size={15} /> : <Play size={15} />}
            </button>

            <div className={styles.vidProgressTrack}>
              <div className={styles.vidProgressFill} style={{ width: `${pct}%` }} />
            </div>

            <span className={styles.vidTimerBadge}>
              {unlocked ? '✓ Completed' : `${REQUIRED_SEC - secondsWatched}s left`}
            </span>

            <button
              type="button"
              className={styles.vidCtrlBtn}
              onClick={toggleMute}
              aria-label={muted ? 'Unmute video' : 'Mute video'}
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        <button
          type="button"
          className={styles.claimBtn}
          disabled={!unlocked}
          onClick={() => {
            handleCompleteActionModal({
              earningId: 'watch',
              xp: 50,
              ves: 5,
              title: 'Watch & Earn Video',
              icon: 'watch',
              category: 'tasks',
            });
            setActiveModal(null);
          }}
        >
          <Sparkles size={16} />
          <span>
            {unlocked
              ? 'Claim +50 XP & +5 VEs Reward →'
              : `Watching Sample Video... (${REQUIRED_SEC - secondsWatched}s)`}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. DAILY MISSIONS — Interactive Checklist Modal (+30 XP & +5 VEs)
   ========================================================================== */
const INITIAL_MISSIONS = [
  {
    id: 'm1',
    title: 'Check in to VELOOP Level-Up Dashboard',
    xp: '+10 XP',
    done: true,
  },
  {
    id: 'm2',
    title: 'Verify today’s Next-Level Reward chest status',
    xp: '+10 XP',
    done: false,
  },
  {
    id: 'm3',
    title: 'Complete daily engagement boost check',
    xp: '+10 XP + 5 VEs',
    done: false,
  },
];

export function DailyMissionsModal() {
  const { activeModal, setActiveModal, handleCompleteActionModal } = useDashboard();
  const [missions, setMissions] = useState(INITIAL_MISSIONS);

  const isOpen = activeModal === 'daily';

  useEffect(() => {
    if (isOpen) {
      setMissions(INITIAL_MISSIONS);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMission = (id) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: true } : m))
    );
  };

  const doneCount = missions.filter((m) => m.done).length;
  const allDone = doneCount === missions.length;

  return (
    <div
      className={styles.backdrop}
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Daily Missions Checklist"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setActiveModal(null)}
          aria-label="Close Daily Missions"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <GraphicIcon type="tasks" size={48} />
          <span className={styles.kicker}>DAILY MISSIONS · {doneCount} / 3 COMPLETED</span>
          <h2 className={styles.title}>Today&apos;s Mission Checklist</h2>
          <p className={styles.sub}>
            Complete all 3 quick mission steps below to unlock{' '}
            <strong>+30 XP &amp; +5 VEs</strong>!
          </p>
        </div>

        <div className={styles.missionList}>
          {missions.map((m) => (
            <div
              key={m.id}
              className={`${styles.missionRow} ${m.done ? styles.missionRowDone : ''}`}
            >
              <div className={styles.missionStatusIcon}>
                {m.done ? <CheckCircle2 size={19} /> : <Zap size={17} />}
              </div>
              <div className={styles.missionCopy}>
                <span className={styles.missionTitle}>{m.title}</span>
                <span className={styles.missionXp}>{m.xp}</span>
              </div>
              {m.done ? (
                <span className={styles.donePill}>Done ✓</span>
              ) : (
                <button
                  type="button"
                  className={styles.completeStepBtn}
                  onClick={() => toggleMission(m.id)}
                >
                  Complete
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className={styles.claimBtn}
          disabled={!allDone}
          onClick={() => {
            handleCompleteActionModal({
              earningId: 'daily',
              xp: 30,
              ves: 5,
              title: 'Daily Mission Completed',
              icon: 'tasks',
              category: 'tasks',
            });
            setActiveModal(null);
          }}
        >
          <Sparkles size={16} />
          <span>
            {allDone
              ? 'Claim +30 XP & +5 VEs Mission Reward →'
              : `Tap "Complete" on remaining steps (${doneCount}/3)`}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. REFER & EARN — Invite Friends & Referral Link Modal (+100 XP & +15 VEs)
   ========================================================================== */
export function ReferEarnModal() {
  const { activeModal, setActiveModal, handleCompleteActionModal } = useDashboard();
  const [copied, setCopied] = useState(false);
  const [friendInput, setFriendInput] = useState('');
  const [inviteReady, setInviteReady] = useState(false);

  const isOpen = activeModal === 'refer';
  const refCode = 'VELOOP-7749';
  const refLink = 'https://veloop-level-dashboard-nine.vercel.app/Lvl-Dashboard?ref=VELOOP-7749';

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      setFriendInput('');
      setInviteReady(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refLink).catch(() => {});
    }
    setCopied(true);
    setInviteReady(true);
  };

  const handleShareChannel = (channel) => {
    setInviteReady(true);
    const text = encodeURIComponent(
      `Join me on VELOOP Rewards with code ${refCode} and unlock +500 VEs! ${refLink}`
    );
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    } else if (channel === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${text}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Refer and Earn Invite Friends"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setActiveModal(null)}
          aria-label="Close Refer and Earn"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <GraphicIcon type="refer" size={50} />
          <span className={styles.kicker}>REFER &amp; EARN · INVITE FRIENDS</span>
          <h2 className={styles.title}>Earn +100 XP &amp; +15 VEs</h2>
          <p className={styles.sub}>
            Copy your personal referral code, share via WhatsApp/Telegram, or send a direct
            invite below.
          </p>
        </div>

        {/* Referral Code Copy Box */}
        <div className={styles.refCodeBox}>
          <div>
            <span className={styles.refCodeLabel}>YOUR REFERRAL CODE</span>
            <strong className={styles.refCodeValue}>{refCode}</strong>
          </div>
          <button type="button" className={styles.copyBtn} onClick={handleCopy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Direct Friend Invite Input */}
        <div className={styles.inviteInputRow}>
          <input
            type="text"
            className={styles.inviteInput}
            placeholder="Enter friend's email or @username"
            value={friendInput}
            onChange={(e) => setFriendInput(e.target.value)}
          />
          <button
            type="button"
            className={styles.sendInviteBtn}
            onClick={() => {
              setInviteReady(true);
              setFriendInput('');
            }}
          >
            <Send size={14} />
            <span>Invite</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className={styles.shareGrid}>
          <button
            type="button"
            className={styles.shareChannelBtn}
            onClick={() => handleShareChannel('whatsapp')}
          >
            <Share2 size={14} />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            className={styles.shareChannelBtn}
            onClick={() => handleShareChannel('telegram')}
          >
            <Share2 size={14} />
            <span>Telegram</span>
          </button>
          <button
            type="button"
            className={styles.shareChannelBtn}
            onClick={handleCopy}
          >
            <Copy size={14} />
            <span>Copy Code</span>
          </button>
        </div>

        <button
          type="button"
          className={styles.claimBtn}
          disabled={!inviteReady}
          onClick={() => {
            handleCompleteActionModal({
              earningId: 'refer',
              xp: 100,
              ves: 15,
              title: 'Referral Bonus',
              icon: 'refer',
              category: 'referrals',
            });
            setActiveModal(null);
          }}
        >
          <Sparkles size={16} />
          <span>
            {inviteReady
              ? 'Claim +100 XP & +15 VEs Referral Bonus →'
              : 'Copy Link or Send Invite Above to Unlock Reward'}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. MINI GAMES ARCADE HUB:
      - Game 1: XOX (Tic-Tac-Toe — Gold V vs. Purple XP AI)
      - Game 2: VE Vault Memory Match (6-pair 3D token match)
      - Game 3: Lucky Vault Tap Sprint (Tap 1 → 9 in order)
   ========================================================================== */
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (board) => {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] };
  return null;
};

const pickBotMove = (board) => {
  const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
  if (!empty.length) return null;
  // 1. Can bot ('O') win?
  for (const idx of empty) {
    const test = [...board];
    test[idx] = 'O';
    if (checkWinner(test)?.winner === 'O') return idx;
  }
  // 2. Block player ('X') win (70% of the time so player has a fun chance to win!)
  if (Math.random() < 0.7) {
    for (const idx of empty) {
      const test = [...board];
      test[idx] = 'X';
      if (checkWinner(test)?.winner === 'X') return idx;
    }
  }
  if (empty.includes(4) && Math.random() < 0.6) return 4;
  return empty[Math.floor(Math.random() * empty.length)];
};

function XoxTicTacToeGame({ onWinClaim }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X'); // 'X' = Player (Gold V), 'O' = Bot (Purple XP)
  const [outcome, setOutcome] = useState(null); // { winner: 'X' | 'O' | 'draw', line: [] }

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setOutcome(null);
  };

  const handleCellClick = (idx) => {
    if (board[idx] || outcome || turn !== 'X') return;
    const next = [...board];
    next[idx] = 'X';
    const res = checkWinner(next);
    setBoard(next);
    if (res) {
      setOutcome(res);
      return;
    }
    setTurn('O');
    setTimeout(() => {
      const botIdx = pickBotMove(next);
      if (botIdx !== null) {
        const afterBot = [...next];
        afterBot[botIdx] = 'O';
        const botRes = checkWinner(afterBot);
        setBoard(afterBot);
        if (botRes) {
          setOutcome(botRes);
          return;
        }
      }
      setTurn('X');
    }, 360);
  };

  const playerWon = outcome?.winner === 'X';
  const isDraw = outcome?.winner === 'draw';

  return (
    <div className={styles.subGameWrap}>
      <div className={styles.metaBar}>
        <span className={styles.xoxLegend}>
          <VeCoin size={20} /> You (<strong>X · Gold V</strong>)
        </span>
        <span className={styles.xoxLegend}>
          <XpOrb size={20} /> Bot (<strong>O · XP Orb</strong>)
        </span>
        <button type="button" className={styles.resetLink} onClick={resetBoard}>
          <RotateCcw size={13} /> New Round
        </button>
      </div>

      <div className={styles.xoxBoard}>
        {board.map((cell, i) => {
          const isHighlight = outcome?.line?.includes(i);
          return (
            <button
              key={i}
              type="button"
              className={`${styles.xoxCell} ${isHighlight ? styles.xoxCellWin : ''}`}
              onClick={() => handleCellClick(i)}
              disabled={Boolean(cell || outcome)}
              aria-label={`Tic Tac Toe cell ${i + 1}`}
            >
              {cell === 'X' && (
                <div className={styles.xoxTokenPop}>
                  <VeCoin size={44} />
                  <span className={styles.xoxMarkGold}>X</span>
                </div>
              )}
              {cell === 'O' && (
                <div className={styles.xoxTokenPop}>
                  <XpOrb size={44} />
                  <span className={styles.xoxMarkPurple}>O</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {outcome && (
        <div className={styles.winBox}>
          <img src={trophyImg} alt="" className={styles.miniTrophy} />
          <h3 className={styles.winTitle}>
            {playerWon
              ? 'Victory! You Beat the VELOOP Bot!'
              : isDraw
              ? 'Close Match — Draw!'
              : 'Bot Won This Round!'}
          </h3>
          <div className={styles.rewardPills}>
            <span className={styles.rewardPill}>
              +{playerWon ? 75 : isDraw ? 45 : 25} XP
            </span>
            <span className={styles.rewardPill}>
              +{playerWon ? 15 : isDraw ? 8 : 5} VEs
            </span>
          </div>
          <div className={styles.winActions}>
            <button
              type="button"
              className={styles.claimBtn}
              onClick={() =>
                onWinClaim({
                  xp: playerWon ? 75 : isDraw ? 45 : 25,
                  ves: playerWon ? 15 : isDraw ? 8 : 5,
                  title: 'XOX Tic-Tac-Toe Win',
                })
              }
            >
              <Sparkles size={16} />
              <span>
                Claim +{playerWon ? 75 : isDraw ? 45 : 25} XP &amp; +
                {playerWon ? 15 : isDraw ? 8 : 5} VEs →
              </span>
            </button>
            {!playerWon && (
              <button type="button" className={styles.secondaryBtn} onClick={resetBoard}>
                Play Again for Full +75 XP
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Game 2: VE Vault Memory Match --- */
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

function VaultMemoryGame({ onWinClaim }) {
  const [deck, setDeck] = useState(() => buildDeck());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

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
          setTimeout(() => setCompleted(true), 300);
        }
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
    }
  };

  const renderSymbol = (kind) => {
    switch (kind) {
      case 'orb':
        return <XpOrb size={36} />;
      case 'coin':
        return <VeCoin size={36} />;
      case 'gem-green':
        return <GemToken size={36} variant="green" />;
      case 'gem-purple':
        return <GemToken size={36} variant="purple" />;
      case 'flame':
        return <GraphicIcon type="flame" size={36} />;
      default:
        return <GraphicIcon type="star-xp" size={36} />;
    }
  };

  return (
    <div className={styles.subGameWrap}>
      <div className={styles.metaBar}>
        <span>
          Pairs: <strong>{matched.length} / 6</strong>
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
              >
                {isUp ? renderSymbol(card.kind) : <span className={styles.memBack}>V</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={styles.winBox}>
          <img src={trophyImg} alt="" className={styles.miniTrophy} />
          <h3 className={styles.winTitle}>Vault Unlocked in {moves} Moves!</h3>
          <div className={styles.rewardPills}>
            <span className={styles.rewardPill}>+75 XP</span>
            <span className={styles.rewardPill}>+15 VEs</span>
          </div>
          <button
            type="button"
            className={styles.claimBtn}
            onClick={() =>
              onWinClaim({ xp: 75, ves: 15, title: 'VE Vault Memory Match Win' })
            }
          >
            <Sparkles size={16} />
            <span>Claim +75 XP &amp; +15 VEs →</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* --- Game 3: Lucky Vault Number Sprint (Tap 1 → 9 in sequence) --- */
const shuffleNumbers = () =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

function VaultNumberSprintGame({ onWinClaim }) {
  const [nums, setNums] = useState(() => shuffleNumbers());
  const [nextTarget, setNextTarget] = useState(1);
  const [done, setDone] = useState(false);

  const onTap = (n) => {
    if (n !== nextTarget) return;
    if (n === 9) {
      setDone(true);
    } else {
      setNextTarget((t) => t + 1);
    }
  };

  return (
    <div className={styles.subGameWrap}>
      <div className={styles.metaBar}>
        <span>
          Tap Next: <strong>Vault #{done ? '✓' : nextTarget}</strong>
        </span>
        <button
          type="button"
          className={styles.resetLink}
          onClick={() => {
            setNums(shuffleNumbers());
            setNextTarget(1);
            setDone(false);
          }}
        >
          <RotateCcw size={13} /> Shuffle
        </button>
      </div>

      {!done ? (
        <div className={styles.xoxBoard}>
          {nums.map((n) => {
            const cleared = n < nextTarget;
            return (
              <button
                key={n}
                type="button"
                className={`${styles.xoxCell} ${cleared ? styles.xoxCellWin : ''}`}
                onClick={() => onTap(n)}
                disabled={cleared}
              >
                {cleared ? (
                  <VeCoin size={38} />
                ) : (
                  <span className={styles.sprintNumber}>{n}</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className={styles.winBox}>
          <img src={trophyImg} alt="" className={styles.miniTrophy} />
          <h3 className={styles.winTitle}>All 9 Golden Vaults Cleared!</h3>
          <div className={styles.rewardPills}>
            <span className={styles.rewardPill}>+60 XP</span>
            <span className={styles.rewardPill}>+12 VEs</span>
          </div>
          <button
            type="button"
            className={styles.claimBtn}
            onClick={() =>
              onWinClaim({ xp: 60, ves: 12, title: 'Vault Number Sprint Win' })
            }
          >
            <Sparkles size={16} />
            <span>Claim +60 XP &amp; +12 VEs →</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function MemoryGameModal() {
  const { activeModal, setActiveModal, handleCompleteMiniGame } = useDashboard();
  const [selectedGame, setSelectedGame] = useState('xox'); // 'xox' | 'memory' | 'sprint'

  if (activeModal !== 'mini-games') return null;

  const onWinClaim = ({ xp, ves, title }) => {
    handleCompleteMiniGame({ xp, ves, title });
    setActiveModal(null);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => setActiveModal(null)}
      role="dialog"
      aria-modal="true"
      aria-label="VELOOP Mini-Games Arcade"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setActiveModal(null)}
          aria-label="Close Mini-Games"
        >
          <X size={18} />
        </button>

        <div className={styles.header}>
          <GraphicIcon type="gamepad" size={48} />
          <span className={styles.kicker}>VELOOP ARCADE · 3 SKILL MINI-GAMES</span>
          <h2 className={styles.title}>Play &amp; Win Instant XP</h2>
        </div>

        {/* Game Switcher Tabs */}
        <div className={styles.gameTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={selectedGame === 'xox'}
            className={`${styles.gameTabBtn} ${
              selectedGame === 'xox' ? styles.gameTabActive : ''
            }`}
            onClick={() => setSelectedGame('xox')}
          >
            <Grid size={14} />
            <span>XOX (Tic-Tac-Toe)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedGame === 'memory'}
            className={`${styles.gameTabBtn} ${
              selectedGame === 'memory' ? styles.gameTabActive : ''
            }`}
            onClick={() => setSelectedGame('memory')}
          >
            <Gamepad2 size={14} />
            <span>Vault Match</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedGame === 'sprint'}
            className={`${styles.gameTabBtn} ${
              selectedGame === 'sprint' ? styles.gameTabActive : ''
            }`}
            onClick={() => setSelectedGame('sprint')}
          >
            <Zap size={14} />
            <span>1–9 Sprint</span>
          </button>
        </div>

        {selectedGame === 'xox' && <XoxTicTacToeGame onWinClaim={onWinClaim} />}
        {selectedGame === 'memory' && <VaultMemoryGame onWinClaim={onWinClaim} />}
        {selectedGame === 'sprint' && <VaultNumberSprintGame onWinClaim={onWinClaim} />}
      </div>
    </div>
  );
}

/* ==========================================================================
   5. 7-Day Streak Check-In & Bonus Modal ("Streak Bonus" -> +25 XP & +10 VEs)
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
          <GraphicIcon type="flame" size={54} />
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
   6. VELOOP Quick Quiz Modal ("Quick Quiz" -> +40 XP & +5 VEs)
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
          <GraphicIcon type="quiz" size={48} />
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
