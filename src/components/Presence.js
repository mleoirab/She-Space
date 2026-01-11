import { minutesFromNow, pruneExpired } from "../utils/time";

export function checkIn(presenceByPlace, setPresenceByPlace, placeId) {
  setPresenceByPlace(prev => {
    const copy = structuredClone(prev);
    copy[placeId] = pruneExpired(copy[placeId] || []);
    copy[placeId].push({ id: `local-${Math.random()}`, expiresAt: minutesFromNow(60) });
    return copy;
  });
}

export function getPresenceCount(presenceByPlace, placeId) {
  return pruneExpired(presenceByPlace?.[placeId] || []).length;
}
