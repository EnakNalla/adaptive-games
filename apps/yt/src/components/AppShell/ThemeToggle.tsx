import {useTheme} from "next-themes";
import {MoonFill, SunFill} from "react-bootstrap-icons";
import {Form} from "react-bootstrap";

const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Form.Label htmlFor="theme-toggle" style={{cursor: "pointer"}}>
      <span className="visually-hidden-focusable">Switch Theme</span>
      <div className="d-flex align-items-center">
        <MoonFill className="me-2 fs-4" />
        <Form.Check
          type="switch"
          id="theme-toggle"
          checked={theme === "light"}
          className="fs-4"
          onChange={toggleTheme}
        />
        <SunFill className="fs-4" />
      </div>
    </Form.Label>
  );
};

export default ThemeToggle;
