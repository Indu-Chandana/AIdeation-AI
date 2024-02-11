import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// we just need to cache all the connections, we doesn't want to creating new connection every time we reload the connection.
neonConfig.fetchConnectionCache = true

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql)