import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-black text-primary-foreground">
            A2C
          </div>
          <span className="font-[family-name:var(--font-geist-pixel-square)] text-sm font-semibold tracking-tight">
            api2cli
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Registry
          </Link>
          <Link
            href="/docs"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="https://github.com/Melvynx/api2cli"
            target="_blank"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href="/docs/getting-started"
            className="inline-flex h-8 items-center rounded-md bg-primary px-3 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
