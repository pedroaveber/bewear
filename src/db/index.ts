import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
// biome-ignore lint/performance/noNamespaceImport: Only used once
import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL || '', {
  schema,
});
