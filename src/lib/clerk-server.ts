import { Clerk } from '@clerk/backend' // This use for get the user from actual user ID

export const clerk = Clerk({
    apiKey: process.env.CLERK_SECRET_KEY
})