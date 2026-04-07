import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt, FaUsers, FaBox, FaShoppingBag, FaChartBar, FaTrash } from "react-icons/fa";
import Darkmode from "../components/Darkmode";

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

const TABS = [
  { key: "stats",    icon: <FaChartBar />,    label: "Статистика" },
  { key: "orders",   icon: <FaShoppingBag />, label: "Заказы" },
  { key: "products", icon: <FaBox />,         label: "Товары" },
  { key: "users",    icon: <FaUsers />,       label: "Пользователи" },
];

export default function AdminLayout() {
  const { user, logout, getAllUsers, deleteUser } = useAuth();
  const { products, deleteProduct, orders } = useShop();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("stats");

  const changeLang = (lang) => i18n.changeLanguage(lang);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user]);

  if (!user || user.role !== "admin") return null;

  const allUsers = getAllUsers();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">

      {/* SIDEBAR */}
      <aside className="w-60 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col fixed h-full z-10 p-5">
        <NavLink to="/" className="flex items-center gap-2 no-underline mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="text-gray-900 dark:text-white font-extrabold text-lg">Admin<span className="text-red-500">.</span></span>
        </NavLink>

        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider px-2 mb-2">Панель</p>

        <div className="flex flex-col gap-1 flex-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer border-none text-left
                ${tab === t.key ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-transparent"}`}>
              <span className="text-sm">{t.icon}</span> {t.label}
              {t.key === "orders" && orders.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{orders.length}</span>
              )}
            </button>
          ))}
          <NavLink to="/" className="px-3 py-2.5 rounded-xl text-sm font-medium no-underline text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors mt-1">
            🏠 На главную
          </NavLink>
        </div>

        {/* Lang + Dark */}
        <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
            {["ru","en","uz"].map(l => (
              <button key={l} onClick={() => changeLang(l)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer border-none transition-all
                  ${i18n.language === l ? "bg-violet-500 text-white" : "text-gray-500 bg-transparent"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-2.5 flex-1 mr-2">
              <p className="font-semibold text-gray-900 dark:text-white text-xs truncate">{user.name}</p>
              <span className="text-xs font-bold text-red-500">● Администратор</span>
            </div>
            <Darkmode />
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer bg-transparent border-none flex items-center gap-2 transition-colors">
            <FaSignOutAlt size={13} /> Выйти
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-60 p-8">

        {/* ── СТАТИСТИКА ── */}
        {tab === "stats" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">📊 Статистика</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Пользователей", value: allUsers.length, icon: "👥", color: "blue" },
                { label: "Товаров", value: products.length, icon: "📦", color: "violet" },
                { label: "Заказов", value: orders.length, icon: "🛒", color: "green" },
                { label: "Выручка", value: fmt(totalRevenue), icon: "💰", color: "yellow" },
              ].map(s => (
                <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Последние заказы</h2>
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-12 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400">Заказов пока нет</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.slice(0,5).map(order => (
                  <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 flex-shrink-0">🛒</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{order.userName}</p>
                      <p className="text-xs text-gray-400">{order.items.length} товаров · {new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
                    </div>
                    <span className="font-black text-violet-600 dark:text-violet-400 whitespace-nowrap">{fmt(order.total)}</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-lg font-semibold">Новый</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ЗАКАЗЫ ── */}
        {tab === "orders" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">🛒 Все заказы ({orders.length})</h1>
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-16 text-center">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">Заказов нет</p>
                <p className="text-gray-400 text-sm">Когда покупатели оформят заказы — они появятся здесь</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{order.userName}</p>
                        <p className="text-xs text-gray-400">{order.userEmail} · {new Date(order.createdAt).toLocaleString("ru-RU")}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-violet-600 dark:text-violet-400">{fmt(order.total)}</p>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-lg font-semibold">Новый</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
                          {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" onError={e => e.target.style.display='none'} />}
                          <div>
                            <p className="text-xs font-semibold text-gray-900 dark:text-white max-w-[120px] truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.qty} шт · {fmt(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ТОВАРЫ ── */}
        {tab === "products" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">📦 Все товары ({products.length})</h1>
            <div className="flex flex-col gap-3">
              {products.map(p => (
                <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                    <img src={p.image} alt={p.name?.ru} className="w-full h-full object-cover" onError={e => e.target.src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{p.name?.ru}</p>
                    <p className="text-xs text-violet-500 font-medium">{p.category?.ru}</p>
                  </div>
                  <p className="font-black text-gray-900 dark:text-white whitespace-nowrap text-sm">{fmt(p.price)}</p>
                  <button onClick={() => { if(window.confirm("Удалить товар?")) deleteProduct(p.id); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-semibold cursor-pointer bg-transparent transition-all">
                    <FaTrash size={11} /> Удалить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ПОЛЬЗОВАТЕЛИ ── */}
        {tab === "users" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">👥 Пользователи ({allUsers.length})</h1>
            <div className="flex flex-col gap-3">
              {allUsers.map(u => {
                const isDefault = u.id === "admin-001" || u.id === "seller-001";
                return (
                  <div key={u.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                      ${u.role === "admin" ? "bg-red-100 dark:bg-red-900/30" : u.role === "seller" ? "bg-green-100 dark:bg-green-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
                      {u.role === "admin" ? "🔧" : u.role === "seller" ? "🏪" : "👤"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{u.name}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md
                          ${u.role === "admin" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : u.role === "seller" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}>
                          {u.role === "admin" ? "Admin" : u.role === "seller" ? "Seller" : "User"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{u.email}</p>
                      <p className="text-xs text-gray-400">{u.phone} · {new Date(u.createdAt).toLocaleDateString("ru-RU")}</p>
                    </div>
                    {!isDefault && (
                      <button onClick={() => { if(window.confirm(`Удалить аккаунт ${u.name}?`)) deleteUser(u.id); }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-semibold cursor-pointer bg-transparent transition-all flex-shrink-0">
                        <FaTrash size={11} /> Удалить
                      </button>
                    )}
                    {isDefault && (
                      <span className="text-xs text-gray-300 dark:text-zinc-600 px-3">Системный</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
