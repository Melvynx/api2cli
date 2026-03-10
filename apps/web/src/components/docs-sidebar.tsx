"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import type { DocSection } from "@/app/docs/doc-manager";

function SidebarNav({
  sections,
  pathname,
  onLinkClick,
}: {
  sections: DocSection[];
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav className="space-y-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h4 className="mb-2 px-2 font-[family-name:var(--font-geist-pixel-square)] text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            {section.title}
          </h4>
          <ul className="space-y-0.5">
            {section.docs.map((doc) => {
              const active = pathname === doc.url;
              return (
                <li key={doc.slug}>
                  <Link
                    href={doc.url}
                    onClick={onLinkClick}
                    className={`block rounded-lg px-2 py-1.5 text-sm transition-colors ${
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {doc.attributes.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar({ sections }: { sections: DocSection[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="sticky top-16 z-40 m-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground lg:hidden"
        aria-label="Open docs menu"
      >
        <MenuIcon size={18} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-background px-4 py-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-[family-name:var(--font-geist-pixel-square)] text-sm font-semibold">
                Docs
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close docs menu"
              >
                <XIcon size={18} />
              </button>
            </div>
            <SidebarNav
              sections={sections}
              pathname={pathname}
              onLinkClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border/50 px-4 py-8 lg:block">
        <SidebarNav sections={sections} pathname={pathname} />
      </aside>
    </>
  );
}
