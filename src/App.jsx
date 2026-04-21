import { useState, useEffect } from 'react';
import Header     from './components/Header';
import HomePage   from './pages/HomePage';
import AdminPage  from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import { useApp } from './context/AppContext';

export default function App() {
  const { session, theme } = useApp();
  const dark = theme === 'dark';

  // Сохраняем страницу в sessionStorage — при обновлении остаёмся там же
  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem('as_page');
    return saved || 'home';
  });

  const handleSetPage = (p) => {
    setPage(p);
    sessionStorage.setItem('as_page', p);
  };

  const activePage = (page === 'admin'   && session?.role !== 'admin') ? 'home'
                   : (page === 'profile' && !session)                  ? 'home'
                   : page;

  // Если страница стала недоступна (разлогинился) — сбросить сохранённую
  useEffect(() => {
    if (activePage !== page) {
      setPage(activePage);
      sessionStorage.setItem('as_page', activePage);
    }
  }, [activePage, page]);

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header page={activePage} setPage={handleSetPage} />
      <main>
        {activePage === 'home'    && <HomePage />}
        {activePage === 'admin'   && <AdminPage />}
        {activePage === 'profile' && <ProfilePage />}
      </main>
      <footer className={`border-t mt-12 py-5 text-center text-xs ${dark?'border-slate-800 text-slate-600':'border-slate-200 text-slate-400'}`}>
        © 2025 AutoServicePro · Все права защищены
      </footer>
    </div>
  );
}
