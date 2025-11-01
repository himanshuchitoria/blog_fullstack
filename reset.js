/* eslint-disable no-console */
const postgres = require("postgres");

// Prefer env var; fallback to hardcoded URL if needed
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://blogwebsite_lmws_user:7tdeb8tb6UfVWxOcVbmY2UixMYGrdPRB@dpg-d41li8c9c44c73cuvj90-a.oregon-postgres.render.com/blogwebsite_lmws";

async function resetDatabase() {
  // Render requires SSL
  const sql = postgres(DATABASE_URL, { ssl: { rejectUnauthorized: false } });

  try {
    console.time("reset");

    // Terminate connections to allow schema drop (safe in dev; beware in prod)
    await sql/* sql */`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid <> pg_backend_pid();
    `;

    // Drop and recreate the public schema (wipes tables, types, sequences, indexes)
    await sql/* sql */`DROP SCHEMA IF EXISTS public CASCADE;`;
    await sql/* sql */`CREATE SCHEMA public;`;
    await sql/* sql */`GRANT ALL ON SCHEMA public TO public;`;

    // Drop drizzle migrations tracking tables if they exist in other schemas/names
    await sql/* sql */`DROP TABLE IF EXISTS "_drizzle_migrations" CASCADE;`;
    await sql/* sql */`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;`;

    // Enum for post status
    await sql/* sql */`DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
        CREATE TYPE post_status AS ENUM ('draft', 'published');
      END IF;
    END $$;`;

    // Create posts table with category + status + published_at
    await sql/* sql */`
      CREATE TABLE public.posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        post TEXT NOT NULL,
        image_url VARCHAR(500),
        author VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        status post_status NOT NULL DEFAULT 'draft',
        published_at TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Unique index on title (optional)
    await sql/* sql */`
      CREATE UNIQUE INDEX posts_title_unique_idx ON public.posts (title);
    `;

    // Indexes
    await sql/* sql */`
      CREATE INDEX posts_category_idx ON public.posts (category);
    `;
    await sql/* sql */`
      CREATE INDEX posts_status_idx ON public.posts (status);
    `;

    console.timeEnd("reset");
    console.log("Database reset: schema recreated and posts table initialized.");
  } catch (error) {
    console.error("Error during database reset:", error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

resetDatabase();
