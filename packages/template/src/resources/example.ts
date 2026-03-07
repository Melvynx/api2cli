/**
 * Example resource file.
 * Copy this and adapt for each API resource.
 * Pattern: one file per resource (drafts.ts, links.ts, accounts.ts, etc.)
 */
import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

interface ActionOpts {
  json?: boolean;
  format?: string;
  fields?: string;
  limit?: string;
  page?: string;
  sort?: string;
  filter?: string;
  name?: string;
  description?: string;
}

export const exampleResource = new Command("examples")
  .description("Manage examples (replace with your resource)");

// ── LIST ──────────────────────────────────────────────
exampleResource
  .command("list")
  .description("List all examples")
  .option("--limit <n>", "Max results to return", "20")
  .option("--page <n>", "Page number", "1")
  .option("--sort <field>", "Sort by field (e.g. created_at:desc)")
  .option("--filter <expr>", "Filter expression (e.g. status=active)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExamples:\n  {{APP_CLI}} examples list\n  {{APP_CLI}} examples list --limit 5 --json")
  .action(async (opts: ActionOpts) => {
    try {
      const data = await client.get("/examples", {
        limit: opts.limit ?? "20",
        page: opts.page ?? "1",
        ...(opts.sort && { sort: opts.sort }),
        ...(opts.filter && { filter: opts.filter }),
      });
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
exampleResource
  .command("get")
  .description("Get a specific example by ID")
  .argument("<id>", "Example ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText("after", "\nExample:\n  {{APP_CLI}} examples get abc123")
  .action(async (id: string, opts: ActionOpts) => {
    try {
      const data = await client.get(`/examples/${id}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
exampleResource
  .command("create")
  .description("Create a new example")
  .requiredOption("--name <name>", "Name for the example")
  .option("--description <desc>", "Optional description")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExample:\n  {{APP_CLI}} examples create --name "My Example"')
  .action(async (opts: ActionOpts) => {
    try {
      const data = await client.post("/examples", {
        name: opts.name,
        ...(opts.description && { description: opts.description }),
      });
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── UPDATE ────────────────────────────────────────────
exampleResource
  .command("update")
  .description("Update an existing example")
  .argument("<id>", "Example ID")
  .option("--name <name>", "New name")
  .option("--description <desc>", "New description")
  .option("--json", "Output as JSON")
  .addHelpText("after", '\nExample:\n  {{APP_CLI}} examples update abc123 --name "Updated"')
  .action(async (id: string, opts: ActionOpts) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.description) body.description = opts.description;
      const data = await client.patch(`/examples/${id}`, body);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
exampleResource
  .command("delete")
  .description("Delete an example")
  .argument("<id>", "Example ID")
  .option("--json", "Output as JSON")
  .addHelpText("after", "\nExample:\n  {{APP_CLI}} examples delete abc123")
  .action(async (id: string, opts: ActionOpts) => {
    try {
      await client.delete(`/examples/${id}`);
      output({ deleted: true, id }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
