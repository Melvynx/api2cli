import { ImageResponse } from "next/og";
import {
  loadOgFonts,
  OG_SIZE,
  OG_BG_GRADIENT,
  OG_TITLE_GRADIENT,
} from "@/lib/og-fonts";

export const alt = "CLIs - api2cli";
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
            fontSize: 20,
            fontFamily: "GeistBold",
            color: "#64748b",
            marginBottom: 16,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          api2cli
        </div>
        <div
          style={{
            fontSize: 64,
            fontFamily: "GeistPixel",
            letterSpacing: "-0.02em",
            background: OG_TITLE_GRADIENT,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          CLIs
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: "GeistBold",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
            marginTop: 24,
          }}
        >
          Browse community-built CLI wrappers for REST APIs
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "16px 32px",
            fontSize: 18,
            fontFamily: "GeistMono",
            color: "#94a3b8",
          }}
        >
          npx api2cli install &lt;name&gt;
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
