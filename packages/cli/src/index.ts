#!/usr/bin/env bun
import { Command } from "commander";
import { createCommand } from "./commands/create.js";
import { installCommand } from "./commands/install.js";
import { listCommand } from "./commands/list.js";
import { bundleCommand } from "./commands/bundle.js";
import { linkCommand } from "./commands/link.js";
import { unlinkCommand } from "./commands/unlink.js";
import { tokensCommand } from "./commands/tokens.js";
import { removeCommand } from "./commands/remove.js";
import { doctorCommand } from "./commands/doctor.js";
import { updateCommand } from "./commands/update.js";
import { publishCommand } from "./commands/publish.js";
import { searchCommand } from "./commands/search.js";

const program = new Command();

program
  .name("api2cli")
  .description("Turn any REST API into a standardized, agent-ready CLI")
  .version("0.1.0");

// Core
program.addCommand(createCommand);
program.addCommand(bundleCommand);
program.addCommand(linkCommand);
program.addCommand(unlinkCommand);
program.addCommand(listCommand);

// Auth
program.addCommand(tokensCommand);

// Lifecycle
program.addCommand(removeCommand);
program.addCommand(doctorCommand);
program.addCommand(updateCommand);

// Registry
program.addCommand(installCommand);
program.addCommand(searchCommand);
program.addCommand(publishCommand);

program.parse();
