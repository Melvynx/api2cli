import { Command } from "commander";
import pc from "picocolors";
import { API_URL } from "../lib/config.js";

type RegistrySearchResult = {
  name: string;
  displayName: string;
  description?: string | null;
  category?: string | null;
  downloads?: number | null;
  upvotes?: number | null;
  githubRepo?: string | null;
  installCommand?: string | null;
  skillType?: string | null;
};

type RegistrySearchResponse = {
  ok: boolean;
  data: RegistrySearchResult[];
  total?: number;
  error?: string;
};

const VALID_TYPES = ["all", "wrapper", "official"] as const;
const VALID_SORTS = ["popular", "votes", "newest"] as const;

export const searchCommand = new Command("search")
  .description("Search the api2cli registry")
  .argument("<query>", "Search query")
  .option("--category <category>", "Filter by category")
  .option("--type <type>", `Filter by type: ${VALID_TYPES.join(", ")}`, "all")
  .option("--sort <sort>", `Sort by: ${VALID_SORTS.join(", ")}`, "popular")
  .option("--limit <n>", "Limit results", "10")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    [
      "",
      "Examples:",
      "  api2cli search agentmail",
      "  api2cli search email --type wrapper",
      "  api2cli search vercel --category devtools --json",
    ].join("\n"),
  )
  .action(async (query: string, opts) => {
    const type = String(opts.type || "all").toLowerCase();
    const sort = String(opts.sort || "popular").toLowerCase();
    const limit = Math.max(1, Number.parseInt(String(opts.limit || "10"), 10) || 10);

    if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      console.error(`${pc.red("✗")} Invalid type "${type}". Valid: ${VALID_TYPES.join(", ")}`);
      process.exit(1);
    }

    if (!VALID_SORTS.includes(sort as (typeof VALID_SORTS)[number])) {
      console.error(`${pc.red("✗")} Invalid sort "${sort}". Valid: ${VALID_SORTS.join(", ")}`);
      process.exit(1);
    }

    try {
      const params = new URLSearchParams({ q: query, type, sort });
      if (opts.category) params.set("category", String(opts.category));

      const res = await fetch(`${API_URL}/api/skills?${params.toString()}`);
      const payload = (await res.json()) as RegistrySearchResponse;

      if (!res.ok || !payload.ok) {
        const message = payload.error || "Search failed";
        console.error(`${pc.red("✗")} ${message}`);
        process.exit(1);
      }

      const results = payload.data.slice(0, limit);

      if (opts.json) {
        console.log(JSON.stringify({
          ok: true,
          data: results,
          meta: {
            query,
            total: payload.total ?? payload.data.length,
            shown: results.length,
            type,
            sort,
            category: opts.category ?? null,
          },
        }, null, 2));
        return;
      }

      if (results.length === 0) {
        console.log(`No registry matches for ${pc.bold(query)}.`);
        console.log(`Try ${pc.cyan(`api2cli create ${query}`)} if you want to generate a new wrapper.`);
        return;
      }

      console.log(`\n${pc.bold(`Registry results for "${query}"`)}\n`);

      for (const skill of results) {
        const typeLabel = skill.skillType === "public" ? "official" : "wrapper";
        const stats = [
          skill.category ? pc.cyan(skill.category) : null,
          pc.dim(typeLabel),
          typeof skill.downloads === "number" ? `${skill.downloads} installs` : null,
          typeof skill.upvotes === "number" ? `${skill.upvotes} votes` : null,
        ].filter(Boolean).join(pc.dim(" | "));

        console.log(`  ${pc.bold(skill.name)}${skill.displayName && skill.displayName !== skill.name ? pc.dim(` (${skill.displayName})`) : ""}`);
        if (stats) console.log(`    ${stats}`);
        if (skill.description) console.log(`    ${skill.description}`);
        if (skill.githubRepo) console.log(`    repo: ${pc.dim(skill.githubRepo)}`);
        console.log(`    install: ${pc.cyan(`api2cli install ${skill.name}`)}`);
        if (skill.installCommand) console.log(`    direct: ${pc.dim(skill.installCommand)}`);
        console.log();
      }

      const remaining = payload.data.length - results.length;
      if (remaining > 0) {
        console.log(pc.dim(`Showing ${results.length} of ${payload.data.length} matches. Use --limit to see more.`));
      }
    } catch {
      console.error(`${pc.red("✗")} Could not reach api2cli.dev`);
      process.exit(1);
    }
  });
