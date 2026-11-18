import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import TaskForm from './components/TaskForm.jsx';
import Filters from './components/Filters.jsx';
import TaskList from './components/TaskList.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, done: 0, pending: 0 });
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([api.list(filters), api.stats()]);
      setTasks(list);
      setStats(s);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const run = (action) => async (...args) => {
    try {
      await action(...args);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const progress = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <main className="container">
      <header>
        <h1>TaskFlow</h1>
        <p className="muted">
          {stats.done} of {stats.total} tasks done
        </p>
        <div className="progress" aria-label={`${progress}% complete`}>
          <div style={{ width: `${progress}%` }} />
        </div>
      </header>

      <TaskForm onCreate={run(api.create)} />
      <Filters value={filters} onChange={setFilters} />

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={run((task) => api.update(task.id, { done: !task.done }))}
          onDelete={run((task) => api.remove(task.id))}
        />
      )}
    </main>
  );
}
