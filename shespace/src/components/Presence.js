import { minutesFromNow, pruneExpired } from "../utils/time";
import { save } from "../utils/storage";
import { getUserId } from "../utils/user";

export function checkIn({ placeId, presenceByPlace, setPresenceByPlace }) {
  const userId = getUserId();

  setPresenceByPlace((prev) => {
    const copy = structuredClone(prev);
    const list = pruneExpired(copy[placeId] || []);

    // 🚫 prevent duplicate check-in
    if (list.some((p) => p.userId === userId)) {
      return prev;
    }

    list.push({
      id: crypto.randomUUID(),
      userId,
      expiresAt: minutesFromNow(60),
      createdAt: Date.now(),
    });

    copy[placeId] = list;
    save("presenceByPlace", copy);
    return copy;
  });
}

export function getPresenceSummary(list = [], userId) {
  const active = pruneExpired(list);
  const mine = active.some((p) => p.userId === userId);

  return {
    total: active.length,
    mine,
    others: mine ? active.length - 1 : active.length,
  };
}
