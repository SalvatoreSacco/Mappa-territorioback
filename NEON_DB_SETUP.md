# Neon DB Setup Guide (Mappa Backend)

## Cos'è Neon DB?

Neon DB è un servizio PostgreSQL serverless nel cloud che semplifica il deployment di applicazioni PostgreSQL senza gestire infrastruttura.

## Quick Start con Neon DB

### 1. Creare un Account Neon
1. Vai a https://neon.tech
2. Accedi con GitHub o Email
3. Crea un nuovo progetto

### 2. Trovare la Connection String
Nel Neon Dashboard:
- Vai a **Project Settings** → **Connection String**
- Seleziona **Connection String** (NOT psql command)
- Copia l'URL completo

Aspetto:
\\\
postgresql://user:password@ep-xxxx.neon.tech/dbname
\\\

### 3. Configurare .env Locale
Crea o aggiorna il file \.env\:

\\\env
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
PORT=3000
NODE_ENV=development
\\\

**Importante**: Aggiungi \?sslmode=require\ alla fine per la connessione sicura.

### 4. Installare Dipendenze
\\\ash
npm install
\\\

### 5. Avviare l'Applicazione
\\\ash
npm run start:dev
\\\

L'app si inizializzerà automaticamente:
- ✅ Abilita estensione PostGIS
- ✅ Crea tabelle (comuni, users, assegnazioni)
- ✅ Crea indice GIST su geometrie
- ✅ Inserisce dati di test

Non devi fare nulla - tutto è automatico!

---

## Deploy su Vercel / Railway / Heroku

### Vercel
1. \ercel env add DATABASE_URL\
2. Incolla il tuo Neon connection string
3. \ercel deploy\

### Railway
1. Vai a Project Settings
2. Aggiungi variabile di ambiente: \DATABASE_URL\
3. Valore: tuo Neon connection string
4. Deploy

### Heroku
\\\ash
heroku config:set DATABASE_URL=postgresql://...
git push heroku main
\\\

---

## Troubleshooting

### Errore: \"connection refused\"
- Verifica che la CONNECTION_STRING sia corretta in .env
- Assicurati che Neon DB progetto sia attivo

### Errore: \"SSL certificate problem\"
- Aggiungi \?sslmode=require\ al connection string
- Esempio: \postgresql://user:pass@host.neon.tech/db?sslmode=require\

### Errore: \"PostGIS not available\"
- Neon DB ha PostGIS preinstallato
- L'app lo abilita automaticamente al primo avvio
- Attendi il completamento dell'inizializzazione

### Database vedi dati di test mancanti
- Verifica che il COUNT sia 0 prima di eseguire seed
- I dati vengono inseriti solo se la tabella users è vuota

---

## Monitoraggio Neon DB

### Accedere alla Console Neon
1. Dashboard → Project
2. Seleziona database
3. Usa SQL Editor per query dirette

### Esempio Query per Testare PostGIS
\\\sql
-- Verifica che PostGIS è abilitato
SELECT PostGIS_version();

-- Vedi i comuni
SELECT id, nome, ST_AsText(geom) FROM comuni;

-- Conta le assegnazioni
SELECT COUNT(*) FROM assegnazioni;
\\\

---

## Backup e Restore

Neon fornisce:
- **Backup automatici** giornalieri (free tier)
- **Point-in-time restore** disponibile
- Accedi da Neon Dashboard

---

## Performance Tips

1. **Indici**: I nostri GIST indici sono già ottimizzati
2. **Connection Pool**: Che stiamo usando il pool pg
3. **Compute Scale**: Neon scalerà automaticamente il compute
4. **Storage**: Cresce automaticamente, non devi far nulla

---

## Differenze tra PostgreSQL Locale e Neon

| Feature | PostgreSQL Locale | Neon DB |
|---------|-------------------|---------|
| Setup | Configurazione manuale | Istantaneo |
| Backup | Devi gestire | Automatico |
| Uptime | Dipende da te | 99.9% SLA |
| Scaling | Manuale | Automatico |
| SSL | Opzionale | Richiesto |
| Costo | 0€ (localmente) | Free tier generoso |

---

## Ottenere Supporto

- Neon Docs: https://neon.tech/docs
- Discord Community: https://neon.tech/discord
- Email Support: support@neon.tech

---

## Prossimi Passi

Una volta che il backend è in esecuzione:
1. Test le API con curl o Postman
2. Collegati al frontend map (Leaflet)
3. Visualizza e assegna comuni
4. Deploy in produzione

Buon lavoro! 🚀
