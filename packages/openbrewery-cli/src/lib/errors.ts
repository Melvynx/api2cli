import pc from "picocolors";

export const EXIT = {
  SUCCESS: 0,
  API_ERROR: 1,
  USAGE_ERROR: 2,
} as const;

interface ErrorEnvelope {
  ok: false;
  error: {
    code: number;
    message: string;
    suggestion?: string;
  };
}

export class CliError extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly suggestion?: string,
  ) {
    super(message);
    this.name = "CliError";
  }

  toJSON(): ErrorEnvelope {
    return {
      ok: false,
      error: {
        code: this.code,
        message: this.message,
        ...(this.suggestion && { suggestion: this.suggestion }),
      },
    };
  }
}

const SUGGESTIONS: Record<number, string> = {
  401: "Check your token: openbrewery-cli auth test",
  403: "Insufficient permissions. Check your API token scope.",
  404: "Resource not found. Verify the ID.",
  429: "Rate limited. Wait a moment and try again.",
  500: "Server error. Try again later.",
};

function parseStatusCode(msg: string): number | null {
  const match = msg.match(/^(\d{3}):\s/);
  return match ? Number(match[1]) : null;
}

export function handleError(err: unknown, json = false): never {
  if (err instanceof CliError) {
    if (json) {
      console.error(JSON.stringify(err.toJSON(), null, 2));
    } else {
      console.error(`${pc.red("Error")} ${err.code}: ${err.message}`);
      if (err.suggestion) {
        console.error(`${pc.dim("Suggestion:")} ${err.suggestion}`);
      }
    }
    process.exit(err.code >= 400 ? EXIT.API_ERROR : EXIT.USAGE_ERROR);
  }

  if (err instanceof Error) {
    const status = parseStatusCode(err.message);
    const suggestion = status ? SUGGESTIONS[status] : undefined;

    if (json) {
      const envelope: ErrorEnvelope = {
        ok: false,
        error: {
          code: status ?? 1,
          message: err.message,
          ...(suggestion && { suggestion }),
        },
      };
      console.error(JSON.stringify(envelope, null, 2));
    } else {
      console.error(`${pc.red("Error")}: ${err.message}`);
      if (suggestion) {
        console.error(`${pc.dim("Suggestion:")} ${suggestion}`);
      }
    }
    process.exit(EXIT.API_ERROR);
  }

  console.error(`${pc.red("Error")}: Unknown error`);
  process.exit(EXIT.API_ERROR);
}
