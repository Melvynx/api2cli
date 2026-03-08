import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AddCliDialog } from "@/components/add-cli-dialog";
import { RegistryContent } from "@/components/registry-content";
import {
  OpenClawSection,
  CliVsMcpSection,
  CliIsNewSkillSection,
  HowItWorksSection,
  UniversalSection,
  FinalCtaSection,
} from "@/components/landing-sections";

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

      <OpenClawSection />
      <HowItWorksSection />
      <CliVsMcpSection />
      <CliIsNewSkillSection />
      <UniversalSection />

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section id="cli" className="pt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-geist-pixel-square)] text-2xl font-bold tracking-tight">
                CLIs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {allSkills.length} CLI{allSkills.length !== 1 ? "s" : ""}{" "}
                built by the community
              </p>
            </div>
            <AddCliDialog />
          </div>

          <RegistryContent initialSkills={allSkills} />
        </section>
      </main>

      <FinalCtaSection />
      <Footer />
    </div>
  );
}
