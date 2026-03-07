"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/getting-started" },
    ],
  },
  {
    title: "Build a CLI",
    items: [
      { title: "Create a CLI", href: "/docs/create-cli" },
      { title: "Add Resources", href: "/docs/resources" },
      { title: "Commands Reference", href: "/docs/commands" },
    ],
  },
  {
    title: "Ecosystem",
    items: [
      { title: "Agent Integration", href: "/docs/agent-integration" },
      { title: "Registry", href: "/docs/marketplace" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border/50 px-4 py-8 lg:block">
      <nav className="space-y-6">
        {NAV.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 px-2 font-[family-name:var(--font-geist-pixel-square)] text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              {section.title}
            </h4>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
