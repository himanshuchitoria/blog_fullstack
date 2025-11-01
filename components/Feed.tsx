"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { serverClient } from "@/app/_trpc/serverClient";
import { trpc } from "@/app/_trpc/client";
import { Pagination } from "@/components/Pagination";
import { getPostStats } from "@/lib/postStats";

// Shape that matches the tRPC getPosts output on the client (dates as strings)
type ClientPost = {
  id: number;
  title: string;
  category: string;
  status: "draft" | "published";
  author: string;
  post: string;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// Helpers: short preview + plain text conversion
function toPlainText(html: string) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function firstWordsFromHtml(html: string, maxWords = 14) {
  const text = toPlainText(html);
  const words = text.split(/\s+/).filter(Boolean);
  const sliced = words.slice(0, maxWords).join(" ");
  return words.length > maxWords ? sliced + "..." : sliced;
}

export const Feed = ({
  initialPosts,
  showDelete = false, // dashboard may pass true to enable delete
}: {
  initialPosts: Awaited<ReturnType<(typeof serverClient)["getPosts"]>>;
  showDelete?: boolean;
}) => {
  // Normalize server Dates -> strings so initialData matches the query's TData type
  const initialForClient: ClientPost[] = useMemo(() => {
    const toIso = (d: Date | null) => (d ? new Date(d).toISOString() : null);
    return (initialPosts ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      status: p.status,
      author: p.author,
      post: p.post,
      image_url: p.image_url,
      published_at: toIso(p.published_at as any),
      created_at: new Date(p.created_at as any).toISOString(),
      updated_at: new Date(p.updated_at as any).toISOString(),
    }));
  }, [initialPosts]);

  // UI toggle state (local only) for published/draft
  const [status, setStatus] = useState<"published" | "draft">("published");

  // tRPC cache utils
  const utils = trpc.useContext();

  // Track which row is deleting so only that button shows loading
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Delete mutation with cache invalidation and cleanup
  const deletePost = trpc.deletePost.useMutation({
    onSuccess: async () => {
      await utils.getPosts.invalidate();
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm("Delete this post?")) return;
    setDeletingId(id);
    deletePost.mutate({ id });
  };

  // Fetch posts with the selected status only (API path unchanged)
  const getPosts = trpc.getPosts.useQuery(
    { status }, // pass filter to your existing getPosts procedure
    {
      initialData: initialForClient,
      refetchOnMount: "always",
      select: (rows) =>
        rows.map((p) => ({
          ...p,
          published_at: p.published_at ? new Date(p.published_at) : null,
          created_at: new Date(p.created_at),
          updated_at: new Date(p.updated_at),
        })),
    }
  );

  const posts = (getPosts.data as unknown as ClientPost[]) ?? [];

  // Pagination (6 per page)
  const pageSize = 6;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(Math.ceil(posts.length / pageSize), 1);
  const offset = (page - 1) * pageSize;
  const pageItems = posts.slice(offset, offset + pageSize);

  return (
    <div className="w-full">
      {/* Toggle row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex rounded-full ring-1 ring-slate-300 bg-white/60 p-1 dark:bg-slate-900/60 dark:ring-slate-700">
          <button
            type="button"
            onClick={() => { setStatus("published"); setPage(1); }}
            aria-pressed={status === "published"}
            className={[
              "px-3 py-1 text-xs font-semibold rounded-full transition",
              status === "published"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            Published
          </button>
          <button
            type="button"
            onClick={() => { setStatus("draft"); setPage(1); }}
            aria-pressed={status === "draft"}
            className={[
              "px-3 py-1 text-xs font-semibold rounded-full transition",
              status === "draft"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            Draft
          </button>
        </div>

        <span className="text-xs text-slate-700 dark:text-slate-400">
          Showing {status}
        </span>
      </div>

      {/* Two-column uniform cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {pageItems.map((post) => {
          const previewText = firstWordsFromHtml(post.post ?? "", 14);
          const stats = getPostStats(toPlainText(post.post ?? ""), 120);
          const dateStr = new Date(post.created_at as any).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          const isRowDeleting = deletingId === post.id && deletePost.isLoading;

          return (
            <article
              key={post.id}
              className="flex h-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
            >
              {/* Media (constant height, rounded top) */}
              {post.image_url && (
                <div className="h-56 w-full overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={post.image_url}
                    alt={post.title || "Post image"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Body */}
              <div className="flex flex-1 flex-col p-4">
                {/* Title */}
                <h3 className="line-clamp-2 text-[18px] font-extrabold leading-snug text-slate-900 dark:text-slate-100">
                  {post.title}
                </h3>

                {/* Meta chip row (category • status) */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    {post.category || "General"}
                  </span>
                  <span
                    className={[
                      "rounded-full border px-2.5 py-1 font-semibold",
                      post.status === "draft"
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
                    ].join(" ")}
                  >
                    {post.status === "draft" ? "Draft" : "Published"}
                  </span>
                </div>

                {/* Tiny excerpt (very few words) */}
                <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-slate-600 dark:text-slate-300">
                  {previewText}
                </p>

                {/* Footer: author left; stats/date + controls right */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-[12px] text-slate-500 dark:text-slate-400">
                    By {post.author || "Anonymous"}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-[12px] text-slate-500 dark:text-slate-400">
                      {stats.words} words • {stats.minutes} min • {dateStr}
                    </span>

                    {/* Controls (Edit/Delete) visible on dashboard when showDelete is true */}
                    {showDelete && (
                      <div className="ml-2 inline-flex items-center gap-1">
                        <Link
                          href={`/post/${post.id}/edit`}
                          className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100 dark:text-slate-100 dark:ring-slate-600 dark:hover:bg-slate-800"
                          title="Edit"
                          aria-label="Edit post"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
                          disabled={isRowDeleting}
                          className="rounded-md px-2 py-1 text-[12px] font-semibold text-red-600 ring-1 ring-red-300 hover:bg-red-50 disabled:opacity-60 dark:ring-red-500/40 dark:hover:bg-red-500/10"
                          title="Delete"
                          aria-label="Delete post"
                        >
                          {isRowDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      </div>
    </div>
  );
};
