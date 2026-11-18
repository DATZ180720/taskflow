export default function Filters({ value, onChange }) {
  const update = (field) => (e) => onChange({ ...value, [field]: e.target.value });

  return (
    <div className="filters">
      <input type="search" placeholder="Search…" value={value.search} onChange={update('search')} />
      <select value={value.status} onChange={update('status')} aria-label="Status">
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="done">Done</option>
      </select>
      <select value={value.priority} onChange={update('priority')} aria-label="Priority filter">
        <option value="">Any priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
