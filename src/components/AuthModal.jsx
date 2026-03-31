import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (tab === "login") {
      const res = login(form.email, form.password);
      if (res.success) { onSuccess?.(res.user); onClose(); }
      else setError(res.error);
    } else {
      if (form.password !== form.confirm) { setError("Пароли не совпадают"); setLoading(false); return; }
      const res = register(form.name, form.email, form.password);
      if (res.success) { onSuccess?.(res.user); onClose(); }
      else setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer bg-transparent border-none">
          <FaTimes size={14} />
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🛒</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">
          {tab === "login" ? "Войдите в аккаунт" : "Создайте аккаунт"}
        </h2>
        <p className="text-sm text-center text-gray-400 dark:text-zinc-500 mb-6">
          {tab === "login" ? "Чтобы добавить товар в корзину, нужно войти" : "Регистрация займёт меньше минуты"}
        </p>

        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 mb-6">
          {[["login", "Войти"], ["register", "Регистрация"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none
                ${tab === key ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 bg-transparent"}`}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Имя</label>
              <input type="text" required placeholder="Ваше имя" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input type="email" required placeholder="example@mail.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Пароль</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none">
                {showPass ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
              </button>
            </div>
          </div>
          {tab === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Подтвердите пароль</label>
              <input type="password" required placeholder="••••••••" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            </div>
          )}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold text-sm transition-all cursor-pointer border-none mt-1">
            {loading ? "Загрузка..." : tab === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        {tab === "login" && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-600 dark:text-blue-400">
            <p className="font-semibold mb-1">💡 Тестовые аккаунты:</p>
            <p>👤 user@market.uz / <b>user123</b></p>
            <p>🏪 seller@market.uz / <b>seller123</b></p>
            <p>🔧 admin@market.uz / <b>admin123</b></p>
          </div>
        )}
      </div>
    </div>
  );
}
