import {useTheme} from "next-themes";
import {MoonFill, SunFill} from "react-bootstrap-icons";
import {Button, Nav} from "react-bootstrap";

const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  return (
    <Nav.Link
      as={Button}
      variant={theme === "dark" ? "outline-warning" : "outline-secondary"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="py-2 px-3"
    >
      {theme === "dark" ? <SunFill /> : <MoonFill />}
    </Nav.Link>
  );
};

export default ThemeToggle;
