import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSent(true); setForm({ name: "", email: "", message: "" }); };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Контакты</h1>
        <p className="text-white/70 text-lg">Свяжитесь с нами — мы всегда рады помочь</p>
      </section>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Наши контакты</h2>
          {[
            { icon: <FaPhone />, label: "Телефон", value: "+998 90 123 45 67" },
            { icon: <FaEnvelope />, label: "Email", value: "info@market.uz" },
            { icon: <FaMapMarkerAlt />, label: "Адрес", value: "г. Ташкент, ул. Амира Темура, 15" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center flex-shrink-0">{icon}</div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Написать нам</h2>
          {sent ? (
            <div className="text-center py-8">
              <span className="text-5xl block mb-4">✅</span>
              <p className="font-semibold text-gray-900 dark:text-white">Сообщение отправлено!</p>
              <p className="text-sm text-gray-400 mt-1">Мы ответим в течение 24 часов</p>
              <button onClick={() => setSent(false)} className="mt-5 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold cursor-pointer border-none">Написать ещё</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[{ key: "name", label: "Имя", type: "text", ph: "Ваше имя" }, { key: "email", label: "Email", type: "email", ph: "example@mail.com" }].map(({ key, label, type, ph }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                  <input type={type} required placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Сообщение</label>
                <textarea required rows={4} placeholder="Ваше сообщение..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm cursor-pointer border-none">Отправить</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
