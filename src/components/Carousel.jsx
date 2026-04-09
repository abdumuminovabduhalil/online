import { useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaRegHeart, FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";

export default function Carousel({ products, onProductClick, onAddToCart, isInCart, toggleLike, isLiked }) {
  const { i18n } = useTranslation();
  const lang = ["ru","en","uz"].includes(i18n.language?.slice(0,2)) ? i18n.language.slice(0,2) : "ru";
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Берём топ-5 товаров для карусели
  const slides = products.slice(0, 5);

  const go = useCallback((dir) => {
    if (animating || slides.length < 2) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(prev => (prev + dir + slides.length) % slides.length);
      setAnimating(false);
    }, 300);
  }, [animating, slides.length]);

  // Автопрокрутка каждые 4 сек
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => go(1), 4000);
    return () => clearInterval(timer);
  }, [go, slides.length]);

  if (!slides.length) return null;

  const p = slides[current];
  const name = p.name?.[lang] || p.name?.ru || "";
  const desc = p.desc?.[lang] || p.desc?.ru || "";
  const cat  = p.category?.[lang] || p.category?.ru || "";
  const liked = isLiked(p.id);
  const inCart = isInCart(p.id);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "420px" }}>
      {/* Slide background image */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: animating ? 0 : 1 }}
      >
        <img

          src={p.image}
          alt={name}
          className="w-full h-full object-contain"
          onError={e => e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200&q=80"}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        className="absolute inset-0 flex items-center px-8 sm:px-16 transition-opacity duration-500"
        style={{ opacity: animating ? 0 : 1 }}
      >
        <div className="max-w-lg">
          <span className="inline-block bg-violet-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            {cat}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
            {name}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2 max-w-sm">
            {desc}
          </p>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-black text-white">{fmt(p.price)}</span>
            {p.oldPrice && (
              <span className="text-white/50 line-through text-sm">{fmt(p.oldPrice)}</span>
            )}
            {p.oldPrice && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                -{Math.round((1 - p.price / p.oldPrice) * 100)}%
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onAddToCart(p)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer border-none transition-all
                ${inCart ? "bg-green-500 text-white" : "bg-white text-violet-700 hover:bg-violet-50"}`}
            >
              <FaShoppingCart size={14} />
              {inCart ? "Добавлено ✓" : "В корзину"}
            </button>
            <button
              onClick={() => onProductClick(p)}
              className="px-6 py-3 rounded-xl font-bold text-sm cursor-pointer border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
            >
              Подробнее
            </button>
            <button
              onClick={() => toggleLike(p)}
              className="w-11 h-11 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all"
            >
              {liked ? <FaHeart size={16} className="text-rose-400" /> : <FaRegHeart size={16} className="text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 cursor-pointer transition-all z-10"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white hover:bg-white/25 cursor-pointer transition-all z-10"
          >
            <FaChevronRight size={16} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { if (!animating) { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 300); } }}
            className={`rounded-full cursor-pointer border-none transition-all duration-300
              ${i === current ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2"}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-10">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}
