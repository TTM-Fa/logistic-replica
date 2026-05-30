"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { T } from "@/lib/T";
import { CITIES, type CityId, type Shipment } from "./transportsData";

/**
 * GccLeafletMap — the real map panel for the Transports page.
 *
 * Uses Leaflet + OpenStreetMap (via free CARTO basemap tiles, themed
 * light/dark). The selected shipment's route is fetched from the OSRM
 * public routing API so the line follows ACTUAL ROADS; a live truck
 * marker is placed along that road geometry at the shipment's progress.
 * If OSRM is unreachable, it falls back to a straight line.
 *
 * Leaflet touches `window`, so this component is loaded with
 * `next/dynamic({ ssr: false })` from TransportsView — it never renders
 * on the server.
 */

type LatLng = [number, number];

// ─── Distance + point-along helpers (for the truck marker) ────────────
function haversine(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The point a given fraction (0–1) of the way along a polyline. */
function pointAlong(coords: LatLng[], frac: number): LatLng {
  if (coords.length < 2) return coords[0] ?? [25.5, 50.5];
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const d = haversine(coords[i - 1], coords[i]);
    segs.push(d);
    total += d;
  }
  const target = total * Math.min(Math.max(frac, 0), 1);
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= target) {
      const t = segs[i] === 0 ? 0 : (target - acc) / segs[i];
      const a = coords[i];
      const b = coords[i + 1];
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    acc += segs[i];
  }
  return coords[coords.length - 1];
}

// ─── Marker icons (HTML divIcons — avoids broken default image paths) ──
function cityIcon(label: string, active: boolean) {
  return L.divIcon({
    className: "vis-tr-lf-citywrap",
    html: `<span class="vis-tr-lf-citydot${active ? " is-active" : ""}"></span><span class="vis-tr-lf-citylabel">${label}</span>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function truckIcon(color: string) {
  return L.divIcon({
    className: "vis-tr-lf-truckwrap",
    html: `<span class="vis-tr-lf-truck" style="--tk:${color}">
        <span class="vis-tr-lf-truck-pulse"></span>
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M1 16V7h12v9M13 10h4l3 3v3h-7M5 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 5 19zM16 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 16 19z" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

// ─── Imperatively keep the map sized + framed to the active coords ────
function MapController({ fitCoords }: { fitCoords: LatLng[] }) {
  const map = useMap();
  const sig = fitCoords.map((c) => c.join(",")).join("|");
  useEffect(() => {
    // Leaflet sometimes mounts before the container has its final size.
    map.invalidateSize();
    if (fitCoords.length === 1) {
      map.setView(fitCoords[0], 7);
    } else if (fitCoords.length > 1) {
      map.fitBounds(L.latLngBounds(fitCoords), { padding: [45, 45], maxZoom: 8 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  return null;
}

export function GccLeafletMap({
  shipments,
  selectedId,
}: {
  shipments: Shipment[];
  selectedId: string | null;
}) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const cityName = (id: CityId) =>
    lang === "ar" ? CITIES[id].nameAr : CITIES[id].name;

  const selected = shipments.find((s) => s.id === selectedId) ?? null;

  // Road geometry for the selected route (from OSRM); straight-line fallback.
  const [routeCoords, setRouteCoords] = useState<LatLng[] | null>(null);

  useEffect(() => {
    if (!selected) {
      setRouteCoords(null);
      return;
    }
    const from = CITIES[selected.from];
    const to = CITIES[selected.to];
    const straight: LatLng[] = [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ];
    // Show the straight line immediately, then upgrade to road geometry.
    setRouteCoords(straight);

    let cancelled = false;
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const geo = data?.routes?.[0]?.geometry?.coordinates;
        if (Array.isArray(geo) && geo.length > 1) {
          // OSRM returns [lng, lat]; Leaflet wants [lat, lng].
          setRouteCoords(geo.map(([lng, lat]: [number, number]) => [lat, lng]));
        }
      })
      .catch(() => {
        /* keep the straight-line fallback already set */
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Which cities to mark: the selected route's two endpoints, or — when
  // nothing is selected — every city involved in the visible list.
  const involvedCities = useMemo(() => {
    if (selected) return [selected.from, selected.to];
    const set = new Set<CityId>();
    shipments.forEach((s) => {
      set.add(s.from);
      set.add(s.to);
    });
    return [...set];
  }, [selected, shipments]);

  // What to frame the map around.
  const fitCoords: LatLng[] = useMemo(() => {
    if (routeCoords && routeCoords.length > 1) return routeCoords;
    return involvedCities.map((id) => [CITIES[id].lat, CITIES[id].lng] as LatLng);
  }, [routeCoords, involvedCities]);

  // Truck marker only when there is a live feed and the trip is active.
  const showTruck =
    selected !== null &&
    selected.tracking &&
    selected.progress < 1 &&
    selected.status !== "cancelled" &&
    routeCoords !== null;
  const truckColor = selected?.status === "delayed" ? "#EF4444" : "#22C55E";
  const truckPos =
    showTruck && routeCoords ? pointAlong(routeCoords, selected!.progress) : null;

  // Free CARTO basemaps — light (Positron) / dark, OSM-attributed.
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="vis-tr-map">
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

        {/* Selected route — follows real roads (OSRM) */}
        {routeCoords && routeCoords.length > 1 && (
          <>
            {/* Soft casing under the main line for contrast */}
            <Polyline positions={routeCoords} pathOptions={{ color: "#0B0D0F", opacity: 0.18, weight: 7 }} />
            <Polyline
              positions={routeCoords}
              pathOptions={{ color: "#FCBA02", weight: 4, opacity: 0.95, lineCap: "round" }}
            />
          </>
        )}

        {/* City markers */}
        {involvedCities.map((id) => {
          const c = CITIES[id];
          const active =
            selected !== null && (selected.from === id || selected.to === id);
          return (
            <Marker
              key={id}
              position={[c.lat, c.lng]}
              icon={cityIcon(cityName(id), active)}
            />
          );
        })}

        {/* Live truck marker */}
        {truckPos && (
          <Marker position={truckPos} icon={truckIcon(truckColor)} />
        )}

        <MapController fitCoords={fitCoords} />
      </MapContainer>

      {/* Live badge overlay */}
      {selected?.tracking && selected.status !== "completed" && (
        <span className="vis-tr-map__live">
          <span className="vis-tr-map__live-dot" aria-hidden="true" />
          <T id="visibility.tr.map.live_badge" />
        </span>
      )}

      {/* Route caption / hint overlay */}
      <div className="vis-tr-map__legend">
        {selected ? (
          <span className="vis-tr-map__legend-route">
            {cityName(selected.from)}
            <svg viewBox="0 0 14 14" width="11" height="11" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {cityName(selected.to)}
          </span>
        ) : (
          <span className="vis-tr-map__legend-hint">
            <T id="visibility.tr.map.select_hint" />
          </span>
        )}
      </div>
    </div>
  );
}
