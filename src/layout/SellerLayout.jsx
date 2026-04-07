import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { FaSignOutAlt, FaPlus, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import Darkmode from "../components/Darkmode";
import { useTranslation } from "react-i18next";

const CATEGORY_OPTIONS = [
  { value: "electronics", ru: "Электроника", en: "Electronics", uz: "Elektronika" },
  { value: "shoes",       ru: "Обувь",       en: "Shoes",        uz: "Oyoq kiyim" },
  { value: "accessories", ru: "Аксессуары",  en: "Accessories",  uz: "Aksessuarlar" },
  { value: "appliances",  ru: "Техника",     en: "Appliances",   uz: "Texnika" },
  { value: "sports",      ru: "Спорт",       en: "Sports",       uz: "Sport" },
  { value: "clothing",    ru: "Одежда",      en: "Clothing",     uz: "Kiyim" },
  { value: "furniture",   ru: "Мебель",      en: "Furniture",    uz: "Mebel" },
  { value: "other",       ru: "Другое",      en: "Other",        uz: "Boshqa" },
];

const fmt = (n) => (n ? n.toLocaleString("ru-RU") + " сум" : "0 сум");

const EMPTY_FORM = { nameRu: "", nameEn: "", nameUz: "", descRu: "", price: "", oldPrice: "", image: "", catValue: "electronics" };

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const { products, addProduct, deleteProduct } = useShop();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || user.role !== "seller") return null;

  const handleAdd = () => {
    setFormError("");
    if (!form.nameRu || !form.price) { 
      setFormError("Заполните название (RU) и цену"); 
      return; 
    }
    
    if (isNaN(Number(form.price)) || Number(form.price) <= 0) { 
      setFormError("Введите корректную цену"); 
      return; 
    }

    const cat = CATEGORY_OPTIONS.find(c => c.value === form.catValue) || CATEGORY_OPTIONS[0];

    const newProduct = addProduct({
      name: { 
        ru: form.nameRu, 
        en: form.nameEn || form.nameRu, 
        uz: form.nameUz || form.nameRu 
      },
      desc: { ru: form.descRu, en: form.descRu, uz: form.descRu },
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      image: form.image || "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
      category: { ru: cat.ru, en: cat.en, uz: cat.uz },
      sellerId: user.id,
      rating: 5.0, // Дефолтные значения, чтобы таблица не была пустой
      reviews: 0
    });

    if (newProduct) {
      setSuccessId(newProduct.id);
      setTimeout(() => setSuccessId(null), 2500);
      setForm(EMPTY_FORM);
      setShowForm(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Удалить этот товар? Он исчезнет у всех пользователей.")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">
      {/* SIDEBAR */}
      <aside className="w-60 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 flex flex-col fixed h-full z-10 p-5">
        <NavLink to="/" className="flex items-center gap-2 no-underline mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-gray-900 dark:text-white font-extrabold text-lg">Seller<span className="text-green-500">.</span></span>
        </NavLink>

        <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider px-2 mb-2">Кабинет</p>

        <div className="flex flex-col gap-1 flex-1">
          <div className="px-3 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-2">
            📦 Мои товары
            <span className="ml-auto bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </div>
          <NavLink to="/" className="px-3 py-2.5 rounded-xl text-sm font-medium no-underline text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            🏠 На главную
          </NavLink>
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 pt-4">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 mb-2">
            {["ru", "en", "uz"].map(l => (
              <button 
                key={l} 
                onClick={() => i18n.changeLanguage(l)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer border-none transition-all ${
                  (i18n.language || 'ru').startsWith(l) ? "bg-violet-500 text-white" : "text-gray-500 bg-transparent"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl p-2 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-xs truncate">{user.name}</p>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">● Продавец</span>
            </div>
            <Darkmode />
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer bg-transparent border-none flex items-center gap-2 transition-colors">
            <FaSignOutAlt size={13} /> Выйти
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-60 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Мои товары</h1>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Всего товаров на сайте: {products.length}</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(""); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm cursor-pointer border-none transition-all shadow-sm">
            {showForm ? <FaTimes size={14} /> : <FaPlus size={14} />}
            {showForm ? "Отмена" : "Добавить товар"}
          </button>
        </div>

        {/* ADD FORM */}
        {showForm && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 mb-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">➕ Новый товар</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Название (RU) *</label>
                <input value={form.nameRu} onChange={e => setForm({...form, nameRu: e.target.value})} placeholder="Название на русском"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Название (EN)</label>
                <input value={form.nameEn} onChange={e => setForm({...form, nameEn: e.target.value})} placeholder="Name in English"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Название (UZ)</label>
                <input value={form.nameUz} onChange={e => setForm({...form, nameUz: e.target.value})} placeholder="O'zbekcha nomi"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Категория</label>
                <select value={form.catValue} onChange={e => setForm({...form, catValue: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400">
                  {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.ru}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Цена (сум) *</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="1 000 000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Старая цена (необязательно)</label>
                <input type="number" value={form.oldPrice} onChange={e => setForm({...form, oldPrice: e.target.value})} placeholder="1 500 000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ссылка на картинку</label>
                <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Описание</label>
                <textarea value={form.descRu} onChange={e => setForm({...form, descRu: e.target.value})} rows={3} placeholder="Описание товара..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
            </div>

            {formError && (
              <div className="mt-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm px-4 py-3 rounded-xl">
                {formError}
              </div>
            )}

            <button onClick={handleAdd}
              className="mt-5 px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm cursor-pointer border-none transition-all shadow-sm flex items-center gap-2">
              <FaCheck size={13} /> Добавить товар
            </button>
          </div>
        )}

        {/* SUCCESS TOAST */}
        {successId && (
          <div className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm flex items-center gap-2 animate-bounce">
            ✅ Товар добавлен!
          </div>
        )}

        {/* PRODUCTS LIST */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Нет товаров</p>
            <p className="text-gray-400 text-sm">Добавьте первый товар</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map(product => {
              const name = product.name?.ru || "Без названия";
              const cat = product.category?.ru || "Без категории";
              return (
                <div key={product.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4 hover:shadow-sm transition-all">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                    <img src={product.image} alt={name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"; }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{name}</p>
                    <p className="text-xs text-violet-500 font-medium mt-0.5">{cat}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-black text-gray-900 dark:text-white">{fmt(product.price)}</span>
                      {product.oldPrice && (
                        <>
                          <span className="text-xs text-gray-400 line-through">{fmt(product.oldPrice)}</span>
                          <span className="text-xs bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold px-1.5 py-0.5 rounded-md">
                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-center gap-1 text-center px-4">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{product.rating || 0}</span>
                    <span className="text-xs text-gray-400">{product.reviews || 0} отз.</span>
                  </div>

                  <button onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm font-semibold cursor-pointer bg-transparent transition-all flex-shrink-0">
                    <FaTrash size={12} /> Удалить
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}