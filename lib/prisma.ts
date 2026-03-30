// prisma.config.ts
import { defineConfig } from '@prisma/accelerate'; // Prisma 7 requires this package

export default defineConfig({
  client: {
    // optional logging or other client options
  },
  migrate: {
    adapter: {
      type: 'postgresql',
      url: process.env.DATABASE_URL!, // <-- your DB URL from .env
    },
  },
});