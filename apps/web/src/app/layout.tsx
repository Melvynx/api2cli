import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "api2cli - Turn any API into an agent-ready CLI",
    template: "%s | api2cli",
  },
  description:
    "The open-source marketplace of standardized CLI wrappers for REST APIs. Install in seconds, works with every AI agent.",
  metadataBase: new URL("https://api2cli.dev"),
  keywords: [
    "api2cli",
    "CLI",
    "REST API",
    "AI agent",
    "command line",
    "API wrapper",
    "developer tools",
    "Claude Code",
    "Cursor",
    "Codex",
    "MCP alternative",
    "agent skills",
    "open source",
  ],
  authors: [{ name: "Melvynx", url: "https://github.com/Melvynx" }],
  creator: "Melvynx",
  openGraph: {
    title: "api2cli - Turn any API into an agent-ready CLI",
    description:
      "The open-source marketplace of standardized CLI wrappers for REST APIs. Install in seconds, works with every AI agent.",
    url: "https://api2cli.dev",
    siteName: "api2cli",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "api2cli - Turn any API into an agent-ready CLI",
    description:
      "The open-source marketplace of standardized CLI wrappers for REST APIs.",
    creator: "@maboroshi_melvynx",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  alternates: {
    canonical: "https://api2cli.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
    >
      <body className="antialiased grain">
        <NuqsAdapter>
          <div className="aura" />
          <div className="relative z-10">{children}</div>
        </NuqsAdapter>
      </body>
    </html>
  );
}
