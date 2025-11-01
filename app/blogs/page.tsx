"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchBar } from "@/components/SearchBar";

// Build a short, semantic HTML preview (first ~3 blocks)
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

export default function AllBlogsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") ?? "All";
  const qParam = searchParams.get("q") ?? "";

  const [category, setCategory] = useState<string>(categoryParam);
  const [q, setQ] = useState<string>(qParam);
  const [currentPage, setCurrentPage] = useState(1);

  // Fixed page size
  const postsPerPage = 6;

  // Fetch lists (hooks must not be conditionally skipped)
  const { data: allPublished = [], isLoading: loadingAll, error: errorAll } =
    trpc.getPosts.useQuery({ status: "published" });

  const effectiveCategory = category === "All" ? undefined : category;
  const effectiveQ = q.trim().length ? q : undefined;

  const {
    data: filtered = [],
    isLoading: loadingFiltered,
    error: errorFiltered,
  } = trpc.getPosts.useQuery({
    status: "published",
    category: effectiveCategory,
    q: effectiveQ,
  });

  // Derive categories (always computed; safe on empty array)
  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    for (const p of allPublished) if (p.category) set.add(p.category);
    return Array.from(set);
  }, [allPublished]);

  // Keep URL in sync with category; reset page
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") params.delete("category");
    else params.set("category", category);
    router.replace(`?${params.toString()}`);
    setCurrentPage(1);
  }, [category, router, searchParams]);

  // Sync local q from URL
  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  // Reset page when q changes
  useEffect(() => {
    setCurrentPage(1);
  }, [q]);

  // IMPORTANT: derive values with hooks BEFORE any conditional return
  const isBusy = loadingAll || loadingFiltered;
  const loadError = errorAll?.message || errorFiltered?.message || "";

  // Sort and paginate (safe on empty array while loading)
  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [filtered]
  );

  const totalPages = Math.ceil(sorted.length / postsPerPage) || 1;
  const offset = (currentPage - 1) * postsPerPage;
  const pageItems = sorted.slice(offset, offset + postsPerPage);

  return (
    <div className="page-canvas dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <div className="page-header">
        <h2 className="page-heading">All blog posts</h2>
        <div className="toolbar">
          <SearchBar className="toolbar-search" />
          <div className="toolbar-filter">
            <CategoryFilter
              categories={categories}
              value={category}
              onChange={setCategory}
            />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="content-area">
        {loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            Error loading posts: {loadError}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid-balanced">
              {isBusy
                ? Array.from({ length: postsPerPage }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="h-40 bg-gray-100 dark:bg-slate-800/60" />
                      <div className="space-y-2 p-4">
                        <div className="h-3 w-32 rounded bg-gray-200 dark:bg-slate-800" />
                        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
                        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800" />
                      </div>
                    </div>
                  ))
                : pageItems.map((post: any) => {
                    const previewHtml = toPreviewHtml(post.post ?? "");
                    return (
                      <Link key={post.id} href={`/post/${post.id}`} className="grid-item">
                        <BlogCard
                          title={post.title}
                          author={post.author}
                          date={new Date(post.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          imageUrl={post.image_url ?? "/placeholder.png"}
                          descriptionHtml={previewHtml}
                          content={post.post}
                          tags={[
                            {
                              label: post.category ?? "General",
                              colorClass:
                                "text-emerald-900 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-500/10",
                            },
                          ]}
                        />
                      </Link>
                    );
                  })}
            </div>

            {/* Pagination pinned near footer */}
            <div className="pager-wrap">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.max(totalPages, 1)}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </div>

      {/* Page-only styles */}
      <style jsx global>{`
        .page-canvas {
          background: #ffffff;
          color: #0f172a;
          max-width: 1440px;
          margin: 0 auto;
          padding: 28px 22px 32px;
          min-height: 70vh;
          display: flex;
          flex-direction: column;
        }
        .page-header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 14px;
          margin-bottom: 40px;
          margin-top: 20px;
        }
        .page-heading {
          font-size: 23px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0 0 2px 6px;
          color: #0f172a;
        }
        .toolbar {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .toolbar-search {
          display: none;
        }
        @media (min-width: 640px) {
          .toolbar-search {
            display: block;
            width: 300px;
            height: 40px;
            border-radius: 9999px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 0;
          }
        }
        .toolbar-filter {
          height: 40px;
          display: inline-flex;
          align-items: center;
          padding: 0 10px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
        }
        .toolbar-filter select {
          background: transparent;
          border: none;
          outline: none;
          height: 36px;
          padding: 0 6px;
          color: #334155;
          font-size: 14px;
          cursor: pointer;
        }
        .content-area {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .grid-balanced {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 24px;
        }
        @media (min-width: 640px) {
          .grid-balanced {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
        }
        @media (min-width: 1024px) {
          .grid-balanced {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
          }
        }
        .grid-item {
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .pager-wrap {
          margin-top: auto;
          padding-top: 20px;
        }

        /* Dark theme overrides for this page’s inline styles */
        .dark .page-heading {
          color: #e2e8f0;
        }
        .dark .toolbar-search {
          background: rgba(30, 41, 59, 0.6);
          border-color: #334155;
        }
        .dark .toolbar-filter {
          background: rgba(30, 41, 59, 0.6);
          border-color: #334155;
        }
        .dark .toolbar-filter select {
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
