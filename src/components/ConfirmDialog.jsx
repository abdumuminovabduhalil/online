// Красивый confirm диалог вместо window.confirm
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ConfirmDialog({ title, subtitle, onConfirm, onCancel }) {
  const { theme, t } = useApp();
  const dark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
         onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        {/* Icon */}
        <div className="flex flex-col items-center pt-6 pb-4 px-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-rose-400" />
          </div>
          <h3 className={`font-bold text-base text-center mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          {subtitle && <p className={`text-sm text-center ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
        </div>
        {/* Buttons */}
        <div className={`flex gap-2 px-4 pb-5`}>
          <button onClick={onCancel}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {t.no}
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors">
            {t.yes}
          </button>
        </div>
      </div>
    </div>
  );
}
