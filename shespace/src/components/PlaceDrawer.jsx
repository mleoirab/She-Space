import React, { useMemo, useState } from "react";
import { checkIn, getPresenceCount } from "./Presence";
import { computeCommunityScore, labelFromScore } from "../utils/scoring";
import { getPlaceInsight } from "../utils/ai";

export default function PlaceDrawer({ place, presenceByPlace, setPresenceByPlace, ratingsByPlace }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const presenceCount = getPresenceCount(presenceByPlace, place.id);
  const ratings = ratingsByPlace[place.id] || [];
  const summary = useMemo(() => computeCommunityScore(ratings), [ratings]);

  const ratingsSummary = summary
    ? `Support score=${summary.community.toFixed(1)} (n=${summary.count}). Avg safe=${summary.avg.safe.toFixed(1)}, welcoming=${summary.avg.welcoming.toFixed(1)}, lighting=${summary.avg.lighting.toFixed(1)}, staff=${summary.avg.staffPresence.toFixed(1)}.`
    : "No ratings yet.";

  const recentComments = ratings.slice(-5).map((r) => r.comment).filter(Boolean);

  async function runAI() {
    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    try {
      const data = await getPlaceInsight({
        placeName: place.name,
        ratingsSummary,
        recentComments,
      });
      setAiResult(data);
    } catch {
      setAiError("AI service not running. Start the Python Gemini service on port 8002.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>{place.name}</h2>
      <div className="muted">Category: {place.category}</div>
      <div className="muted small">Tags: {place.tags.join(", ")}</div>

      <div className="row" style={{ marginTop: 10 }}>
        <div className="pill">Presence now: <b>{presenceCount}</b></div>
        <div className="pill">
          Support score: <b>{summary ? summary.community.toFixed(1) : "—"}</b>{" "}
          <span className="muted">{summary ? `(${labelFromScore(summary.community)})` : ""}</span>
        </div>
      </div>

      <button
        className="primaryBtn"
        style={{ marginTop: 10 }}
        onClick={() => checkIn(presenceByPlace, setPresenceByPlace, place.id)}
      >
        Check in (studying here)
      </button>

      <hr />

      <h3 className="cardTitle">AI Place Insight (Gemini)</h3>
      <p className="muted small">
        Gemini summarizes recent comments into supportive guidance (no identities stored).
      </p>

      <button onClick={runAI} disabled={aiLoading} className="primaryBtn">
        {aiLoading ? "Generating..." : "Generate AI Insight"}
      </button>

      {aiError && <p className="error">{aiError}</p>}

      {aiResult && (
        <div className="aiBox">
          {aiResult.summary && <p><b>Summary:</b> {aiResult.summary}</p>}
          {Array.isArray(aiResult.tags) && aiResult.tags.length > 0 && (
            <p><b>Tags:</b> {aiResult.tags.join(", ")}</p>
          )}
          {aiResult.recommendation && <p><b>Recommendation:</b> {aiResult.recommendation}</p>}
          {aiResult.raw && (
            <>
              <p className="muted small">Raw (fallback):</p>
              <pre className="pre">{aiResult.raw}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
