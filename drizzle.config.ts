import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({
    path: '.env'
})

export default {
    driver: 'pg',
    schema: './src/lib/db/schema.ts', // where the schema file lived in
    dbCredentials: {
        // env is only load when we only use in src folder, if we are accessing outside the src. for fix that issue we need to install.
        // npm install dotenv
        connectionString: process.env.DATABASE_URL!, // ! -> make sure valus are exist.

    }
} satisfies Config // config gives us type annotations

// Push the schema upto DB
// 1. npx drizzle-kit push:pg

// we can see that using this command
// for that we need to install pg -> npm install pg
// npm drizzle-kit studio