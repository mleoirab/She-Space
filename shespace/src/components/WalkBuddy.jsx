import React, { useMemo, useState } from "react";
import { minutesFromNow, pruneExpired } from "../utils/time";
import { save } from "../utils/storage";

export default function WalkBuddy({ places, walkPosts, setWalkPosts }) {
  const [from, setFrom] = useState(places[0]?.id || "");
  const [to, setTo] = useState(places[0]?.id || "");
  const [mins, setMins] = useState(15);
  
  const defaultMeet = (pid) => {
    const p = places.find((x) => x.id === pid);
    return p ? `Meet at ${p.name} main entrance` : "Meet at main entrance";
  };
  const [customMeet, setCustomMeet] = useState("");
  const [autoMeet, setAutoMeet] = useState(true);

  // Compute meeting spot based on auto mode or custom input
  const meet = autoMeet ? defaultMeet(from) : customMeet;

  const active = useMemo(() => pruneExpired(walkPosts), [walkPosts]);
  const nameOf = (id) => places.find((p) => p.id === id)?.name || id;

  const createPost = () => {
    const post = {
      id: crypto.randomUUID(),
      fromPlaceId: from,
      toPlaceId: to,
      timeWindowMins: mins,
      expiresAt: minutesFromNow(mins),
      meetAt: meet,
      interest: 0,
      createdAt: Date.now(),
    };
    const next = [...active, post];
    setWalkPosts(next);
    save("walkPosts", next);
  };

  const join = (id) => {
    const next = active.map((p) => (p.id === id ? { ...p, interest: p.interest + 1 } : p));
    setWalkPosts(next);
    save("walkPosts", next);
  };

  return (
    <div className="card">
      <h3 className="cardTitle">Walk Buddy</h3>

      <div className="row">
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {places.map((p) => <option key={p.id} value={p.id}>From: {p.name}</option>)}
        </select>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {places.map((p) => <option key={p.id} value={p.id}>To: {p.name}</option>)}
        </select>

        <select value={mins} onChange={(e) => setMins(Number(e.target.value))}>
          {[10, 15, 20].map((m) => <option key={m} value={m}>{m} min</option>)}
        </select>

        <input
          value={meet}
          onChange={(e) => { setCustomMeet(e.target.value); setAutoMeet(false); }}
          placeholder="Meeting spot (e.g., main entrance)"
          aria-label="Meeting spot"
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd", flex: 1 }}
        />

        <button className="primaryBtn" onClick={createPost}>Post</button>
      </div>

      {active.length === 0 ? (
        <p className="muted">No active walk buddy posts.</p>
      ) : (
        <div className="list">
          {active.map((p) => (
            <div className="listItem" key={p.id}>
              <div className="small"><b>{nameOf(p.fromPlaceId)}</b> → <b>{nameOf(p.toPlaceId)}</b></div>
              <div className="muted small">
                Leaving in next {p.timeWindowMins} min • Expires {new Date(p.expiresAt).toLocaleTimeString()}
              </div>
              {p.meetAt && (
                <div className="small" style={{ marginTop: 6 }}>
                  <span role="img" aria-label="pin">📍</span> {p.meetAt}
                </div>
              )}
              <div className="row" style={{ marginTop: 8 }}>
                <button onClick={() => join(p.id)}>I’m interested</button>
                <span className="muted">Interest: {p.interest}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
