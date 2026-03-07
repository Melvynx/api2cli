export interface CliError {
  ok: false;
  error: {
    code: number;
    message: string;
    suggestion?: string;
  };
}

export function formatError(code: number, message: string, suggestion?: string): CliError {
  return {
    ok: false,
    error: { code, message, suggestion },
  };
}

export function handleError(err: unknown, json: boolean = false): never {
  if (err instanceof Error) {
    const match = err.message.match(/^(\d+): (.+)/);
    if (match) {
      const code = parseInt(match[1]);
      const message = match[2];
      const suggestion = code === 401
        ? "Check your token: <app>-cli auth test"
        : code === 404
          ? "Resource not found. Check the ID."
          : code === 429
            ? "Rate limited. Try again later."
            : undefined;

      if (json) {
        console.error(JSON.stringify(formatError(code, message, suggestion), null, 2));
      } else {
        console.error(`Error ${code}: ${message}`);
        if (suggestion) console.error(`Suggestion: ${suggestion}`);
      }
    } else {
      if (json) {
        console.error(JSON.stringify(formatError(1, err.message), null, 2));
      } else {
        console.error(`Error: ${err.message}`);
      }
    }
  }
  process.exit(1);
}
