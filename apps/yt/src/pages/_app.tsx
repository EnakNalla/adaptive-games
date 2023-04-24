import {useQueryErrorResetBoundary} from "@tanstack/react-query";
import type {Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "next-themes";
import type {AppType} from "next/app";
import Link from "next/link";
import {Suspense, type ReactNode} from "react";
import {Alert, Button, Container} from "react-bootstrap";
import {ErrorBoundary} from "react-error-boundary";
import {Loading} from "@ag/ui";
import AppShell from "../components/AppShell";
import "../styles/index.scss";
import {api} from "../utils/api";

const AppWrapper = ({children}: {children: ReactNode}) => {
  const {reset} = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({resetErrorBoundary}) => (
        <Container>
          <Alert variant="danger" className="text-center">
            <h1>Something went wrong.</h1>
            <div className="mb-5 mt-5">
              <Button onClick={resetErrorBoundary}>Try again</Button>
              <Link className="btn btn-primary ms-4" href="/">
                Go Home
              </Link>
            </div>

            <p>If the problem persists please contact the system administrator</p>
          </Alert>
        </Container>
      )}
    >
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

const MyApp: AppType<{session: Session | null}> = ({
  Component,
  pageProps: {session, ...pageProps}
}) => {
  return (
    <AppWrapper>
      <SessionProvider session={session}>
        <ThemeProvider attribute="data-bs-theme">
          <AppShell>
            <Component {...pageProps} />
          </AppShell>
        </ThemeProvider>
      </SessionProvider>
    </AppWrapper>
  );
};

export default api.withTRPC(MyApp);
