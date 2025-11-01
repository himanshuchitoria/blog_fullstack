import "./globals.css";
import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Provider from "./_trpc/Provider";
import { NavBar } from "@/components/NavBar";
import { ThemeProvider } from "@/components/ThemeProvider";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Use untyped viewport export so it works across Next versions
export const viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: {
    default: "My Blog Site",
    template: "%s • My Blog",
  },
  description: "Explore articles and blog posts with images and tags.",
  keywords: ["blog", "tech", "programming", "cloud", "aws", "react", "next.js"],
  authors: [{ name: "Himanshu" }],
  creator: "Himanshu",
  publisher: "My Blog",
  openGraph: {
    type: "website",
    url: "https://your-domain.com",
    title: "My Blog Site",
    description: "Explore articles and blog posts with images and tags.",
    siteName: "My Blog",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "My Blog Open Graph",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@your_handle",
    creator: "@your_handle",
    title: "My Blog Site",
    description: "Explore articles and blog posts with images and tags.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning helps avoid a brief flash when next-themes toggles classes
    <html lang="en" suppressHydrationWarning>
      {/* Flex column sticky-footer layout */}
      <body className={`${sora.className} min-h-screen flex flex-col bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Provider>
            <NavBar />

            {/* Fills remaining height so the footer is pushed to the bottom */}
            <main className="flex-1">{children}</main>

            {/* Aesthetic, Gen‑Z glass footer with fixed height */}
            <footer className="relative h-16 md:h-20 border-t border-slate-200 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60">
              {/* soft gradient hairline */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-fuchsia-400/40 via-slate-200 to-emerald-400/40" />
              <div className="mx-auto h-full max-w-[1240px] px-5 md:px-6 flex items-center justify-center">
                <p className="text-sm text-gray-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">© 2025 My Blog</span>
                  <span className="mx-2 text-slate-400">•</span>
                  <span>By Himanshu</span>
                </p>
              </div>
            </footer>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
