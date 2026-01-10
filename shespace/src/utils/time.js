export const minutesFromNow = (mins) => Date.now() + mins * 60 * 1000;
export const isExpired = (expiresAt) => Date.now() > expiresAt;

export function pruneExpired(items) {
  return (items || []).filter((x) => !isExpired(x.expiresAt));
}
