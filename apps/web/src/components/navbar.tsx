"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, XIcon } from "lucide-react";

const navLinks = [
  { href: "/cli", label: "CLIs" },
  { href: "/docs", label: "Docs" },
  { href: "https://github.com/Melvynx/api2cli", label: "GitHub", external: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="api2cli" width={24} height={24} />
          <span className="font-[family-name:var(--font-geist-pixel-square)] text-sm font-semibold tracking-tight">
            api<span style={{ color: "#D54747" }}>2</span>cli
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank" } : {})}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/docs/getting-started"
            className="inline-flex h-8 items-center rounded-md bg-primary px-3 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/docs/getting-started"
            className="inline-flex h-8 items-center rounded-md bg-primary px-3 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                {...(link.external ? { target: "_blank" } : {})}
                className="py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
