import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";

function Darkmode() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:scale-110 transition-all duration-200 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <FaMoon size={15} /> : <IoMdSunny size={17} />}
    </button>
  );
}

export default Darkmode;
