import Link from "next/link";

const cards = [
  {
    icon: "⚡",
    title: "Quick Start",
    description: "Install the skill, tell your agent what you need. Done.",
    href: "/docs/getting-started",
  },
  {
    icon: "🤖",
    title: "Agent Integration",
    description: "Works with Claude Code, Cursor, Gemini CLI, and 10+ agents.",
    href: "/docs/agent-integration",
  },
  {
    icon: "🔨",
    title: "Create a CLI",
    description: "How the agent builds CLIs under the hood.",
    href: "/docs/create-cli",
  },
  {
    icon: "📦",
    title: "Add Resources",
    description: "The resource pattern for CRUD operations.",
    href: "/docs/resources",
  },
  {
    icon: "📚",
    title: "Commands Reference",
    description: "Every command and flag documented.",
    href: "/docs/commands",
  },
  {
    icon: "🏪",
    title: "Registry",
    description: "Publish your CLI and install community CLIs.",
    href: "/docs/marketplace",
  },
];

export default function DocsIndex() {
  return (
    <div>
      <h1>Documentation</h1>
      <p>
        Install the skill in your AI agent. Ask it to wrap any API. Your agent
        handles everything: discovery, code generation, building, and linking.
        Every CLI follows the same pattern, so agents learn once and scale to
        every API.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-border bg-card/50 p-5 no-underline transition-all hover:border-primary/40 hover:bg-card/80"
          >
            <div className="mb-2 text-2xl">{card.icon}</div>
            <h3 className="!mt-0 !mb-1 text-sm font-semibold text-foreground">
              {card.title}
            </h3>
            <p className="!mb-0 text-xs text-muted-foreground">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
