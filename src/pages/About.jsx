export default function About() {
  const team = [
    { name: "Алишер Каримов", role: "CEO & Основатель", emoji: "👨‍💼" },
    { name: "Малика Юсупова", role: "Дизайнер", emoji: "👩‍🎨" },
    { name: "Бобур Рашидов", role: "Разработчик", emoji: "👨‍💻" },
    { name: "Зарина Ахмедова", role: "Маркетинг", emoji: "👩‍💼" },
  ];
  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">О нас</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">Мы создаём лучший маркетплейс для покупателей и продавцов Узбекистана</p>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { emoji: "🎯", title: "Наша миссия", text: "Сделать онлайн-торговлю доступной и удобной для каждого жителя Узбекистана." },
            { emoji: "👁️", title: "Наше видение", text: "Стать ведущим маркетплейсом Центральной Азии к 2027 году." },
            { emoji: "💎", title: "Наши ценности", text: "Честность, прозрачность и забота о каждом клиенте — основа нашей работы." },
          ].map(({ emoji, title, text }) => (
            <div key={title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6">
              <span className="text-4xl block mb-4">{emoji}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Наша команда</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {team.map(({ name, role, emoji }) => (
            <div key={name} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <span className="text-5xl block mb-3">{emoji}</span>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
              <p className="text-xs text-violet-500 mt-0.5">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
