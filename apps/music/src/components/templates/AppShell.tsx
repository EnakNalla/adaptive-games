import Link from "next/link";
import {type ReactNode} from "react";
import {useConfig, useStore} from "~/store";
import {Navbar, Container, Nav} from "react-bootstrap";
import Image from "next/image";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import {Loading} from "@ag/ui";

const ThemeToggle = dynamic(() => import("@ag/ui").then(x => x.ThemeToggle), {ssr: false});

export const AppShell = ({children}: {children: ReactNode}) => {
  const hasHydrated = useStore(state => state.hasHydrated);

  if (!hasHydrated) return <Loading />;

  return (
    <>
      <NavBar />
      <main className="mx-4">{children}</main>
    </>
  );
};

export const NavBar = () => {
  const router = useRouter();
  const hasStarted = useStore(state => state.hasStarted);
  const config = useConfig();

  return (
    <Navbar className="bg-body-tertiary mb-4 px-2" hidden={hasStarted}>
      <Container fluid>
        <Navbar.Brand href="/" as={Link}>
          <Image src="/icon.png" alt="Adaptive Games Logo" width="32" height="32" />
        </Navbar.Brand>

        <Nav className="ms-4">
          <Nav.Link as={Link} href="/" active={router.pathname === "/"}>
            Home
          </Nav.Link>
          <Nav.Link as={Link} href="/settings" active={router.pathname === "/settings"}>
            Settings
          </Nav.Link>
          {config.inputConfig.type === "SWITCH" && (
            <Nav.Link as={Link} href="/misshits" active={router.pathname === "/misshits"}>
              Misshits
            </Nav.Link>
          )}
        </Nav>

        <Nav className="ms-auto">
          <Nav.Item>
            <ThemeToggle />
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};
