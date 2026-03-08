import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RegistryContent } from "@/components/registry-content";

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

          <RegistryContent initialSkills={allSkills} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
