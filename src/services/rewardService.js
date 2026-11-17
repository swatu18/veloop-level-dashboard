/**
 * Reward service – separates PROTOTYPE reward logic from FUTURE backend
 * reward processing (PDF §7, §44).
 *
 * Every function here is a local mock. In production each call should be a
 * server request; the server must validate eligibility, cooldowns, daily
 * limits and anti-abuse rules and return the granted reward. The client
 * should only DISPLAY what the server granted.
 */
import { getRewardTier } from '../data/game.config';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** Claim an earning activity (Watch & Earn, Daily Mission, Refer & Earn). */
export async function claimEarning(earning) {
  await delay(350);
  return { xp: earning.xp, ves: 0, source: earning.source, demo: true };
}

/** Submit a finished game and receive the granted reward. */
export async function submitGameResult({ score }) {
  await delay(250);
  const tier = getRewardTier(score);
  return { xp: tier.xp, ves: tier.ves, title: tier.title, demo: true };
}

/** Claim the rewards attached to a newly reached level. */
export async function claimLevelReward(levelConfig) {
  await delay(300);
  return { rewards: levelConfig.rewards, demo: true };
}
