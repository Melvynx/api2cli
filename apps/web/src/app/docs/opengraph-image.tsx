import { ImageResponse } from "next/og";
import {
  loadOgFonts,
  OG_SIZE,
  OG_BG_GRADIENT,
  OG_TITLE_GRADIENT,
} from "@/lib/og-fonts";

export const alt = "api2cli Documentation";
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
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontFamily: "GeistBold",
              color: "#64748b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            api2cli
          </div>
          <div style={{ fontSize: 20, color: "#4b5563" }}>/</div>
          <div
            style={{
              fontSize: 20,
              fontFamily: "GeistBold",
              color: "#818cf8",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            docs
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontFamily: "GeistPixel",
            letterSpacing: "-0.02em",
            background: OG_TITLE_GRADIENT,
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
          }}
        >
          Documentation
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: "GeistBold",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
            marginTop: 24,
          }}
        >
          Complete guide to building agent-ready CLI wrappers for REST APIs.
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
