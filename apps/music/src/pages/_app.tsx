import "~/styles/styles.scss";
import type {AppProps} from "next/app";
import {AppShell} from "~/components/templates/AppShell";
import {ThemeProvider} from "next-themes";

export default function App({Component, pageProps}: AppProps) {
  return (
    <ThemeProvider attribute="data-bs-theme">
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </ThemeProvider>
  );
}
