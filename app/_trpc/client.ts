import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "@/server";

// Create fully typed tRPC hooks for client usage
export const trpc = createTRPCReact<AppRouter>({});
