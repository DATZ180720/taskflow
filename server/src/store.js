import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

/**
 * Simple task repository. Keeps tasks in memory and, when a file path
 * is given, persists them as JSON after every change.
 */
export class TaskStore {
  constructor(filePath = null) {
    this.filePath = filePath;
    this.tasks = [];
  }

  async load() {
    if (!this.filePath) return;
    try {
      this.tasks = JSON.parse(await readFile(this.filePath, 'utf8'));
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      this.tasks = [];
    }
  }

  async #save() {
    if (!this.filePath) return;
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(this.tasks, null, 2));
  }

  list({ status, priority, search } = {}) {
    return this.tasks.filter((t) => {
      if (status === 'done' && !t.done) return false;
      if (status === 'pending' && t.done) return false;
      if (priority && t.priority !== priority) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  get(id) {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  async create({ title, description = '', priority = 'medium', dueDate = null }) {
    const now = new Date().toISOString();
    const task = { id: randomUUID(), title, description, priority, dueDate, done: false, createdAt: now, updatedAt: now };
    this.tasks.push(task);
    await this.#save();
    return task;
  }

  async update(id, changes) {
    const task = this.get(id);
    if (!task) return null;
    Object.assign(task, changes, { updatedAt: new Date().toISOString() });
    await this.#save();
    return task;
  }

  async remove(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    await this.#save();
    return true;
  }

  stats() {
    const done = this.tasks.filter((t) => t.done).length;
    return { total: this.tasks.length, done, pending: this.tasks.length - done };
  }
}
