import Image from "next/image";
import { Suspense } from "react";
import { SponsorBar } from "./sponsor-bar";

export function Footer() {
  return (
    <>
      <Suspense fallback={<SponsorBarSkeleton />}>
        <SponsorBar />
      </Suspense>
      <footer className="border-t border-border/50 bg-muted/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="api2cli" width={24} height={24} />
            <span className="font-[family-name:var(--font-geist-pixel-square)] text-xs text-muted-foreground/60">
              api<span style={{ color: "#D54747" }}>2</span>cli
            </span>
          </div>
          <a
            href="mailto:contact@api2cli.dev"
            className="text-xs text-muted-foreground/40 transition-colors hover:text-muted-foreground"
          >
            Contact
          </a>
        </div>
      </footer>
    </>
  );
}

function SponsorBarSkeleton() {
  return (
    <section className="border-y border-border/30 bg-muted/5 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-4 text-center">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground/40 uppercase">
            Sponsors
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex min-h-[72px] items-center rounded-xl border border-dashed border-border/40 bg-card/10"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
