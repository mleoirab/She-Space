export function computeCommunityScore(ratings) {
  if (!ratings?.length) return null;

  const keys = ["safe", "welcoming", "lighting", "staffPresence"];
  const sums = Object.fromEntries(keys.map((k) => [k, 0]));

  ratings.forEach((r) => keys.forEach((k) => (sums[k] += (r[k] || 0))));
  const avg = Object.fromEntries(keys.map((k) => [k, sums[k] / ratings.length]));

  const community = (avg.safe + avg.welcoming + avg.lighting + avg.staffPresence) / 4; // 1..5
  return { avg, community, count: ratings.length };
}

export function labelFromScore(score) {
  if (score == null) return "Not enough data";
  if (score >= 4) return "Very supportive";
  if (score >= 3) return "Supportive";
  return "Mixed";
}
