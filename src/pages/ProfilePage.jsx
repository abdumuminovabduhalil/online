import { useState } from 'react';
import { User, Key, Check, AlertCircle, Eye, EyeOff, Shield, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const { session, changeOwnPassword, theme, t, workers, toggleWorkerStatus } = useApp();
  const dark = theme === 'dark';

  const [form,    setForm]    = useState({ old:'', newP:'', confirm:'' });
  const [showPw,  setShowPw]  = useState(false);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // Надёжный поиск: сначала по workerId (если есть), потом по имени
  const myWorker = session?.role === 'worker'
    ? (session.workerId
        ? workers.find(w => w.id === session.workerId)
        : workers.find(w => w.name?.toLowerCase() === session.displayName?.toLowerCase()))
    : null;

  const isFree = myWorker?.status === 'free';

  const handleToggle = async () => {
    if (!myWorker || toggling) return;
    setToggling(true);
    await toggleWorkerStatus(myWorker.id);
    setToggling(false);
  };

  const handleChange = async () => {
    setResult(null);
    if (form.newP !== form.confirm) { setResult({ ok:false, msg: t.passwordsMismatch }); return; }
    setLoading(true);
    const res = await changeOwnPassword(form.old, form.newP);
    setLoading(false);
    if (res.ok) { setForm({ old:'', newP:'', confirm:'' }); setResult({ ok:true, msg: t.passwordChanged }); }
    else setResult({ ok:false, msg: res.error });
  };

  const inputCls = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/10 ${
    dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500'
         : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400'
  }`;

  const roleColor = session?.role === 'admin'  ? 'text-amber-400'
                  : session?.role === 'worker' ? 'text-emerald-400'
                  : 'text-blue-400';
  const RoleIcon  = session?.role === 'admin'  ? Shield
                  : session?.role === 'worker' ? Star
                  : User;
  const roleLabel = session?.role === 'admin'  ? t.administrator
                  : session?.role === 'worker' ? t.master
                  : t.user;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-1 ${dark?'text-white':'text-slate-900'}`}>{t.myProfile}</h1>
        <p className={`text-sm ${dark?'text-slate-400':'text-slate-500'}`}>{t.myProfileSub}</p>
      </div>

      {/* Info card */}
      <div className={`rounded-xl border p-4 mb-4 ${dark?'bg-slate-900 border-slate-800':'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${dark?'bg-slate-800 text-slate-300':'bg-slate-100 text-slate-600'}`}>
            {session?.displayName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={`font-semibold ${dark?'text-white':'text-slate-900'}`}>{session?.displayName}</div>
            <div className={`text-xs ${dark?'text-slate-400':'text-slate-500'}`}>@{session?.username}</div>
            <div className={`text-xs mt-0.5 flex items-center gap-1 ${roleColor}`}>
              <RoleIcon size={10}/> {roleLabel}
            </div>
          </div>
        </div>
      </div>

      {/* ── Статус мастера ── */}
      {session?.role === 'worker' && (
        <div className={`rounded-xl border p-4 mb-4 ${dark?'bg-slate-900 border-slate-800':'bg-white border-slate-200'}`}>
          <p className={`text-xs font-medium mb-3 ${dark?'text-slate-400':'text-slate-500'}`}>{t.myStatus}</p>

          {myWorker ? (
            <>
              {/* Текущий статус — крупный бейдж */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 w-fit ${
                isFree
                  ? (dark ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-emerald-50 border border-emerald-200')
                  : (dark ? 'bg-rose-500/10 border border-rose-500/25'       : 'bg-rose-50 border border-rose-200')
              }`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isFree ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}/>
                <span className={`text-sm font-semibold ${isFree ? (dark?'text-emerald-400':'text-emerald-600') : (dark?'text-rose-400':'text-rose-600')}`}>
                  {isFree ? t.free : t.busy}
                </span>

              </div>

              {/* Две большие кнопки */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => !isFree && handleToggle()}
                  disabled={isFree || toggling}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                    isFree
                      ? (dark ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-400 cursor-default'
                               : 'border-emerald-400 bg-emerald-50 text-emerald-600 cursor-default')
                      : (dark ? 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/5'
                               : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50')
                  }`}>
                  <ToggleRight size={22} className={isFree ? (dark?'text-emerald-400':'text-emerald-500') : ''} />
                  {t.free}
                </button>

                <button
                  onClick={() => isFree && handleToggle()}
                  disabled={!isFree || toggling}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                    !isFree
                      ? (dark ? 'border-rose-500/60 bg-rose-500/10 text-rose-400 cursor-default'
                               : 'border-rose-400 bg-rose-50 text-rose-600 cursor-default')
                      : (dark ? 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-rose-500/50 hover:text-rose-400 hover:bg-rose-500/5'
                               : 'border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50')
                  }`}>
                  <ToggleLeft size={22} className={!isFree ? (dark?'text-rose-400':'text-rose-500') : ''} />
                  {t.busy}
                </button>
              </div>
            </>
          ) : (
            // Запись мастера ещё не привязана
            <p className={`text-sm ${dark?'text-slate-500':'text-slate-400'}`}>
              Профиль мастера не найден. Попросите администратора привязать аккаунт.
            </p>
          )}
        </div>
      )}

      {/* Смена пароля */}
      <div className={`rounded-xl border p-4 ${dark?'bg-slate-900 border-slate-800':'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Key size={14} className={dark?'text-slate-400':'text-slate-500'} />
          <h2 className={`font-semibold text-sm ${dark?'text-white':'text-slate-900'}`}>{t.savePassword}</h2>
        </div>
        <div className="space-y-3">
          {[
            { key:'old',     label: t.currentPassword, ph:'••••••••' },
            { key:'newP',    label: t.newPassword,      ph:'••••••' },
            { key:'confirm', label: t.confirmPassword,  ph:'••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{f.label}</label>
              <div className="relative">
                <input type={showPw?'text':'password'} value={form[f.key]} onChange={set(f.key)} placeholder={f.ph} className={`${inputCls} pr-9`} />
                <button type="button" onClick={() => setShowPw(p=>!p)}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${dark?'text-slate-500':'text-slate-400'}`}>
                  {showPw ? <EyeOff size={13}/> : <Eye size={13}/>}
                </button>
              </div>
            </div>
          ))}
          {result && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
              result.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              {result.ok ? <Check size={12}/> : <AlertCircle size={12}/>}
              {result.msg}
            </div>
          )}
          <button onClick={handleChange} disabled={!form.old||!form.newP||!form.confirm||loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-40 transition-colors">
            <Key size={13}/> {loading ? t.wait : t.savePassword}
          </button>
        </div>
      </div>
    </div>
  );
}
