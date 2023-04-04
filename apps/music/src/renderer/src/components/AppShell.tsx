import {useEffect, useState, type ReactNode} from "react";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import logo from "../assets/logo.svg";

const AppShell = ({children}: {children: ReactNode}) => {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <img src={logo} alt="logo" width="32" height="32" />
          </Navbar.Brand>

          <Nav className="ms-auto">
            <ThemeToggle />
          </Nav>
        </Container>
      </Navbar>
      <Container fluid>{children}</Container>
    </>
  );
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-bs-theme", savedTheme);
    } else {
      const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

      setTheme(darkMode ? "dark" : "light");
      localStorage.setItem(darkMode ? "dark" : "light", "theme");
      document.documentElement.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    localStorage.setItem(theme === "light" ? "dark" : "light", "theme");
    document.documentElement.setAttribute("data-bs-theme", theme === "light" ? "dark" : "light");
  };

  return (
    <Button onClick={toggleTheme} variant="outline-secondary">
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
};

export default AppShell;
