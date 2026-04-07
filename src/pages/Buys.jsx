import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function Buys() {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, updateQty, cartTotal, checkout } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const lang = ["ru","en","uz"].includes(i18n.language?.slice(0,2)) ? i18n.language.slice(0,2) : "ru";

  const handleCheckout = () => {
    checkout(user);
    navigate("/?ordered=1");
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center justify-center gap-3">
          <FaShoppingCart /> {t("cart.title")}
        </h1>
        <p className="text-white/70">{cart.length} {t("cart.positions")}</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🛒</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("cart.empty")}</p>
            <p className="text-gray-400 text-sm mb-5">{t("cart.emptySubtitle")}</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-violet-700 transition-all">
              {t("cart.toCatalog")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map(item => {
                const name = item.name?.[lang] || item.name?.ru || item.name || "";
                return (
                  <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                      {item.image
                        ? <img src={item.image} alt={name} className="w-full h-full object-cover" loading="lazy" onError={e => e.target.src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"} />
                        : <div className="w-full h-full flex items-center justify-center text-3xl">{item.emoji || "🛍️"}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{name}</p>
                      <p className="text-sm font-black text-violet-600 dark:text-violet-400 mt-1">{fmt(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 cursor-pointer bg-transparent"><FaMinus size={10} /></button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 cursor-pointer bg-transparent"><FaPlus size={10} /></button>
                    </div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 w-24 text-right flex-shrink-0 hidden sm:block">{fmt(item.price * item.qty)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer bg-transparent border-none transition-all">
                      <FaTrash size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 h-fit sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{t("cart.total")}</h3>
              <div className="flex flex-col gap-3 text-sm mb-5">
                {cart.map(item => {
                  const name = item.name?.[lang] || item.name?.ru || item.name || "";
                  return (
                    <div key={item.id} className="flex justify-between text-gray-500 dark:text-zinc-400">
                      <span className="truncate mr-2">{name} × {item.qty}</span>
                      <span className="font-medium whitespace-nowrap">{fmt(item.price * item.qty)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex justify-between font-black text-gray-900 dark:text-white mb-5">
                <span>{t("cart.total")}</span>
                <span className="text-violet-600 dark:text-violet-400">{fmt(cartTotal)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm cursor-pointer border-none transition-all">
                {t("cart.checkout")}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
