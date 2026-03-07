import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-foreground">
            api2cli
          </span>
          <span>— Skillathon #1, SF 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/Melvynx/api2cli"
            target="_blank"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href="https://melvynx.com"
            target="_blank"
            className="transition-colors hover:text-foreground"
          >
            @melvynx
          </Link>
        </div>
      </div>
    </footer>
  );
}
