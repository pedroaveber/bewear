import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
// biome-ignore lint/performance/noNamespaceImport: No reason to import everything
import * as schema from '@/db/schema';

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: 'usersTable',
  },
  account: {
    modelName: 'accountsTable',
  },
  session: {
    modelName: 'sessionsTable',
  },
  verification: {
    modelName: 'verificationsTable',
  },
});
