# Quiz Builder

A full-stack quiz builder application for creating, managing, and viewing quizzes.

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Frontend | React 19, Vite, MUI 9, RTK Query, React Hook Form |
| Backend  | Express 5, Prisma 7, Zod, PostgreSQL              |
| Testing  | Vitest, Supertest                                  |
| CI       | GitHub Actions                                     |

## Prerequisites

- **Node.js** >= 20
- **PostgreSQL** running locally or remotely

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/sanderalex1/quiz_builder.git
cd quiz_builder
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/quiz_builder
PORT=3000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Set up the database

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed      # optional — seeds 3 sample quizzes
```

### 4. Start development servers

Backend:

```bash
cd backend
npm run dev
```

Frontend (in a separate terminal):

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment Variables

### Backend

| Variable       | Required | Default                 | Description               |
| -------------- | -------- | ----------------------- | ------------------------- |
| `DATABASE_URL` | Yes      | —                       | PostgreSQL connection URL |
| `PORT`         | No       | `3000`                  | Server port               |
| `CORS_ORIGIN`  | No       | `http://localhost:5173` | Allowed CORS origin       |
| `NODE_ENV`     | No       | `development`           | Environment mode          |

### Frontend

| Variable       | Required | Default | Description        |
| -------------- | -------- | ------- | ------------------ |
| `VITE_API_URL` | Yes      | —       | Backend API base URL |

## Available Scripts

### Backend (`cd backend`)

| Script                 | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start dev server with hot reload   |
| `npm run build`        | Compile TypeScript to `dist/`      |
| `npm start`            | Run compiled production build      |
| `npm test`             | Run tests once                     |
| `npm run test:watch`   | Run tests in watch mode            |
| `npm run lint`         | Run ESLint                         |
| `npm run lint:fix`     | Run ESLint with auto-fix           |
| `npm run format`       | Format code with Prettier          |
| `npm run format:check` | Check formatting without changes   |

### Frontend (`cd frontend`)

| Script                 | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start Vite dev server with HMR      |
| `npm run build`        | Type-check and build for production |
| `npm run preview`      | Preview production build locally    |
| `npm run lint`         | Run ESLint                          |
| `npm run lint:fix`     | Run ESLint with auto-fix            |
| `npm run format`       | Format code with Prettier           |
| `npm run format:check` | Check formatting without changes    |

## API Endpoints

Base URL: `http://localhost:3000`

| Method   | Path                   | Description              |
| -------- | ---------------------- | ------------------------ |
| `GET`    | `/healthz`             | Health check             |
| `GET`    | `/api/v1/quizzes`      | List quizzes (paginated) |
| `GET`    | `/api/v1/quizzes/:id`  | Get a quiz by ID         |
| `POST`   | `/api/v1/quizzes`      | Create a new quiz        |
| `PATCH`  | `/api/v1/quizzes/:id`  | Update a quiz (partial)  |
| `DELETE` | `/api/v1/quizzes/:id`  | Delete a quiz            |

### Pagination

`GET /api/v1/quizzes` supports cursor-based pagination:

- `?limit=20` — Items per page (max 100, default 20)
- `?cursor=<quiz-id>` — Cursor from `nextCursor` in previous response

Response:

```json
{
  "data": [ ... ],
  "nextCursor": "uuid-or-null"
}
```

## Frontend Routes

| Path                | Page         | Description           |
| ------------------- | ------------ | --------------------- |
| `/`                 | Home         | Landing page          |
| `/quizzes`          | Quiz List    | Browse all quizzes    |
| `/quizzes/create`   | Create Quiz  | Create a new quiz     |
| `/quizzes/:id`      | Quiz Detail  | View quiz details     |
| `/quizzes/:id/edit` | Edit Quiz    | Edit an existing quiz |
| `*`                 | Not Found    | 404 page              |

## Project Structure

```
quiz_builder/
  .github/workflows/ci.yml    # CI pipeline (lint + test)
  .prettierrc                  # Shared Prettier config
  backend/
    prisma/
      schema.prisma            # Database schema with indexes
      migrations/              # Migration files
      seed.ts                  # Seed data (3 sample quizzes)
    src/
      config.ts                # Env validation (Zod)
      app.ts                   # Express app (helmet, rate limit, CORS)
      index.ts                 # Server entry point
      prisma.ts                # Prisma client instance
      controllers/             # Route handlers
      services/                # Business logic
      schemas/                 # Zod validation schemas
      middleware/              # Error handling, validation, async wrapper
      errors/                  # Custom AppError class
      generated/               # Prisma generated client (gitignored)
      __tests__/               # Integration tests (supertest)
  frontend/
    src/
      main.tsx                 # Entry point
      App.tsx                  # RouterProvider wrapper
      router.tsx               # Route definitions
      components/              # Reusable UI components
      context/                 # Theme context and provider
      hooks/                   # Custom hooks
      layouts/                 # Root layout with nav bar
      pages/                   # Route page components
      services/                # RTK Query API endpoints
      store/                   # Redux store and slices
      theme/                   # MUI theme configuration
      types/                   # TypeScript type definitions
```
