import { useState, useMemo } from 'react';
import { Search, Users, CheckCircle, Clock, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WorkerCard from '../components/WorkerCard';
import WorkerModal from '../components/WorkerModal';

export default function HomePage() {
  const { workers, session, theme, t, loading } = useApp();
  const dark = theme === 'dark';
  const isAdmin = session?.role === 'admin';

  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [editWorker, setEditWorker] = useState(null);

  const free = workers.filter(w => w.status === 'free').length;
  const busy = workers.length - free;

  const filtered = useMemo(() => workers.filter(w => {
    const q = search.toLowerCase();
    const matchQ = !q || w.name.toLowerCase().includes(q) || w.role.toLowerCase().includes(q);
    const matchF = filter === 'all' || w.status === filter;
    return matchQ && matchF;
  }), [workers, search, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <div className="mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-1.5 ${dark?'text-white':'text-slate-900'}`}>
          {t.workers}
        </h1>
        <p className={`text-sm ${dark?'text-slate-400':'text-slate-500'}`}>
          {t.search}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: t.totalWorkers, value: workers.length, icon: Users,       color: 'blue' },
          { label: t.freeWorkers,  value: free,           icon: CheckCircle, color: 'emerald' },
          { label: t.busyWorkers,  value: busy,           icon: Clock,       color: 'rose' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 sm:p-4 ${dark?'bg-slate-900 border-slate-800':'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <s.icon size={15} className={`text-${s.color}-400`} />
            </div>
            <div className={`text-2xl font-bold ${dark?'text-white':'text-slate-900'}`}>{s.value}</div>
            <div className={`text-xs mt-0.5 ${dark?'text-slate-500':'text-slate-400'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark?'text-slate-500':'text-slate-400'}`} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t.search}
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${dark?'bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-slate-600':'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300'} focus:ring-2 focus:ring-blue-500/10`} />
        </div>
        <div className="flex gap-2">
          {[
            { key:'all',  label: t.all },
            { key:'free', label: t.free },
            { key:'busy', label: t.busy },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === f.key
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : (dark ? 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700')
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className={`text-center py-20 ${dark?'text-slate-500':'text-slate-400'}`}>
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3"/>
          <p className="text-sm">{t.loading}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`text-center py-20 ${dark?'text-slate-600':'text-slate-400'}`}>
          <Filter size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">{t.notFound}</p>
          <p className="text-sm mt-1">{t.changeFilters}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(worker => (
            <WorkerCard key={worker.id} worker={worker} isAdmin={isAdmin} onEdit={setEditWorker} />
          ))}
        </div>
      )}

      {editWorker && <WorkerModal worker={editWorker} onClose={() => setEditWorker(null)} />}
    </div>
  );
}
