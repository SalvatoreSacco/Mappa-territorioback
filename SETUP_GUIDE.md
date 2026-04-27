# Mappa Backend - Geographic Areas Management System

A production-ready NestJS backend for managing geographic areas (comuni) and assigning them to users using PostgreSQL with PostGIS extension. Fully compatible with **Neon DB** for cloud hosting.

## Features

- ✅ PostgreSQL with PostGIS for geographic operations
- ✅ Automatic database initialization on startup
- ✅ GeoJSON support for geometry data
- ✅ Point-in-polygon queries using PostGIS spatial operations
- ✅ RESTful API endpoints for comuni, users, and assignments
- ✅ Raw SQL queries (no ORM) for performance and flexibility
- ✅ Modular NestJS architecture
- ✅ TypeScript for type safety
- ✅ **Neon DB compatible** (easy cloud deployment)

## Prerequisites

- Node.js 18+
- PostgreSQL 12+ with PostGIS extension (or Neon DB account)
- pnpm or npm

## Installation

### 1. Install Dependencies

\\\ash
npm install
# or with pnpm
pnpm install
\\\

### 2. Configure Environment Variables

Create a \.env\ file in the root directory:

\\\ash
cp .env.example .env
\\\

Edit \.env\ with your database connection:

#### Option A: Local PostgreSQL
\\\env
DATABASE_URL=postgresql://postgres:postgres@localhost/mappa_db
PORT=3000
NODE_ENV=development
\\\

#### Option B: Neon DB (Cloud)
\\\env
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
PORT=3000
NODE_ENV=development
\\\

Get your connection string from Neon DB dashboard:
- Project Settings → Connection String → Connection String (includes password)
- Format: \postgresql://user:password@host.neon.tech/dbname\

### 3. Set Up Database

#### Local PostgreSQL
\\\ash
createdb mappa_db
\\\

#### Neon DB
- Create database via Neon console
- Copy connection string to \.env\
- App will auto-initialize on startup

The application will automatically:
- Enable PostGIS extension
- Create tables (comuni, users, assegnazioni)
- Create GIST index on geometries
- Insert seed data on first run

## Running the Application

### Development Mode

\\\ash
npm run start:dev
\\\

The server will start at \http://localhost:3000\

### Production Mode

\\\ash
npm run build
npm run start:prod
\\\

## Project Structure

\\\
src/
├── common/
│   └── database/
│       ├── db.helper.ts          # Geometry helper functions
│       ├── database.service.ts    # Database connection pool & queries
│       └── database.module.ts     # Database module
├── db/
│   ├── init.sql                   # Database schema
│   └── seed.sql                   # Initial data
├── modules/
│   ├── comuni/
│   │   ├── comuni.controller.ts   # Endpoints for comuni
│   │   ├── comuni.service.ts      # Business logic
│   │   └── comuni.module.ts
│   ├── users/
│   │   ├── users.controller.ts    # Endpoints for users
│   │   ├── users.service.ts       # Business logic
│   │   └── users.module.ts
│   └── assegnazioni/
│       ├── assegnazioni.controller.ts  # Endpoints for assignments
│       ├── assegnazioni.service.ts     # Business logic
│       └── assegnazioni.module.ts
├── app.module.ts                  # Main application module
└── main.ts                        # Application entry point
\\\

## API Endpoints

### Comuni (Geographic Areas)

#### GET /comuni
Retrieve all comuni with their geometries as GeoJSON.

**Response:**
\\\json
[
  {
    \"id\": 1,
    \"nome\": \"Test Comune\",
    \"geometry\": {
      \"type\": \"MultiPolygon\",
      \"coordinates\": [...]
    }
  }
]
\\\

#### POST /comuni/find
Find a comune that contains the given coordinates.

**Request:**
\\\json
{
  \"lat\": 43.5,
  \"lng\": 13.2
}
\\\

**Response:**
\\\json
{
  \"id\": 1,
  \"nome\": \"Test Comune\",
  \"geometry\": { ... }
}
\\\

### Users

#### GET /users
Get all users.

**Response:**
\\\json
[
  {
    \"id\": 1,
    \"name\": \"Test User\"
  }
]
\\\

#### GET /users/:id
Get a specific user by ID.

#### POST /users
Create a new user.

**Request:**
\\\json
{
  \"name\": \"New User\"
}
\\\

### Assignments (Assegnazioni)

#### GET /assegnazioni
Get all assignments with associated comune and user data.

**Response:**
\\\json
[
  {
    \"id\": 1,
    \"comune\": {
      \"id\": 1,
      \"nome\": \"Test Comune\",
      \"geometry\": { ... }
    },
    \"user\": {
      \"id\": 1,
      \"name\": \"Test User\"
    }
  }
]
\\\

#### POST /assegnazioni
Create or update an assignment between a user and a comune.

**Request:**
\\\json
{
  \"comuneId\": 1,
  \"userId\": 1
}
\\\

## Database Schema

### comuni
- \id\ (SERIAL PRIMARY KEY)
- \
ome\ (TEXT)
- \geom\ (GEOMETRY MULTIPOLYGON, SRID 4326) with GIST index

### users
- \id\ (SERIAL PRIMARY KEY)
- \
ame\ (TEXT)

### assegnazioni
- \id\ (SERIAL PRIMARY KEY)
- \comune_id\ (INTEGER FK → comuni.id)
- \user_id\ (INTEGER FK → users.id)
- UNIQUE constraint on (comune_id, user_id)

## Key Features

### Geometry Helpers

The \DbHelper\ class provides convenient methods for PostGIS operations:

- \DbHelper.asGeoJSON(columnName)\ - Convert geometry to GeoJSON
- \DbHelper.geomFromText(wkt, srid)\ - Create geometry from WKT format
- \DbHelper.point(lng, lat)\ - Create a point (note: lng, lat order)
- \DbHelper.parseGeoJSON(jsonString)\ - Parse GeoJSON from database
- \DbHelper.pointInsideGeometry(column, lng, lat)\ - Point-in-polygon check

### Database Service

The \DatabaseService\ provides:

- \query(text, params)\ - Execute query and return raw result
- \queryOne(text, params)\ - Execute query and return first row
- \queryAll(text, params)\ - Execute query and return all rows
- Automatic database initialization on module initialization
- Connection pooling with pg Pool
- Support for both local PostgreSQL and Neon DB

## Integration with Frontend (e.g., Leaflet)

The API is ready to use with frontend map libraries:

1. Fetch comuni from \GET /comuni\
2. Convert geometry to Leaflet GeoJSON layer
3. Implement click handler to find comune at coordinates using \POST /comuni/find\
4. Create assignment with \POST /assegnazioni\ when user selects a comune
5. Display assignments with user information

**Example Leaflet Integration:**

\\\javascript
// Fetch and display comuni
fetch('http://localhost:3000/comuni')
  .then(r => r.json())
  .then(comuni => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: comuni.map(c => ({
        type: 'Feature',
        properties: { id: c.id, nome: c.nome },
        geometry: c.geometry
      }))
    };
    
    L.geoJSON(featureCollection, {
      style: { color: '#3388ff', weight: 2 },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          // Create assignment or handle selection
        });
      }
    }).addTo(map);
  });
\\\

## Notes

- The coordinate order for ST_Point is \(lng, lat)\ - this is correct for PostGIS
- The GIST index on \comuni.geom\ significantly improves point-in-polygon query performance
- The application uses raw SQL with parameterized queries for security
- All responses use proper error handling and async/await patterns
- The database is automatically initialized with seed data on first run (if empty)
- Works with both local PostgreSQL and Neon DB (cloud) - same code!

## Deploying to Production with Neon DB

1. Create Neon DB account and project
2. Get connection string from Neon console
3. Set \DATABASE_URL\ environment variable in your deploy platform
4. Add \sslmode=require\ to connection string if not already included
5. Deploy normally - auto-initialization handles everything

Example Vercel/Railway environment variable:
\\\
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
\\\

## Future Extensions

- Add authentication and authorization
- Add more PostGIS operations (buffer, distance, intersection)
- Add caching layer for performance
- Add validation layer with class-validator
- Add API documentation with Swagger/OpenAPI
- Add GraphQL alternative
- Add unit and integration tests
- Add data migration system for schema changes

## License

UNLICENSED
