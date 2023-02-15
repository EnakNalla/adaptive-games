import type {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import type {AppType} from "next/app";
import {api} from "../utils/api";
import "../styles/index.scss";
import AppShell from "../components/AppShell";
import {ThemeProvider} from "next-themes";

const MyApp: AppType<{session: Session | null}> = ({
  Component,
  pageProps: {session, ...pageProps}
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="data-bs-theme">
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
