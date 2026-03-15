import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RegistryContent } from "@/components/registry-content";
import { type RegistryCliType } from "@/lib/cli-kind";
import { getVisibleSkillsQuery, searchRegistrySkills, type RegistrySort } from "@/lib/registry-query";

export const revalidate = 60;

const INITIAL_PAGE_SIZE = 12;

export const metadata: Metadata = {
  title: "CLIs - api2cli",
  description:
    "Browse wrapper CLIs and official CLIs for developer tools and APIs. Install any CLI in seconds with npx api2cli install.",
  alternates: { canonical: "https://api2cli.dev/cli" },
  openGraph: {
    title: "CLIs - api2cli",
    description:
      "Browse wrapper CLIs and official CLIs. Install any CLI in seconds.",
    url: "https://api2cli.dev/cli",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLIs - api2cli",
    description:
      "Browse wrapper CLIs and official CLIs. Install any CLI in seconds.",
    creator: "@maboroshi_melvynx",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CLIs - api2cli",
  description:
    "Browse wrapper CLIs and official CLIs. Install any CLI in seconds.",
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
  type?: RegistryCliType;
  sort?: string;
}>;

export default async function CliListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q = "", tag = "all", type = "all", sort: rawSort = "popular" } = await searchParams;
  const VALID_SORTS: RegistrySort[] = ["popular", "votes", "newest"];
  const sort: RegistrySort = VALID_SORTS.includes(rawSort as RegistrySort) ? (rawSort as RegistrySort) : "popular";
  const hasFilters = q.trim().length > 0 || tag !== "all" || type !== "all";
  const baseQuery = getVisibleSkillsQuery(null, type, sort).limit(INITIAL_PAGE_SIZE);
  const countQuery = getVisibleSkillsQuery(null, type);

  const [[totalResult], baseSkills, filteredSkills] = await Promise.all([
    countQuery.then((rows) => [{ count: rows.length }]),
    baseQuery,
    hasFilters ? searchRegistrySkills({ query: q, tag, type, sort }) : Promise.resolve(null),
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
              {totalCount} CLI{totalCount !== 1 ? "s" : ""} available in the registry
            </p>
          </div>

          <RegistryContent
            initialSkills={initialSkills}
            baseSkills={baseSkills}
            totalCount={totalCount}
            initialQuery={q}
            initialTag={tag}
            initialType={type}
            initialSort={sort}
            showTypeToggle
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
