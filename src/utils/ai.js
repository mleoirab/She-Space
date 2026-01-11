export async function getPlaceInsight({ placeName, ratingsSummary, recentComments }) {
  const res = await fetch("http://localhost:8000/place-insight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      place_name: placeName,
      ratings_summary: ratingsSummary,
      recent_comments: recentComments,
    }),
  });

  if (!res.ok) throw new Error("AI service unavailable");
  return await res.json();
}


