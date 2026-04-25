import { ImageResponse } from "next/og";

// This file makes Next.js auto-generate a 1200×630 share-preview image at
// /opengraph-image.png. It's used by LinkedIn, WhatsApp, X, Slack, etc.
// when someone shares the site. No image asset file is needed — the layout
// below is rendered to PNG at build time.

export const alt = "Shenatech — Supply Chain Intelligence for the GCC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          backgroundImage:
            "radial-gradient(circle at 25% 50%, rgba(252,186,2,0.22), transparent 60%), linear-gradient(180deg, #0B0D0F 0%, #14171B 100%)",
          fontFamily: "sans-serif",
          color: "#F5F0E6",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 900,
            letterSpacing: 6,
            color: "#FCBA02",
          }}
        >
          SHENATECH
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 38,
            fontWeight: 400,
            color: "rgba(245, 240, 230, 0.85)",
            textAlign: "center",
          }}
        >
          Supply Chain Intelligence for the GCC
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 110,
            fontSize: 22,
            fontWeight: 500,
            color: "rgba(245, 240, 230, 0.5)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          shenatech.com
        </div>
      </div>
    ),
    size,
  );
}
