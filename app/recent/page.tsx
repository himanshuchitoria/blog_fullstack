"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { BlogCard } from "@/components/BlogCard";
import { SearchBar } from "@/components/SearchBar";
import { useSearchParams } from "next/navigation";

/* Build a short preview from the first semantic blocks */
function toPreviewHtml(html: string): string {
  if (!html) return "";
  if (typeof window !== "undefined" && typeof (window as any).DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const blocks = doc.body.querySelectorAll("h1,h2,h3,p,li,blockquote,pre");
    const frag = doc.createElement("div");
    let count = 0;
    for (const el of blocks) {
      frag.appendChild(el.cloneNode(true));
      count++;
      if (count >= 3) break;
    }
    return frag.innerHTML || doc.body.innerHTML;
  }
  return html;
}

function toPlainText(html: string) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function firstWordsFromHtml(html: string, maxWords = 26) {
  const text = toPlainText(html);
  const words = text.split(/\s+/).filter(Boolean);
  const sliced = words.slice(0, maxWords).join(" ");
  return words.length > maxWords ? sliced + "..." : sliced;
}

/* Larger horizontal small-card so text is guaranteed visible */
function SmallCard({ post }: { post: any }) {
  const date = new Date(post.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const preview = firstWordsFromHtml(toPreviewHtml(post.post || ""), 28);

  return (
    <Link href={`/post/${post.id}`} className="block">
      <article className="grid items-start gap-3 grid-cols-[180px_1fr] sm:grid-cols-[200px_1fr] margins-[40px]">
        <div className="h-[140px] w-[180px] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 sm:h-[150px] sm:w-[200px]">
          <img
            src={post.image_url || "/placeholder.png"}
            alt={post.title}
            className="h-50px w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[12px] font-semibold">
            <span className="text-blue-700 dark:text-blue-300">{post.author || "Anonymous"}</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-blue-700 dark:text-blue-300">{date}</span>
          </div>

          <h3 className="mt-1 line-clamp-2 text-[18px] font-extrabold leading-snug text-slate-900 dark:text-slate-100">
            {post.title}
          </h3>

          <p className="mt-1 line-clamp-3 text-[14px] leading-6 text-slate-600 dark:text-slate-300">
            {preview}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function RecentBlogsPage() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const effectiveQ = qParam.trim().length ? qParam : undefined;

  const { data: posts = [], isLoading, error } = trpc.getPosts.useQuery({
    status: "published",
    q: effectiveQ,
  });

  const sorted = useMemo(
    () =>
      [...posts].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [posts]
  );

  const [featured, small1, small2, small3] = sorted as any[];

  if (isLoading) {
    return (
      <div className="recent-canvas">
        <p>Loading posts...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="recent-canvas">
        <p>Error loading posts: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="recent-canvas">
      <div className="recent-top">
        <h2 className="recent-title">Recent blog posts</h2>

        <SearchBar className="recent-search" />
      </div>

      <div className="grid-wrap">
        {/* Featured left: spans three rows on desktop; reduced image height so more text is visible */}
        <div className="featured-cell">
          {featured && (
            <Link href={`/post/${featured.id}`} className="block">
              <div className="featured-card">
                <div className="override-height">
                  <BlogCard
                    title={featured.title}
                    author={featured.author}
                    date={new Date(featured.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    imageUrl={featured.image_url || "/placeholder.png"}
                    descriptionHtml={toPreviewHtml(featured.post ?? "")}
                    content={featured.post}
                    tags={[
                      {
                        label: featured.category ?? "General",
                        colorClass:
                          "text-emerald-900 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/10",
                      },
                    ]}
                  />
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Right: three larger small posts with horizontal layout */}
        <div className="small-stack">
          {[small1, small2, small3].filter(Boolean).map((p: any) => (
            <div key={p.id} className="small-row">
              <SmallCard post={p} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .recent-canvas {
          background: transparent;
          color: inherit;
          max-width: 1536px;
          margin: 0 auto;
          padding: 20px 14px 28px;
          margin-top: 30px;
        }

        .recent-top {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
          
        }
        .recent-title {
          font-size: 22px;
          font-weight: 800;
          
        }
        .recent-search {
          display: none;
        }
        @media (min-width: 640px) {
          .recent-search {
            display: block;
            width: 320px;
            height: 40px;
            border-radius: 9999px;
            background: transparent;
            border: 1px solid rgba(148, 163, 184, 0.4);
          }
          .dark .recent-search {
            border-color: rgba(100, 116, 139, 0.5);
          }
        }

        /* Responsive grid: single column on mobile; on desktop, featured spans 3 rows */
        .grid-wrap {
          display: grid;
          gap: 38px;
          grid-template-columns: 1fr;
          margin-top: 60px;
          

        }
        @media (min-width: 900px) {
          .grid-wrap {
            grid-template-columns: 2fr 1fr;
            align-items: start;
          }
          .featured-cell {
            grid-row: span 3; /* left equals height of three right rows */
          }
        }

        @media (max-width: 500px) {
        .featured-card .override-height > article > div:first-child {
          height: 210px !important;           /* reduced featured image height */
          aspect-ratio: auto !important;       /* cancel 16:9 if present */
          width: 400px !important;
          margin: 20px !important;
        }
          
          
        }

        .small-stack {
          display: grid;
          gap: 38px;
          grid-auto-rows: auto;
        }

        /* Make featured BlogCard image smaller and content fully visible */
        .featured-card .override-height > article {
          height: auto !important;
        }
        /* Target the BlogCard media block (first child div) and shrink it */
        .featured-card .override-height > article > div:first-child {
          height: 410px !important;           /* reduced featured image height */
          aspect-ratio: auto !important;       /* cancel 16:9 if present */
        }
        /* Allow more text in featured if it was clamped to 2 lines */
        .featured-card .override-height p.line-clamp-2 {
          -webkit-line-clamp: 4;
          line-clamp: 4;
        }

        /* Keep everything transparent */
        .grid-wrap,
        .featured-card,
        .small-stack,
        .small-row {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
