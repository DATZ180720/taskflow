import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { TaskStore } from './store.js';

const PORT = process.env.PORT ?? 4000;
const DATA_FILE = process.env.DATA_FILE ?? fileURLToPath(new URL('../data/tasks.json', import.meta.url));

const store = new TaskStore(DATA_FILE);
await store.load();

createApp(store).listen(PORT, () => {
  console.log(`TaskFlow API running on http://localhost:${PORT}`);
});
