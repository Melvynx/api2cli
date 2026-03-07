import { db } from "@/db";
import { skills, CATEGORIES } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SkillCard } from "@/components/skill-card";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CategoryFilter } from "@/components/category-filter";

export const revalidate = 60;

export default async function Home() {
  const allSkills = await db
    .select()
    .from(skills)
    .orderBy(desc(skills.downloads))
    .limit(50);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section id="registry" className="pt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                CLI Registry
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {allSkills.length} CLI{allSkills.length !== 1 ? "s" : ""}{" "}
                built by the community
              </p>
            </div>
          </div>

          {/* Categories */}
          <CategoryFilter categories={CATEGORIES as unknown as { value: string; label: string; icon: string }[]} />

          {allSkills.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
              <div className="text-4xl">📦</div>
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
