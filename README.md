# VELOOP Rewards – Level-Up Dashboard (Task 16)

A complete redesign and frontend implementation of the **VELOOP Rewards Level-Up Dashboard** (`/Lvl-Dashboard`) transforming the passive level page into a **Gamified Level Progression, Rewards & Engagement Hub**.

Built to match:
1. **The 6-screen dark & gold design mockup** attached on Page 33 of the Task 16 assignment brief.
2. **The full interactive functionality and 10 winged level badges** of the reference build (`https://ve-loop-client.vercel.app/Lvl-Dashboard`).
3. **Every requirement and submission checklist item** in the 33-page Task 16 specification (Sections 1–58).

---

## 1. Project Overview

The redesigned **Level-Up Dashboard** immediately answers the core user questions defined in Section 1 of the brief:

| User Question | Dashboard Component |
|---|---|
| **Where am I now?** | Prominent Gold Hexagon Badge (`LEVEL 04`) + Winged Tier Emblem (`Challenger`) |
| **How far have I progressed?** | Animated `6,420 XP` counter + `80%` golden progress bar (`6,420 / 8,000 XP`) |
| **What do I need next?** | Explicit `1,580 XP needed to reach Level 05` (no mental math required) |
| **What will I receive?** | `Level 05 Rewards` Vault Card (`+500 VEs` & `+25 Gems`) with 3D treasure chest |
| **What level comes next?** | 10-Level Progression Roadmap (`Level 01` → `Level 10`) with `YOU ARE HERE`, `Completed`, `Next Goal`, and `Locked` states |
| **What can I do right now?** | Play the playable **XP Catcher** mini-game or claim active earning missions |
| **Why should I return?** | Daily streaks (`7 Days`), cooldown missions, higher tier privileges, and new earning quests |

---

## 2. Level System

- **10 Progression Tiers (`Level 01` – `Level 10`)**:
  - `Level 01` – **Rookie** (`0 XP` · `+50 VEs`)
  - `Level 02` – **Explorer** (`500 XP` · `+100 VEs`)
  - `Level 03` – **Achiever** (`1,500 XP` · `+100 VEs`)
  - `Level 04` – **Challenger** (`3,500 XP` · `+10 Gems`) — *Initial Demo User Level*
  - `Level 05` – **Ascendant** (`8,000 XP` · `+500 VEs + 25 Gems`) — *Next Goal*
  - `Level 06` – **Elite** (`11,000 XP` · `+2 Spins`)
  - `Level 07` – **Master** (`15,000 XP` · `+750 VEs + 1 SVE`)
  - `Level 08` – **Champion** (`20,000 XP` · `+40 Gems`)
  - `Level 09` – **Legend** (`26,000 XP` · `+1,500 VEs`)
  - `Level 10` – **Mythic** (`33,000 XP` · `+5 SVEs + 10 Tokens`)
- **4 Clear Visual States**:
  - `✓ Completed` (green verification badge)
  - `YOU ARE HERE` (elevated gold glow + active pill)
  - `Next Goal` (highlighted purple/gold outline)
  - `🔒 Locked` (subtle blur + golden padlock overlay)
- **Click-to-Inspect Level Details**: Clicking any badge in the roadmap opens the **Level Details Sheet** showing its XP threshold, demo rewards, and tier privileges.

---

## 3. XP System

- **Animated XP Counter & Progress Bar**: Smoothly interpolates on page load and whenever XP is earned from tasks or the mini-game.
- **Today's Boost Strip**: Displays today's `XP Earned (215 XP)`, `Tasks Done (4 / 8)`, and `Streak (7 Days)`.
- **XP Sources & Recent XP Activity**: Tracks XP & VE entries across `Tasks`, `Games`, `Referrals`, `Streaks`, and `Rewards`, with category filtering and a dedicated `/Lvl-Dashboard/activity` route.

---

## 4. Next-Level Rewards & Level-Up Celebration

- **Partially-Locked Next-Level Reward Card**: Displays `Level 05 Rewards` (`+500 VEs` + `+25 Gems`), a 3D treasure chest with amethyst gems, an `[i]` transparent configuration tooltip, and a `Reach Level 05 to unlock (80%)` progress bar.
- **Level-Up Celebration Modal**: Automatically triggers when the user's XP crosses a level threshold (or via the `Preview Level-Up` / `Demo States` button). Shows the `LEVEL UP! You've reached Level 05` golden hexagon emblem on a 3D podium, `+500 VEs` & `+25 Gems` showcase cards, unlocked privileges (`Higher daily XP limit`, `Access to new challenges`, `Better reward opportunities`), and a `Claim Rewards` button.

---

## 5. Game Concept – XP Catcher

- **Dedicated Play & Earn Area**: Includes an inline **XP Catcher** arcade card on the dashboard and a full-screen / phone-framed interactive game modal matching Mockup Screens 2 & 3.
- **Skill-Based Engagement**: Purely skill/timing-based collector challenge — zero gambling, betting, casino, or jackpot mechanics.

---

## 6. Game Rules

- **How to Play**: Move the golden collector basket left and right using **touch drag** (iOS/Android), **mouse drag**, or **← / → arrow keys** (`A` / `D`).
- **Objective**: Catch falling **XP Orbs**, **VE Coins**, **Green Gems**, and **2X Boosters** before the **20-second** timer expires.
- **Scoring (Transparent — No Hidden Mechanics)**:
  - `VE Coin`: **+5 pts** (+VE bonus progress)
  - `XP Orb`: **+10 pts**
  - `Green Gem`: **+15 pts**
  - `🚀 2X Booster`: Doubles all points earned for **5 seconds**
- **Demo Reward Tiers** *(clearly treated as development/demo values)*:
  - Score `90+` → **+30 XP & +12 VEs** (*Outstanding!*)
  - Score `60–89` → **+20 XP & +5 VEs** (*Great Job!*)
  - Score `30–59` → **+10 XP & +2 VEs** (*Nice Work!*)
  - Score `0–29` → **+5 XP** (*Good Try!*)
- **Eligibility & Play Limit**: Available to all VELOOP users; `5` daily skill runs configured (unlimited demo replays enabled).

---

## 7. Earning Features

- **Supported Active Earning Routes** *(with live XP updates & cooldown timers)*:
  - **Watch & Earn** (`+50 XP` · 5h cooldown)
  - **Daily Missions / Daily Tasks** (`+30 XP` · 24h cooldown)
  - **Refer & Earn** (`+100 XP` per referral)
  - **XP Catcher** (`Up to +30 XP & +12 VEs` — launches the mini-game)
- **Expanded Earning Concepts** *(clearly marked `Coming Soon` per Section 23 & 47)*:
  - **Mini Games** (`+75 XP` · *Coming Soon*)
  - **Streak Bonus** (`+25 XP` · *Coming Soon*)
  - **Daily Challenge** (`Up to +50 XP` · *Coming Soon*)
  - **Weekly Quest** (`Up to +200 XP` · *Coming Soon*)
  - **Quick Quiz** (`+20 XP` · *Coming Soon*)
- **Personalized Recommendation Banner**: Dynamically updates its message and recommended next action based on how much XP remains to reach the next level.

---

## 8. Technology Stack

- **React.js 18** (Functional components, Hooks & Context API)
- **Vite 5** (Fast HMR & optimized production bundle)
- **Bootstrap 5** (Reboot & responsive utilities)
- **CSS Modules (`.module.css`)** + Design Tokens (`#161827` project-wide body background)
- **React Router DOM v6** (`/Lvl-Dashboard` & `/Lvl-Dashboard/activity` routes + Vercel/Netlify SPA rewrites)
- **Lucide React** & custom 3D-styled SVG / WebP assets

---

## 9. Installation & Development Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (http://localhost:5173/Lvl-Dashboard)
npm run dev

# 3. Create production build
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 10. Folder Structure & Component Architecture

```text
src/
├── assets/
│   ├── badges/                 # 10 winged level badges (lvl-1..lvl-10.svg) + lock.svg
│   └── illustrations/          # 3D WebP assets (chest, trophy, podium, coins, gems, basket, wallet)
├── components/
│   ├── BottomNav/              # Mobile bottom navigation bar (iOS safe-area aware)
│   ├── CurrentLevel/           # Gold Hexagon Level badge + animated XP hero card
│   ├── EarnMoreXP/             # Quick 3×2 Earn Grid, Screen 4 Drawer & Desktop Feature Cards
│   ├── GameTokens/             # Glossy SVG tokens (XpOrb, VeCoin, GemToken, GraphicIcon)
│   ├── LevelDetailsSheet/      # Click-to-inspect level details modal
│   ├── LevelHero/              # Header bar, greeting, wallet pill & Demo States button
│   ├── LevelInfo/              # Accessible [i] tooltip component
│   ├── LevelRewardCard/        # Individual level badge card with 4 visual states
│   ├── LevelRoadmap/           # 10-level progression & rewards roadmap
│   ├── LevelUpModal/           # Screen 5 Level-Up celebration modal
│   ├── NextLevelReward/        # Partially-locked Level 05 reward chest card
│   ├── PlayAndEarn/
│   │   ├── GameContainer/      # State machine (Start -> Play -> Result -> Replay)
│   │   ├── GameStart/          # Inline arcade promo & transparent game rules card
│   │   ├── GamePlay/           # Screen 2 interactive 60fps catch game
│   │   ├── GameResult/         # Screen 3 Challenge Complete trophy & score screen
│   │   └── Game.module.css     # Scoped game styles
│   ├── Recommendation/         # Dynamic "Recommended for You" action banner
│   ├── Skeletons/              # Shimmer loading skeletons for all 6 sections
│   ├── States/                 # Friendly ErrorState + Reviewer DemoToolbar
│   ├── TodayBoost/             # Today's Boost (XP Earned, Tasks Done, Streak)
│   ├── XPActivity/             # Screen 6 Recent Activity feed + Today's Summary + Empty State
│   └── XPProgress/             # Animated golden XP progress bar
├── context/
│   └── DashboardContext.jsx    # Central state, persistence & level-up detection
├── data/
│   ├── activity.mock.js        # Demo XP history & filter categories
│   ├── earnings.js             # Active & Coming Soon earning configurations
│   ├── game.config.js          # XP Catcher rules, item weights & reward tiers
│   ├── levels.js               # 10-level thresholds, badges, rewards & helper functions
│   └── user.mock.js            # Demo user profile (Level 04 · 6,420 / 8,000 XP)
├── hooks/
│   ├── useCooldown.js          # Live countdown timer hook for claimed tasks
│   └── useCountUp.js           # Smooth numeric interpolation hook
├── pages/
│   ├── ActivityPage/           # /Lvl-Dashboard/activity page
│   └── LevelDashboard/         # /Lvl-Dashboard main page
├── services/
│   ├── levelService.js         # Decoupled data fetching service
│   └── rewardService.js        # Decoupled prototype reward service (ready for backend API)
└── styles/
    ├── global.css              # Global resets, accessibility & skeleton shimmer
    └── tokens.css              # Design tokens (#161827 body background, gold/purple palette)
```

---

## 11. Responsive Behavior (Mobile iOS & Android, Tablet, Desktop, Large Screens)

- **Mobile (`320px+` — iOS Safari & Android Chrome)**:
  - Uses `100dvh`, `viewport-fit=cover`, and `env(safe-area-inset-*)` so notched iPhones and Android gesture bars never clip content.
  - Follows the 6-screen mobile mockup layout with touch-friendly 48px tap targets, horizontal swipeable Level Roadmap, and touch-drag XP Catcher basket.
- **Tablet (`768px+`)**: Balanced two-column cards and expanded header controls.
- **Laptop & Desktop (`1280px+`, `1440px+`, `1920px+`)**: Multi-column fintech dashboard composition with a 5×2 Level Roadmap grid, side-by-side Arcade & Activity panels, and an Action Hub with interactive feature cards.

---

## 12. Animation Details & UX States

- **Subtle Fintech-Grade Animations**: Smooth XP bar fill + shine sweep on load, count-up numbers, floating game tokens, and badge pop-in on Level-Up (respects `prefers-reduced-motion: reduce`).
- **Loading, Empty & Error States**:
  - **Skeleton Loading**: Displays automatically on initial load and can be re-triggered anytime from the **Demo States** button in the top header.
  - **Empty State**: Shows *"No XP Activity — Your XP journey starts here"* with a `Start Earning XP →` CTA and *"No Available Game — New challenge coming soon"*.
  - **Friendly Error State**: Shows *"Unable to Load Level Progress — We couldn't load your level information right now"* with a `Try Again` button (never exposes raw server errors).

---

## 13. Live Demo

- **Production Dashboard (`/Lvl-Dashboard`):** https://veloop-level-dashboard-nine.vercel.app/Lvl-Dashboard
- **Recent Activity Route (`/Lvl-Dashboard/activity`):** https://veloop-level-dashboard-nine.vercel.app/Lvl-Dashboard/activity

---

## 14. Author

- **VELOOP Frontend Development Team – Task 16 Submission**
