import {useTheme} from "next-themes";
import {MoonFill, SunFill} from "react-bootstrap-icons";
import {Button} from "react-bootstrap";

const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  return (
    <Button
      variant={theme === "dark" ? "outline-warning" : "outline-secondary"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="ms-4"
    >
      {theme === "dark" ? <SunFill /> : <MoonFill />}
    </Button>
  );
};

export default ThemeToggle;
