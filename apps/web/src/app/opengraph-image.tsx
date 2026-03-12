import { ImageResponse } from "next/og";
import {
  loadOgFonts,
  OG_SIZE,
  OG_BG_GRADIENT,
  OG_TITLE_GRADIENT,
} from "@/lib/og-fonts";

export const alt = "api2cli - Turn any API into an agent-ready CLI";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          background: OG_BG_GRADIENT,
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontFamily: "GeistPixel",
              letterSpacing: "-0.02em",
              background: OG_TITLE_GRADIENT,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            api2cli
          </div>
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: "GeistBold",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Turn any API into an agent-ready CLI
        </div>
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 48,
            fontSize: 18,
            fontFamily: "GeistBold",
            color: "#64748b",
          }}
        >
          <span>Open Source</span>
          <span style={{ color: "#4b5563" }}>·</span>
          <span>40+ AI Agents</span>
          <span style={{ color: "#4b5563" }}>·</span>
          <span>Install in Seconds</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
