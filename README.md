# Absence Record - Fullstack Monorepo

Welcome to the Absence Record project! This is a production-grade, decoupled fullstack application built with **NestJS** (Backend), **Vite + React** (Frontend), and **PostgreSQL** (Database).

## 🚀 Quick Start

Follow these steps to get the project running locally on your machine.

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **pnpm** (Recommended monorepo manager: `npm install -g pnpm`)
- **Docker Desktop** (For running the PostgreSQL database)

### 2. Installation

Clone the repository and install all dependencies from the root:

```bash
pnpm install
```

### 3. Environment Configuration

Copy the example environment file to the root and app directories. The project is pre-configured to work with the default Docker settings.

```bash
# Root environment (Database and Shared config)
cp .env.example .env
```

*Note: Ensure `apps/api/.env` and `apps/web/.env` are also set up if you need to override defaults.*

### 4. Database Setup

We use Docker to run PostgreSQL.

1. **Initialize the Schema**:
   Run the following command to create the necessary tables:

   ```bash
   pnpm db:init
   ```

2. **Seed the Database**:
   Create an initial admin user (`admin@admin.com` / `password123`):

   ```bash
   pnpm db:seed
   ```

### 5. Run the Application

Start both the API and the Web app in development mode:

```bash
pnpm dev
```

- **Web App**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:3000](http://localhost:3000)

---

## 🏗 Architecture Walkthrough

This project uses a **Feature-based Monorepo** structure, making it highly scalable and easy to maintain.

### 1. The Shared Package (`/packages/shared`)

The "Source of Truth" for the entire app. It contains:

- **Zod Schemas**: Defined once, used by the API for validation and the Frontend for type safety.
- **TypeScript Types**: Automatically inferred from schemas.

### 2. The Backend (`/apps/api`)

Built with NestJS and raw `pg` for high performance and full control over SQL queries.

- **Vertical Slicing**: Code is organized by feature (e.g., `auth`, `attendance`).
- **Repositories**: Dedicated layer for database interactions, keeping services clean.

### 3. The Frontend (`/apps/web`)

A modern React application using:

- **TanStack Query**: For efficient data fetching and caching.
- **Shadcn UI**: For a premium, accessible design system.

---

## 🛠 Useful Commands

| Command        | Description                                           |
| :------------- | :---------------------------------------------------- |
| `pnpm dev`     | Starts API and Web apps in parallel.                  |
| `pnpm db:init` | Executes `schema.sql` to set up database tables.      |
| `pnpm db:seed` | Adds initial seed data to the database.               |
| `pnpm build`   | Builds all packages for production.                   |
| `pnpm format`  | Formats the entire codebase using Prettier.           |

## 📝 Extending the Project

To add a new feature:

1. **Define the Schema**: Add a new Zod schema in `packages/shared/src/schemas/`.
2. **Update the DB**: Add the table definition to `schema.sql`.
3. **Backend**: Create a new feature folder in `apps/api/src/features/`.
4. **Frontend**: Implement the feature logic and UI in `apps/web/src/features/`.
