import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import {signIn, signOut, useSession} from "next-auth/react";
import {PersonFill} from "react-bootstrap-icons";
import {ReactNode} from "react";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), {ssr: false});

const AppShell = ({children}: {children: ReactNode}) => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} href="/">
            <Image src="/logo.svg" alt="Adaptive Games Logo" width={42} height={42} />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav></Nav>
          </Navbar.Collapse>

          <Nav>
            <UserDropdown />
            <ThemeToggle />
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">{children}</Container>
    </>
  );
};

const UserDropdown = () => {
  const {status} = useSession();

  if (status !== "authenticated")
    return (
      <Button type="button" variant="outline-primary" onClick={() => void signIn("azure-ad-b2c")}>
        Login
      </Button>
    );

  return (
    <NavDropdown title={<PersonFill size={24} />} align="end">
      <NavDropdown.Item as={Button} variant="link" onClick={() => void signOut()}>
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default AppShell;
