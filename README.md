# MappaBack — Backend

API REST in NestJS per la gestione geografica dei comuni della provincia di Trapani, con autenticazione JWT e PostGIS.

## Stack

- **NestJS 11** con TypeScript
- **PostgreSQL + PostGIS** (Neon DB in produzione)
- **JWT** (`@nestjs/jwt` + `passport-jwt`) per autenticazione
- **bcrypt** per hashing password
- SQL raw con `pg` (nessun ORM)

## Prerequisiti

- Node.js 18+
- pnpm
- Account Neon DB (o PostgreSQL locale con PostGIS)

## Installazione

```bash
pnpm install
cp .env.example .env
# Modifica .env con le tue credenziali
```

## Variabili d'ambiente

| Variabile | Descrizione |
|-----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `JWT_SECRET` | Segreto JWT — minimo 32 caratteri casuali |
| `JWT_EXPIRES_IN` | Durata token, es. `8h` |
| `CORS_ORIGIN` | Origini CORS consentite (virgola separata) |
| `PORT` | Porta server (default: `3000`) |
| `ADMIN_EMAIL` | Email admin creato al primo avvio |
| `ADMIN_DEFAULT_PASSWORD` | Password admin di default (cambiare subito) |
| `IMPORT_FILE_PATH` | Percorso del file GeoJSON per l'import comuni |

## Avvio

```bash
# Sviluppo
pnpm start:dev

# Produzione
pnpm build
pnpm start:prod
```

Al primo avvio l'app inizializza automaticamente le tabelle e crea l'utente admin se non esiste.

## Endpoints

| Metodo | Path | Auth | Descrizione |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Login, restituisce JWT |
| GET | `/comuni` | No | Lista comuni con geometrie |
| GET | `/comuni/findAt?lat=&lng=` | No | Trova comune per coordinate |
| GET | `/operatori` | No | Lista operatori |
| POST | `/operatori` | JWT | Crea operatore |
| PUT | `/operatori/:id` | JWT | Modifica operatore |
| DELETE | `/operatori/:id` | JWT | Elimina operatore |
| GET | `/categorie` | No | Lista categorie |
| POST | `/categorie` | JWT | Crea categoria |
| PUT | `/categorie/:id` | JWT | Modifica categoria |
| DELETE | `/categorie/:id` | JWT | Elimina categoria |
| GET | `/assegnazioni` | No | Lista assegnazioni |
| POST | `/assegnazioni` | JWT | Crea assegnazione |
| DELETE | `/assegnazioni/:id` | JWT | Elimina assegnazione |
| POST | `/import/trapani` | JWT | Importa comuni da GeoJSON |

## Sicurezza

- Helmet per security headers HTTP
- Rate limiting globale (100 req/min per IP) e specifico sul login (5 req/min)
- ValidationPipe con whitelist — campi extra rifiutati
- CORS configurabile da variabile d'ambiente
- Timing-attack safe sul login
