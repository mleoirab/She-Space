import React, { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import "./leafletFix";
import "./styles.css";

import { WESTERN_POIS, POI_CATEGORIES } from "./data/pois";
import { load, save } from "./utils/storage";
import { pruneExpired } from "./utils/time";
import { simulatePresence } from "./utils/simulate";
import { computeCommunityScore, labelFromScore } from "./utils/scoring";

import MapView from "./components/MapView";
import CategoryToggles from "./components/CategoryToggles";
import PlaceDrawer from "./components/PlaceDrawer";
import Ratings from "./components/Ratings";
import WalkBuddy from "./components/WalkBuddy";
import { getPresenceCount } from "./components/Presence";

/**
 * App.jsx = Integration hub
 * Owner: Member 1 only
 */
export default function App() {
  const [selectedPlaceId, setSelectedPlaceId] = useState(WESTERN_POIS[0].id);

  const [ratingsByPlace, setRatingsByPlace] = useState(() => load("ratingsByPlace", {}));
  const [presenceByPlace, setPresenceByPlace] = useState(() => load("presenceByPlace", {}));
  const [walkPosts, setWalkPosts] = useState(() => load("walkPosts", []));
  const [simulateLive, setSimulateLive] = useState(true);

  const [enabledCats, setEnabledCats] = useState(() => ({
    [POI_CATEGORIES.LIBRARY]: true,
    [POI_CATEGORIES.STUDY]: true,
    [POI_CATEGORIES.AFFILIATE]: true,
    [POI_CATEGORIES.CAMPUS]: true,
  }));

  const places = useMemo(() => WESTERN_POIS.filter((p) => enabledCats[p.category]), [enabledCats]);

  const selectedPlace = useMemo(
    () => WESTERN_POIS.find((p) => p.id === selectedPlaceId) || WESTERN_POIS[0],
    [selectedPlaceId]
  );

  const scoreByPlace = useMemo(() => {
    const obj = {};
    for (const p of WESTERN_POIS) {
      const summary = computeCommunityScore(ratingsByPlace[p.id] || []);
      obj[p.id] = summary
        ? { score: Number(summary.community.toFixed(1)), label: labelFromScore(summary.community) }
        : { score: null, label: "Not enough data" };
    }
    return obj;
  }, [ratingsByPlace]);

  useEffect(() => save("ratingsByPlace", ratingsByPlace), [ratingsByPlace]);
  useEffect(() => save("walkPosts", walkPosts), [walkPosts]);
  useEffect(() => save("presenceByPlace", presenceByPlace), [presenceByPlace]);

  // 🔥 Sync presence across browser tabs (pseudo multi-user)
useEffect(() => {
  const onStorage = (e) => {
    if (e.key === "presenceByPlace" && e.newValue) {
      setPresenceByPlace(JSON.parse(e.newValue));
    }
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);


  useEffect(() => {
    const placeIds = WESTERN_POIS.map((p) => p.id);

    const interval = setInterval(() => {
      setPresenceByPlace((prev) => {
        const copy = structuredClone(prev);
        for (const pid of placeIds) copy[pid] = pruneExpired(copy[pid] || []);
        return simulatePresence(copy, simulateLive, placeIds);
      });

      setWalkPosts((prev) => pruneExpired(prev));
    }, 10000);

    return () => clearInterval(interval);
  }, [simulateLive]);

  return (
    <div className="layout">
      <div className="left">
        <div className="header">
          <div>
            <h1 className="title">SheSpace</h1>
            {/* <p className="subtitle">
              Women-friendly STEM study zones • privacy-first • AI insight (Gemini)
            </p> */}
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={simulateLive}
              onChange={(e) => setSimulateLive(e.target.checked)}
            />
            Simulated Live
          </label>
        </div>

        <PlaceDrawer
          place={selectedPlace}
          presenceByPlace={presenceByPlace}
          setPresenceByPlace={setPresenceByPlace}
          ratingsByPlace={ratingsByPlace}
        />

        <Ratings
          placeId={selectedPlace.id}
          ratingsByPlace={ratingsByPlace}
          setRatingsByPlace={setRatingsByPlace}
        />

        <WalkBuddy places={WESTERN_POIS} walkPosts={walkPosts} setWalkPosts={setWalkPosts} />
      </div>

      <div className="right">
        <div className="mapWrap" style={{ position: "relative" }}>
          <CategoryToggles enabled={enabledCats} setEnabled={setEnabledCats} />

          <MapView
            places={places}
            onSelectPlace={setSelectedPlaceId}
            presenceByPlace={presenceByPlace}
            getPresenceCount={getPresenceCount}
            scoreByPlace={scoreByPlace}
          />
        </div>
      </div>
    </div>
  );
}
