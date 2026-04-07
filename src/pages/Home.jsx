import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaShoppingCart, FaStar, FaTimes } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import AuthModal from "../components/AuthModal";

const CATEGORIES = {
  ru: ["Все", "Электроника", "Одежда", "Обувь", "Аксессуары", "Мебель", "Техника", "Спорт"],
  en: ["All", "Electronics", "Clothing", "Shoes", "Accessories", "Furniture", "Appliances", "Sports"],
  uz: ["Hammasi", "Elektronika", "Kiyim", "Oyoq kiyim", "Aksessuarlar", "Mebel", "Texnika", "Sport"],
};

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { products, addToCart, isInCart, toggleLike, isLiked } = useShop();
  const navigate = useNavigate();

  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const lang = ["ru","en","uz"].includes(i18n.language?.slice(0,2)) ? i18n.language.slice(0,2) : "ru";
  const cats = CATEGORIES[lang] || CATEGORIES.ru;

  const handleAddToCart = (product) => {
    if (!user) { setPendingProduct(product); setShowAuthModal(true); return; }
    addToCart(product);
  };

  const handleAuthSuccess = () => {
    if (pendingProduct) { addToCart(pendingProduct); setPendingProduct(null); }
  };

  const filtered = products.filter((p) => {
    const catName = p.category?.[lang] || p.category?.ru || "";
    const matchCat = activeCatIndex === 0 || catName === cats[activeCatIndex];
    const productName = p.name?.[lang] || p.name?.ru || "";
    const matchSearch = productName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 rounded-full bg-pink-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 flex flex-col items-center text-center gap-6">
          <span className="bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
            {t("hero.badge")}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-3xl">
            {t("hero.title")}<br /><span className="text-yellow-300">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl">{t("hero.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input type="text" placeholder={t("hero.searchPlaceholder")} value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 text-sm" />
            <button className="px-6 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-yellow-300 hover:text-violet-800 transition-all flex items-center gap-2 justify-center cursor-pointer border-none">
              {t("hero.searchBtn")} <HiArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            [products.length + "+", t("stats.products")],
            ["12 000+", t("stats.buyers")],
            ["3 200+", t("stats.sellers")],
            ["4.9 ★", t("stats.rating")]
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{val}</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("products.title")}</h2>
          <div className="flex gap-2 flex-wrap">
            {cats.map((cat, i) => (
              <button key={cat} onClick={() => setActiveCatIndex(i)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border
                  ${activeCatIndex === i ? "bg-violet-600 text-white border-violet-600" : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:border-violet-300"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium">{t("products.notFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const name = product.name?.[lang] || product.name?.ru || "";
              const cat = product.category?.[lang] || product.category?.ru || "";
              const inCart = isInCart(product.id);
              const liked = isLiked(product.id);
              return (
                <div key={product.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}>
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <img src={product.image} alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"; }} />
                    {product.oldPrice && (
                      <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                      </span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); toggleLike(product); }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all cursor-pointer border-none shadow-sm">
                      {liked ? <FaHeart size={14} className="text-rose-500" /> : <FaRegHeart size={14} className="text-gray-400" />}
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-violet-500 font-semibold mb-1">{cat}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2">{name}</p>
                    <div className="flex items-center gap-1.5 mb-3">
                      <FaStar size={11} className="text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-base font-black text-gray-900 dark:text-white">{fmt(product.price)}</span>
                      {product.oldPrice && <span className="text-xs text-gray-400 line-through">{fmt(product.oldPrice)}</span>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border-none transition-all
                        ${inCart ? "bg-green-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
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

      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2">{t("banner.title")}</h3>
            <p className="text-white/70 text-sm max-w-sm">{t("banner.subtitle")}</p>
          </div>
          <button onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-yellow-300 hover:text-violet-800 transition-all whitespace-nowrap cursor-pointer border-none">
            {t("banner.btn")}
          </button>
        </div>
      </section>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          lang={lang}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isInCart={isInCart}
          toggleLike={toggleLike}
          isLiked={isLiked}
          t={t}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => { setShowAuthModal(false); setPendingProduct(null); }}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

function ProductModal({ product, lang, onClose, onAddToCart, isInCart, toggleLike, isLiked, t }) {
  const name = product.name?.[lang] || product.name?.ru || "";
  const desc = product.desc?.[lang] || product.desc?.ru || "";
  const cat = product.category?.[lang] || product.category?.ru || "";
  const inCart = isInCart(product.id);
  const liked = isLiked(product.id);
  const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="relative h-64 bg-gray-100 dark:bg-zinc-800">
          <img src={product.image} alt={name} className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"; }} />
          {product.oldPrice && (
            <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:scale-110 transition-all cursor-pointer border-none shadow-sm">
            <FaTimes size={14} />
          </button>
          <button onClick={() => toggleLike(product)}
            className="absolute top-4 right-16 w-9 h-9 rounded-xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all cursor-pointer border-none shadow-sm">
            {liked ? <FaHeart size={15} className="text-rose-500" /> : <FaRegHeart size={15} className="text-gray-400" />}
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-xs text-violet-500 font-semibold mb-1">{cat}</p>
              <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{name}</h2>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-black text-gray-900 dark:text-white">{fmt(product.price)}</p>
              {product.oldPrice && <p className="text-sm text-gray-400 line-through">{fmt(product.oldPrice)}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={13} className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200 dark:text-zinc-700"} />
            ))}
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews} {t("products.reviews")})</span>
          </div>
          {desc && <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed mb-6">{desc}</p>}
          <div className="flex gap-3">
            <button onClick={() => onAddToCart(product)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border-none transition-all
                ${inCart ? "bg-green-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"}`}>
              <FaShoppingCart size={15} />
              {inCart ? t("products.added") : t("products.addToCart")}
            </button>
            <button onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer bg-transparent">
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}