import { NavLink, Outlet } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import Darkmode from "../components/Darkmode";
import { useTranslation } from "react-i18next";

function MainLayout() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <header className="bg-white dark:bg-black">
        <div>
          <div>
            <NavLink>Logo</NavLink>
          </div>
          <nav>
            <NavLink className="text-black dark:text-white" to="/about">
              About
            </NavLink>
            <NavLink className="text-black dark:text-white" to="/contact">
              {t("contactText")}
            </NavLink>
            <NavLink className="text-black dark:text-white" to="/likes">
              <FaRegHeart />
            </NavLink>
            <NavLink to="/buys">
              <FaShoppingCart
                className="text-black dark:text-white"
                to="/likes"
              ></FaShoppingCart>
            </NavLink>
            <NavLink className="text-black dark:text-white" to="/likes">
              Login
            </NavLink>

            <Darkmode />
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </>
  );
}

export default MainLayout;
