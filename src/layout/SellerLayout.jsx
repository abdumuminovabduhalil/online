import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { useEffect, useState } from "react";
import { FaSignOutAlt, FaPlus, FaTrash, FaTimes, FaCheck, FaEdit } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Darkmode from "../components/Darkmode";

const CATEGORY_OPTIONS = [
  { value: "electronics", ru: "Электроника", en: "Electronics", uz: "Elektronika" },
  { value: "shoes",       ru: "Обувь",       en: "Shoes",       uz: "Oyoq kiyim" },
  { value: "accessories", ru: "Аксессуары",  en: "Accessories", uz: "Aksessuarlar" },
  { value: "appliances",  ru: "Техника",     en: "Appliances",  uz: "Texnika" },
  { value: "sports",      ru: "Спорт",       en: "Sports",      uz: "Sport" },
  { value: "clothing",    ru: "Одежда",      en: "Clothing",    uz: "Kiyim" },
  { value: "furniture",   ru: "Мебель",      en: "Furniture",   uz: "Mebel" },
  { value: "other",       ru: "Другое",      en: "Other",       uz: "Boshqa" },
];

const fmt = (n) => n.toLocaleString("ru-RU") + " сум";
const EMPTY = { nameRu:"", nameEn:"", nameUz:"", descRu:"", price:"", oldPrice:"", image:"", catValue:"electronics" };

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const { products, addProduct, deleteProduct, editProduct } = useShop();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = ["ru","en","uz"].includes(i18n.language?.slice(0,2)) ? i18n.language.slice(0,2) : "ru";
  const changeLang = (l) => i18n.changeLanguage(l);

  const [mode, setMode]       = useState(null);   // null | "add" | "edit"
  const [editId, setEditId]   = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [toast, setToast]     = useState("");

  useEffect(() => {
    if (!user || user.role !== "seller") navigate("/login");
  }, [user]);

  if (!user || user.role !== "seller") return null;

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const openAdd = () => {
    setForm(EMPTY);
    setFormError("");
    setEditId(null);
    setMode("add");
  };

  const openEdit = (p) => {
    // Find matching category
    const matchCat = CATEGORY_OPTIONS.find(c =>
      c.ru === p.category?.ru || c.en === p.category?.en || c.value === p.category
    );
    setForm({
      nameRu:   p.name?.ru || "",
      nameEn:   p.name?.en || "",
      nameUz:   p.name?.uz || "",
      descRu:   p.desc?.ru || p.description || "",
      price:    String(p.price || ""),
      oldPrice: String(p.oldPrice || ""),
      image:    p.image || "",
      catValue: matchCat?.value || "other",
    });
    setFormError("");
    setEditId(p.id);
    setMode("edit");
  };

  const closeForm = () => { setMode(null); setEditId(null); setFormError(""); };

  const validateForm = () => {
    if (!form.nameRu.trim()) { setFormError("Введите название на русском"); return false; }
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) { setFormError("Введите корректную цену"); return false; }
    return true;
  };

  const buildProduct = () => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === form.catValue);
    return {
      name:     { ru: form.nameRu, en: form.nameEn || form.nameRu, uz: form.nameUz || form.nameRu },
      desc:     { ru: form.descRu, en: form.descRu, uz: form.descRu },
      price:    Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      image:    form.image || "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
      category: { ru: cat.ru, en: cat.en, uz: cat.uz },
      sellerId: user.id,
    };
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    addProduct(buildProduct());
    showToast("✅ Товар добавлен и виден всем покупателям!");
    closeForm();
  };

  const handleEdit = () => {
    if (!validateForm()) return;
    editProduct(editId, buildProduct());
    showToast("✅ Товар обновлён!");
    closeForm();
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Удалить "${name}"? Товар исчезнет у всех пользователей.`)) return;
    deleteProduct(id);
    showToast("🗑️ Товар удалён");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">

      {/* ── SIDEBAR ── */}
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
            <span className="ml-auto bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{products.length}</span>
          </div>
          <NavLink to="/" className="px-3 py-2.5 rounded-xl text-sm font-medium no-underline text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            🏠 На главную
          </NavLink>
        </div>

        {/* Lang + Dark + User + Logout */}
        <div className="border-t border-gray-100 dark:border-zinc-800 pt-4 flex flex-col gap-2">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1">
            {["ru","en","uz"].map(l => (
              <button key={l} onClick={() => changeLang(l)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold cursor-pointer border-none transition-all
                  ${i18n.language === l ? "bg-violet-500 text-white" : "text-gray-500 dark:text-gray-400 bg-transparent"}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-xl p-2.5 min-w-0">
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

      {/* ── MAIN ── */}
      <main className="flex-1 ml-60 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Мои товары</h1>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">Всего на сайте: {products.length} товаров</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm cursor-pointer border-none transition-all shadow-sm">
            <FaPlus size={13} /> Добавить товар
          </button>
        </div>

        {/* ── ADD / EDIT FORM ── */}
        {mode && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {mode === "add" ? "➕ Новый товар" : "✏️ Редактировать товар"}
              </h2>
              <button onClick={closeForm} className="w-8 h-8 rounded-xl border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent">
                <FaTimes size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Names */}
              {[
                { key:"nameRu", label:"Название (RU) *", ph:"Название на русском" },
                { key:"nameEn", label:"Название (EN)",   ph:"Name in English" },
                { key:"nameUz", label:"Название (UZ)",   ph:"O'zbekcha nomi" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{f.label}</label>
                  <input value={form[f.key]} onChange={set(f.key)} placeholder={f.ph}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
                </div>
              ))}

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Категория</label>
                <select value={form.catValue} onChange={set("catValue")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400">
                  {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.ru}</option>)}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Цена (сум) *</label>
                <input type="number" value={form.price} onChange={set("price")} placeholder="1 000 000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              {/* Old Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Старая цена (для скидки)</label>
                <input type="number" value={form.oldPrice} onChange={set("oldPrice")} placeholder="1 500 000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              {/* Image */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ссылка на фото</label>
                <input value={form.image} onChange={set("image")} placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400" />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Описание</label>
                <textarea value={form.descRu} onChange={set("descRu")} rows={3} placeholder="Описание товара..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>
            </div>

            {/* Image preview */}
            {form.image && (
              <div className="mt-4 flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-xl p-3">
                <img src={form.image} alt="preview"
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={e => e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"} />
                <div>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Предпросмотр картинки</p>
                  {form.price && <p className="text-xs text-gray-400 mt-0.5">{fmt(Number(form.price))}</p>}
                </div>
              </div>
            )}

            {formError && (
              <div className="mt-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm px-4 py-3 rounded-xl">
                {formError}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <button onClick={mode === "add" ? handleAdd : handleEdit}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm cursor-pointer border-none transition-all shadow-sm">
                <FaCheck size={13} />
                {mode === "add" ? "Добавить товар" : "Сохранить изменения"}
              </button>
              <button onClick={closeForm}
                className="px-5 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer bg-transparent transition-all">
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* ── PRODUCTS LIST ── */}
        {products.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-16 text-center">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">Нет товаров</p>
            <p className="text-gray-400 text-sm mb-5">Добавьте первый товар</p>
            <button onClick={openAdd} className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm cursor-pointer border-none hover:bg-green-600">
              + Добавить товар
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {products.map(product => {
              const name = product.name?.ru || "";
              const cat  = product.category?.ru || "";
              return (
                <div key={product.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-4 hover:shadow-sm transition-all">

                  {/* Thumb */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                    <img src={product.image} alt={name} className="w-full h-full object-cover"
                      onError={e => e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400"} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{name}</p>
                    <p className="text-xs text-violet-500 font-medium mt-0.5">{cat}</p>
                    <div className="flex items-center gap-2 mt-1">
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

                  {/* Rating */}
                  <div className="hidden sm:flex flex-col items-center gap-1 px-4">
                    <span className="text-yellow-400 text-sm">⭐</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{product.rating}</span>
                    <span className="text-xs text-gray-400">{product.reviews} отз.</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Edit */}
                    <button onClick={() => openEdit(product)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-semibold cursor-pointer bg-transparent transition-all">
                      <FaEdit size={11} /> Изменить
                    </button>
                    {/* Delete */}
                    <button onClick={() => handleDelete(product.id, name)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs font-semibold cursor-pointer bg-transparent transition-all">
                      <FaTrash size={11} /> Удалить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
