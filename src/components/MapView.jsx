import React, { useEffect } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../leafletFix";
import { CATEGORY_COLORS } from "./CategoryToggles";

function FitBounds({ places }) {
    const map = useMap();
    useEffect(() => {
        const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [40, 90] }); // room for legend / bottom space
    }, [map, places]);
    return null;
}

export default function MapView({ places, onSelectPlace, presenceByPlace, getPresenceCount, scoreByPlace }) {
  const fallbackCenter = [43.0096, -81.2737]; // Western core

return (
    <MapContainer center={fallbackCenter} zoom={15} style={{ height: "100%", width: "100%" }}>
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.length > 0 && <FitBounds places={places} />}

        {places.map((p) => {
            const color = CATEGORY_COLORS[p.category] || "#111";
            const presence = getPresenceCount(presenceByPlace, p.id);
            const score = scoreByPlace?.[p.id]?.score;

        return (
            <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={10}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
                eventHandlers={{ click: () => onSelectPlace(p.id) }}
            >
                <Popup>
                    <b>{p.name}</b>
                    <div className="muted small">{p.category}</div>
                    <div>Presence now: <b>{presence}</b></div>
                    <div>Support score: <b>{score ?? "—"}</b></div>
                </Popup>
            </CircleMarker>
        );
        })}
    </MapContainer>
);
}
