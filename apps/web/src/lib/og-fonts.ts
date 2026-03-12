import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_BG_GRADIENT =
  "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)";

export const OG_TITLE_GRADIENT =
  "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)";

export async function loadOgFonts() {
  const [pixelFont, boldFont, monoFont] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/GeistPixel-Square.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/GeistMono-Regular.ttf")),
  ]);

  return [
    {
      name: "GeistPixel",
      data: pixelFont,
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: "GeistBold",
      data: boldFont,
      style: "normal" as const,
      weight: 700 as const,
    },
    {
      name: "GeistMono",
      data: monoFont,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}
