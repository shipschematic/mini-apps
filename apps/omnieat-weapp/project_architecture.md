# Dapoer Recipe App: Fullstack Architecture Guide

This document defines the production-ready folder structure, stack specifications, and connectivity details for both the **Taro H5/Mini-Program Frontend** and the **Next.js Fullstack Backend**.

---

## 📂 1. Recommended Monorepo Folder Structure

For absolute clean segregation and easy containerization (e.g. Docker), deploy the project in a unified monorepo. This allows your mobile frontend and backend services to reside side-by-side:

```text
dapoer-workspace/
├── frontend-taro/              # 📱 Taro Cross-Platform Mobile Client
│   ├── config/                 # Taro build configurations (H5, Mini-Program, RN)
│   ├── dist/                   # Static compiled production assets (H5, etc.)
│   ├── src/
│   │   ├── components/         # Shared presentation elements (Navbar, Cards, Buttons)
│   │   ├── config/             # Themes, typography, and image config files
│   │   ├── pages/              # Core screen routes (Home, Categories, Details, Live Cooking)
│   │   ├── app.config.ts       # Application routing configurations
│   │   └── app.scss            # Root layout styling system
│   ├── tsconfig.json
│   └── package.json
│
├── backend-nextjs/             # ⚡ Next.js Production API Service
│   ├── prisma/
│   │   └── schema.prisma       # SQLite/PostgreSQL Database Models
│   ├── src/
│   │   ├── app/
│   │   │   └── api/            # API Router Endpoints
│   │   │       ├── auth/
│   │   │       │   ├── login/  # Secure bcrypt JWT authorization
│   │   │       │   └── register/# Email/Name registration hashing
│   │   │       ├── recipes/    # Queries, post creations, and search filters
│   │   │       └── categories/ # Categories queries with recipe counting
│   │   ├── lib/
│   │   │   └── db.ts           # Prisma client singleton helper
│   │   └── models/
│   ├── next.config.mjs         # Contains complete CORS configs for Taro requests
│   ├── tsconfig.json
│   └── package.json
```

---

## 🛠️ 2. Core Backend Technologies & Setup

The backend is built in **Next.js 14+ (App Router)** using TypeScript. It runs extremely fast, secures user credentials, and serves requests to any mobile app or browser engine.

### Key Components Built:
1. **Prisma ORM & SQLite Database** (`backend/prisma/schema.prisma`): Fully models `User`, `Recipe`, `Category`, `Comment`, `Review`, and `Saved` relationships.
2. **Secure Credentials** (`backend/src/app/api/auth/`): Implements `bcrypt` for encrypting passwords and generates standard `JSON Web Tokens (JWT)` on successful authentication.
3. **Flexible Queries** (`backend/src/app/api/recipes/route.ts`): Automatically matches keyword searches, filters by specific categories, and maps creator profiles.
4. **Auto-Seeding Endpoint** (`backend/src/app/api/categories/route.ts`): Automatically creates default Figma food categories (Soup, Grill, Dessert, Salad, Drink, Breakfast) on first run if they do not exist.
5. **Full CORS Support** (`backend/next.config.mjs`): Custom response headers are pre-injected to permit cross-origin requests from the Taro client.

---

## 🚀 3. How to Launch & Connect Frontend-Backend

### Step A: Initialize the Backend Database
Run this in the `/backend` folder to generate the database client and create tables:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
```

### Step B: Launch Backend Server
Start the Next.js API server locally:
```bash
npm run dev
```
*API will be running on: **`http://localhost:3000`***

### Step C: Querying API Endpoints
You can immediately trigger requests:
*   **Categories List**: `GET http://localhost:3000/api/categories` *(will auto-seed categories on first call!)*
*   **Recipes List**: `GET http://localhost:3000/api/recipes`
*   **Register User**: `POST http://localhost:3000/api/auth/register`
*   **User Login**: `POST http://localhost:3000/api/auth/login`
