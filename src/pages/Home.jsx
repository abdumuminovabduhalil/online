import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

const PRODUCTS = [
  { id: 1, name: "Кроссовки Nike Air Max", price: 1490000, oldPrice: 1890000, category: "Обувь", emoji: "👟", rating: 4.8, reviews: 124 },
  { id: 2, name: "Наушники Sony WH-1000XM5", price: 3490000, oldPrice: null, category: "Электроника", emoji: "🎧", rating: 4.9, reviews: 89 },
  { id: 3, name: "Кожаная сумка", price: 890000, oldPrice: 1200000, category: "Аксессуары", emoji: "👜", rating: 4.6, reviews: 57 },
  { id: 4, name: "Смарт-часы Apple Watch", price: 4290000, oldPrice: null, category: "Электроника", emoji: "⌚", rating: 4.9, reviews: 203 },
  { id: 5, name: "Куртка зимняя", price: 1190000, oldPrice: 1590000, category: "Одежда", emoji: "🧥", rating: 4.7, reviews: 41 },
  { id: 6, name: "Книжная полка", price: 590000, oldPrice: null, category: "Мебель", emoji: "📚", rating: 4.5, reviews: 33 },
  { id: 7, name: "Кофеварка Delonghi", price: 2190000, oldPrice: 2690000, category: "Техника", emoji: "☕", rating: 4.8, reviews: 76 },
  { id: 8, name: "Велосипед горный", price: 5490000, oldPrice: null, category: "Спорт", emoji: "🚲", rating: 4.7, reviews: 18 },
];

const CATEGORIES = ["Все", "Электроника", "Одежда", "Обувь", "Аксессуары", "Мебель", "Техника", "Спорт"];

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function Home() {
  const [liked, setLiked] = useState({});
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: true }));

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "Все" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
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
            🎉 Бесплатная доставка от 500 000 сум
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-3xl">
            Найди всё что нужно<br />
            <span className="text-yellow-300">в одном месте</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            Тысячи товаров от проверенных продавцов. Быстрая доставка по всему Узбекистану.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <button className="px-6 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-yellow-300 hover:text-violet-800 transition-all duration-200 flex items-center gap-2 justify-center cursor-pointer">
              Найти <HiArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            ["50 000+", "Товаров"],
            ["12 000+", "Покупателей"],
            ["3 200+", "Продавцов"],
            ["4.9 ★", "Рейтинг"],
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Популярные товары</h2>
          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border
                  ${activeCategory === cat
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-700 hover:border-violet-300"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-zinc-600">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium">Ничего не найдено</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image area */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-700 h-44 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>

                  {product.oldPrice && (
                    <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}

                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
                  >
                    {liked[product.id]
                      ? <FaHeart size={13} className="text-rose-500" />
                      : <FaRegHeart size={13} className="text-gray-400" />}
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-violet-500 dark:text-violet-400 font-semibold mb-1">{product.category}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2">{product.name}</p>

                  <div className="flex items-center gap-1.5 mb-3">
                    <FaStar size={11} className="text-yellow-400" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-base font-black text-gray-900 dark:text-white">{fmt(product.price)}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">{fmt(product.oldPrice)}</span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer
                      ${cart[product.id]
                        ? "bg-green-500 text-white"
                        : "bg-violet-600 hover:bg-violet-700 text-white"}`}
                  >
                    <FaShoppingCart size={13} />
                    {cart[product.id] ? "Добавлено ✓" : "В корзину"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black mb-2">Стань продавцом!</h3>
            <p className="text-white/70 text-sm max-w-sm">Продавайте свои товары миллионам покупателей. Регистрация бесплатно.</p>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-yellow-300 hover:text-violet-800 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            Начать продавать →
          </button>
        </div>
      </section>
    </div>
  );
}
