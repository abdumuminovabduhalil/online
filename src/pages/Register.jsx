import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Darkmode from "../components/Darkmode";

export default function Register() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const changeLang = (lang) => i18n.changeLanguage(lang);
  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) { setError(t("auth.fillAll")); return; }
    if (form.password.length < 6) { setError(t("auth.passShort")); return; }
    if (form.password !== form.confirm) { setError(t("auth.passMismatch")); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = register(form.name, form.email, form.phone, form.password);
    if (res.success) navigate("/");
    else if (res.error === "email_taken") setError(t("auth.emailTaken"));
    else if (res.error === "phone_taken") setError(t("auth.phoneTaken"));
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Top controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-1">
          {["ru", "en", "uz"].map(l => (
            <button key={l} onClick={() => changeLang(l)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer border-none transition-all
                ${i18n.language === l ? "bg-white text-gray-900" : "text-white bg-transparent"}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <Darkmode />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/15 dark:bg-black/30 backdrop-blur-xl rounded-3xl border border-white/25 shadow-2xl p-8">

          <div className="flex justify-center mb-6">
            <NavLink to="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">М</span>
              </div>
              <span className="text-white font-extrabold text-2xl tracking-tight">
                Маркет<span className="text-violet-300">.</span>
              </span>
            </NavLink>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-1">{t("auth.regTitle")}</h1>
          <p className="text-sm text-center text-white/60 mb-6">{t("auth.regSub")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">{t("auth.name")}</label>
              <input type="text" required placeholder={t("auth.namePh")} value={form.name} onChange={set("name")}
                className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/15 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400 text-sm" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                <FaEnvelope className="inline mr-1.5" size={12}/>{t("auth.email")}
              </label>
              <input type="email" required placeholder="example@mail.com" value={form.email} onChange={set("email")}
                className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/15 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400 text-sm" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                <FaPhone className="inline mr-1.5" size={12}/>{t("auth.phone")}
              </label>
              <input type="tel" required placeholder="+998 90 123 45 67" value={form.phone} onChange={set("phone")}
                className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/15 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400 text-sm" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">{t("auth.pass")}</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required placeholder="Минимум 6 символов" value={form.password} onChange={set("password")}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-white/25 bg-white/15 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer bg-transparent border-none">
                  {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">{t("auth.confirm")}</label>
              <input type="password" required placeholder="••••••••" value={form.confirm} onChange={set("confirm")}
                className="w-full px-4 py-3 rounded-xl border border-white/25 bg-white/15 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-violet-400 text-sm" />
            </div>

            {error && (
              <div className="bg-rose-500/20 border border-rose-400/40 text-rose-200 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold text-sm cursor-pointer border-none transition-all mt-1 shadow-lg">
              {loading ? t("auth.loading") : t("auth.regBtn")}
            </button>
          </form>

          <p className="text-center text-sm text-white/60 mt-5">
            {t("auth.hasAcc")}{" "}
            <NavLink to="/login" className="text-violet-300 font-semibold hover:underline no-underline">
              {t("nav.login")}
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
