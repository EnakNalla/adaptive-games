import {createNextApiHandler} from "@trpc/server/adapters/next";
import {appRouter, createTRPCContext} from "@ag/api";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext
});
