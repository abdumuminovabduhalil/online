import React, { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";

function Darkmode() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <a
      onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      }}
    >
      {theme === "light" ? <FaMoon /> : <IoMdSunny className="text-white" />}
    </a>
  );
}

export default Darkmode;
