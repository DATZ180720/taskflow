# TaskFlow

A full-stack task manager built with **React** (Vite) and a **Node.js / Express** REST API.

## Features

- Create, complete, and delete tasks
- Priorities (low / medium / high) and due dates, with overdue highlighting
- Filter by status and priority, plus text search (handled server-side)
- Progress bar with live stats
- Input validation with clear error messages
- JSON file persistence behind a small repository class (easy to swap for a real database)
- API tests with `node:test` and Supertest

## Tech stack

| Layer   | Tools                         |
|---------|-------------------------------|
| Client  | React 18, Vite, plain CSS     |
| Server  | Node.js 20+, Express          |
| Testing | node:test, Supertest          |

## Project structure

```
taskflow/
├── client/            # React app
│   └── src/
│       ├── api.js     # fetch wrapper for the REST API
│       ├── App.jsx
│       └── components/
└── server/            # Express API
    ├── src/
    │   ├── app.js       # routes (exported for testing)
    │   ├── store.js     # task repository
    │   ├── validate.js  # payload validation
    │   └── index.js     # entry point
    └── tests/
```

## Getting started

```bash
# 1. API (http://localhost:4000)
cd server
npm install
npm run dev

# 2. Client (http://localhost:5173), in another terminal
cd client
npm install
npm run dev
```

Run the API tests:

```bash
cd server
npm test
```

## API

| Method | Endpoint            | Description                                      |
|--------|---------------------|--------------------------------------------------|
| GET    | `/api/tasks`        | List tasks. Query: `status`, `priority`, `search` |
| GET    | `/api/tasks/stats`  | Totals of done / pending tasks                   |
| GET    | `/api/tasks/:id`    | Get one task                                     |
| POST   | `/api/tasks`        | Create a task                                    |
| PATCH  | `/api/tasks/:id`    | Update any field                                 |
| DELETE | `/api/tasks/:id`    | Delete a task                                    |

Example:

```bash
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Ship v1", "priority": "high", "dueDate": "2026-12-01"}'
```

## Possible improvements

- Replace the JSON store with PostgreSQL
- User accounts and authentication
- Drag-and-drop ordering
