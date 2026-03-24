import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-violet-200 dark:text-violet-900 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Страница не найдена</h1>
        <p className="text-gray-400 dark:text-zinc-500 text-sm mb-6">Такой страницы не существует</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all cursor-pointer border-none"
        >
          На главную
        </button>
      </div>
    </div>
  );
}
