import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext(null);

const INITIAL_PRODUCTS = [
  { id: 1, name: { ru: "Кроссовки Nike Air Max", en: "Nike Air Max Sneakers", uz: "Nike Air Max krossovkalar" }, desc: { ru: "Лёгкие кроссовки с амортизацией Air Max. Идеальны для бега и повседневной носки.", en: "Lightweight sneakers with Air Max cushioning.", uz: "Yengil krossovkalar. Yugurish uchun ideal." }, price: 1490000, oldPrice: 1890000, category: { ru: "Обувь", en: "Shoes", uz: "Oyoq kiyim" }, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", rating: 4.8, reviews: 124, sellerId: "seller-001" },
  { id: 2, name: { ru: "Наушники Sony WH-1000XM5", en: "Sony WH-1000XM5 Headphones", uz: "Sony WH-1000XM5 quloqchinlar" }, desc: { ru: "Беспроводные наушники с лучшим шумоподавлением. До 30 часов работы.", en: "Best-in-class noise cancellation. 30h battery.", uz: "Simsiz quloqchinlar. 30 soat ishlaydi." }, price: 3490000, oldPrice: null, category: { ru: "Электроника", en: "Electronics", uz: "Elektronika" }, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", rating: 4.9, reviews: 89, sellerId: "seller-001" },
  { id: 3, name: { ru: "Кожаная сумка", en: "Leather Bag", uz: "Charm sumka" }, desc: { ru: "Стильная сумка из натуральной кожи. Подходит для работы и путешествий.", en: "Stylish genuine leather bag for work and travel.", uz: "Tabiiy teridan yasalgan sumka." }, price: 890000, oldPrice: 1200000, category: { ru: "Аксессуары", en: "Accessories", uz: "Aksessuarlar" }, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", rating: 4.6, reviews: 57, sellerId: "seller-001" },
  { id: 4, name: { ru: "Смарт-часы Apple Watch", en: "Apple Watch Smartwatch", uz: "Apple Watch aqlli soat" }, desc: { ru: "Умные часы с ЭКГ, GPS и датчиком кислорода. Защита от воды 50м.", en: "Smartwatch with ECG, GPS, blood oxygen sensor.", uz: "ECG, GPS, qon kislorodi sensori bilan aqlli soat." }, price: 4290000, oldPrice: null, category: { ru: "Электроника", en: "Electronics", uz: "Elektronika" }, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", rating: 4.9, reviews: 203, sellerId: "seller-001" },
  { id: 5, name: { ru: "Куртка зимняя", en: "Winter Jacket", uz: "Qishki kurtka" }, desc: { ru: "Тёплая куртка с пуховым наполнителем. До -30°C.", en: "Warm down jacket. Temperature rating to -30°C.", uz: "Issiq kurtka. -30°C gacha." }, price: 1190000, oldPrice: 1590000, category: { ru: "Одежда", en: "Clothing", uz: "Kiyim" }, image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80", rating: 4.7, reviews: 41, sellerId: "seller-001" },
  { id: 6, name: { ru: "Кофемашина DeLonghi", en: "DeLonghi Coffee Maker", uz: "DeLonghi qahva mashinasi" }, desc: { ru: "Автоматическая кофемашина с кофемолкой. 15 бар давление.", en: "Automatic coffee machine with grinder. 15 bar.", uz: "Qo'shimchali avtomatik qahva mashinasi." }, price: 2190000, oldPrice: 2690000, category: { ru: "Техника", en: "Appliances", uz: "Texnika" }, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", rating: 4.8, reviews: 76, sellerId: "seller-001" },
  { id: 7, name: { ru: "Горный велосипед", en: "Mountain Bike", uz: "Tog' velosipedi" }, desc: { ru: "21-скоростной Shimano. Алюминиевая рама, гидравлические тормоза.", en: "21-speed Shimano. Aluminum frame, hydraulic brakes.", uz: "21 tezlikli Shimano uzatmali velosiped." }, price: 5490000, oldPrice: null, category: { ru: "Спорт", en: "Sports", uz: "Sport" }, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", rating: 4.7, reviews: 18, sellerId: "seller-001" },
  { id: 8, name: { ru: "Книжная полка", en: "Bookshelf", uz: "Kitob tokchasi" }, desc: { ru: "Деревянная полка в скандинавском стиле. 5 полок, 20 кг нагрузка.", en: "Scandinavian wooden bookshelf. 5 shelves, 20 kg load.", uz: "Skandinaviya uslubidagi tokcha. 5 javon." }, price: 590000, oldPrice: null, category: { ru: "Мебель", en: "Furniture", uz: "Mebel" }, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", rating: 4.5, reviews: 33, sellerId: "seller-001" },
];

const load = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(() => load("market_products", INITIAL_PRODUCTS));
  const [cart, setCart] = useState(() => load("market_cart", []));
  const [likes, setLikes] = useState(() => load("market_likes", []));
  // Все заказы — для admin
  const [orders, setOrders] = useState(() => load("market_orders", []));

  useEffect(() => { localStorage.setItem("market_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("market_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("market_likes", JSON.stringify(likes)); }, [likes]);
  useEffect(() => { localStorage.setItem("market_orders", JSON.stringify(orders)); }, [orders]);

  // ── PRODUCTS ─────────────────────────────────
  const addProduct = (product) => {
    const p = { ...product, id: Date.now(), rating: 5.0, reviews: 0 };
    setProducts(prev => [p, ...prev]);
    return p;
  };
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(i => i.id !== id));
    setLikes(prev => prev.filter(i => i.id !== id));
  };

  const editProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    // Обновить и в корзине если там есть
    setCart(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  // ── CART ─────────────────────────────────────
  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const isInCart = (id) => cart.some(i => i.id === id);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── CHECKOUT — сохранить заказ ───────────────
  const checkout = (user) => {
    if (!cart.length) return;
    const order = {
      id: "order-" + Date.now(),
      userId: user?.id || "guest",
      userName: user?.name || "Гость",
      userEmail: user?.email || "",
      items: cart.map(i => ({
        id: i.id,
        name: i.name?.ru || i.name || "",
        price: i.price,
        qty: i.qty,
        image: i.image,
      })),
      total: cartTotal,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    return order;
  };

  // ── ОБНОВИТЬ СТАТУС ЗАКАЗА ────────────────────
  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // ── LIKES ─────────────────────────────────────
  const toggleLike = (product) => setLikes(prev => prev.find(i => i.id === product.id) ? prev.filter(i => i.id !== product.id) : [...prev, product]);
  const isLiked = (id) => likes.some(i => i.id === id);
  const removeLike = (id) => setLikes(prev => prev.filter(i => i.id !== id));

  return (
    <ShopContext.Provider value={{
      products, addProduct, deleteProduct, editProduct,
      cart, addToCart, removeFromCart, updateQty, isInCart, cartTotal, cartCount,
      likes, toggleLike, isLiked, removeLike,
      orders, checkout, updateOrderStatus,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
