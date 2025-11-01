import { httpBatchLink } from "@trpc/client";
import { appRouter } from "@/server";

// Create a type-safe caller to your app router for server-side or direct invocation
export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_TRPC_URL || "https://blog-fullstack-o4gm.vercel.app/api/trpc",
      // Can add headers/auth here if needed
    }),
  ],
});
