import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

type Params = Promise<{ name: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { name } = await params;
  const [skill] = await db.select().from(skills).where(eq(skills.name, name)).limit(1);
  if (!skill) return { title: "Not Found - api2cli" };
  return {
    title: `${skill.displayName} - api2cli`,
    description: skill.description || `Install ${skill.displayName} CLI with npx api2cli install ${skill.name}`,
    alternates: { canonical: `https://api2cli.dev/cli/${skill.name}` },
    openGraph: {
      title: `${skill.displayName} - api2cli`,
      description: skill.description || `Install ${skill.displayName} CLI`,
      url: `https://api2cli.dev/cli/${skill.name}`,
      type: "website",
    },
  };
}

export default async function CliDetailPage({ params }: { params: Params }) {
  const { name } = await params;

  const [skill] = await db
    .select()
    .from(skills)
    .where(eq(skills.name, name))
    .limit(1);

  if (!skill) notFound();

  const cliJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: skill.displayName,
        description:
          skill.description ||
          `CLI wrapper for the ${skill.displayName} API`,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Linux, Windows",
        url: `https://api2cli.dev/cli/${skill.name}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        ...(skill.authorGithub && {
          author: {
            "@type": "Person",
            name: skill.authorGithub,
            url: `https://github.com/${skill.authorGithub}`,
          },
        }),
        ...(skill.version && { softwareVersion: skill.version }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://api2cli.dev",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "CLIs",
            item: "https://api2cli.dev/cli",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: skill.displayName,
          },
        ],
      },
    ],
  };

  const repoUrl = skill.githubRepo?.startsWith("http")
    ? skill.githubRepo
    : skill.githubRepo
      ? `https://github.com/${skill.githubRepo}`
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cliJsonLd) }}
      />
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
        <div className="mb-10">
          <Link
            href="/cli"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back to CLIs
          </Link>
          <div className="mt-4 flex items-start gap-4">
            {skill.authorGithub ? (
              <img
                src={`https://github.com/${skill.authorGithub}.png?size=48`}
                alt={skill.authorGithub}
                className="h-12 w-12 rounded-lg"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted font-mono text-sm font-bold">
                {skill.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
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
              {/* Tags */}
              {((skill.tags as string[]) ?? []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {((skill.tags as string[]) ?? []).map((tag) => (
                    <Link
                      key={tag}
                      href={`/cli?tag=${encodeURIComponent(tag)}`}
                      className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Install */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Install
          </h2>
          <pre className="rounded-xl border border-border bg-card p-4 font-mono text-sm">
            <span className="text-muted-foreground">$ </span>
            {`npx api2cli install ${skill.name}`}
          </pre>
        </section>

        {/* Details */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </h2>
          <div className="grid gap-3 rounded-xl border border-border bg-card p-4 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Skill type: </span>
              <span className="font-mono">{skill.skillType === "public" ? "Public CLI" : "Generated CLI"}</span>
            </div>
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
            {skill.authorGithub && (
              <div>
                <span className="text-muted-foreground">Author: </span>
                <a
                  href={`https://github.com/${skill.authorGithub}`}
                  target="_blank"
                  className="font-mono text-primary underline"
                >
                  {skill.authorGithub}
                </a>
              </div>
            )}
            {skill.downloads != null && (
              <div>
                <span className="text-muted-foreground">Views: </span>
                <span className="font-mono">{skill.downloads.toLocaleString()}</span>
              </div>
            )}
            {repoUrl && (
              <div className="col-span-full">
                <span className="text-muted-foreground">Repo: </span>
                <a
                  href={repoUrl}
                  target="_blank"
                  className="font-mono text-primary underline"
                >
                  {repoUrl}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* README */}
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            README
          </h2>
          {skill.readme ? (
            <MarkdownRenderer content={skill.readme} />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No README found. Add a README.md to your repository and
              re-publish to update it.
            </div>
          )}
        </section>

        {/* Resources / endpoints */}
        {(skill.resources as { name: string; description?: string; actions: { name: string; method: string; path: string; description?: string }[] }[] ?? []).length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h2>
            <div className="space-y-4">
              {(skill.resources as { name: string; description?: string; actions: { name: string; method: string; path: string; description?: string }[] }[]).map((resource) => (
                <div
                  key={resource.name}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <h3 className="mb-1 font-mono text-sm font-semibold">
                    {resource.name}
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
                          {action.name}
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
