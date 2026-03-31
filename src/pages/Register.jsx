import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Пароли не совпадают"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = register(form.name, form.email, form.password);
    if (res.success) navigate("/");
    else setError(res.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <NavLink to="/" className="flex items-center gap-2 no-underline">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-black text-xl">М</span>
              </div>
              <span className="text-gray-900 dark:text-white font-extrabold text-2xl tracking-tight">Маркет<span className="text-violet-500">.</span></span>
            </NavLink>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">Создать аккаунт</h1>
          <p className="text-sm text-center text-gray-400 mb-8">Присоединяйтесь к нам</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[{ key: "name", label: "Имя", type: "text", ph: "Ваше имя" }, { key: "email", label: "Email", type: "email", ph: "example@mail.com" }].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input type={type} required placeholder={ph} value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Пароль</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer bg-transparent border-none">
                  {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Подтвердите пароль</label>
              <input type="password" required placeholder="••••••••" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            </div>
            {error && <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold text-sm cursor-pointer border-none mt-2">
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Уже есть аккаунт?{" "}
            <NavLink to="/login" className="text-violet-600 font-semibold hover:underline no-underline">Войти</NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
