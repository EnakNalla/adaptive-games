import {createTRPCRouter} from "./trpc";
import {ytRouter} from "./router/ytRouter";

export const appRouter = createTRPCRouter({
  yt: ytRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
