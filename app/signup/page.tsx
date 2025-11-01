import Link from "next/link";

export default function SignupPage() {
  return (
    // Center the card in the viewport and keep the card at half screen height
    <main className="mx-auto grid min-h-[100dvh] max-w-[1240px] place-items-center px-5 py-10 md:px-6">
      <section className="relative mx-auto w-full max-w-[920px] h-[75vh] min-h-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-white/30 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-500/15" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl dark:bg-cyan-500/15" />

        {/* Equal-height two-column layout inside the half-height card */}
        <div className="relative grid h-full w-full grid-cols-1 lg:grid-cols-2">
          {/* Left: intro */}
          <div className="flex h-full flex-col justify-center p-8 md:p-10">
            <p className="text-xs tracking-widest text-slate-600 dark:text-slate-400">GET STARTED</p>
            <h1 className="mt-2 text-[36px] font-extrabold leading-tight md:text-[40px]">
              <span className="bg-gradient-to-r from-slate-900 via-violet-700 to-cyan-600 bg-clip-text text-transparent dark:from-white dark:via-violet-300 dark:to-cyan-300">
                Create account
              </span>
            </h1>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Join the feed, draft your first post, and share your voice.
            </p>

            <div className="mt-6 flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-indigo-400" />
              <span>No credit card. No nonsense.</span>
            </div>
          </div>

          {/* Right: form (vertically centered) */}
          <div className="flex h-full items-center border-t border-slate-200 bg-white/40 p-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 md:p-10 lg:border-l lg:border-t-0">
            <form action="/api/auth/signup" method="post" className="w-full space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Himanshu"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="assignment@Kapybara"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    boxShadow:
                      "0 0 0 2px rgba(15,23,42,0.08), 0 10px 24px rgba(15,23,42,0.10), inset 0 0 0 1px rgba(255,255,255,0.5)",
                  }}
                />
                Create account
              </button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-violet-700 hover:underline dark:text-violet-400">
                  Sign in
                </Link>
              </p>

              {/* Divider */}
              <div className="relative my-4">
                <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />
                <span className="absolute inset-0 -top-3 mx-auto w-max rounded-full bg-white/40 px-2 text-[11px] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                  or continue with
                </span>
              </div>

              {/* Social (dummy links) */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="#"
                  className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-center text-slate-800 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Google
                </Link>
                <Link
                  href="#"
                  className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-center text-slate-800 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  GitHub
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
