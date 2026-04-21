import { Phone, MessageCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ConfirmDialog from './ConfirmDialog';

export default function WorkerCard({ worker, isAdmin, onEdit }) {
  const { toggleWorkerStatus, deleteWorker, theme, t } = useApp();
  const dark = theme === 'dark';
  const isFree = worker.status === 'free';
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className={`rounded-xl border transition-all duration-200 group ${
        dark
          ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}>
        {/* Status bar top */}
        <div className={`h-0.5 rounded-t-xl ${isFree ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        <div className="p-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {worker.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`font-semibold text-sm truncate ${dark?'text-white':'text-slate-900'}`}>
                  {worker.name}
                </h3>
                <p className={`text-xs truncate mt-0.5 ${dark?'text-blue-400':'text-blue-600'}`}>
                  {worker.role}
                </p>
              </div>
            </div>

            {/* Status badge — fixed width, never overflows */}
            <div className={`flex-shrink-0 flex items-center gap-[5px] px-2 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
              isFree
                ? (dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
                : (dark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600 border border-rose-100')
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isFree ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              {isFree ? t.free : t.busy}
            </div>
          </div>

          {/* Phone */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg mb-3 text-xs font-mono ${dark?'bg-slate-800/60 text-slate-400':'bg-slate-50 text-slate-500'}`}>
            <Phone size={11} className="flex-shrink-0" />
            <span className="truncate">{worker.phone}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <a href={`tel:${worker.phone}`}
              className={`flex-1 flex items-center justify-center gap-[6px] py-2 rounded-lg text-xs font-semibold transition-colors ${
                dark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}>
              <Phone size={12} /> {t.call}
            </a>
            <a href={`https://t.me/${worker.telegram || worker.phone.replace(/\D/g,'')}`}
               target="_blank" rel="noreferrer"
               title={t.telegram_tooltip}
               className="relative flex items-center justify-center gap-[6px] px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 transition-colors group/tg">
              <MessageCircle size={12} />
              {/* Tooltip */}
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-white whitespace-nowrap opacity-0 group-hover/tg:opacity-100 transition-opacity shadow-lg z-10">
                {t.telegram_tooltip}
              </span>
            </a>

            {isAdmin && (
              <>
                <button onClick={() => onEdit(worker)} title="Редактировать"
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${dark?'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200':'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700'}`}>
                  <Pencil size={12} />
                </button>
                <button onClick={() => toggleWorkerStatus(worker.id)} title="Переключить статус"
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                    isFree
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                  }`}>
                  {isFree ? <ToggleRight size={13}/> : <ToggleLeft size={13}/>}
                </button>
                <button onClick={() => setConfirmDelete(true)} title="Удалить"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title={t.deleteWorkerConfirm}
          subtitle={`${worker.name} · ${t.deleteWorkerSub}`}
          onConfirm={() => { deleteWorker(worker.id); setConfirmDelete(false); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
