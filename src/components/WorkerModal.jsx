import { useState } from 'react';
import { X, Save, User, Phone, Briefcase, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WorkerModal({ worker, onClose }) {
  const { updateWorker, theme, t } = useApp();
  const dark = theme === 'dark';

  const [form, setForm] = useState({
    name:     worker?.name     || '',
    role:     worker?.role     || '',
    phone:    worker?.phone    || '',
    telegram: worker?.telegram || '',
  });
  const [saving, setSaving] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // Phone: only digits + auto leading +
  const handlePhone = (e) => {
    let val = e.target.value;
    // Allow only digits and + at start
    val = val.replace(/[^\d+]/g, '');
    // Ensure starts with +
    if (val && !val.startsWith('+')) val = '+' + val;
    // Only one + allowed at start
    val = '+' + val.replace(/\+/g, '');
    setForm(p => ({ ...p, phone: val }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role.trim() || !form.phone.trim()) return;
    setSaving(true);
    await updateWorker(worker.id, form);
    setSaving(false);
    onClose();
  };

  const inputCls = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/15 ${
    dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl ${dark?'bg-slate-900 border-slate-700':'bg-white border-slate-200'}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark?'border-slate-800':'border-slate-100'}`}>
          <h2 className={`font-semibold text-sm ${dark?'text-white':'text-slate-900'}`}>{t.editWorker}</h2>
          <button onClick={onClose} className={`w-7 h-7 rounded-lg flex items-center justify-center ${dark?'text-slate-500 hover:text-white hover:bg-slate-800':'text-slate-400 hover:text-slate-700 hover:bg-slate-100'} transition-colors`}>
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{t.name}</label>
            <div className="relative">
              <User size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark?'text-slate-500':'text-slate-400'}`} />
              <input value={form.name} onChange={set('name')} placeholder="Иван Иванов" className={`${inputCls} pl-8`} />
            </div>
          </div>
          {/* Spec */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{t.spec}</label>
            <div className="relative">
              <Briefcase size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark?'text-slate-500':'text-slate-400'}`} />
              <input value={form.role} onChange={set('role')} placeholder="Моторист, Электрик..." className={`${inputCls} pl-8`} />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{t.phone}</label>
            <div className="relative">
              <Phone size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark?'text-slate-500':'text-slate-400'}`} />
              <input
                value={form.phone}
                onChange={handlePhone}
                onFocus={e => { if (!e.target.value) setForm(p => ({...p, phone: '+'})); }}
                placeholder="+998 90 123 45 67"
                inputMode="tel"
                className={`${inputCls} pl-8`}
              />
            </div>
          </div>
          {/* Telegram */}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dark?'text-slate-400':'text-slate-600'}`}>{t.telegram}</label>
            <div className="relative">
              <MessageCircle size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark?'text-slate-500':'text-slate-400'}`} />
              <input value={form.telegram} onChange={set('telegram')} placeholder="username" className={`${inputCls} pl-8`} />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={saving || !form.name || !form.role || !form.phone}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
              <Save size={13} />
              {saving ? t.saving : t.save}
            </button>
            <button onClick={onClose} className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${dark?'border-slate-700 text-slate-400 hover:bg-slate-800':'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
