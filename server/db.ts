import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// We are using JSON storage for this MVP, but we keep this file to satisfy imports
// and for future upgradability to Postgres.
// If DATABASE_URL is not present, we won't throw immediately to allow the JSON fallback in storage.ts

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db" 
});
export const db = drizzle(pool, { schema });
