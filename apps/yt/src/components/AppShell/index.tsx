import {signIn, useSession} from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {useEffect, type ReactNode} from "react";
import {Alert, Button, Container, Nav, Navbar} from "react-bootstrap";
import {api} from "~/utils/api";
import {useAppStore} from "~/utils/useAppStore";
import {Loading} from "../Loading";
import NavBar from "./NavBar";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), {ssr: false});

const AppShell = ({children}: {children: ReactNode}) => {
  const {status} = useSession();
  const configId = useAppStore(s => s.configId);
  const utils = api.useContext();

  useEffect(() => {
    if (status === "authenticated" && !configId) {
      void (async () => {
        const config = await utils.yt.getConfig.fetch();

        useAppStore.setState({configId: config?.id});
      })();
    }
  }, [status, configId]);

  if (status === "loading" || !configId) return <Loading />;

  if (status !== "authenticated") return <LoginPage />;

  return (
    <>
      <NavBar />

      <Container fluid className="mt-4">
        {children}
      </Container>
    </>
  );
};

const LoginPage = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} href="/">
            <Image src="/logo.svg" alt="Adaptive Games Logo" width={42} height={42} />
          </Navbar.Brand>

          <Nav>
            <ThemeToggle />
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1 className="text-center my-5">Welcome to Adaptive Games YT</h1>
        <h2 className="text-center mb-5">Login is required.</h2>
        <Alert variant="primary" className="d-grid w-75 mx-auto">
          <Button onClick={() => void signIn("azure-ad-b2c")} size="lg">
            Login
          </Button>
        </Alert>
      </Container>
    </>
  );
};

export default AppShell;
