import { useState, useEffect, useCallback } from 'react';
import { workerAPI } from '../api/workers';

export function useWorkers() {
  const [workers, setWorkers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workerAPI.getAll();
      setWorkers(data);
    } catch {
      setError('Не удалось загрузить данные. Убедитесь что json-server запущен.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addWorker = async (data) => {
    const created = await workerAPI.create({ ...data, status: 'free' });
    setWorkers(prev => [...prev, created]);
    return created;
  };

  const updateWorker = async (id, data) => {
    const updated = await workerAPI.update(id, data);
    setWorkers(prev => prev.map(w => w.id === id ? updated : w));
    return updated;
  };

  const toggleStatus = async (id, current) => {
    const next = current === 'free' ? 'busy' : 'free';
    return updateWorker(id, { status: next });
  };

  const deleteWorker = async (id) => {
    await workerAPI.remove(id);
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  return { workers, loading, error, load, addWorker, updateWorker, toggleStatus, deleteWorker };
}
