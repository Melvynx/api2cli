import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

interface ActionOpts {
  json?: boolean;
  format?: string;
  fields?: string;
  page?: string;
  perPage?: string;
  byCity?: string;
  byCountry?: string;
  byState?: string;
  byPostal?: string;
  byType?: string;
  byName?: string;
  byIds?: string;
  byDist?: string;
  sort?: string;
  size?: string;
  query?: string;
}

const BREWERY_TYPES =
  "micro, nano, regional, brewpub, large, planning, contract, proprietor, closed";

export const breweriesResource = new Command("breweries").description(
  "List, get, search, and explore breweries from Open Brewery DB",
);

// ── LIST ──────────────────────────────────────────────
breweriesResource
  .command("list")
  .description("List breweries with optional filters and pagination")
  .option("--page <n>", "Page number", "1")
  .option("--per-page <n>", "Results per page (max 200)", "50")
  .option("--by-city <city>", "Filter by city name")
  .option("--by-country <country>", "Filter by country")
  .option("--by-state <state>", "Filter by full state name (no abbreviations)")
  .option("--by-postal <code>", "Filter by postal/ZIP code")
  .option(
    "--by-type <type>",
    `Filter by type: ${BREWERY_TYPES}`,
  )
  .option("--by-name <name>", "Filter by brewery name")
  .option("--by-ids <ids>", "Comma-separated brewery IDs")
  .option("--by-dist <lat,lng>", "Sort by distance from latitude,longitude")
  .option("--sort <field>", "Sort: field asc|desc (e.g. name:asc)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `
Examples:
  openbrewery-cli breweries list
  openbrewery-cli breweries list --by-city "San Diego" --per-page 10
  openbrewery-cli breweries list --by-type micro --by-state "California"
  openbrewery-cli breweries list --by-dist "37.7749,-122.4194" --per-page 5
  openbrewery-cli breweries list --sort name:asc --json`,
  )
  .action(async (opts: ActionOpts) => {
    try {
      const params: Record<string, string> = {
        page: opts.page ?? "1",
        per_page: opts.perPage ?? "50",
      };
      if (opts.byCity) params.by_city = opts.byCity;
      if (opts.byCountry) params.by_country = opts.byCountry;
      if (opts.byState) params.by_state = opts.byState;
      if (opts.byPostal) params.by_postal = opts.byPostal;
      if (opts.byType) params.by_type = opts.byType;
      if (opts.byName) params.by_name = opts.byName;
      if (opts.byIds) params.by_ids = opts.byIds;
      if (opts.byDist) params.by_dist = opts.byDist;
      if (opts.sort) params.sort = opts.sort;

      const data = await client.get("/breweries", params);
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
breweriesResource
  .command("get <id>")
  .description("Get a single brewery by ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `
Example:
  openbrewery-cli breweries get 10-barrel-brewing-san-diego`,
  )
  .action(async (id: string, opts: ActionOpts) => {
    try {
      const data = await client.get(`/breweries/${encodeURIComponent(id)}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── RANDOM ────────────────────────────────────────────
breweriesResource
  .command("random")
  .description("Get one or more random breweries")
  .option("--size <n>", "Number of random breweries (1-50)", "1")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .option("--fields <cols>", "Comma-separated columns to display")
  .addHelpText(
    "after",
    `
Examples:
  openbrewery-cli breweries random
  openbrewery-cli breweries random --size 5 --json`,
  )
  .action(async (opts: ActionOpts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.size) params.size = opts.size;
      const data = await client.get("/breweries/random", params);
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── SEARCH ────────────────────────────────────────────
breweriesResource
  .command("search <query>")
  .description("Search breweries by name (partial, case-insensitive)")
  .option("--page <n>", "Page number", "1")
  .option("--per-page <n>", "Results per page (max 200)", "50")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .option("--fields <cols>", "Comma-separated columns to display")
  .addHelpText(
    "after",
    `
Examples:
  openbrewery-cli breweries search "barrel"
  openbrewery-cli breweries search "sierra" --per-page 20 --json`,
  )
  .action(async (query: string, opts: ActionOpts) => {
    try {
      const params: Record<string, string> = {
        query,
        page: opts.page ?? "1",
        per_page: opts.perPage ?? "50",
      };
      const data = await client.get("/breweries/search", params);
      const fields = opts.fields?.split(",");
      output(data, { json: opts.json, format: opts.format, fields });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── META ──────────────────────────────────────────────
breweriesResource
  .command("meta")
  .description("Get metadata (total count) with same filters as list")
  .option("--by-city <city>", "Filter by city")
  .option("--by-country <country>", "Filter by country")
  .option("--by-state <state>", "Filter by state")
  .option("--by-postal <code>", "Filter by postal code")
  .option("--by-type <type>", `Filter by type: ${BREWERY_TYPES}`)
  .option("--by-name <name>", "Filter by name")
  .option("--by-ids <ids>", "Comma-separated brewery IDs")
  .option("--by-dist <lat,lng>", "Filter by distance from point")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    `
Examples:
  openbrewery-cli breweries meta
  openbrewery-cli breweries meta --by-country "United States" --json`,
  )
  .action(async (opts: ActionOpts) => {
    try {
      const params: Record<string, string> = {};
      if (opts.byCity) params.by_city = opts.byCity;
      if (opts.byCountry) params.by_country = opts.byCountry;
      if (opts.byState) params.by_state = opts.byState;
      if (opts.byPostal) params.by_postal = opts.byPostal;
      if (opts.byType) params.by_type = opts.byType;
      if (opts.byName) params.by_name = opts.byName;
      if (opts.byIds) params.by_ids = opts.byIds;
      if (opts.byDist) params.by_dist = opts.byDist;

      const data = await client.get("/breweries/meta", params);
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
