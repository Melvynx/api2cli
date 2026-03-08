import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
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

export default async function CliListPage() {
  const allSkills = await db
    .select()
    .from(skills)
    .where(eq(skills.visible, true))
    .orderBy(desc(skills.downloads))
    .limit(50);

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
