import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { z } from "zod";
import { eq, desc, and, ilike, or } from "drizzle-orm";

import { publicProcedure, router } from "./trpc";
import { posts } from "@/db/schema";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 10,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(sql);

(async () => {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Database migrated successfully");
  } catch (error) {
    console.error("Migration error:", error);
  }
})();

export const appRouter = router({
  getPosts: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          status: z.enum(["draft", "published"]).optional(),
          q: z.string().min(1).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const filters = [];
      if (input?.category) filters.push(eq(posts.category, input.category));
      if (input?.status) filters.push(eq(posts.status, input.status));
      if (input?.q) {
        const pattern = `%${input.q}%`;
        filters.push(
          or(
            ilike(posts.title, pattern),
            ilike(posts.post, pattern),
            ilike(posts.author, pattern)
          )
        );
      }

      if (filters.length) {
        return await db
          .select()
          .from(posts)
          .where(and(...filters))
          .orderBy(desc(posts.created_at));
      }
      return await db.select().from(posts).orderBy(desc(posts.created_at));
    }),

  getPostById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const rows = await db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id))
        .limit(1);
      return rows[0] ?? null;
    }),

  addPost: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        imageUrl: z.string().optional(),
        author: z.string(),
        category: z.string().min(1).default("General"),
        status: z.enum(["draft", "published"]).default("draft"),
      })
    )
    .mutation(async ({ input }) => {
      const now = new Date();
      await db.insert(posts).values({
        title: input.title,
        post: input.content,
        image_url: input.imageUrl ?? null,
        author: input.author,
        category: input.category || "General",
        status: input.status || "draft",
        published_at: input.status === "published" ? now : null,
      });
      return true;
    }),

  updatePost: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string(),
        content: z.string(),
        imageUrl: z.string().nullable().optional(),
        author: z.string(),
        category: z.string().min(1).default("General"),
        status: z.enum(["draft", "published"]).default("draft"),
      })
    )
    .mutation(async ({ input }) => {
      const now = new Date();
      await db
        .update(posts)
        .set({
          title: input.title,
          post: input.content,
          image_url: input.imageUrl ?? null,
          author: input.author,
          category: input.category || "General",
          status: input.status || "draft",
          published_at: input.status === "published" ? now : null,
          updated_at: now,
        })
        .where(eq(posts.id, input.id));
      return true;
    }),

  publishPost: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const now = new Date();
      await db
        .update(posts)
        .set({ status: "published", published_at: now, updated_at: now })
        .where(eq(posts.id, input.id));
      return true;
    }),

  setStatus: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["draft", "published"]),
      })
    )
    .mutation(async ({ input }) => {
      const now = new Date();
      await db
        .update(posts)
        .set({
          status: input.status,
          published_at: input.status === "published" ? now : null,
          updated_at: now,
        })
        .where(eq(posts.id, input.id));
      return true;
    }),

  // Added: delete a post by id
  deletePost: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await db.delete(posts).where(eq(posts.id, input.id));
      return true;
    }),
});

export type AppRouter = typeof appRouter;
