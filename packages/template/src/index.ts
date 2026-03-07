#!/usr/bin/env bun
import { Command } from "commander";
import { authCommand } from "./commands/auth.js";

// Import resources here
// import { exampleResource } from "./resources/example.js";

const program = new Command();

program
  .name("{{APP_CLI}}")
  .description("CLI for {{APP_NAME}} API")
  .version("0.1.0");

// Auth
program.addCommand(authCommand);

// Resources - add your resources here
// program.addCommand(exampleResource);

program.parse();
