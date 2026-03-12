import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServerMdx } from "../server-mdx";
import {
  getAllDocs,
  getCurrentDoc,
  getDocSections,
  type DocParams,
} from "../doc-manager";

export async function generateStaticParams() {
  const docs = await getAllDocs();
  return [
    { slug: [] },
    ...docs
      .filter((d) => d.slug !== "")
      .map((doc) => ({
        slug: doc.slug.split("/"),
      })),
  ];
}

export async function generateMetadata(props: DocParams): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug?.join("/") ?? "";

  if (slug === "") {
    return {
      title: "Documentation - Learn to Build Agent-Ready CLIs",
      description:
        "Complete guide to api2cli: install the skill, create CLI wrappers for any REST API, add resources, and publish to the registry.",
      alternates: { canonical: "https://api2cli.dev/docs" },
      openGraph: {
        title: "api2cli Documentation",
        description:
          "Complete guide to building agent-ready CLI wrappers for REST APIs.",
        url: "https://api2cli.dev/docs",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "api2cli Documentation",
        description:
          "Complete guide to building agent-ready CLI wrappers for REST APIs.",
        creator: "@maboroshi_melvynx",
      },
    };
  }

  const doc = await getCurrentDoc(params.slug);
  if (!doc) return { title: "Not Found" };

  return {
    title: `${doc.attributes.title} - api2cli`,
    description: doc.attributes.description,
    keywords: doc.attributes.keywords,
    alternates: { canonical: `https://api2cli.dev${doc.url}` },
    openGraph: {
      title: doc.attributes.title,
      description: doc.attributes.description,
      type: "article",
      url: `https://api2cli.dev${doc.url}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.attributes.title} - api2cli`,
      description: doc.attributes.description,
      creator: "@maboroshi_melvynx",
    },
  };
}

const ICONS: Record<string, string> = {
  "getting-started": "🚀",
  "create-cli": "🔨",
  resources: "📦",
  commands: "📚",
  "agent-integration": "🤖",
  openclaw: "🦞",
  marketplace: "🏪",
};

function DocsIndex({
  sections,
}: {
  sections: Awaited<ReturnType<typeof getDocSections>>;
}) {
  const allDocs = sections.flatMap((s) => s.docs).filter((d) => d.slug !== "");

  return (
    <div className="mx-auto max-w-3xl px-8 py-12 lg:px-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Documentation</h1>
      <p className="mb-8 text-muted-foreground">
        Install the skill in your AI agent. Ask it to wrap any API. Your agent
        handles everything: discovery, code generation, building, and linking.
        Every CLI follows the same pattern, so agents learn once and scale to
        every API.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {allDocs.map((doc) => (
          <Link
            key={doc.slug}
            href={doc.url}
            className="group rounded-xl border border-border bg-card/50 p-5 no-underline transition-all hover:border-primary/40 hover:bg-card/80"
          >
            <div className="mb-2 text-2xl">{ICONS[doc.slug] ?? "📄"}</div>
            <h3 className="mt-0 mb-1 text-sm font-semibold text-foreground">
              {doc.attributes.title}
            </h3>
            <p className="mb-0 text-xs text-muted-foreground">
              {doc.attributes.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function Page(props: DocParams) {
  const params = await props.params;
  const slug = params.slug?.join("/") ?? "";

  if (slug === "") {
    const sections = await getDocSections();
    return <DocsIndex sections={sections} />;
  }

  const doc = await getCurrentDoc(params.slug);
  if (!doc) notFound();

  return (
    <div className="mx-auto max-w-3xl px-8 py-12 lg:px-16">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        {doc.attributes.title}
      </h1>
      {doc.attributes.description && (
        <p className="mb-8 text-muted-foreground">
          {doc.attributes.description}
        </p>
      )}
      <ServerMdx source={doc.content} />
    </div>
  );
}
