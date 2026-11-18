function isOverdue(task) {
  if (!task.dueDate || task.done) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) return <p className="muted empty">No tasks here yet.</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`card task ${task.done ? 'done' : ''}`}>
          <input type="checkbox" checked={task.done} onChange={() => onToggle(task)} aria-label={`Mark ${task.title} as done`} />
          <div className="task-body">
            <span className="title">{task.title}</span>
            <span className="meta">
              <span className={`badge ${task.priority}`}>{task.priority}</span>
              {task.dueDate && (
                <span className={isOverdue(task) ? 'overdue' : ''}>
                  Due {new Date(task.dueDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
                </span>
              )}
            </span>
          </div>
          <button className="icon" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
