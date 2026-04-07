import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaRegHeart, FaShoppingCart, FaBars, FaTimes, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Darkmode from "../components/Darkmode";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

function MainLayout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { cartCount, likes } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLang = (lang) => i18n.changeLanguage(lang);
  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate("/"); };

  const navLinkClass = ({ isActive }) =>
    `relative font-medium text-sm transition-colors duration-200 pb-0.5 no-underline
     ${isActive ? "text-violet-600 dark:text-violet-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-violet-500 after:rounded-full"
      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-zinc-800" : "bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-base leading-none">М</span>
            </div>
            <span className="text-gray-900 dark:text-white font-extrabold text-xl tracking-tight">
              Маркет<span className="text-violet-500">.</span>
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/about" className={navLinkClass}>{t("nav.about")}</NavLink>
            <NavLink to="/contact" className={navLinkClass}>{t("nav.contact")}</NavLink>
          </nav>

          <div className="flex items-center gap-2">
            {/* Lang */}
            <div className="hidden sm:flex items-center gap-1 border border-gray-200 dark:border-zinc-700 rounded-xl p-1 bg-gray-100 dark:bg-zinc-800">
              {["ru", "en", "uz"].map((lang) => (
                <button key={lang} onClick={() => changeLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border-none
                    ${i18n.language === lang ? "bg-violet-500 text-white shadow-sm" : "text-gray-500 dark:text-gray-400 bg-transparent"}`}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Likes with badge */}
            <NavLink to="/likes"
              className={({ isActive }) =>
                `relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 no-underline
                ${isActive ? "bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-500"
                  : "border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-rose-500"}`}>
              <FaRegHeart size={15} />
              {likes.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {likes.length > 9 ? "9+" : likes.length}
                </span>
              )}
            </NavLink>

            {/* Cart with badge */}
            <NavLink to="/buys"
              className={({ isActive }) =>
                `relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 no-underline
                ${isActive ? "bg-violet-50 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-500"
                  : "border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-violet-500"}`}>
              <FaShoppingCart size={14} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </NavLink>

            <Darkmode />

            {/* User / Login */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all cursor-pointer border-solid">
                  <FaUserCircle size={16} className="text-violet-500" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 max-w-[80px] truncate">{user.name}</span>
                  {user.role !== "user" && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md
                      ${user.role === "admin" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"}`}>
                      {user.role === "admin" ? "ADM" : "SEL"}
                    </span>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <button onClick={() => { navigate("/admin"); setUserMenuOpen(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer bg-transparent border-none">
                        🔧 {t("nav.admin")}
                      </button>
                    )}
                    {user.role === "seller" && (
                      <button onClick={() => { navigate("/seller"); setUserMenuOpen(false); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer bg-transparent border-none">
                        🏪 {t("nav.seller")}
                      </button>
                    )}
                    <button onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer bg-transparent border-none flex items-center gap-2">
                      <FaSignOutAlt size={12} /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login"
                className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all hover:scale-105 shadow-sm no-underline">
                {t("nav.login")}
              </NavLink>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 cursor-pointer bg-transparent">
              {menuOpen ? <FaTimes size={15} /> : <FaBars size={15} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 px-4 py-4 flex flex-col gap-2">
            {[{ to: "/about", key: "nav.about" }, { to: "/contact", key: "nav.contact" }].map(({ to, key }) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `text-sm font-medium py-2 px-3 rounded-lg no-underline transition-colors
                  ${isActive ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
                {t(key)}
              </NavLink>
            ))}
            {!user ? (
              <>
                <NavLink to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium py-2 px-3 rounded-lg no-underline text-gray-700 dark:text-gray-300">{t("nav.login")}</NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold py-2 px-3 rounded-lg no-underline bg-violet-600 text-white text-center">{t("nav.register")}</NavLink>
              </>
            ) : (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="text-sm font-medium py-2 px-3 rounded-lg text-rose-500 text-left cursor-pointer bg-transparent border-none">
                {t("nav.logout")} ({user.name})
              </button>
            )}
            <div className="flex gap-1 pt-2 border-t border-gray-100 dark:border-zinc-800">
              {["ru", "en", "uz"].map((lang) => (
                <button key={lang} onClick={() => { changeLang(lang); setMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border-none
                    ${i18n.language === lang ? "bg-violet-500 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-500"}`}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}

      <main className="pt-16"><Outlet /></main>

      <footer className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-black text-sm">М</span>
              </div>
              <span className="text-gray-900 dark:text-white font-extrabold text-lg tracking-tight">Маркет<span className="text-violet-500">.</span></span>
            </div>
            <p className="text-gray-400 dark:text-zinc-500 text-sm leading-relaxed">{t("footer.description")}</p>
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">{t("footer.navigation")}</p>
            {[["nav.about", "/about"], ["nav.contact", "/contact"], ["nav.likes", "/likes"], ["nav.cart", "/buys"]].map(([key, path]) => (
              <div key={path} className="mb-2">
                <NavLink to={path} className="text-gray-400 dark:text-zinc-500 hover:text-violet-500 text-sm no-underline transition-colors">{t(key)}</NavLink>
              </div>
            ))}
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-semibold text-sm mb-3">{t("footer.account")}</p>
            {!user
              ? [["nav.login", "/login"], ["nav.register", "/register"]].map(([key, path]) => (
                  <div key={path} className="mb-2">
                    <NavLink to={path} className="text-gray-400 dark:text-zinc-500 hover:text-violet-500 text-sm no-underline transition-colors">{t(key)}</NavLink>
                  </div>
                ))
              : <p className="text-sm text-gray-400">{t("auth.loggedAs")} <span className="text-violet-500 font-medium">{user.name}</span></p>
            }
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-zinc-800 py-4 text-center text-xs text-gray-400 dark:text-zinc-600">
          {t("footer.rights")}
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
