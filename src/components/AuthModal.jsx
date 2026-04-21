import { useState } from 'react';
import { X, Eye, EyeOff, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register, theme, t } = useApp();
  const dark = theme === 'dark';

  const [form, setForm]   = useState({ username:'', password:'', displayName:'' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = mode === 'login'
      ? await login(form.username, form.password)
      : await register(form.username, form.password, form.displayName);
    setLoading(false);
    if (res.ok) { onClose(); }
    else { setError(res.error); }
  };

  const inputCls = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/15 ${dark?'bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500':'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
         onClick={e => e.target===e.currentTarget && onClose()}>
      <div className={`w-full max-w-sm rounded-2xl border shadow-2xl ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>

        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark?'border-slate-800':'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mode==='login'?'bg-blue-500/15 text-blue-400':'bg-emerald-500/15 text-emerald-400'}`}>
              {mode==='login' ? <LogIn size={15}/> : <UserPlus size={15}/>}
            </div>
            <div>
              <h2 className={`font-semibold text-sm ${dark?'text-white':'text-slate-900'}`}>
                {mode==='login' ? t.loginTitle : t.registerTitle}
              </h2>
              <p className={`text-xs ${dark?'text-slate-500':'text-slate-400'}`}>
                {mode==='login' ? t.loginSub : t.registerSub}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark?'text-slate-500 hover:text-white hover:bg-slate-800':'text-slate-400 hover:text-slate-700 hover:bg-slate-100'} transition-colors`}>
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{t.displayName}</label>
              <input value={form.displayName} onChange={set('displayName')} placeholder="Иван Иванов"
                className={inputCls} />
            </div>
          )}

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{t.username}</label>
            <input value={form.username} onChange={set('username')} required placeholder="username"
              className={inputCls} />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{t.password}</label>
            <div className="relative">
              <input type={showPw?'text':'password'} value={form.password} onChange={set('password')} required placeholder="••••••••"
                className={`${inputCls} pr-9`} />
              <button type="button" onClick={() => setShowPw(p=>!p)}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${dark?'text-slate-500 hover:text-slate-300':'text-slate-400 hover:text-slate-600'}`}>
                {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle size={13} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${mode==='login' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} disabled:opacity-50`}>
            {loading ? t.wait : mode==='login' ? t.login : t.register}
          </button>

          <p className={`text-xs text-center ${dark?'text-slate-500':'text-slate-400'}`}>
            {mode==='login' ? t.noAccount : t.hasAccount}{' '}
            <button type="button" onClick={() => onSwitch(mode==='login'?'register':'login')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              {mode==='login' ? t.register : t.login}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
