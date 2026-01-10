import React from "react";
import { POI_CATEGORIES } from "../data/pois";
import { CATEGORY_COLORS } from "../constants/colors";

export default function CategoryToggles({ enabled, setEnabled }) {
  const categories = Object.values(POI_CATEGORIES);

  const toggle = (cat) => setEnabled((prev) => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div className="legend">
      <div className="legendTitle">Places</div>
      {categories.map((cat) => (
        <div key={cat} className="legendRow" onClick={() => toggle(cat)} style={{ cursor: "pointer" }}>
          <span className="dot" style={{ background: CATEGORY_COLORS[cat] }} />
          <span style={{ flex: 1 }}>{cat}</span>
          <span className="muted small">{enabled[cat] ? "ON" : "OFF"}</span>
        </div>
      ))}
    </div>
  );
}
