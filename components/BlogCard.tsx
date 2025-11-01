import React, { useMemo } from "react";
import { getPostStats } from "@/lib/postStats";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import Link from "next/link";

type Tag = { label: string; colorClass: string };

interface BlogCardProps {
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  descriptionHtml?: string; // HTML preview (first blocks)
  content?: string; // full content for stats
  tags?: Tag[];
  // Optional CRUD controls
  editHref?: string;             // e.g., `/postform?id=${id}`
  onDelete?: () => void;         // click handler for delete
  showControls?: boolean;        // toggle controls on/off
}

function stripClasses(html: string) {
  return html
    .replace(/\sclass=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\sstyle=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\sdata-[a-z0-9_-]+=(?:"[^"]*"|'[^']*')/gi, "");
}

function toPlainText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function firstWordsFromHtml(html: string, maxWords = 12) {
  const text = toPlainText(html);
  const words = text.split(/\s+/).filter(Boolean);
  const sliced = words.slice(0, maxWords).join(" ");
  return words.length > maxWords ? sliced + "..." : sliced;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  author,
  date,
  imageUrl,
  descriptionHtml = "",
  content = "",
  tags = [],
  editHref,
  onDelete,
  showControls = false,
}) => {
  // Stats basis: prefer full content, fallback to preview HTML; count on plain text
  const statsBasisPlain = useMemo(() => {
    const basis = content?.trim().length ? content : descriptionHtml || "";
    return basis.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }, [content, descriptionHtml]);

  const stats = useMemo(() => getPostStats(statsBasisPlain, 150), [statsBasisPlain]);

  // Short teaser for uniform height
  const preview = useMemo(() => {
    const cleaned = stripClasses(descriptionHtml);
    const sanitized = sanitizeHtml(cleaned);
    const basis = sanitized && sanitized.trim().length > 0 ? sanitized : descriptionHtml;
    return firstWordsFromHtml(basis, 12);
  }, [descriptionHtml]);

  return (
    <article className="group flex h-[420px] flex-col overflow-hidden" role="article">
      {/* Rounded image (constant aspect/size) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800/60">
        <img
          src={imageUrl}
          alt={`Image for blog post: ${title}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Transparent content area; spacing only, no borders/rings */}
      <div className="flex min-h-0 flex-1 flex-col bg-transparent p-3 md:p-4">
        {/* Meta (author • date) */}
        <div className="flex items-center gap-2 text-[12px] font-semibold">
          <span className="text-blue-700 dark:text-blue-300">{author}</span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="text-blue-700 dark:text-blue-300">{date}</span>
        </div>

        {/* Title (clamped to 2 lines) */}
        <h3 className="mt-1 line-clamp-2 text-[18px] font-extrabold leading-snug text-slate-900 dark:text-slate-100">
          {title}
        </h3>

        {/* Teaser (clamped) */}
        <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-slate-600 dark:text-slate-300">
          {preview}
        </p>

        {/* Footer pinned bottom: tags left, stats + controls right */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex max-w-[60%] flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className={`truncate rounded-full px-2.5 py-1 text-[12px] font-semibold ${tag.colorClass}`}
                title={tag.label}
                aria-label={`Tag: ${tag.label}`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {stats.words > 0 && (
              <span className="shrink-0 whitespace-nowrap text-[12px] text-slate-500 dark:text-slate-400">
                {stats.words} words • {stats.minutes} min
              </span>
            )}

            {showControls && (
              <div className="ml-2 inline-flex items-center gap-1">
                <Link
                  href={editHref || "#"}
                  className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100 dark:text-slate-100 dark:ring-slate-600 dark:hover:bg-slate-800"
                  title="Edit"
                  aria-label="Edit post"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-md px-2 py-1 text-[12px] font-semibold text-red-600 ring-1 ring-red-300 hover:bg-red-50 dark:ring-red-500/40 dark:hover:bg-red-500/10"
                  title="Delete"
                  aria-label="Delete post"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
