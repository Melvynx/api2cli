import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL!;
const isLocal =
  DATABASE_URL.includes("localhost") || DATABASE_URL.includes("127.0.0.1");

async function createDb() {
  if (isLocal) {
    const postgres = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const client = postgres.default(DATABASE_URL);
    return drizzle(client, { schema });
  }
  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  const sql = neon(DATABASE_URL);
  return drizzle(sql, { schema });
}

export const db = await createDb();
