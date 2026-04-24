import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

function fixDatabaseUrl(url: string): string {
  try {
    const protocolEnd = url.indexOf("://");
    if (protocolEnd === -1) return url;
    const protocol = url.slice(0, protocolEnd + 3);
    const rest = url.slice(protocolEnd + 3);
    const lastAt = rest.lastIndexOf("@");
    if (lastAt === -1) return url;
    const credentials = rest.slice(0, lastAt);
    const hostPart = rest.slice(lastAt + 1);
    const firstColon = credentials.indexOf(":");
    if (firstColon === -1) return url;
    const user = credentials.slice(0, firstColon);
    const password = credentials.slice(firstColon + 1);
    const encodedPassword = encodeURIComponent(password);
    return `${protocol}${user}:${encodedPassword}@${hostPart}`;
  } catch {
    return url;
  }
}

const connectionString = fixDatabaseUrl(process.env.DATABASE_URL);

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

export * from "./schema";
