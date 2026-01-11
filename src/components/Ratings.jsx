import React, { useMemo, useState } from "react";
import { save } from "../utils/storage";
import { computeCommunityScore, labelFromScore } from "../utils/scoring";

export default function Ratings({ placeId, ratingsByPlace, setRatingsByPlace }) {
  const [form, setForm] = useState({
    safe: 4, welcoming: 4, lighting: 4, staffPresence: 3, comment: ""
  });

  const ratings = ratingsByPlace[placeId] || [];
  const summary = useMemo(() => computeCommunityScore(ratings), [ratings]);

  const submit = () => {
    setRatingsByPlace(prev => {
      const copy = structuredClone(prev);
      copy[placeId] = [...(copy[placeId] || []), { ...form, createdAt: Date.now() }];
      save("ratingsByPlace", copy);
      return copy;
    });
    setForm(f => ({ ...f, comment: "" }));
  };

  return (
    <div className="card">
      <h3 className="cardTitle">Ratings</h3>

      {summary ? (
        <p className="muted">
          Support Score: <b>{summary.community.toFixed(1)}</b> ({labelFromScore(summary.community)}) • {summary.count} rating(s)
        </p>
      ) : <p className="muted">No ratings yet.</p>}

      <div className="formGrid">
        {[
          ["safe", "Feeling safe"],
          ["welcoming", "Welcoming to women & gender-diverse people"],
          ["lighting", "Lighting"],
          ["staffPresence", "Staff presence"],
        ].map(([k, label]) => (
          <label key={k} className="rangeRow">
            <span>{label}</span>
            <input
              type="range"
              min="1" max="5"
              value={form[k]}
              onChange={e => setForm({ ...form, [k]: Number(e.target.value) })}
            />
            <b>{form[k]}</b>
          </label>
        ))}

        <textarea
          className="textarea"
          placeholder="Optional comment (e.g., bright, staff nearby, felt comfortable)"
          value={form.comment}
          onChange={e => setForm({ ...form, comment: e.target.value })}
        />

        <button className="primaryBtn" onClick={submit}>Submit rating</button>
      </div>

      <div className="list">
        {ratings.slice().reverse().slice(0, 5).map((r, idx) => (
          <div className="listItem" key={idx}>
            <div className="muted small">{new Date(r.createdAt).toLocaleString()}</div>
            <div className="small">
              safe {r.safe} • welcoming {r.welcoming} • lighting {r.lighting} • staff {r.staffPresence}
            </div>
            {r.comment && <div className="quote">“{r.comment}”</div>}
          </div>
        ))}
      </div>
    </div>
  );
}



