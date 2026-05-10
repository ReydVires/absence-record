# Absence Record - Fullstack Monorepo

Welcome to the Absence Record project! This is a production-grade, decoupled fullstack application built with **NestJS** (Backend), **Vite + React** (Frontend), and **Drizzle ORM** (Database).

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** (v18+)
- **pnpm** (Recommended monorepo manager)
- **Docker Desktop** (For the PostgreSQL database)

### 2. Setup

Clone the repository and install dependencies:

```bash
pnpm install
```

### 3. Environment Configuration

The project is already pre-configured with `.env` files in:

- Root: `.env`
- `apps/api/.env`
- `apps/web/.env`

### 4. Start the Database

Ensure Docker is running, then start the PostgreSQL container:

```bash
docker compose up -d postgres
```

### 5. Run the Application

Start both the API and the Web app in parallel:

```bash
pnpm dev
```

- **Web App**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:3000](http://localhost:3000)

---

## 🏗 Architecture Walkthrough (For React Engineers)

As a React developer, you can think of the backend architecture in terms of **"Vertical Slicing"**—just like how you organize your React components by feature.

### 1. The Shared Package (`/packages/shared`)

This is the "Source of Truth". We use **Zod** to define schemas.

- **Why?** One schema generates both the **Validation Logic** for the API and the **TypeScript Types** for the Frontend.
- If you change a field here, both the API and the Frontend will immediately show type errors until they are updated.

### 2. The Backend (`/apps/api`)

NestJS might look intimidating with its decorators, but here is how it maps to React concepts:

- **Modules** (e.g., `attendance.module.ts`): Think of these as a **Context Provider**. It bundles everything related to a feature together so other parts of the app can use it.
- **Controllers** (e.g., `attendance.controller.ts`): These are your **API Routes**. They define the URLs (`/attendance`) and which HTTP methods (`GET`, `POST`) are allowed.
- **Services** (e.g., `attendance.service.ts`): This is where the **Business Logic** lives. If you need to calculate something or check permissions, do it here. It's like a custom hook that holds logic but no UI.
- **Repositories** (e.g., `attendance.repository.ts`): These handle **Data Access**. They talk to the database using Drizzle. Think of this as the logic inside an `api.ts` file in React, but for the database.

### 3. The Frontend (`/apps/web`)

We use a modern React stack:

- **TanStack Query**: For server state management (caching, loading states).
- **Path Aliases**: Use `@/` to point to `src/` and `@shared/` to point to the shared package.
- **Feature Folders**: Each domain (like `attendance`) has its own `components/`, `hooks/`, and `api.ts`.

---

## 🛠 Useful Commands

| Command          | Description                                             |
| :--------------- | :------------------------------------------------------ |
| `pnpm dev`       | Starts API and Web apps in parallel with hot-reload.    |
| `pnpm db:push`   | Syncs your Drizzle schema to the actual database.       |
| `pnpm db:studio` | Opens a GUI in your browser to view/edit database data. |
| `pnpm build`     | Builds all packages for production.                     |

## 📝 Extending the Project

To add a new feature (e.g., `users`):

1. Add the Zod schema in `packages/shared/src/schemas/users.ts`.
2. Create a new folder `apps/api/src/features/users` and implement the Module, Controller, Service, and Repository.
3. Create a new folder `apps/web/src/features/users` for your React components and hooks.
