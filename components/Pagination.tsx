"use client";

import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;   // number of pages to show on each side of current
  boundaryCount?: number;  // number of pages to always show at the start and end
  className?: string;
};

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1
): (number | "...")[] {
  const items: (number | "...")[] = [];
  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(
    Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
    totalPages
  );

  const leftSibling = Math.max(currentPage - siblingCount, boundaryCount + 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1);

  const showLeftEllipsis = leftSibling > boundaryCount + 2;
  const showRightEllipsis = rightSibling < totalPages - boundaryCount - 1;

  items.push(...startPages);

  if (showLeftEllipsis) {
    items.push("...");
  } else {
    items.push(...range(boundaryCount + 1, Math.max(leftSibling - 1, boundaryCount + 1)));
  }

  items.push(...range(leftSibling, rightSibling));

  if (showRightEllipsis) {
    items.push("...");
  } else {
    items.push(
      ...range(Math.min(rightSibling + 1, totalPages - boundaryCount), totalPages - boundaryCount)
    );
  }

  items.push(...endPages);

  // Deduplicate and keep order
  const seen = new Set<string>();
  const unique: (number | "...")[] = [];
  for (const it of items) {
    const key = String(it);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(it);
    }
  }
  // Filter out invalid numbers
  return unique.filter((it) => it === "..." || (typeof it === "number" && it >= 1 && it <= totalPages));
}

function range(start: number, end: number): number[] {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  className = "",
}) => {
  const page = clamp(currentPage || 1, 1, Math.max(totalPages, 1));
  const disabledPrev = page <= 1;
  const disabledNext = page >= totalPages;

  if (totalPages <= 1) {
    return (
      <nav aria-label="Pagination" className={`mt-8 flex justify-center ${className}`}>
        <div className="text-sm text-gray-500 dark:text-slate-400">Page 1 of 1</div>
      </nav>
    );
  }

  const items = getPageItems(page, totalPages, siblingCount, boundaryCount);

  const goTo = (p: number) => {
    const np = clamp(p, 1, totalPages);
    if (np !== page) onPageChange(np);
  };

  const baseBtn =
    "h-9 px-3 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-500/50"; // better focus ring for a11y [web:73]
  const btnEnabled =
    "text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"; // dark variants for contrast [web:73]
  const btnDisabled =
    "text-gray-400 border-gray-200 cursor-not-allowed dark:text-slate-500 dark:border-slate-800"; // disabled dark styles [web:73]

  return (
    <nav aria-label="Pagination" className={`mt-8 flex items-center justify-center ${className}`}>
      <ul className="inline-flex items-center gap-1">
        <li>
          <button
            type="button"
            aria-label="Go to first page"
            onClick={() => goTo(1)}
            disabled={disabledPrev}
            className={`${baseBtn} ${disabledPrev ? btnDisabled : btnEnabled}`}
          >
            «
          </button>
        </li>

        <li>
          <button
            type="button"
            aria-label="Go to previous page"
            onClick={() => goTo(page - 1)}
            disabled={disabledPrev}
            className={`${baseBtn} ${disabledPrev ? btnDisabled : btnEnabled}`}
          >
            ‹
          </button>
        </li>

        {items.map((it, idx) => {
          if (it === "...") {
            return (
              <li
                key={`ellipsis-${idx}`}
                className="flex h-9 items-end px-2 pb-[6px] select-none text-gray-500 dark:text-slate-400"
              >
                …
              </li>
            );
          }
          const isActive = it === page;
          return (
            <li key={it}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-label={`Page ${it}`}
                onClick={() => goTo(it)}
                className={
                  isActive
                    ? "h-9 min-w-9 px-3 rounded border text-sm bg-emerald-600 border-emerald-600 text-white"
                    : `h-9 min-w-9 ${baseBtn} ${btnEnabled}`
                }
              >
                {it}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            aria-label="Go to next page"
            onClick={() => goTo(page + 1)}
            disabled={disabledNext}
            className={`${baseBtn} ${disabledNext ? btnDisabled : btnEnabled}`}
          >
            ›
          </button>
        </li>

        <li>
          <button
            type="button"
            aria-label="Go to last page"
            onClick={() => goTo(totalPages)}
            disabled={disabledNext}
            className={`${baseBtn} ${disabledNext ? btnDisabled : btnEnabled}`}
          >
            »
          </button>
        </li>
      </ul>

      <div className="ml-3 hidden text-sm text-gray-600 dark:text-slate-400 sm:block">
        Page {page} of {totalPages}
      </div>
    </nav>
  );
};
