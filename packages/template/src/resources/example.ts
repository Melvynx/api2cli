/**
 * Example resource file.
 * Copy this file and modify for each API resource.
 *
 * Pattern: one file per API resource (e.g. drafts.ts, links.ts, accounts.ts)
 */
import { Command } from "commander";
import { getClient } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const exampleResource = new Command("examples")
  .description("Manage examples");

// LIST
exampleResource
  .command("list")
  .description("List all examples")
  .option("--limit <n>", "Limit results", "20")
  .option("--page <n>", "Page number", "1")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .action(async (options) => {
    try {
      const client = getClient();
      const data = await client.get("/examples", {
        limit: options.limit,
        page: options.page,
      });
      output(data, options);
    } catch (err) {
      handleError(err, options.json);
    }
  });

// GET
exampleResource
  .command("get")
  .description("Get a specific example")
  .argument("<id>", "Example ID")
  .option("--json", "Output as JSON")
  .action(async (id: string, options) => {
    try {
      const client = getClient();
      const data = await client.get(`/examples/${id}`);
      output(data, options);
    } catch (err) {
      handleError(err, options.json);
    }
  });

// CREATE
exampleResource
  .command("create")
  .description("Create a new example")
  .requiredOption("--name <name>", "Example name")
  .option("--description <desc>", "Description")
  .option("--json", "Output as JSON")
  .action(async (options) => {
    try {
      const client = getClient();
      const data = await client.post("/examples", {
        name: options.name,
        description: options.description,
      });
      output(data, options);
    } catch (err) {
      handleError(err, options.json);
    }
  });

// UPDATE
exampleResource
  .command("update")
  .description("Update an example")
  .argument("<id>", "Example ID")
  .option("--name <name>", "New name")
  .option("--description <desc>", "New description")
  .option("--json", "Output as JSON")
  .action(async (id: string, options) => {
    try {
      const client = getClient();
      const data = await client.patch(`/examples/${id}`, {
        ...(options.name && { name: options.name }),
        ...(options.description && { description: options.description }),
      });
      output(data, options);
    } catch (err) {
      handleError(err, options.json);
    }
  });

// DELETE
exampleResource
  .command("delete")
  .description("Delete an example")
  .argument("<id>", "Example ID")
  .option("--json", "Output as JSON")
  .action(async (id: string, options) => {
    try {
      const client = getClient();
      await client.delete(`/examples/${id}`);
      console.log(`✅ Deleted example ${id}`);
    } catch (err) {
      handleError(err, options.json);
    }
  });
