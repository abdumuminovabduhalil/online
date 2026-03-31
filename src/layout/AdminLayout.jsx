import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaUsers, FaBox, FaShoppingCart, FaChartLine, FaSignOutAlt } from "react-icons/fa";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user]);

  if (!user || user.role !== "admin") return null;

  const stats = [
    { icon: <FaUsers />, label: "Пользователи", value: "1 248", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: <FaBox />, label: "Товаров", value: "50 382", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { icon: <FaShoppingCart />, label: "Заказов", value: "3 841", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { icon: <FaChartLine />, label: "Выручка", value: "128M сум", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  const users = [
    { name: "Алишер К.", email: "alisher@mail.uz", role: "user", date: "12.01.2025" },
    { name: "Малика Ю.", email: "malika@mail.uz", role: "seller", date: "15.02.2025" },
    { name: "Бобур Р.", email: "bobur@mail.uz", role: "user", date: "20.03.2025" },
    { name: "Зарина А.", email: "zarina@mail.uz", role: "seller", date: "01.04.2025" },
    { name: "Санжар М.", email: "sanjarm@mail.uz", role: "user", date: "10.05.2025" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">Панель администратора</p>
            <p className="text-xs text-gray-400">Маркет.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{user.name}</span>
          <button onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all cursor-pointer border-none bg-transparent">
            <FaSignOutAlt size={13} /> Выйти
          </button>
          <button onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all cursor-pointer border-none">
            На сайт →
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Дашборд</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon, label, value, color, bg }) => (
            <div key={label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>{icon}</div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white">Пользователи</h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">{users.length} человек</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  {["Имя", "Email", "Роль", "Дата"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.email} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{u.name}</td>
                    <td className="px-6 py-3 text-gray-500 dark:text-zinc-400">{u.email}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
                        ${u.role === "seller" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-violet-100 dark:bg-violet-900/30 text-violet-600"}`}>
                        {u.role === "seller" ? "Продавец" : "Покупатель"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 dark:text-zinc-500">{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
