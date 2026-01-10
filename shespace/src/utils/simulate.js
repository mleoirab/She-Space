import { minutesFromNow, pruneExpired } from "./time";

export function simulatePresence(presenceByPlace, enabled, placeIds) {
  if (!enabled) return presenceByPlace;

  const copy = structuredClone(presenceByPlace);

  for (const pid of placeIds) {
    copy[pid] = pruneExpired(copy[pid] || []);

    const base = copy[pid].length;
    const wiggle = Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? 1 : -1);
    const target = Math.max(0, base + wiggle);

    while (copy[pid].length < target) {
      copy[pid].push({ id: `sim-${Math.random()}`, expiresAt: minutesFromNow(10) });
    }
    while (copy[pid].length > target) {
      copy[pid].pop();
    }
  }

  return copy;
}
