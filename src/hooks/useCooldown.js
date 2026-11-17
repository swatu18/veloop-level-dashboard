import { useEffect, useState } from 'react';

/**
 * Formats a remaining cooldown timestamp (`untilMs`) into a friendly string
 * like "4h 59m" or "23h 59m" and ticks every second while active.
 */
export function useCooldown(untilMs) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!untilMs || untilMs <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [untilMs]);

  const remaining = Math.max(0, (untilMs || 0) - now);
  if (remaining <= 0) return { active: false, label: '' };

  const totalSec = Math.ceil(remaining / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  let label = '';
  if (hours > 0) {
    label = `Back in ${hours}h ${mins}m`;
  } else if (mins > 0) {
    label = `Back in ${mins}m ${secs}s`;
  } else {
    label = `Back in ${secs}s`;
  }
  return { active: true, label, remaining };
}
