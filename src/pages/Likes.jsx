import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";

const LIKED_PRODUCTS = [
  { id: 2, name: "Наушники Sony WH-1000XM5", price: 3490000, category: "Электроника", emoji: "🎧" },
  { id: 4, name: "Смарт-часы Apple Watch", price: 4290000, category: "Электроника", emoji: "⌚" },
];
const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function Likes() {
  const { user } = useAuth();
  const [items, setItems] = useState(LIKED_PRODUCTS);
  const [cart, setCart] = useState({});
  const [showAuth, setShowAuth] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const navigate = useNavigate();

  const handleCart = (id) => {
    if (!user) { setPendingId(id); setShowAuth(true); return; }
    setCart(p => ({ ...p, [id]: true }));
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <section className="bg-gradient-to-br from-rose-500 to-pink-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center justify-center gap-3"><FaHeart /> Избранное</h1>
        <p className="text-white/70">{items.length} товаров в избранном</p>
      </section>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🤍</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Список пуст</p>
            <button onClick={() => navigate("/")} className="mt-4 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm cursor-pointer border-none">Перейти в каталог</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(product => (
              <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-700 h-40 flex items-center justify-center relative">
                  <span className="text-6xl">{product.emoji}</span>
                  <button onClick={() => setItems(p => p.filter(x => x.id !== product.id))}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:scale-110 transition-all cursor-pointer">
                    <FaTrash size={12} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-rose-500 font-semibold mb-1">{product.category}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{product.name}</p>
                  <p className="text-base font-black text-gray-900 dark:text-white mb-3">{fmt(product.price)}</p>
                  <button onClick={() => handleCart(product.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border-none
                      ${cart[product.id] ? "bg-green-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
                    <FaShoppingCart size={13} />
                    {cart[product.id] ? "Добавлено ✓" : "В корзину"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {showAuth && <AuthModal onClose={() => { setShowAuth(false); setPendingId(null); }} onSuccess={() => { if (pendingId) { setCart(p => ({ ...p, [pendingId]: true })); setPendingId(null); } }} />}
    </div>
  );
}
