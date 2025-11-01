import { pgTable, serial, text, varchar, timestamp, uniqueIndex, index, pgEnum } from "drizzle-orm/pg-core";

export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  post: text("post").notNull(),
  image_url: varchar("image_url", { length: 500 }),
  author: varchar("author", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull().default("General"),
  status: postStatusEnum("status").notNull().default("draft"),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Optional: unique title
export const postsUniqueTitleIndex = uniqueIndex("posts_title_unique_idx").on(posts.title);

// Optional: indexes
export const postsCategoryIdx = index("posts_category_idx").on(posts.category);
export const postsStatusIdx = index("posts_status_idx").on(posts.status);
