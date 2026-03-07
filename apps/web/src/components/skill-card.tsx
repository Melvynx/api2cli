import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Skill } from "@/db/schema";
import Link from "next/link";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/skills/${skill.name}`}>
      <Card className="group h-full transition-all hover:border-primary/40 hover:bg-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted font-mono text-xs font-bold">
                {skill.displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-mono text-sm font-semibold leading-tight">
                  {skill.name}-cli
                </h3>
                <p className="text-xs text-muted-foreground">
                  v{skill.version}
                </p>
              </div>
            </div>
            {skill.verified && (
              <Badge
                variant="secondary"
                className="text-[10px] font-medium uppercase tracking-wider"
              >
                Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {skill.description && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {skill.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">
              {skill.authType ?? "bearer"}
            </span>
            {skill.downloads != null && skill.downloads > 0 && (
              <>
                <span className="text-border">·</span>
                <span>{skill.downloads.toLocaleString()} installs</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
