import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import AuthModal from "../components/AuthModal";

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function Likes() {
  const { t, i18n } = useTranslation();
  const { likes, removeLike, addToCart, isInCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);

  const lang = ["ru","en","uz"].includes(i18n.language?.slice(0,2)) ? i18n.language.slice(0,2) : "ru";

  const handleCart = (product) => {
    if (!user) { setPendingProduct(product); setShowAuth(true); return; }
    addToCart(product);
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <section className="bg-gradient-to-br from-rose-500 to-pink-600 text-white py-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-2 flex items-center justify-center gap-3">
          <FaHeart /> {t("likes.title")}
        </h1>
        <p className="text-white/70">{likes.length} {t("likes.count")}</p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {likes.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🤍</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("likes.empty")}</p>
            <p className="text-gray-400 text-sm mb-5">{t("likes.emptySubtitle")}</p>
            <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-violet-700 transition-all">
              {t("likes.toCatalog")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {likes.map(product => {
              const name = product.name?.[lang] || product.name?.ru || product.name || "";
              const cat = product.category?.[lang] || product.category?.ru || product.category || "";
              const inCart = isInCart(product.id);
              return (
                <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-44 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    {product.image
                      ? <img src={product.image} alt={name} className="w-full h-full object-cover" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">{product.emoji || "🛍️"}</div>
                    }
                    <button
                      onClick={() => removeLike(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 dark:bg-zinc-800/90 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:scale-110 transition-all cursor-pointer border-none shadow-sm"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-rose-500 font-semibold mb-1">{cat}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{name}</p>
                    <p className="text-base font-black text-gray-900 dark:text-white mb-3">{fmt(product.price)}</p>
                    <button
                      onClick={() => handleCart(product)}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border-none transition-all
                        ${inCart ? "bg-green-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}
                    >
                      <FaShoppingCart size={13} />
                      {inCart ? t("products.added") : t("products.addToCart")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showAuth && (
        <AuthModal
          onClose={() => { setShowAuth(false); setPendingProduct(null); }}
          onSuccess={() => { if (pendingProduct) { addToCart(pendingProduct); setPendingProduct(null); } }}
        />
      )}
    </div>
  );
}
