import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTimes, FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function AuthModal({ onClose, onSuccess }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState("login");
  const [loginType, setLoginType] = useState("email");
  const [form, setForm] = useState({ name: "", email: "", phone: "", identifier: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    if (tab === "login") {
      const res = login(form.identifier, form.password);
      if (res.success) { onSuccess?.(res.user); onClose(); }
      else setError(t("auth.wrongCreds"));
    } else {
      if (form.password !== form.confirm) { setError(t("auth.passMismatch")); setLoading(false); return; }
      if (form.password.length < 6) { setError(t("auth.passShort")); setLoading(false); return; }
      const res = register(form.name, form.email, form.phone, form.password);
      if (res.success) { onSuccess?.(res.user); onClose(); }
      else if (res.error === "email_taken") setError(t("auth.emailTaken"));
      else if (res.error === "phone_taken") setError(t("auth.phoneTaken"));
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer bg-transparent border-none">
          <FaTimes size={14} />
        </button>
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🛒</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">
          {tab === "login" ? t("auth.modalTitle") : t("auth.registerTitle")}
        </h2>
        <p className="text-sm text-center text-gray-400 mb-5">
          {tab === "login" ? t("auth.modalSubtitle") : t("auth.modalRegSubtitle")}
        </p>

        {/* Main tabs */}
        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 mb-5 gap-1">
          {[["login", t("auth.loginBtn")], ["register", t("nav.register")]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all
                ${tab === key ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 bg-transparent"}`}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {tab === "login" ? (
            <>
              {/* Login type */}
              <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 gap-1 mb-1">
                <button type="button" onClick={() => { setLoginType("email"); setForm(p=>({...p,identifier:""})); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all
                    ${loginType==="email" ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 bg-transparent"}`}>
                  <FaEnvelope size={11}/> Email
                </button>
                <button type="button" onClick={() => { setLoginType("phone"); setForm(p=>({...p,identifier:""})); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border-none transition-all
                    ${loginType==="phone" ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 bg-transparent"}`}>
                  <FaPhone size={11}/> {t("auth.phone")}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {loginType === "email" ? t("auth.email") : t("auth.phone")}
                </label>
                <input type={loginType === "email" ? "email" : "tel"} required
                  placeholder={loginType === "email" ? "example@mail.com" : "+998 90 123 45 67"}
                  value={form.identifier} onChange={set("identifier")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.name")}</label>
                <input type="text" required placeholder={t("auth.namePh")} value={form.name} onChange={set("name")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"><FaEnvelope className="inline mr-1" size={11}/>{t("auth.email")}</label>
                <input type="email" required placeholder="example@mail.com" value={form.email} onChange={set("email")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"><FaPhone className="inline mr-1" size={11}/>{t("auth.phone")}</label>
                <input type="tel" required placeholder="+998 90 123 45 67" value={form.phone} onChange={set("phone")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.pass")}</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={form.password} onChange={set("password")}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer bg-transparent border-none">
                {showPass ? <FaEyeSlash size={15}/> : <FaEye size={15}/>}
              </button>
            </div>
          </div>

          {tab === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("auth.confirm")}</label>
              <input type="password" required placeholder="••••••••" value={form.confirm} onChange={set("confirm")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            </div>
          )}

          {error && <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold text-sm cursor-pointer border-none mt-1">
            {loading ? t("auth.loading") : tab === "login" ? t("auth.loginBtn") : t("auth.regBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}
