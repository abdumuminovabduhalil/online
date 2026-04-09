import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt, FaUsers, FaBox, FaShoppingBag, FaChartBar, FaTrash, FaEdit } from "react-icons/fa";
import Darkmode from "../components/Darkmode";

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

// Статусы заказов — цепочка
const ORDER_STATUSES = [
  { key: "new",       label: "Новый",      emoji: "🆕", color: "blue"   },
  { key: "accepted",  label: "Принят",     emoji: "✅", color: "violet" },
  { key: "cooking",   label: "Готовится",  emoji: "📦", color: "yellow" },
  { key: "delivery",  label: "В пути",     emoji: "🚚", color: "orange" },
  { key: "delivered", label: "Доставлен",  emoji: "🎉", color: "green"  },
  { key: "cancelled", label: "Отменён",    emoji: "❌", color: "red"    },
];

const statusColor = {
  blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  violet: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  green:  "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  red:    "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const ROLE_INFO = {
  admin:  { label: "Admin",   color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",     icon: "🔧" },
  seller: { label: "Seller",  color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", icon: "🏪" },
  user:   { label: "User",    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",  icon: "👤" },
};

const TABS = [
  { key: "stats",    icon: <FaChartBar />,    label: "Статистика" },
  { key: "orders",   icon: <FaShoppingBag />, label: "Заказы"     },
  { key: "products", icon: <FaBox />,         label: "Товары"     },
  { key: "users",    icon: <FaUsers />,       label: "Пользователи" },
];

export default function AdminLayout() {
  const { user, logout, getAllUsers, deleteUser, changeRole, tick } = useAuth();
  const { products, deleteProduct, orders, updateOrderStatus } = useShop();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const changeLang = (lang) => i18n.changeLanguage(lang);

  const [tab, setTab] = useState("stats");
  const [roleMenuId, setRoleMenuId] = useState(null); // для дропдауна смены роли
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user]);

  if (!user || user.role !== "admin") return null;

  // Пересчитываем при tick (когда меняются пользователи)
  const allUsers = getAllUsers();
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleDeleteUser = (u) => {
    if (!window.confirm(`Удалить аккаунт "${u.name}"?`)) return;
    deleteUser(u.id);
    showToast("🗑️ Аккаунт удалён");
  };

  const handleChangeRole = (u, role) => {
    changeRole(u.id, role);
    setRoleMenuId(null);
    showToast(`✅ Роль "${u.name}" изменена на ${role}`);
  };

  const handleDeleteProduct = (p) => {
    if (!window.confirm(`Удалить товар "${p.name?.ru}"?`)) return;
    deleteProduct(p.id);
    showToast("🗑️ Товар удалён");
  };

  // Следующий статус по цепочке
  const getNextStatuses = (current) => {
    if (current === "cancelled") return [];
    if (current === "delivered") return [];
    const idx = ORDER_STATUSES.findIndex(s => s.key === current);
    const next = ORDER_STATUSES.slice(idx + 1).filter(s => s.key !== "cancelled");
    return [...next.slice(0, 1), ORDER_STATUSES.find(s => s.key === "cancelled")];
  };

  const getStatusInfo = (key) => ORDER_STATUSES.find(s => s.key === key) || ORDER_STATUSES[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex" onClick={() => setRoleMenuId(null)}>

      {/* ── SIDEBAR ── */}
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
              className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 cursor-pointer border-none text-left transition-colors
                ${tab === t.key
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-transparent"}`}>
              <span>{t.icon}</span> {t.label}
              {t.key === "orders" && orders.filter(o => o.status === "new").length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {orders.filter(o => o.status === "new").length}
                </span>
              )}
              {t.key === "users" && (
                <span className="ml-auto text-xs text-gray-400">{allUsers.length}</span>
              )}
            </button>
          ))}
          <NavLink to="/" className="px-3 py-2.5 rounded-xl text-sm font-medium no-underline text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 mt-1">
            🏠 На главную
          </NavLink>
        </div>

        {/* Lang + Dark + User */}
        <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
            {["ru","en","uz"].map(l => (
              <button key={l} onClick={() => changeLang(l)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer border-none transition-all
                  ${i18n.language === l ? "bg-violet-500 text-white" : "text-gray-500 dark:text-gray-400 bg-transparent"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl p-2.5 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-xs truncate">{user.name}</p>
              <span className="text-xs font-bold text-red-500">● Администратор</span>
            </div>
            <Darkmode />
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer bg-transparent border-none flex items-center gap-2 transition-colors">
            <FaSignOutAlt size={13} /> Выйти
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 ml-60 p-8 min-h-screen">

        {/* ════ СТАТИСТИКА ════ */}
        {tab === "stats" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">📊 Статистика</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Пользователей", value: allUsers.length, icon: "👥" },
                { label: "Товаров",       value: products.length, icon: "📦" },
                { label: "Заказов",       value: orders.length,   icon: "🛒" },
                { label: "Выручка",       value: fmt(totalRevenue), icon: "💰" },
              ].map(s => (
                <div key={s.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Статусы заказов */}
            {orders.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">По статусам</h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
                  {ORDER_STATUSES.map(s => {
                    const count = orders.filter(o => o.status === s.key).length;
                    return (
                      <div key={s.key} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 text-center">
                        <p className="text-2xl mb-1">{s.emoji}</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">{count}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Последние заказы</h2>
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400">Заказов пока нет</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.slice(0, 5).map(order => {
                  const si = getStatusInfo(order.status);
                  return (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                      <div className="text-2xl">{si.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{order.userName}</p>
                        <p className="text-xs text-gray-400">{order.items?.length} товаров · {new Date(order.createdAt).toLocaleDateString("ru-RU")}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${statusColor[si.color]}`}>{si.label}</span>
                      <span className="font-black text-violet-600 dark:text-violet-400 text-sm whitespace-nowrap">{fmt(order.total)}</span>
                    </div>
                  );
                })}
                {orders.length > 5 && (
                  <button onClick={() => setTab("orders")} className="text-sm text-violet-600 dark:text-violet-400 text-center py-2 cursor-pointer bg-transparent border-none hover:underline">
                    Показать все {orders.length} заказов →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ ЗАКАЗЫ ════ */}
        {tab === "orders" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              🛒 Все заказы <span className="text-gray-400 font-normal text-lg">({orders.length})</span>
            </h1>
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-20 text-center">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">Заказов нет</p>
                <p className="text-gray-400 text-sm">Когда покупатели оформят заказы — они появятся здесь</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {orders.map(order => {
                  const si = getStatusInfo(order.status);
                  const nextStatuses = getNextStatuses(order.status);
                  return (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                      {/* Order header */}
                      <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-50 dark:border-zinc-800">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{si.emoji}</span>
                            <p className="font-bold text-gray-900 dark:text-white">{order.userName}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${statusColor[si.color]}`}>
                              {si.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{order.userEmail}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleString("ru-RU")} · {order.items?.length} товаров
                          </p>
                          <p className="text-xs text-gray-300 dark:text-zinc-600 font-mono mt-0.5">{order.id}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-black text-violet-600 dark:text-violet-400">{fmt(order.total)}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-gray-50 dark:border-zinc-800">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover"
                                onError={e => e.target.style.display="none"} />
                            )}
                            <div>
                              <p className="text-xs font-semibold text-gray-900 dark:text-white max-w-[120px] truncate">{item.name}</p>
                              <p className="text-xs text-gray-400">{item.qty} шт · {fmt(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons — статусы */}
                      <div className="px-5 py-4">
                        <p className="text-xs text-gray-400 mb-3 font-medium">Изменить статус:</p>
                        <div className="flex flex-wrap gap-2">
                          {/* Прогресс статусов */}
                          {ORDER_STATUSES.filter(s => s.key !== "cancelled").map((s, idx) => {
                            const currentIdx = ORDER_STATUSES.findIndex(x => x.key === order.status);
                            const isActive = s.key === order.status;
                            const isDone = idx < currentIdx;
                            const isNext = idx === currentIdx + 1;
                            const isCancelled = order.status === "cancelled" || order.status === "delivered";

                            if (isCancelled && !isActive && !isDone) return null;

                            return (
                              <button
                                key={s.key}
                                onClick={() => !isActive && !isDone && !isCancelled && updateOrderStatus(order.id, s.key)}
                                disabled={isActive || isDone || isCancelled}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                                  ${isActive
                                    ? `${statusColor[s.color]} ring-2 ring-offset-1 ring-current cursor-default`
                                    : isDone
                                      ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-default"
                                      : isNext && !isCancelled
                                        ? `border-2 border-dashed ${statusColor[s.color]} cursor-pointer hover:ring-2`
                                        : "bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 cursor-default"
                                  }`}
                              >
                                <span>{s.emoji}</span> {s.label}
                                {isActive && <span className="ml-1">●</span>}
                              </button>
                            );
                          })}

                          {/* Кнопка отмены */}
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <button
                              onClick={() => { if(window.confirm("Отменить заказ?")) updateOrderStatus(order.id, "cancelled"); }}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-dashed border-red-300 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer bg-transparent transition-all ml-auto">
                              ❌ Отменить
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════ ТОВАРЫ ════ */}
        {tab === "products" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              📦 Все товары <span className="text-gray-400 font-normal text-lg">({products.length})</span>
            </h1>
            <div className="flex flex-col gap-3">
              {products.map(p => (
                <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                    <img src={p.image} alt={p.name?.ru} className="w-full h-full object-cover"
                      onError={e => e.target.src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{p.name?.ru}</p>
                    <p className="text-xs text-violet-500 font-medium mt-0.5">{p.category?.ru}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-gray-900 dark:text-white">{fmt(p.price)}</span>
                      {p.oldPrice && <span className="text-xs text-gray-400 line-through">{fmt(p.oldPrice)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 hidden sm:flex">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.rating}</span>
                    <span className="text-xs text-gray-400 ml-1">({p.reviews})</span>
                  </div>
                  <button onClick={() => handleDeleteProduct(p)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-semibold cursor-pointer bg-transparent transition-all flex-shrink-0">
                    <FaTrash size={11} /> Удалить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ ПОЛЬЗОВАТЕЛИ ════ */}
        {tab === "users" && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              👥 Пользователи <span className="text-gray-400 font-normal text-lg">({allUsers.length})</span>
            </h1>
            <div className="flex flex-col gap-3">
              {allUsers.map(u => {
                const ri = ROLE_INFO[u.role] || ROLE_INFO.user;
                const isMe = u.id === user.id;
                return (
                  <div key={u.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                      ${u.role === "admin" ? "bg-red-100 dark:bg-red-900/30"
                        : u.role === "seller" ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"}`}>
                      {ri.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{u.name}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${ri.color}`}>{ri.label}</span>
                        {u.isSystem && <span className="text-xs text-gray-300 dark:text-zinc-600 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">Системный</span>}
                        {isMe && <span className="text-xs text-violet-500 font-bold">← Вы</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{u.email}</p>
                      <p className="text-xs text-gray-400">{u.phone} · {new Date(u.createdAt).toLocaleDateString("ru-RU")}</p>
                    </div>

                    {/* Actions */}
                    {!u.isSystem && (
                      <div className="flex gap-2 flex-shrink-0 relative">
                        {/* Change role dropdown */}
                        <div className="relative" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setRoleMenuId(roleMenuId === u.id ? null : u.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-xs font-semibold cursor-pointer bg-transparent transition-all">
                            <FaEdit size={11} /> Роль
                          </button>

                          {roleMenuId === u.id && (
                            <div className="absolute right-0 top-10 w-40 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50">
                              <p className="text-xs text-gray-400 px-3 py-1 font-semibold">Выбрать роль:</p>
                              {Object.entries(ROLE_INFO).map(([role, info]) => (
                                <button key={role}
                                  onClick={() => handleChangeRole(u, role)}
                                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 cursor-pointer border-none transition-colors
                                    ${u.role === role
                                      ? "bg-gray-50 dark:bg-zinc-800 font-bold text-gray-900 dark:text-white"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 bg-transparent"}`}>
                                  {info.icon} {info.label}
                                  {u.role === role && <span className="ml-auto text-xs text-green-500">✓</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Delete */}
                        <button onClick={() => handleDeleteUser(u)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-semibold cursor-pointer bg-transparent transition-all">
                          <FaTrash size={11} /> Удалить
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
