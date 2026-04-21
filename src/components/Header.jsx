import { useState } from 'react';
import { Sun, Moon, LogIn, UserPlus, LogOut, User, Shield, ChevronDown, Settings, Wrench, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AuthModal from './AuthModal';

export default function Header({ page, setPage }) {
  const { theme, toggleTheme, session, logout, lang, setLang, t } = useApp();
  const [authMode, setAuthMode] = useState(null);
  const [ddOpen,   setDdOpen]   = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dark = theme === 'dark';

  const handleLogout = () => { logout(); setDdOpen(false); setPage('home'); };

  return (
    <>
      <header className={`sticky top-0 z-40 border-b ${dark ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <button onClick={() => setPage('home')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 shadow-md">
              <Wrench size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className={`font-bold text-sm tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                AutoService<span className="text-blue-500 font-extrabold">Pro</span>
              </span>
              <div className={`text-[10px] font-medium tracking-widest uppercase leading-none ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {lang === 'ru' ? 'Управление мастерами' : 'Ustalar boshqaruvi'}
              </div>
            </div>
          </button>

          {/* Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { key: 'home', label: t.workers },
              ...(session?.role === 'admin' ? [{ key: 'admin', label: t.adminPanel }] : []),
            ].map(item => (
              <button key={item.key} onClick={() => setPage(item.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  page === item.key
                    ? (dark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900')
                    : (dark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')
                }`}>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative">
              <button onClick={() => setLangOpen(o => !o)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}>
                <Globe size={13} />
                {lang.toUpperCase()}
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className={`absolute right-0 top-10 w-28 rounded-xl border shadow-xl z-50 py-1 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                    {['ru', 'uz'].map(l => (
                      <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                          lang === l
                            ? (dark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-50')
                            : (dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50')
                        }`}>
                        {l === 'ru' ? '🇷🇺 Русский' : '🇺🇿 O\'zbek'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {session ? (
              <div className="relative">
                <button onClick={() => setDdOpen(o => !o)}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    dark ? 'border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${session.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {session.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{session.displayName}</span>
                  {session.role === 'admin' && <Shield size={11} className="text-amber-400 hidden sm:block" />}
                  <ChevronDown size={12} className={`transition-transform ${ddOpen ? 'rotate-180' : ''}`} />
                </button>

                {ddOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDdOpen(false)} />
                    <div className={`absolute right-0 top-10 w-48 rounded-xl border shadow-xl z-50 py-1 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <div className={`px-3 py-2 border-b text-xs ${dark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                        <div className={`font-semibold text-sm mb-0.5 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{session.displayName}</div>
                        <div className="flex items-center gap-1">
                          {session.role === 'admin' ? <><Shield size={10} className="text-amber-400" /> {t.administrator}</> : <><User size={10} /> {t.user}</>}
                        </div>
                      </div>
                      {session.role === 'admin' && (
                        <button onClick={() => { setPage('admin'); setDdOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <Settings size={13} /> {t.adminPanel}
                        </button>
                      )}
                      <button onClick={() => { setPage('profile'); setDdOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'}`}>
                        <User size={13} /> {t.myProfile}
                      </button>
                      <div className={`border-t my-1 ${dark ? 'border-slate-800' : 'border-slate-100'}`} />
                      <button onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <LogOut size={13} /> {t.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setAuthMode('login')}
                  className={`flex items-center gap-[6px] px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                    dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}>
                  <LogIn size={13} /> {t.login}
                </button>
                <button onClick={() => setAuthMode('register')}
                  className="flex items-center gap-[6px] px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                  <UserPlus size={13} /> {t.register}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {session?.role === 'admin' && (
          <div className={`md:hidden border-t ${dark ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-white'}`}>
            <div className="flex px-4 gap-1 py-2">
              {[{ key:'home', label: t.workers }, { key:'admin', label: t.admin }].map(item => (
                <button key={item.key} onClick={() => setPage(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${page===item.key ? (dark?'bg-slate-800 text-white':'bg-slate-100 text-slate-900') : (dark?'text-slate-500 hover:text-white':'text-slate-500 hover:text-slate-900')}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={m => setAuthMode(m)} />}
    </>
  );
}
