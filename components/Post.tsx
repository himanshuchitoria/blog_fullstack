"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { getPostStats } from "@/lib/postStats";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { trpc } from "@/app/_trpc/client";

interface PostProps {
  id?: number;
  title?: string | null;
  content?: string | null; // may contain HTML from editor
  imageUrl?: string | null;
  author?: string | null;
  createdAt?: string | Date | null;
  category?: string | null;
  status?: "draft" | "published" | null;
  showDelete?: boolean; // enable on dashboard only
  showEdit?: boolean; // control Edit visibility while preserving layout
}

export const Post: React.FC<PostProps> = ({
  id,
  title,
  content,
  imageUrl,
  author,
  createdAt,
  category = "General",
  status = "draft",
  showDelete = false,
  showEdit = true, // default: show Edit; hide by passing false
}) => {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  const isDraft = status === "draft";

  const stats = useMemo(() => getPostStats(content ?? ""), [content]);
  const safeHtml = useMemo(() => sanitizeHtml(content ?? ""), [content]);

  // tRPC invalidate after delete
  const utils = trpc.useContext();
  const [deleting, setDeleting] = useState(false);
  const deletePost = trpc.deletePost.useMutation({
    onSettled: async () => {
      setDeleting(false);
      await utils.getPosts.invalidate();
    },
  });

  const onDelete = () => {
    if (typeof id !== "number") return;
    const ok = window.confirm("Delete this post? This action cannot be undone.");
    if (!ok) return;
    setDeleting(true);
    deletePost.mutate({ id });
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5 dark:border-slate-800 dark:bg-slate-900">
      {/* Top row: title + chips + actions */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          {typeof id === "number" ? (
            <Link
              href={`/post/${id}`}
              className="break-words text-[20px] font-extrabold text-slate-900 hover:underline md:text-[22px] dark:text-slate-100"
              aria-label={`Open ${title ?? "post"}`}
            >
              {title ?? "Untitled"}
            </Link>
          ) : (
            <h2 className="break-words text-[20px] font-extrabold text-slate-900 md:text-[22px] dark:text-slate-100">
              {title ?? "Untitled"}
            </h2>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[12px] font-semibold text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300">
              {category || "General"}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 text-[12px] font-semibold ${
                isDraft
                  ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              }`}
            >
              {isDraft ? "Draft" : "Published"}
            </span>
          </div>
        </div>

        {/* Actions cluster with stable width so layout doesn't shift */}
        <div className="shrink-0 flex items-center gap-3">
          {stats.words > 0 && (
            <span className="whitespace-nowrap text-[12px] text-slate-500 dark:text-slate-400">
              {stats.words} words • {stats.minutes} min read
            </span>
          )}
          <span className="whitespace-nowrap text-[12px] text-slate-500 dark:text-slate-400">
            {formattedDate}
          </span>

          {/* Keep a placeholder to preserve spacing when Edit is hidden */}
          <div className="min-w-[64px] flex justify-end">
            {showEdit && typeof id === "number" ? (
              <Link
                href={`/post/${id}/edit`}
                className="rounded-full border border-slate-300 px-3 py-1 text-[12px] text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                aria-label={`Edit ${title ?? "post"}`}
              >
                Edit
              </Link>
            ) : (
              <span aria-hidden className="inline-block select-none px-3 py-1 opacity-0">
                Edit
              </span>
            )}
          </div>

          {showDelete && typeof id === "number" && (
            <button
              onClick={onDelete}
              disabled={deleting || deletePost.isLoading}
              className={[
                "rounded-full border px-3 py-1 text-[12px] transition",
                "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                "dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20",
                deleting || deletePost.isLoading ? "cursor-not-allowed opacity-60" : "",
              ].join(" ")}
              aria-label={`Delete ${title ?? "post"}`}
              title="Delete post"
            >
              {deleting || deletePost.isLoading ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mt-3 overflow-hidden rounded-[16px] bg-slate-100 dark:bg-slate-800/60">
          <img
            src={imageUrl}
            alt={title ?? "Post Image"}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="mt-3">
        {safeHtml ? (
          <div className="preview-html" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        ) : (
          <p className="text-slate-700 dark:text-slate-200">{content}</p>
        )}
      </div>

      {/* Footer author */}
      <p className="mt-3 text-[12px] text-slate-500 dark:text-slate-400">
        Posted by: {author ?? "Anonymous"}
      </p>
    </article>
  );
};
