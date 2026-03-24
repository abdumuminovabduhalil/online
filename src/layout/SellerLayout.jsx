import { NavLink, Outlet } from "react-router-dom";

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800 p-6 flex flex-col gap-2">
        <div className="font-black text-lg text-violet-600 mb-6">Кабинет продавца</div>
        {[["Мои товары", "/seller"], ["Заказы", "/seller/orders"], ["Статистика", "/seller/stats"]].map(([label, path]) => (
          <NavLink key={path} to={path} className={({ isActive }) =>
            `px-4 py-2.5 rounded-xl text-sm font-medium no-underline transition-colors
            ${isActive ? "bg-violet-50 dark:bg-violet-900/30 text-violet-600" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}>
            {label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
        <div className="text-gray-400 dark:text-zinc-600">Выберите раздел</div>
      </main>
    </div>
  );
}
