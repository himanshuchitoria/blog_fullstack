"use client";

import React, { useMemo } from "react";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { getPostStats } from "@/lib/postStats";

type Props = {
  title: string;
  author: string;
  date: Date;
  imageUrl?: string;
  contentHtml: string; // rich text HTML from editor
  category?: string;
  status?: "draft" | "published";
};

export const PostPreview: React.FC<Props> = ({
  title,
  author,
  date,
  imageUrl,
  contentHtml,
  category = "General",
  status = "draft",
}) => {
  const safeHtml = useMemo(() => sanitizeHtml(contentHtml), [contentHtml]);
  const stats = useMemo(() => getPostStats(contentHtml), [contentHtml]);
  const formattedDate = useMemo(
    () =>
      new Date(date).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [date]
  );

  const isDraft = status === "draft";

  return (
    <article className="bg-gray-900 rounded-lg p-6 border border-gray-700">
      <header className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-white">{title || "Untitled"}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
            {category}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${
              isDraft
                ? "bg-yellow-500/15 text-yellow-300 border-yellow-400/40"
                : "bg-blue-500/15 text-blue-300 border-blue-400/40"
            }`}
          >
            {isDraft ? "Draft" : "Published"}
          </span>
        </div>
      </header>

      <div className="text-sm text-gray-300 mb-4">
        By {author || "Anonymous"} • {formattedDate}
        {stats.words > 0 && <> • {stats.words} words • {stats.minutes} min read</>}
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post cover"
          className="w-full max-h-[420px] object-contain rounded mb-4 bg-black/20"
        />
      )}

      <section
        className="prose prose-invert max-w-none prose-headings:scroll-mt-20"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </article>
  );
};
