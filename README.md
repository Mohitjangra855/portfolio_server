# Portfolio Server (NestJS + Prisma)

This is the backend server for the Portfolio project. It is built using NestJS, Prisma ORM, and supports features for authentication, project management, skills, education, company info, and more.

## Features
- JWT-based authentication (login, register, logout, refresh)
- CRUD for Projects, Skills, Education, Company
- Role-based access (admin, user)
- Caching with Redis
- Prisma ORM for database access
- DTO validation with class-validator
- API documentation with Swagger

## Folder Structure
```
server/
├── prisma/                # Prisma schema and migrations
├── src/
│   ├── auth/              # Authentication (controllers, services, DTOs)
│   ├── company/           # Company info (controllers, services, DTOs)
│   ├── education/         # Education info (controllers, services, DTOs)
│   ├── project/           # Projects (controllers, services, DTOs)
│   ├── skill/             # Skills (controllers, services, DTOs)
│   ├── cacheManger/       # Redis cache manager
│   ├── guard/             # Role-based guards
│   ├── jwt/               # JWT config
│   ├── prisma/            # Prisma service/module
│   └── main.ts            # App entry point
├── test/                  # E2E tests
├── dump.rdb               # Redis dump
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── nest-cli.json          # NestJS CLI config
└── README.md              # This file
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file in the `server/` directory. Example:
```
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
JWT_SECRET="your_jwt_secret"
REDIS_URL="redis://localhost:6379"
```

### 3. Run Prisma migrations
```bash
npx prisma migrate dev
```

### 4. Start the server
```bash
npm run start:dev
```

Server will run on `http://localhost:3000` by default.

## API Endpoints

### Auth
- `POST /auth/login` — Login
- `POST /auth/register` — Register
- `POST /auth/logout` — Logout
- `POST /auth/refresh` — Refresh token
- `GET /auth/check` — Check authentication
- `GET /auth/profile` — Get user profile

### Projects
- `GET /project` — List all projects
- `GET /project/:id` — Get project by ID
- `POST /project` — Create project
- `PATCH /project/:id` — Update project
- `DELETE /project/:id` — Delete project

### Skills
- `GET /skill` — List all skills
- `POST /skill` — Create skill
- `PATCH /skill/:id` — Update skill
- `DELETE /skill/:id` — Delete skill

### Education
- `GET /education` — List all education records
- `POST /education` — Create education
- `PATCH /education/:id` — Update education
- `DELETE /education/:id` — Delete education

### Company
- `GET /company` — List all companies
- `POST /company` — Create company
- `PATCH /company/:id` — Update company
- `DELETE /company/:id` — Delete company

## Technologies Used
- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- JWT
- Swagger
- class-validator

## Development Scripts
- `npm run start:dev` — Start server in development mode
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests
- `npx prisma studio` — Open Prisma Studio

## License
MIT

---
For any issues or contributions, please open an issue or pull request on the repository.

