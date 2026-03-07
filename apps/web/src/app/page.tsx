import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SkillCard } from "@/components/skill-card";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
        <section id="registry">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Registry</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {allSkills.length} CLI{allSkills.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>
          </div>

          {allSkills.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 py-20 text-center">
              <p className="font-mono text-sm text-muted-foreground">
                No CLIs published yet. Be the first!
              </p>
              <pre className="mt-4 inline-block rounded-lg bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
                npx api2cli create my-api
              </pre>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
