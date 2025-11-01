import Link from "next/link";
import { serverClient } from "@/app/_trpc/serverClient";
import { Feed } from "@/components/Feed";
import { Suspense } from "react";

function ProfilePanel() {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white/30 p-4 shadow-sm backdrop-blur-md md:p-5 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dev Blogger</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">@dev_demo</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">24</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Posts</p>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">1.2k</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Followers</p>
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">180</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Following</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
        Passionate about full‑stack, cloud, and clean architecture. This is dummy profile info for the dashboard.
      </p>
    </aside>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // Fetch both sets; Feed will still query by selected status on the client
  const [published, drafts] = await Promise.all([
    serverClient.getPosts({ status: "published" }),
    serverClient.getPosts({ status: "draft" }),
  ]);

  return (
    <main className="mx-auto max-w-[1240px] px-5 py-6 md:px-6 text-slate-900 dark:text-slate-100">
      <header className="mb-5">
        <h1 className="ml-1 text-[24px] font-extrabold leading-tight">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/40 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70">
            <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/15" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl dark:bg-emerald-500/15" />

            <div className="relative p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[20px] font-extrabold tracking-tight">Write something great</h2>

                <Link
                  href="/blogs"
                  className="rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-xs text-slate-800 hover:bg-white/90 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 md:text-sm"
                >
                  View all posts
                </Link>
              </div>

              <Link
                href="/postform"
                className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white/60 shadow-sm transition backdrop-blur-md hover:bg-white/70 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:bg-slate-900/80"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/20" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/20" />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
                      ✨ New post
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">click to open</span>
                  </div>

                  <h3 className="mt-4 text-[22px] font-extrabold leading-tight md:text-[26px]">
                    <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-emerald-600 bg-clip-text text-transparent dark:from-white dark:via-indigo-300 dark:to-emerald-300">
                      What’s on your mind?
                    </span>
                  </h3>

                  <p className="mt-2 text-slate-700 dark:text-slate-300">
                    Share ideas, wins, rants, or deep dives. Make it yours.
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:scale-105 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                      <img
                        src="https://api.iconify.design/lucide/pen-line.svg?color=%230f172a"
                        alt="Create"
                        className="h-5 w-5 dark:invert"
                        loading="lazy"
                      />
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:scale-105 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                      <img
                        src="https://api.iconify.design/lucide/sparkles.svg?color=%230f172a"
                        alt="Inspire"
                        className="h-5 w-5 dark:invert"
                        loading="lazy"
                      />
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:scale-105 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                      <img
                        src="https://api.iconify.design/lucide/rocket.svg?color=%230f172a"
                        alt="Launch"
                        className="h-5 w-5 dark:invert"
                        loading="lazy"
                      />
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-400">Start a post</span>
                  </div>

                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white transition group-hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:group-hover:bg-slate-200">
                      Write now
                      <img
                        src="https://api.iconify.design/lucide/arrow-right.svg?color=%23ffffff"
                        alt=""
                        className="h-4 w-4 dark:invert"
                        loading="lazy"
                      />
                    </span>
                  </div>

                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm text-white transition group-hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:group-hover:bg-slate-200">
                      Show some creativity
                      <span aria-hidden className="translate-x-0 transition group-hover:translate-x-0.5"></span>
                    </span>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-400/10 via-transparent to-emerald-400/10" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Right column: profile, heading, and logout button */}
        <section className="lg:col-span-5">
          <ProfilePanel />
          <h1 className="mt-[50px] text-center text-[50px] font-extrabold">YOUR STYLE</h1>


          <div className="mt-3 flex justify-center">
            <form action="/login" className="mt-4 flex justify-center">
              <button
                type="submit"
                className="
                  relative inline-flex items-center gap-2
                  rounded-full border border-slate-300 bg-white px-6 py-3 text-[15px] font-semibold text-slate-900 shadow-sm transition hover:bg-white/90
                  dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700
                "
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{ boxShadow: '0 0 0 2px rgba(15,23,42,0.08), 0 8px 20px rgba(15,23,42,0.08), inset 0 0 0 1px rgba(255,255,255,0.5)' }}
                />
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15 text-red-600 ring-1 ring-red-500/30">
                  ⏻
                </span>
                Logout
              </button>
            </form>
          </div>
        </section>

        {/* Posts block with toggle */}
        <section className="lg:col-span-12">
          <div className="rounded-3xl border border-slate-200 bg-white/40 p-3 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/70 md:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-extrabold">Your posts</h3>
              {/* counts from server */}
              <span className="text-xs text-slate-700 dark:text-slate-400">{published.length}</span>
            </div>

            {/* Feed now contains its own Published/Draft toggle and filters queries */}
            <Suspense>
              <Feed initialPosts={published} showDelete />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
