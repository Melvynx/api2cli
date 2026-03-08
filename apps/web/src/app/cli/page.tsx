import { db } from "@/db";
import { skills, CATEGORIES } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Metadata } from "next";
import { SkillCard } from "@/components/skill-card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CategoryFilter } from "@/components/category-filter";
import { RegistrySearch } from "@/components/registry-search";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "CLIs - api2cli",
  description: "Browse community-built CLI wrappers for REST APIs. Install any CLI in seconds with npx api2cli install.",
  alternates: { canonical: "https://api2cli.dev/cli" },
};

export default async function CliListPage() {
  const allSkills = await db
    .select()
    .from(skills)
    .orderBy(desc(skills.downloads))
    .limit(50);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <section id="cli">
          <div className="mb-8">
            <h1 className="font-[family-name:var(--font-geist-pixel-square)] text-4xl font-bold tracking-tight">
              CLIs
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {allSkills.length} CLI{allSkills.length !== 1 ? "s" : ""} built by the community
            </p>
          </div>

          <RegistrySearch />
          <div className="mt-4" />
          <CategoryFilter categories={CATEGORIES as unknown as { value: string; label: string; icon: string }[]} />
          <div className="mt-6" />

          {allSkills.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
              <p className="mt-4 font-mono text-sm text-muted-foreground">
                No CLIs published yet. Be the first!
              </p>
              <pre className="mx-auto mt-4 inline-block rounded-xl bg-muted px-5 py-3 font-mono text-xs text-muted-foreground">
                npx api2cli create my-api
              </pre>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
