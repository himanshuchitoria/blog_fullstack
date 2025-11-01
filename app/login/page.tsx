import Link from "next/link";

export default function LoginPage() {
  return (
    // Center the card vertically and horizontally in the viewport
    <main className="mx-auto grid min-h-[100dvh] max-w-[1240px] place-items-center px-5 py-10 md:px-6">
      <section className="relative mx-auto w-full max-w-[920px] h-[70vh] min-h-[420px] overflow-hidden rounded-3xl border border-slate-200 bg-white/30 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
        {/* ambient blobs */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/15" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl dark:bg-emerald-500/15" />

        {/* Fill the half-height card and keep both sides equal height */}
        <div className="relative grid h-full w-full grid-cols-1 lg:grid-cols-2">
          {/* Left: intro */}
          <div className="flex h-full flex-col justify-center p-8 md:p-10">
            <p className="text-xs tracking-widest text-slate-600 dark:text-slate-400">WELCOME BACK</p>
            <h1 className="mt-2 text-[36px] font-extrabold leading-tight md:text-[40px]">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-emerald-600 bg-clip-text text-transparent dark:from-white dark:via-indigo-300 dark:to-emerald-300">
                Sign in
              </span>
            </h1>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Continue your story, ship your ideas, and keep the streak alive.
            </p>

            <div className="mt-6 flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              <span>Secure by default. No trackers.</span>
            </div>
          </div>

          {/* Right: form (vertically centered) */}
          <div className="flex h-full items-center border-t border-slate-200 bg-white/40 p-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 md:p-10 lg:border-l lg:border-t-0">
            <form action="/dashboard" className="w-full space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="assignment@kapybara"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input type="checkbox" name="remember" className="h-4 w-4 accent-indigo-600 dark:accent-indigo-500" />
                  Remember me
                </label>
                <Link href="/reset" className="text-sm text-indigo-700 hover:underline dark:text-indigo-400">
                  Forgot password?
                </Link>
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
                ⏎ Sign in
              </button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                New here?{" "}
                <Link href="/signup" className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400">
                  Create an account
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
