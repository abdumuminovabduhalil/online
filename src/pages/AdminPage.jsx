import { useState } from 'react';
import { UserPlus, Users, Key, Trash2, ToggleLeft, ToggleRight, Shield, User, Save, Check, Pencil, Star, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WorkerModal from '../components/WorkerModal';
import ConfirmDialog from '../components/ConfirmDialog';

// ── Phone helper ──────────────────────────────────────────────
function usePhone(initial = '') {
  const [phone, setPhone] = useState(initial);
  const handlePhone = (e) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (val && !val.startsWith('+')) val = '+' + val;
    val = '+' + val.replace(/\+/g, '');
    setPhone(val);
  };
  return [phone, handlePhone, setPhone];
}

// ── Add Worker Form ───────────────────────────────────────────
function AddWorkerForm({ dark }) {
  const { addWorker, register, t } = useApp();
  const [form, setForm] = useState({ name:'', role:'', telegram:'' });
  const [phone, handlePhone, setPhone] = usePhone('');
  const [saved, setSaved] = useState(false);
  const [showCreds, setShowCreds] = useState(false);
  const [creds, setCreds] = useState({ username:'', password:'' });

  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const setCred = k => e => setCreds(p => ({...p,[k]:e.target.value}));

  const handleAdd = async () => {
    if (!form.name.trim() || !form.role.trim() || !phone.trim()) return;
    // If creds provided — create account too
    if (showCreds && creds.username && creds.password) {
      await register(creds.username, creds.password, form.name);
    }
    await addWorker({ ...form, phone });
    setForm({ name:'', role:'', telegram:'' });
    setPhone('');
    setCreds({ username:'', password:'' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/10 ${dark?'bg-slate-800/60 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500':'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400'}`;

  return (
    <div className={`rounded-xl border p-4 ${dark?'bg-slate-900 border-slate-800':'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark?'bg-blue-500/15':'bg-blue-50'}`}>
          <UserPlus size={13} className="text-blue-400" />
        </div>
        <h3 className={`font-semibold text-sm ${dark?'text-white':'text-slate-900'}`}>{t.addWorker}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.name}</label>
          <input value={form.name} onChange={set('name')} placeholder="Иван Иванов" className={inputCls} />
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.spec}</label>
          <input value={form.role} onChange={set('role')} placeholder="Моторист" className={inputCls} />
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.phone}</label>
          <input
            value={phone}
            onChange={handlePhone}
            onFocus={e => { if (!e.target.value) setPhone('+'); }}
            placeholder="+998 90 123 45 67"
            inputMode="tel"
            className={inputCls}
          />
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.telegram}</label>
          <input value={form.telegram} onChange={set('telegram')} placeholder="username" className={inputCls} />
        </div>
      </div>

      {/* Optional account creation */}
      <button
        onClick={() => setShowCreds(s => !s)}
        className={`flex items-center gap-2 text-xs font-medium mb-3 transition-colors ${dark?'text-slate-400 hover:text-slate-200':'text-slate-500 hover:text-slate-700'}`}>
        <Lock size={11} />
        {t.createAccount}
        {showCreds ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
      </button>

      {showCreds && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 p-3 rounded-lg border border-dashed border-slate-600/40">
          <div>
            <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.masterLogin}</label>
            <input value={creds.username} onChange={setCred('username')} placeholder="login123" className={inputCls} />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.masterPassword}</label>
            <input type="password" value={creds.password} onChange={setCred('password')} placeholder="••••••" className={inputCls} />
          </div>
        </div>
      )}

      <button onClick={handleAdd} disabled={!form.name||!form.role||!phone}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 ${saved?'bg-emerald-600 text-white':'bg-blue-600 hover:bg-blue-500 text-white'}`}>
        {saved ? <><Check size={13}/> {t.added}</> : <><UserPlus size={13}/> {t.add}</>}
      </button>
    </div>
  );
}

// ── Workers Table ─────────────────────────────────────────────
function WorkersTable({ dark }) {
  const { workers, toggleWorkerStatus, deleteWorker, t } = useApp();
  const [editTarget, setEditTarget] = useState(null);
  const [confirmId, setConfirmId]   = useState(null);

  return (
    <div className={`rounded-xl border ${dark?'bg-slate-900 border-slate-800':'bg-white border-slate-200'}`}>
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${dark?'border-slate-800':'border-slate-100'}`}>
        <Users size={14} className={dark?'text-slate-400':'text-slate-500'} />
        <h3 className={`font-semibold text-sm ${dark?'text-white':'text-slate-900'}`}>{t.workerList}</h3>
        <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-full ${dark?'bg-slate-800 text-slate-400':'bg-slate-100 text-slate-500'}`}>{workers.length}</span>
      </div>
      <div className="divide-y divide-slate-800/50">
        {workers.map(w => (
          <div key={w.id} className={`flex items-center gap-3 px-4 py-3 transition-colors ${dark?'hover:bg-slate-800/40':'hover:bg-slate-50'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${dark?'bg-slate-800 text-slate-300':'bg-slate-100 text-slate-600'}`}>
              {w.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm truncate ${dark?'text-white':'text-slate-900'}`}>{w.name}</div>
              <div className={`text-xs truncate ${dark?'text-blue-400':'text-blue-500'}`}>{w.role}</div>
            </div>
            <div className={`hidden sm:flex items-center gap-[5px] px-2 py-1 rounded-lg text-[11px] font-semibold flex-shrink-0 whitespace-nowrap ${w.status==='free'?(dark?'bg-emerald-500/10 text-emerald-400':'bg-emerald-50 text-emerald-600'):(dark?'bg-rose-500/10 text-rose-400':'bg-rose-50 text-rose-600')}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${w.status==='free'?'bg-emerald-400 animate-pulse':'bg-rose-400'}`}/>
              {w.status==='free'? t.free : t.busy}
            </div>
            <div className="flex items-center gap-[6px] flex-shrink-0">
              <button onClick={() => setEditTarget(w)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${dark?'hover:bg-slate-700 text-slate-500 hover:text-slate-300':'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}>
                <Pencil size={12}/>
              </button>
              <button onClick={() => toggleWorkerStatus(w.id)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${w.status==='free'?'text-amber-400 hover:bg-amber-500/10':'text-emerald-400 hover:bg-emerald-500/10'}`}>
                {w.status==='free'?<ToggleRight size={13}/>:<ToggleLeft size={13}/>}
              </button>
              <button onClick={() => setConfirmId(w.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-500/10 transition-colors">
                <Trash2 size={12}/>
              </button>
            </div>
          </div>
        ))}
        {workers.length === 0 && (
          <div className={`text-center py-12 text-sm ${dark?'text-slate-600':'text-slate-400'}`}>{t.noWorkers}</div>
        )}
      </div>
      {editTarget && <WorkerModal worker={editTarget} onClose={() => setEditTarget(null)} />}
      {confirmId && (
        <ConfirmDialog
          title={t.deleteWorkerConfirm}
          subtitle={`${workers.find(w=>w.id===confirmId)?.name} · ${t.deleteWorkerSub}`}
          onConfirm={() => { deleteWorker(confirmId); setConfirmId(null); }}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}

// ── Users Table ───────────────────────────────────────────────
function UsersTable({ dark }) {
  const { users, adminUpdateUser, adminDeleteUser, promoteUserToWorker, session, t } = useApp();
  const [editId, setEditId]   = useState(null);
  const [editData, setEditData] = useState({});
  const [confirmId, setConfirmId] = useState(null);
  // promote modal
  const [promoteId, setPromoteId] = useState(null);
  const [promoteForm, setPromoteForm] = useState({ name:'', role:'', telegram:'' });
  const [promotePhone, handlePromotePhone, setPromotePhone] = usePhone('');

  const startEdit = (u) => { setEditId(u.id); setEditData({ role: u.role, displayName: u.displayName, password: '' }); };
  const saveEdit  = () => {
    const patch = { role: editData.role, displayName: editData.displayName };
    if (editData.password.length >= 6) patch.password = editData.password;
    adminUpdateUser(editId, patch);
    setEditId(null);
  };

  const handlePromote = async () => {
    const u = users.find(x => x.id === promoteId);
    if (!u || !promoteForm.name || !promoteForm.role || !promotePhone) return;
    // Создаёт worker-запись и сохраняет workerId прямо в user → надёжная связь
    await promoteUserToWorker(promoteId, { ...promoteForm, phone: promotePhone });
    setPromoteId(null);
    setPromoteForm({ name:'', role:'', telegram:'' });
    setPromotePhone('');
  };

  const inputCls = `px-2.5 py-1.5 rounded-lg border text-xs outline-none ${dark?'bg-slate-800 border-slate-700 text-white':'bg-white border-slate-200 text-slate-900'}`;

  return (
    <div className={`rounded-xl border ${dark?'bg-slate-900 border-slate-800':'bg-white border-slate-200'}`}>
      <div className={`flex items-center gap-2 px-4 py-3 border-b ${dark?'border-slate-800':'border-slate-100'}`}>
        <Shield size={14} className="text-amber-400" />
        <h3 className={`font-semibold text-sm ${dark?'text-white':'text-slate-900'}`}>{t.userList}</h3>
        <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-full ${dark?'bg-slate-800 text-slate-400':'bg-slate-100 text-slate-500'}`}>{users.length}</span>
      </div>
      <div className="divide-y divide-slate-800/30">
        {users.map(u => (
          <div key={u.id} className={`px-4 py-3 ${dark?'hover:bg-slate-800/30':'hover:bg-slate-50'} transition-colors`}>
            {editId === u.id ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={editData.displayName} onChange={e=>setEditData(p=>({...p,displayName:e.target.value}))} placeholder="Отображаемое имя"
                    className={`${inputCls} col-span-2`} />
                  <select value={editData.role} onChange={e=>setEditData(p=>({...p,role:e.target.value}))}
                    className={inputCls}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="worker">worker</option>
                  </select>
                  <input type="password" value={editData.password} onChange={e=>setEditData(p=>({...p,password:e.target.value}))} placeholder="Новый пароль (мин. 6)"
                    className={inputCls} />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"><Save size={11}/> {t.save}</button>
                  <button onClick={() => setEditId(null)} className={`px-3 py-1.5 rounded-lg border text-xs ${dark?'border-slate-700 text-slate-400':'border-slate-200 text-slate-500'}`}>{t.cancel}</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${u.role==='admin'?'bg-amber-500/15 text-amber-400':u.role==='worker'?'bg-emerald-500/15 text-emerald-400':'bg-blue-500/15 text-blue-400'}`}>
                  {u.role==='admin'?<Shield size={12}/>:u.role==='worker'?<Star size={12}/>:<User size={12}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-sm ${dark?'text-white':'text-slate-900'}`}>{u.displayName}</div>
                  <div className={`text-xs ${dark?'text-slate-500':'text-slate-400'}`}>@{u.username} · <span className={u.role==='admin'?'text-amber-400':u.role==='worker'?'text-emerald-400':'text-blue-400'}>{u.role}</span></div>
                </div>
                {u.id === session.id && <span className="text-[10px] text-slate-500 hidden sm:block">{t.you}</span>}
                <div className="flex items-center gap-[6px]">
                  {/* Promote to master if plain user */}
                  {u.role === 'user' && (
                    <button onClick={() => setPromoteId(u.id)} title={t.makeMaster}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${dark?'hover:bg-emerald-500/20 text-emerald-500/60 hover:text-emerald-400':'hover:bg-emerald-50 text-emerald-400'}`}>
                      <Star size={12}/>
                    </button>
                  )}
                  <button onClick={() => startEdit(u)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${dark?'hover:bg-slate-700 text-slate-500 hover:text-slate-300':'hover:bg-slate-100 text-slate-400'}`}>
                    <Key size={12}/>
                  </button>
                  {u.id !== session.id && (
                    <button onClick={() => setConfirmId(u.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-500/10 transition-colors">
                      <Trash2 size={12}/>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm delete user */}
      {confirmId && (
        <ConfirmDialog
          title={t.deleteUserConfirm}
          subtitle={`@${users.find(u=>u.id===confirmId)?.username}`}
          onConfirm={() => { adminDeleteUser(confirmId); setConfirmId(null); }}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Promote to master modal */}
      {promoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
             onClick={e => e.target===e.currentTarget && setPromoteId(null)}>
          <div className={`w-full max-w-sm rounded-2xl border shadow-2xl ${dark?'bg-slate-900 border-slate-700':'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${dark?'border-slate-800':'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Star size={14} className="text-emerald-400"/>
                <h2 className={`font-semibold text-sm ${dark?'text-white':'text-slate-900'}`}>{t.makeMaster}</h2>
              </div>
              <button onClick={() => setPromoteId(null)} className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark?'text-slate-500 hover:text-white hover:bg-slate-800':'text-slate-400 hover:text-slate-700 hover:bg-slate-100'} transition-colors`}>✕</button>
            </div>
            <div className="p-5 space-y-3">
              {(() => {
                const u = users.find(x=>x.id===promoteId);
                return <p className={`text-xs ${dark?'text-slate-400':'text-slate-500'}`}>@{u?.username} → {t.makeMaster}</p>;
              })()}
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.name}</label>
                  <input value={promoteForm.name} onChange={e=>setPromoteForm(p=>({...p,name:e.target.value}))} className={`w-full ${inputCls}`} placeholder="Полное имя"/>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.spec}</label>
                  <input value={promoteForm.role} onChange={e=>setPromoteForm(p=>({...p,role:e.target.value}))} className={`w-full ${inputCls}`} placeholder="Моторист"/>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.telegram}</label>
                  <input value={promoteForm.telegram} onChange={e=>setPromoteForm(p=>({...p,telegram:e.target.value}))} className={`w-full ${inputCls}`} placeholder="username"/>
                </div>
                <div className="col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${dark?'text-slate-400':'text-slate-500'}`}>{t.phone}</label>
                  <input
                    value={promotePhone}
                    onChange={handlePromotePhone}
                    onFocus={e => { if (!e.target.value) setPromotePhone('+'); }}
                    inputMode="tel"
                    placeholder="+998 90 123 45 67"
                    className={`w-full ${inputCls}`}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={handlePromote} disabled={!promoteForm.name||!promoteForm.role||!promotePhone}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold disabled:opacity-40 transition-colors">
                  {t.makeMaster}
                </button>
                <button onClick={() => setPromoteId(null)} className={`px-4 py-2.5 rounded-xl border text-sm ${dark?'border-slate-700 text-slate-400':'border-slate-200 text-slate-500'}`}>{t.cancel}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { theme, t } = useApp();
  const dark = theme === 'dark';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-1 ${dark?'text-white':'text-slate-900'}`}>{t.adminPanel}</h1>
        <p className={`text-sm ${dark?'text-slate-400':'text-slate-500'}`}>{t.adminSub}</p>
      </div>

      <div className="space-y-5">
        <AddWorkerForm dark={dark} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <WorkersTable dark={dark} />
          <UsersTable dark={dark} />
        </div>
      </div>
    </div>
  );
}
