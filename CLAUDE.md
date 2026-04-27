# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies
pnpm run start:dev    # Run in watch mode (development)
pnpm run build        # Compile TypeScript via NestJS CLI
pnpm run start:prod   # Run compiled output
pnpm run lint         # ESLint with auto-fix
pnpm run format       # Prettier format
pnpm run test         # Run unit tests (jest, rootDir: src)
pnpm run test:e2e     # Run e2e tests (test/jest-e2e.json)
pnpm run test:cov     # Test coverage report
```

Run a single test file:
```bash
pnpm run test -- --testPathPattern=comuni
```

## Architecture

NestJS 11 backend in TypeScript using raw PostgreSQL (pg driver) with PostGIS for geospatial queries. No ORM — all queries are written directly in SQL using `DatabaseService`.

### Database initialization

`DatabaseService` (`src/common/database/database.service.ts`) connects via `DATABASE_URL` env var (falls back to a hardcoded Neon DB connection string). On `onModuleInit` it:
1. Runs every statement in `src/db/init.sql` (creates tables + PostGIS extension idempotently via `IF NOT EXISTS`)
2. Seeds from `src/db/seed.sql` if the `users` table is empty

Database: PostgreSQL + PostGIS on [Neon](https://neon.tech) (serverless). The `comuni.geom` column is `GEOMETRY(MULTIPOLYGON, 4326)`.

### Module structure

| Module | Path | Responsibility |
|---|---|---|
| `DatabaseModule` | `src/common/database/` | Global pool, `query`/`queryOne`/`queryAll` helpers |
| `ComuniModule` | `src/modules/comuni/` | GeoJSON endpoints, PostGIS spatial queries |
| `UsersModule` | `src/modules/users/` | CRUD for users |
| `AssegnazioniModule` | `src/modules/assegnazioni/` | Assignments of users to comuni (unique per pair) |
| `ImportModule` | `src/modules/import/` | One-off import of Trapani province comuni from a GeoJSON file |

### PostGIS helpers

`DbHelper` (`src/common/database/db.helper.ts`) generates PostGIS SQL fragments:
- `asGeoJSON(col)` → `ST_AsGeoJSON(col)`
- `pointInsideGeometry(col, lng, lat)` → `ST_Contains(col, ST_Point(lng, lat))`
- `geomFromText(wkt, srid)` → `ST_GeomFromText(...)`
- `parseGeoJSON(str)` → parses the string returned by `ST_AsGeoJSON`

### REST API

Server listens on `PORT` (default 3000). CORS is open only to `http://localhost:3001`.

| Method | Path | Description |
|---|---|---|
| GET | `/comuni` | All comuni with GeoJSON geometry |
| POST | `/comuni/find` | Find comune containing `{lat, lng}` |
| GET | `/comuni/:id/operatori` | Operators for a comune, grouped by category |
| GET | `/users` | All users |
| GET | `/users/:id` | Single user |
| POST | `/users` | Create user `{name}` |
| GET | `/assegnazioni` | All assignments |
| POST | `/assegnazioni` | Assign user to comune `{comuneId, userId}` |
| POST | `/import/trapani` | Import Trapani comuni from `comuni.geojson` (or custom `filePath`) |

### Database schema

```
comuni        id, nome, geom(MULTIPOLYGON,4326) — GIST index on geom
users         id, name
assegnazioni  id, comune_id→comuni, user_id→users — UNIQUE(comune_id, user_id)
categoria     id, nome(UNIQUE)
operatori     id, nome, categoria_id→categoria, comune_id→comuni
```

`comuni.geojson` in the repo root is the source file for the import endpoint (Trapani province municipalities filtered by `prov_name === 'Trapani'`).
