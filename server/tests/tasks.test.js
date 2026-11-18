import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { TaskStore } from '../src/store.js';

let app;

beforeEach(() => {
  app = createApp(new TaskStore()); // in-memory store for each test
});

test('creates a task with defaults', async () => {
  const res = await request(app).post('/api/tasks').send({ title: '  Write README  ' });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Write README');
  assert.equal(res.body.priority, 'medium');
  assert.equal(res.body.done, false);
  assert.ok(res.body.id);
});

test('rejects a task without title', async () => {
  const res = await request(app).post('/api/tasks').send({ priority: 'high' });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.errors, ['title is required']);
});

test('rejects an invalid priority', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'x', priority: 'urgent' });
  assert.equal(res.status, 400);
});

test('lists and filters tasks', async () => {
  const a = await request(app).post('/api/tasks').send({ title: 'Buy milk', priority: 'low' });
  await request(app).post('/api/tasks').send({ title: 'Deploy app', priority: 'high' });
  await request(app).patch(`/api/tasks/${a.body.id}`).send({ done: true });

  assert.equal((await request(app).get('/api/tasks')).body.length, 2);
  assert.equal((await request(app).get('/api/tasks?status=done')).body[0].title, 'Buy milk');
  assert.equal((await request(app).get('/api/tasks?priority=high')).body[0].title, 'Deploy app');
  assert.equal((await request(app).get('/api/tasks?search=deploy')).body.length, 1);
});

test('updates a task partially', async () => {
  const { body } = await request(app).post('/api/tasks').send({ title: 'Old' });
  const res = await request(app).patch(`/api/tasks/${body.id}`).send({ title: 'New', done: true });
  assert.equal(res.status, 200);
  assert.equal(res.body.title, 'New');
  assert.equal(res.body.done, true);
});

test('returns stats', async () => {
  const { body } = await request(app).post('/api/tasks').send({ title: 'One' });
  await request(app).post('/api/tasks').send({ title: 'Two' });
  await request(app).patch(`/api/tasks/${body.id}`).send({ done: true });
  const res = await request(app).get('/api/tasks/stats');
  assert.deepEqual(res.body, { total: 2, done: 1, pending: 1 });
});

test('deletes a task and returns 404 afterwards', async () => {
  const { body } = await request(app).post('/api/tasks').send({ title: 'Temp' });
  assert.equal((await request(app).delete(`/api/tasks/${body.id}`)).status, 204);
  assert.equal((await request(app).get(`/api/tasks/${body.id}`)).status, 404);
});
