import { Suspense } from "react";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SponsorBar } from "@/components/sponsor-bar";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "api2cli",
      url: "https://api2cli.dev",
      logo: "https://api2cli.dev/logo.svg",
      description:
        "The open-source marketplace of standardized CLI wrappers for REST APIs.",
      sameAs: ["https://github.com/Melvynx/api2cli"],
    },
    {
      "@type": "SoftwareApplication",
      name: "api2cli",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "macOS, Linux, Windows",
      description:
        "Turn any REST API into an agent-ready CLI. Install in seconds, works with every AI agent.",
      url: "https://api2cli.dev",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",
        name: "Melvynx",
        url: "https://github.com/Melvynx",
      },
    },
    {
      "@type": "WebSite",
      name: "api2cli",
      url: "https://api2cli.dev",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://api2cli.dev/cli?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is api2cli?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "api2cli is an open-source tool that turns any REST API into a standardized, agent-ready CLI. Install a skill in your AI coding agent, tell it what API you need, and it auto-generates a complete CLI wrapper.",
          },
        },
        {
          "@type": "Question",
          name: "How is api2cli different from MCP?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CLIs are ~25ms vs ~800ms for MCP, require no WebSocket server, work with any agent that can run shell commands, and follow a universal standardized pattern. No plugins or server setup needed.",
          },
        },
        {
          "@type": "Question",
          name: "Which AI agents does api2cli work with?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "api2cli works with 40+ coding agents including Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot, Windsurf, Cline, and many more via the AgentSkills standard.",
          },
        },
      ],
    },
  ],
};

export default async function Home() {
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
      <Hero />

      <Suspense>
        <SponsorBar />
      </Suspense>

      <OpenClawSection />
      <HowItWorksSection />
      <CliVsMcpSection />
      <CliIsNewSkillSection />
      <UniversalSection />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24">
        <section id="cli" className="pt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-(family-name:--font-geist-pixel-square) text-2xl font-bold tracking-tight">
                CLIs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {allSkills.length} CLI{allSkills.length !== 1 ? "s" : ""}{" "}
                available in the registry
              </p>
            </div>
            <AddCliDialog />
          </div>

          <Suspense
            fallback={
              <div className="mt-6 rounded-2xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
                Loading CLI registry...
              </div>
            }
          >
            <RegistryContent initialSkills={allSkills} />
          </Suspense>
        </section>
      </main>

      <FinalCtaSection />
      <Footer />
    </div>
  );
}
