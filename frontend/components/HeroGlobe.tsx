"use client";

import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule, geoInterpolate } from "d3-geo";
import { feature as topoFeature } from "topojson-client";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

/**
 * City tuples: [name, lat, lng]. Doha is the super-hub every arc terminates at.
 */
type City = [string, number, number];

const CITIES: City[] = [
  ["New York", 40.71, -74.0],
  ["Los Angeles", 34.05, -118.24],
  ["Chicago", 41.88, -87.63],
  ["Toronto", 43.65, -79.38],
  ["Mexico City", 19.43, -99.13],
  ["San Francisco", 37.77, -122.42],
  ["Miami", 25.76, -80.19],
  ["Vancouver", 49.28, -123.12],
  ["São Paulo", -23.55, -46.63],
  ["Rio de Janeiro", -22.91, -43.17],
  ["Buenos Aires", -34.6, -58.38],
  ["Lima", -12.05, -77.04],
  ["Bogotá", 4.71, -74.07],
  ["Santiago", -33.45, -70.67],
  ["London", 51.51, -0.13],
  ["Paris", 48.86, 2.35],
  ["Berlin", 52.52, 13.4],
  ["Madrid", 40.42, -3.7],
  ["Rome", 41.9, 12.5],
  ["Amsterdam", 52.37, 4.9],
  ["Barcelona", 41.39, 2.17],
  ["Lisbon", 38.72, -9.14],
  ["Stockholm", 59.33, 18.07],
  ["Istanbul", 41.01, 28.98],
  ["Moscow", 55.76, 37.62],
  ["Vienna", 48.21, 16.37],
  ["Cairo", 30.04, 31.24],
  ["Lagos", 6.52, 3.38],
  ["Johannesburg", -26.2, 28.04],
  ["Cape Town", -33.92, 18.42],
  ["Nairobi", -1.29, 36.82],
  ["Casablanca", 33.57, -7.59],
  ["Marrakech", 31.63, -8.01],
  ["Tokyo", 35.68, 139.69],
  ["Shanghai", 31.23, 121.47],
  ["Beijing", 39.9, 116.41],
  ["Hong Kong", 22.32, 114.17],
  ["Seoul", 37.57, 126.98],
  ["Singapore", 1.35, 103.82],
  ["Bangkok", 13.76, 100.5],
  ["Mumbai", 19.08, 72.88],
  ["Delhi", 28.61, 77.21],
  ["Jakarta", -6.21, 106.85],
  ["Manila", 14.6, 120.98],
  ["Doha", 25.29, 51.53],
  ["Karachi", 24.86, 67.01],
  ["Sydney", -33.87, 151.21],
  ["Melbourne", -37.81, 144.96],
  ["Auckland", -36.85, 174.76],
];

const DOHA_PARTNERS = [
  "London", "Paris", "Rome", "Istanbul", "Madrid",
  "Cairo", "Casablanca", "Lagos", "New York",
  "Mumbai", "Delhi", "Karachi", "Bangkok", "Singapore",
  "Shanghai", "Hong Kong", "Tokyo", "Seoul", "Jakarta",
  "Manila", "Sydney",
  "Berlin", "Vienna", "Toronto", "Los Angeles", "San Francisco",
  "Melbourne", "Johannesburg", "Nairobi", "São Paulo", "Buenos Aires",
  "Bogotá", "Miami", "Mexico City",
];

export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.pointerEvents = "none";

    const projection = geoOrthographic().clipAngle(90).precision(0.5);
    const path = geoPath(projection, ctx);

    const idx = (n: string) => CITIES.findIndex((c) => c[0] === n);
    const dohaIdx = idx("Doha");

    const ARCS: Array<[number, number]> = [];
    const seen = new Set<string>();
    for (const name of DOHA_PARTNERS) {
      if (seen.has(name)) continue;
      seen.add(name);
      const t = idx(name);
      if (t >= 0 && dohaIdx >= 0) ARCS.push([dohaIdx, t]);
    }

    const connected = new Set<number>();
    for (const [a, b] of ARCS) {
      connected.add(a);
      connected.add(b);
    }

    const arcInterps = ARCS.map(([ai, bi]) => {
      const a = CITIES[ai], b = CITIES[bi];
      return geoInterpolate([a[2], a[1]], [b[2], b[1]]);
    });

    const arcFeatures: Feature<Geometry, GeoJsonProperties>[] = ARCS.map(
      ([ai, bi]) => {
        const a = CITIES[ai], b = CITIES[bi];
        return {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              [a[2], a[1]],
              [b[2], b[1]],
            ],
          },
        };
      },
    );

    const arcMeta = ARCS.map((_, i) => ({
      period: 3.8 + ((i * 1.37) % 1) * 3.2,
      phase: (i * 0.6180339) % 1,
      dir: i % 2 === 0 ? 1 : -1,
    }));

    let cx = 0, cy = 0, R = 0, size = 0, dpr = 1;
    const rot: [number, number, number] = [-30, -12, 0];

    function resize() {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? window.innerWidth;
      const h = parent?.clientHeight ?? window.innerHeight;
      size = Math.min(w, h);
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = size / 2;
      cy = size / 2;
      R = size / 2 - 8;
      projection.scale(R).translate([cx, cy]);
    }

    function isOnFront(lng: number, lat: number): boolean {
      const lam = (-rot[0] * Math.PI) / 180;
      const phi = (-rot[1] * Math.PI) / 180;
      const la = (lat * Math.PI) / 180;
      const lo = (lng * Math.PI) / 180;
      const cosC =
        Math.sin(phi) * Math.sin(la) +
        Math.cos(phi) * Math.cos(la) * Math.cos(lo - lam);
      return cosC > 0.02;
    }

    let landGeo: FeatureCollection<Geometry, GeoJsonProperties> | null = null;
    let cancelled = false;

    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;

        const land = topoFeature(topo, topo.objects.land) as
          | Feature<Geometry, GeoJsonProperties>
          | FeatureCollection<Geometry, GeoJsonProperties>;

        landGeo =
          land.type === "FeatureCollection"
            ? land
            : {
                type: "FeatureCollection",
                features: [land],
              };
      })
      .catch(() => {});

    function drawGlobeBody() {
      if (!ctx) return;
      const g = ctx.createRadialGradient(cx, cy, R * 0.94, cx, cy, R * 1.32);
      g.addColorStop(0.0, "rgba(252,186,2, 0.24)");
      g.addColorStop(0.55, "rgba(252,186,2, 0.08)");
      g.addColorStop(1.0, "rgba(252,186,2, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.32, 0, Math.PI * 2);
      ctx.fill();

      const og = ctx.createRadialGradient(
        cx + R * 0.3,
        cy - R * 0.3,
        R * 0.08,
        cx,
        cy,
        R,
      );
      og.addColorStop(0.0, "#1a1a1a");
      og.addColorStop(0.55, "#0c0c0c");
      og.addColorStop(1.0, "#000000");
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawLand() {
      if (!ctx || !landGeo) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "rgba(252,186,2, 0.42)";
      ctx.strokeStyle = "rgba(252,186,2, 0.85)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      path(landGeo);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function drawGraticule() {
      if (!ctx) return;
      const grat = geoGraticule().step([20, 20])();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(252,186,2, 0.14)";
      ctx.lineWidth = 0.5;
      path(grat);
      ctx.stroke();
    }

    function drawOutline() {
      if (!ctx) return;
      ctx.strokeStyle = "rgba(252,186,2, 0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawArcs(t: number) {
      if (!ctx) return;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.strokeStyle = "rgba(252,186,2, 0.45)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (const f of arcFeatures) path(f);
      ctx.stroke();

      ctx.strokeStyle = "rgba(252,186,2, 0.85)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (const f of arcFeatures) path(f);
      ctx.stroke();

      const tSec = t / 1000;
      for (let i = 0; i < arcFeatures.length; i++) {
        const interp = arcInterps[i];
        const meta = arcMeta[i];
        let f = (tSec / meta.period + meta.phase) % 1;
        if (meta.dir < 0) f = 1 - f;
        const geo = interp(f);
        if (!isOnFront(geo[0], geo[1])) continue;
        const p = projection(geo as [number, number]);
        if (!p) continue;

        ctx.fillStyle = "rgba(252,186,2, 0.45)";
        ctx.beginPath();
        ctx.arc(p[0], p[1], 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(251, 248, 238, 1)";
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawCities() {
      if (!ctx) return;
      for (let i = 0; i < CITIES.length; i++) {
        if (!connected.has(i)) continue;
        const c = CITIES[i];
        if (!isOnFront(c[2], c[1])) continue;
        const p = projection([c[2], c[1]]);
        if (!p) continue;
        const isDoha = c[0] === "Doha";

        ctx.fillStyle = isDoha
          ? "rgba(250,181,11, 1)"
          : "rgba(252,186,2, 0.85)";
        ctx.beginPath();
        ctx.arc(p[0], p[1], isDoha ? 2.8 : 1.4, 0, Math.PI * 2);
        ctx.fill();

        if (isDoha) {
          ctx.strokeStyle = "rgba(250,181,11, 0.55)";
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(p[0], p[1], 6, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = "rgba(252,186,2, 0.3)";
          ctx.beginPath();
          ctx.arc(p[0], p[1], 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    let rafId = 0;

    function frame(t: number) {
      if (!ctx || !canvas) return;
      rot[0] += 0.08;
      projection.rotate(rot);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGlobeBody();
      drawLand();
      drawGraticule();
      drawOutline();
      drawArcs(t);
      drawCities();
      rafId = requestAnimationFrame(frame);
    }

    resize();
    projection.rotate(rot);
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const paintOnce = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGlobeBody();
        drawLand();
        drawGraticule();
        drawOutline();
        drawArcs(0);
        drawCities();
      };

      paintOnce();

      const check = setInterval(() => {
        if (landGeo) {
          paintOnce();
          clearInterval(check);
        }
      }, 120);

      return () => {
        cancelled = true;
        clearInterval(check);
        window.removeEventListener("resize", resize);
      };
    } else {
      rafId = requestAnimationFrame(frame);
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
      };
    }
  }, []);

  return (
    <div className="hero__globe" aria-hidden="true">
      <canvas ref={canvasRef} id="hero-globe" />
    </div>
  );
}