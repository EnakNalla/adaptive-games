import {appRouter, createContext} from "@ag/api";
import {createNextApiHandler} from "@trpc/server/adapters/next";

export default createNextApiHandler({
  router: appRouter,
  createContext
});
