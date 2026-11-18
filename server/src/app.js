import express from 'express';
import cors from 'cors';
import { validateTask } from './validate.js';

export function createApp(store) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/tasks', (req, res) => {
    const { status, priority, search } = req.query;
    res.json(store.list({ status, priority, search }));
  });

  app.get('/api/tasks/stats', (_req, res) => res.json(store.stats()));

  app.get('/api/tasks/:id', (req, res) => {
    const task = store.get(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  });

  app.post('/api/tasks', async (req, res, next) => {
    try {
      const { value, errors } = validateTask(req.body ?? {});
      if (errors.length) return res.status(400).json({ errors });
      res.status(201).json(await store.create(value));
    } catch (err) {
      next(err);
    }
  });

  app.patch('/api/tasks/:id', async (req, res, next) => {
    try {
      const { value, errors } = validateTask(req.body ?? {}, { partial: true });
      if (errors.length) return res.status(400).json({ errors });
      const task = await store.update(req.params.id, value);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/api/tasks/:id', async (req, res, next) => {
    try {
      const removed = await store.remove(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Task not found' });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
