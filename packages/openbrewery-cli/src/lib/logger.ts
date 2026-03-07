import pc from "picocolors";
import { globalFlags } from "./config.js";

export const log = {
  info(msg: string): void {
    if (!globalFlags.json) {
      console.log(msg);
    }
  },

  success(msg: string): void {
    if (!globalFlags.json) {
      console.log(`${pc.green("✓")} ${msg}`);
    }
  },

  warn(msg: string): void {
    if (!globalFlags.json) {
      console.warn(`${pc.yellow("⚠")} ${msg}`);
    }
  },

  error(msg: string): void {
    console.error(`${pc.red("✗")} ${msg}`);
  },

  debug(msg: string): void {
    if (globalFlags.verbose && !globalFlags.json) {
      console.log(`${pc.dim("[debug]")} ${msg}`);
    }
  },
};
