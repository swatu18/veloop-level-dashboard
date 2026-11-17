/**
 * Level service – the single place the UI gets level data from.
 *
 * Today it resolves DEMO data with a small artificial delay so loading
 * skeletons are visible. To connect the backend, replace the body of
 * `fetchLevelProgress` with a real API call returning the same shape.
 */
import { MOCK_USER } from '../data/user.mock';
import { MOCK_ACTIVITY } from '../data/activity.mock';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {{ forceError?: boolean, emptyActivity?: boolean }} [opts]
 */
export async function fetchLevelProgress(opts = {}) {
  await delay(1100);
  if (opts.forceError) {
    // Never surface raw server errors to the user (PDF §42) – UI shows a friendly message.
    throw new Error('LEVEL_PROGRESS_UNAVAILABLE');
  }
  const now = Date.now();
  return {
    user: structuredClone(MOCK_USER),
    activity: opts.emptyActivity
      ? []
      : MOCK_ACTIVITY.map(({ minutesAgo, ...a }) => ({ ...a, at: now - minutesAgo * 60_000 })),
  };
}
