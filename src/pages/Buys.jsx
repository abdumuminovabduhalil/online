import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";

const INITIAL_CART = [
  { id: 1, name: "Кроссовки Nike Air Max", price: 1490000, emoji: "👟", qty: 1 },
  { id: 7, name: "Кофеварка Delonghi", price: 2190000, emoji: "☕", qty: 2 },
];
const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function Buys() {
  const [items, setItems] = useState(INITIAL_CART);
  const [ordered, setOrdered] = useState(false);
  const navigate = useNavigate();

  const updateQty = (id, d) => setItems(p => p.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + d) } : x));
  const total = items.reduce((s, p) => s + p.price * p.qty, 0);

  if (ordered) return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-7xl block mb-5">🎉</span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Заказ оформлен!</h2>
        <p className="text-gray-400 mb-6">Мы свяжемся с вами для подтверждения</p>
        <button onClick={() => { setOrdered(false); setItems(INITIAL_CART); navigate("/"); }}
          className="px-8 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-violet-700">
          На главную
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center justify-center gap-3"><FaShoppingCart /> Корзина</h1>
        <p className="text-white/70">{items.length} позиций</p>
      </section>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🛒</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-6">Корзина пуста</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm cursor-pointer border-none">В каталог</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-3xl flex-shrink-0">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-sm font-black text-violet-600 mt-1">{fmt(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 cursor-pointer bg-transparent"><FaMinus size={10} /></button>
                    <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 cursor-pointer bg-transparent"><FaPlus size={10} /></button>
                  </div>
                  <button onClick={() => setItems(p => p.filter(x => x.id !== item.id))} className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-600 cursor-pointer bg-transparent border-none"><FaTrash size={13} /></button>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 h-fit">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Итого</h3>
              <div className="flex flex-col gap-3 text-sm mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-500">
                    <span className="truncate mr-2">{item.name} × {item.qty}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex justify-between font-black text-gray-900 dark:text-white mb-5">
                <span>Итого</span>
                <span className="text-violet-600">{fmt(total)}</span>
              </div>
              <button onClick={() => setOrdered(true)} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm cursor-pointer border-none">Оформить заказ</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
