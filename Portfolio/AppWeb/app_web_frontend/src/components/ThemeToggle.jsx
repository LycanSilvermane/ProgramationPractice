import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id="themeSwitch"
        checked={theme === "dark"}
        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <label
        className="form-check-label"
        htmlFor="themeSwitch"
        style={{
          transition: "transform 0.3s ease",
          transform: theme === "light" ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </label>
    </div>
  );
}
