import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const revalidate = 60;

type Params = Promise<{ name: string }>;

export default async function SkillPage({ params }: { params: Params }) {
  const { name } = await params;

  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.name, name))
    .limit(1);

  if (!skill) notFound();

  const resources = (skill.resources ?? []) as {
    name: string;
    description?: string;
    actions: {
      name: string;
      method: string;
      path: string;
      description?: string;
    }[];
  }[];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to registry
          </Link>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted font-mono text-sm font-bold">
              {skill.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">
                  {skill.displayName}
                </h1>
                {skill.verified && (
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {skill.description}
              </p>
            </div>
          </div>
        </div>

        {/* Install */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Install
          </h2>
          <pre className="rounded-xl border border-border bg-card p-4 font-mono text-sm">
            <span className="text-muted-foreground">$ </span>npx api2cli
            install {skill.name}
          </pre>
        </section>

        {/* Quick start */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Start
          </h2>
          <div className="space-y-2">
            <pre className="rounded-xl border border-border bg-card p-4 font-mono text-sm">
              <span className="text-muted-foreground"># Auth</span>
              {"\n"}
              <span className="text-muted-foreground">$ </span>
              {skill.name}-cli auth set &quot;your-token&quot;
              {"\n\n"}
              <span className="text-muted-foreground"># Test</span>
              {"\n"}
              <span className="text-muted-foreground">$ </span>
              {skill.name}-cli --help
            </pre>
          </div>
        </section>

        {/* Info grid */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </h2>
          <div className="grid gap-3 rounded-xl border border-border bg-card p-4 text-sm sm:grid-cols-2">
            {skill.authType && (
              <div>
                <span className="text-muted-foreground">Auth type: </span>
                <span className="font-mono">{skill.authType}</span>
              </div>
            )}
            {skill.version && (
              <div>
                <span className="text-muted-foreground">Version: </span>
                <span className="font-mono">{skill.version}</span>
              </div>
            )}
            {skill.apiBaseUrl && (
              <div>
                <span className="text-muted-foreground">Base URL: </span>
                <span className="font-mono">{skill.apiBaseUrl}</span>
              </div>
            )}
            {skill.npmPackage && (
              <div>
                <span className="text-muted-foreground">npm: </span>
                <span className="font-mono">{skill.npmPackage}</span>
              </div>
            )}
            {skill.docsUrl && (
              <div className="col-span-full">
                <span className="text-muted-foreground">Docs: </span>
                <a
                  href={skill.docsUrl}
                  target="_blank"
                  className="font-mono text-primary underline"
                >
                  {skill.docsUrl}
                </a>
              </div>
            )}
            {skill.githubRepo && (
              <div className="col-span-full">
                <span className="text-muted-foreground">Repo: </span>
                <a
                  href={`https://github.com/${skill.githubRepo}`}
                  target="_blank"
                  className="font-mono text-primary underline"
                >
                  {skill.githubRepo}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Resources / endpoints */}
        {resources.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h2>
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.name}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <h3 className="mb-1 font-mono text-sm font-semibold">
                    {skill.name}-cli {resource.name}
                  </h3>
                  {resource.description && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  )}
                  <div className="space-y-1">
                    {resource.actions.map((action) => (
                      <div
                        key={action.name}
                        className="flex items-center gap-2 font-mono text-xs"
                      >
                        <Badge
                          variant="outline"
                          className="w-14 justify-center text-[10px]"
                        >
                          {action.method}
                        </Badge>
                        <span className="text-muted-foreground">
                          {action.path}
                        </span>
                        <span className="text-foreground/70">
                          → {resource.name} {action.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
