import { useState } from 'react';

const EMPTY = { title: '', priority: 'medium', dueDate: '' };

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(EMPTY);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await onCreate({ ...form, dueDate: form.dueDate || null });
    setForm(EMPTY);
  };

  return (
    <form className="card task-form" onSubmit={submit}>
      <input placeholder="What needs to be done?" value={form.title} onChange={update('title')} maxLength={120} required />
      <select value={form.priority} onChange={update('priority')} aria-label="Priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input type="date" value={form.dueDate} onChange={update('dueDate')} aria-label="Due date" />
      <button type="submit">Add</button>
    </form>
  );
}
