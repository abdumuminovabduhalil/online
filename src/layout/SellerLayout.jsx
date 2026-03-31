import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBox, FaShoppingCart, FaChartLine, FaSignOutAlt, FaPlus, FaTrash } from "react-icons/fa";

const INITIAL_PRODUCTS = [
  { id: 1, name: "Кроссовки Nike Air Max", price: 1490000, category: "Обувь", emoji: "👟", stock: 12, orders: 34 },
  { id: 2, name: "Кожаная сумка", price: 890000, category: "Аксессуары", emoji: "👜", stock: 5, orders: 18 },
];

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", emoji: "📦" });

  useEffect(() => {
    if (!user || user.role !== "seller") navigate("/login");
  }, [user]);

  if (!user || user.role !== "seller") return null;

  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setProducts((prev) => [...prev, {
      id: Date.now(), name: newProduct.name, price: Number(newProduct.price),
      category: newProduct.category || "Другое", emoji: newProduct.emoji, stock: 0, orders: 0,
    }]);
    setNewProduct({ name: "", price: "", category: "", emoji: "📦" });
    setShowAdd(false);
  };

  const totalRevenue = products.reduce((s, p) => s + p.price * p.orders, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <span className="text-white font-black text-sm">П</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">Кабинет продавца</p>
            <p className="text-xs text-gray-400">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Мои товары</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <FaBox />, label: "Товаров", value: products.length, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
            { icon: <FaShoppingCart />, label: "Заказов", value: products.reduce((s, p) => s + p.orders, 0), color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
            { icon: <FaChartLine />, label: "Выручка", value: fmt(totalRevenue), color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
          ].map(({ icon, label, value, color, bg }) => (
            <div key={label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>{icon}</div>
              <p className="text-xl font-black text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white">Товары</h2>
            <button onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold cursor-pointer border-none transition-all">
              <FaPlus size={11} /> Добавить
            </button>
          </div>

          {showAdd && (
            <form onSubmit={addProduct} className="border-b border-gray-100 dark:border-zinc-800 p-6 bg-violet-50 dark:bg-violet-900/10 flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Эмодзи</label>
                <input value={newProduct.emoji} onChange={(e) => setNewProduct({ ...newProduct, emoji: e.target.value })}
                  className="w-14 px-2 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center text-lg outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Название *</label>
                <input required placeholder="Название товара" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="w-36">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Цена (сум) *</label>
                <input required type="number" placeholder="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Категория</label>
                <input placeholder="Обувь" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <button type="submit" className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold cursor-pointer border-none">Сохранить</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 text-sm font-semibold cursor-pointer border-none">Отмена</button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  {["Товар", "Категория", "Цена", "На складе", "Заказов", ""].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 dark:text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.emoji}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500 dark:text-zinc-400">{p.category}</td>
                    <td className="px-6 py-3 font-semibold text-violet-600 dark:text-violet-400">{fmt(p.price)}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock > 0 ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-500"}`}>
                        {p.stock > 0 ? `${p.stock} шт` : "Нет"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{p.orders}</td>
                    <td className="px-6 py-3">
                      <button onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all cursor-pointer bg-transparent border-none">
                        <FaTrash size={12} />
                      </button>
                    </td>
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
