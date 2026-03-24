import { NavLink, Outlet } from "react-router-dom";
import { FaRegHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import Darkmode from "../components/Darkmode";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import logo from "../assets/image.png"

function MainLayout() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLang = (lang) => i18n.changeLanguage(lang);

  const navLinkClass = ({ isActive }) =>
    `relative font-medium text-sm transition-colors duration-200 pb-0.5
     ${isActive
      ? "text-violet-600 dark:text-violet-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-violet-500 after:rounded-full"
      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-zinc-800"
            : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-base leading-none">
                <img src={logo} alt="" />
              </span>
            </div>
            <span className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight">
              Маркет<span className="text-violet-500">.</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/about" className={navLinkClass}>
              {t("about") || "О нас"}
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              {t("contactText") || "Контакты"}
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Lang switcher */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-zinc-700 rounded-xl p-1 bg-gray-100 dark:bg-zinc-800">
              {["ru", "en", "uz"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
                    ${i18n.language === lang
                      ? "bg-violet-500 text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-transparent border-none"}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Likes */}
            <NavLink
              to="/likes"
              className={({ isActive }) =>
                `w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 no-underline
                ${isActive
                  ? "bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-500"
                  : "border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-rose-500"}`}
            >
              <FaRegHeart size={15} />
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/buys"
              className={({ isActive }) =>
                `w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 no-underline
                ${isActive
                  ? "bg-violet-50 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-500"
                  : "border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-violet-500"}`}
            >
              <FaShoppingCart size={14} />
            </NavLink>

            <Darkmode />

            {/* Login */}
            <NavLink
              to="/login"
              className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-sm no-underline"
            >
              {t("login") || "Войти"}
            </NavLink>

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 cursor-pointer"
            >
              {menuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-4 py-4 flex flex-col gap-2">
            {[
              { to: "/about", label: t("about") || "О нас" },
              { to: "/contact", label: t("contactText") || "Контакты" },
              { to: "/login", label: t("login") || "Войти" },
              { to: "/register", label: t("register") || "Регистрация" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium py-2 px-3 rounded-lg no-underline transition-colors
                  ${isActive
                    ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
              >
                {label}
              </NavLink>
            ))}
            <div className="flex gap-1 pt-2 border-t border-gray-100 dark:border-zinc-800">
              {["ru", "en", "uz"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { changeLang(lang); setMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none
                    ${i18n.language === lang
                      ? "bg-violet-500 text-white"
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400"}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-black text-sm">
                  <img src={logo} alt="" />
                </span>
              </div>
              <span className="text-gray-900 dark:text-white font-extrabold text-lg tracking-tight">
                Маркет<span className="text-violet-500">.</span>
              </span>
            </div>
            <p className="text-gray-400 dark:text-zinc-500 text-sm leading-relaxed">
              Современный маркетплейс для покупки и продажи товаров онлайн.
            </p>
          </div>

          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Навигация</p>
            {[["О нас", "/about"], ["Контакты", "/contact"], ["Избранное", "/likes"], ["Корзина", "/buys"]].map(([label, path]) => (
              <div key={path} className="mb-2">
                <NavLink
                  to={path}
                  className="text-gray-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-violet-400 text-sm no-underline transition-colors"
                >
                  {label}
                </NavLink>
              </div>
            ))}
          </div>

          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">Аккаунт</p>
            {[["Войти", "/login"], ["Регистрация", "/register"]].map(([label, path]) => (
              <div key={path} className="mb-2">
                <NavLink
                  to={path}
                  className="text-gray-400 dark:text-zinc-500 hover:text-violet-500 dark:hover:text-violet-400 text-sm no-underline transition-colors"
                >
                  {label}
                </NavLink>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 py-4 text-center text-xs text-gray-400 dark:text-zinc-600">
          © 2025 Маркет. Все права защищены.
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
