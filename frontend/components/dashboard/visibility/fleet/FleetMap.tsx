"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/lib/ThemeContext";
import { CITIES, type Vehicle, type VehicleStatus } from "./fleetData";

/**
 * FleetMap — the "Map" view of the Fleet monitor. Plots every (filtered)
 * vehicle on a real Leaflet/OpenStreetMap map at its current city, with a
 * small deterministic offset so vehicles in the same city don't stack.
 * Truck markers are colored by vehicle status.
 *
 * Loaded via next/dynamic({ ssr:false }) from FleetMonitor.
 */

type LatLng = [number, number];

const STATUS_COLOR: Record<VehicleStatus, string> = {
  driving: "#22C55E",
  idle: "#64748B",
  loading: "#3B82F6",
  maintenance: "#F59E0B",
};

// Deterministic small offset (no Math.random → hydration-safe).
function offsetFor(index: number): LatLng {
  const ring = [
    [0, 0], [0.22, 0.22], [-0.22, 0.18], [0.18, -0.24],
    [-0.2, -0.2], [0.3, 0], [0, 0.3], [-0.3, 0.1],
  ];
  const o = ring[index % ring.length];
  return [o[0], o[1]];
}

function vehicleIcon(color: string, plate: string) {
  return L.divIcon({
    className: "vis-fl-lf-vehwrap",
    html: `<span class="vis-fl-lf-veh" style="--vk:${color}">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M1 16V7h12v9M13 10h4l3 3v3h-7M5 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 5 19zM16 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 16 19z" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span><span class="vis-fl-lf-plate">${plate}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

function FitAll({ points }: { points: LatLng[] }) {
  const map = useMap();
  const sig = points.map((p) => p.join(",")).join("|");
  useEffect(() => {
    map.invalidateSize();
    if (points.length === 1) map.setView(points[0], 7);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 7 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  return null;
}

export function FleetMap({ vehicles }: { vehicles: Vehicle[] }) {
  const { theme } = useTheme();

  const points: LatLng[] = vehicles.map((v, i) => {
    const c = CITIES[v.currentCity];
    const [dLat, dLng] = offsetFor(i);
    return [c.lat + dLat, c.lng + dLng];
  });

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="vis-fl-map">
      <MapContainer
        className="vis-tr-map__leaflet"
        center={[25.5, 50.5]}
        zoom={5}
        scrollWheelZoom={false}
        zoomControl
        attributionControl
      >
        <TileLayer
          key={theme}
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {vehicles.map((v, i) => (
          <Marker key={v.id} position={points[i]} icon={vehicleIcon(STATUS_COLOR[v.status], v.plate)} />
        ))}
        <FitAll points={points} />
      </MapContainer>
    </div>
  );
}
