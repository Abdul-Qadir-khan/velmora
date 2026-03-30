// prisma.config.ts
import { defineConfig } from '@prisma/cli';

export default defineConfig({
  client: {
    log: ['query'], // optional
  },
  migrate: {
    adapter: {
      type: 'postgresql',
      url: process.env.DATABASE_URL!, // must be set in your .env
    },
  },
});