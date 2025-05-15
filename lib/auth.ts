import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { Pool } from "pg";
import { admin, anonymous } from "better-auth/plugins";

 
export const auth = betterAuth({
    plugins: [expo(), admin(), anonymous()],
    trustedOrigins: ["workoutmate://"],
    database: new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }),
    socialProviders: { 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID!, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
        } 
    } 
});