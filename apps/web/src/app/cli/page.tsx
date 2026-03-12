import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc, eq, count as drizzleCount } from "drizzle-orm";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RegistryContent } from "@/components/registry-content";
import { searchRegistrySkills } from "@/lib/registry-query";

export const revalidate = 60;

const INITIAL_PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "CLIs - api2cli",
  description:
    "Browse community-built CLI wrappers for REST APIs. Install any CLI in seconds with npx api2cli install.",
  alternates: { canonical: "https://api2cli.dev/cli" },
  openGraph: {
    title: "CLIs - api2cli",
    description:
      "Browse community-built CLI wrappers for REST APIs. Install any CLI in seconds.",
    url: "https://api2cli.dev/cli",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLIs - api2cli",
    description:
      "Browse community-built CLI wrappers for REST APIs. Install any CLI in seconds.",
    creator: "@maboroshi_melvynx",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CLIs - api2cli",
  description:
    "Browse community-built CLI wrappers for REST APIs. Install any CLI in seconds.",
  url: "https://api2cli.dev/cli",
  isPartOf: {
    "@type": "WebSite",
    name: "api2cli",
    url: "https://api2cli.dev",
  },
};

type SearchParams = Promise<{
  q?: string;
  tag?: string;
}>;

export default async function CliListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q = "", tag = "all" } = await searchParams;
  const hasFilters = q.trim().length > 0 || tag !== "all";

  const [[totalResult], baseSkills, filteredSkills] = await Promise.all([
    db
      .select({ count: drizzleCount() })
      .from(skills)
      .where(eq(skills.visible, true)),
    db
      .select()
      .from(skills)
      .where(eq(skills.visible, true))
      .orderBy(desc(skills.downloads))
      .limit(INITIAL_PAGE_SIZE),
    hasFilters ? searchRegistrySkills({ query: q, tag }) : Promise.resolve(null),
  ]);

  const initialSkills = filteredSkills ?? baseSkills;
  const totalCount = totalResult?.count ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-12">
        <section id="cli">
          <div className="mb-8">
            <h1 className="font-(family-name:--font-geist-pixel-square) text-4xl font-bold tracking-tight">
              CLIs
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {totalCount} CLI{totalCount !== 1 ? "s" : ""} built by the community
            </p>
          </div>

          <RegistryContent
            initialSkills={initialSkills}
            baseSkills={baseSkills}
            totalCount={totalCount}
            initialQuery={q}
            initialTag={tag}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
