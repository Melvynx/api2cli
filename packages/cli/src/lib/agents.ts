import { join } from "path";
import { homedir } from "os";

export const AGENT_DIRS = [
  { name: "Claude Code", path: join(homedir(), ".claude", "skills") },
  { name: "Cursor", path: join(homedir(), ".cursor", "skills") },
  { name: "OpenClaw", path: join(homedir(), ".openclaw", "workspace", "skills") },
] as const;
