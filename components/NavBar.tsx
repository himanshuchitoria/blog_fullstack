"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/blogs", label: "All Blogs" },
  { href: "/recent", label: "Recent Blogs" },
  { href: "/post", label: "Post Blog" }, // change if your create route differs
];

export const NavBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-900/60">
      <nav className="mx-auto max-w-[1240px] px-4">
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/blogs"
            className="text-[16px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100"
          >
            My Blog
          </Link>

          {/* Desktop pill nav */}
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800/60">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                    isActive(l.href)
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-900 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <span className="sr-only">Toggle menu</span>
              <div className="flex flex-col gap-1.5">
                <span className="h-0.5 w-5 rounded bg-slate-900 dark:bg-slate-100" />
                <span className="ml-auto h-0.5 w-4 rounded bg-slate-900 dark:bg-slate-100" />
                <span className="h-0.5 w-5 rounded bg-slate-900 dark:bg-slate-100" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay + pop panel */}
      {open && (
        <>
          {/* Backdrop */}
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
          />
          {/* Pop panel */}
          <div className="absolute right-4 top-16 z-50 w-[86%] max-w-[360px]">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/60 shadow-lg backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/70">
              {/* subtle gradient ring */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/60 dark:ring-slate-700/60" />
              <div className="p-3">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block w-full rounded-2xl px-4 py-3 text-base transition",
                      isActive(l.href)
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
