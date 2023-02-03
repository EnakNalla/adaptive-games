import {
  Alert,
  Button,
  Container,
  Dropdown,
  Nav,
  Navbar,
  NavDropdown,
  NavLink
} from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import {signIn, signOut, useSession} from "next-auth/react";
import {PersonFill} from "react-bootstrap-icons";
import {ReactNode} from "react";
import dynamic from "next/dynamic";
import {NextRouter, useRouter} from "next/router";
import styles from "./AppShell.module.css";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), {ssr: false});

const navLinks: {href: string; label: string}[] = [];
const Index = ({children}: {children: ReactNode}) => {
  const {status} = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (status !== "authenticated") return <LoginPage />;

  return (
    <>
      <NavMobile router={router} />
      <NavDesktop router={router} />

      <Container className="mt-4">{children}</Container>
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

interface NavProps {
  router: NextRouter;
}

const NavMobile = ({router}: NavProps) => (
  <Navbar expand="lg" collapseOnSelect className={`${styles.navMobile as string} bg-body-tertiary`}>
    <Container fluid>
      <div>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Brand as={Link} href="/" className="ms-3">
          <Image src="/logo.svg" alt="Adaptive Games Logo" width={42} height={42} />
        </Navbar.Brand>
      </div>

      <Nav className="flex-row">
        <Dropdown className="me-4">
          <Dropdown.Toggle as={NavLink}>
            <PersonFill size={24} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="position-absolute" align="end">
            <Dropdown.Item as={Button} variant="link" onClick={() => void signOut()}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <ThemeToggle />
      </Nav>

      <Navbar.Collapse id="navbar-nav">
        <Nav activeKey={router.pathname}>
          {navLinks.map(({href, label}) => (
            <Nav.Link as={Link} href={href} key={href}>
              {label}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

const NavDesktop = ({router}: NavProps) => (
  <Navbar className={`${styles.navDesktop as string} bg-body-tertiary`}>
    <Container>
      <Navbar.Brand as={Link} href="/">
        <Image src="/logo.svg" alt="Adaptive Games Logo" width={42} height={42} />
      </Navbar.Brand>

      <Nav activeKey={router.pathname} className="ms-4">
        {navLinks.map(({href, label}) => (
          <Nav.Link as={Link} href={href} key={href}>
            {label}
          </Nav.Link>
        ))}
      </Nav>

      <Nav>
        <NavDropdown title={<PersonFill size={24} />} align="end" className="me-4">
          <NavDropdown.Item as={Button} variant="link" onClick={() => void signOut()}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
        <Nav.Item className="mx-auto">
          <ThemeToggle />
        </Nav.Item>
      </Nav>
    </Container>
  </Navbar>
);

export default Index;
