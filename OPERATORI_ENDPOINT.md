# Operatori Endpoint Documentation

## 📋 Descrizione

Nuovo endpoint per ottenere gli **operatori/staff** associati a un comune, raggruppati per categoria.

## 🔧 Database Schema Updates

### Tabelle Aggiunte

#### `categoria`
```sql
CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);
```
Categorie predefinite nel seed:
- OSS
- Infermieri
- Fisioterapisti
- Medici
- Logistica

#### `operatori`
```sql
CREATE TABLE operatori (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria_id INTEGER NOT NULL REFERENCES categoria(id),
  comune_id INTEGER NOT NULL REFERENCES comuni(id)
);
```

**Indici:**
- `idx_operatori_comune_id` - Query veloce per comune
- `idx_operatori_categoria_id` - Query veloce per categoria

## 🌐 API Endpoint

### GET `/comuni/:id/operatori`

Ottiene tutti gli operatori di un comune, raggruppati per categoria.

**Path Parameters:**
- `id` (number) - ID del comune

**Response Status:** `200 OK`

**Response Format:**
```json
[
  {
    "categoria": "OSS",
    "operatori": [
      { "id": 1, "nome": "Marco Rossi" },
      { "id": 2, "nome": "Anna Bianchi" }
    ]
  },
  {
    "categoria": "Infermieri",
    "operatori": [
      { "id": 3, "nome": "Giovanni Verdi" },
      { "id": 4, "nome": "Laura Ferrari" }
    ]
  },
  {
    "categoria": "Fisioterapisti",
    "operatori": [
      { "id": 5, "nome": "Paolo Russo" }
    ]
  }
]
```

**Empty Case:** Se il comune non ha operatori, ritorna `[]`.

## 📝 Esempio di Uso

### cURL
```bash
# Get operatori for comune with id=1
curl http://localhost:3000/comuni/1/operatori

# Get operatori for Test Comune (id=1)
curl http://localhost:3000/comuni/1/operatori \
  -H "Content-Type: application/json"
```

### JavaScript/Fetch (Frontend)
```javascript
async function getOperatori(comuneId) {
  const response = await fetch(`/comuni/${comuneId}/operatori`);
  const data = await response.json();
  return data;
}

// Esempio di uso
const operatoriGrouped = await getOperatori(1);
console.log(operatoriGrouped);
// Output:
// [
//   { categoria: "OSS", operatori: [...] },
//   { categoria: "Infermieri", operatori: [...] },
//   ...
// ]
```

## 🛠️ Implementazione Dettagli

### TypeScript Interfaces (Backend)
```typescript
export interface Operatore {
  id: number;
  nome: string;
}

export interface OperatoriByCategoria {
  categoria: string;
  operatori: Operatore[];
}
```

### SQL Query
```sql
SELECT 
  c.nome as categoria,
  json_agg(
    json_build_object('id', o.id, 'nome', o.nome)
  ) as operatori
FROM operatori o
JOIN categoria c ON o.categoria_id = c.id
WHERE o.comune_id = $1
GROUP BY c.id, c.nome
ORDER BY c.nome
```

**Ottimizzazioni:**
- Uses JSON aggregation per ridurre roundtrips di database
- Indici su `comune_id` e `categoria_id` per performance
- `ORDER BY c.nome` per categoria alfabeticamente ordinate

## 🚀 Testing

### Con Database di Test (Test Comune - id=1)
```bash
curl http://localhost:3000/comuni/1/operatori

# Response:
# [
#   {
#     "categoria": "Fisioterapisti",
#     "operatori": [{ "id": 5, "nome": "Paolo Russo" }]
#   },
#   {
#     "categoria": "Infermieri",
#     "operatori": [
#       { "id": 3, "nome": "Giovanni Verdi" },
#       { "id": 4, "nome": "Laura Ferrari" }
#     ]
#   },
#   {
#     "categoria": "Medici",
#     "operatori": [{ "id": 6, "nome": "Sandra Gallo" }]
#   },
#   {
#     "categoria": "OSS",
#     "operatori": [
#       { "id": 1, "nome": "Marco Rossi" },
#       { "id": 2, "nome": "Anna Bianchi" }
#     ]
#   }
# ]
```

## 📊 Struttura Finale del Database

```
comuni (id, nome, geom)
  ↓
operatori (id, nome, categoria_id, comune_id)
  ↓
categoria (id, nome)

assegnazioni (id, comune_id, user_id)
users (id, name)
```

## ✅ Checklist Frontend Implementation

Quando implementerai il frontend React:

1. ✅ Click su comune nella mappa → salva `comuneId`
2. ✅ Apri sidebar/drawer laterale
3. ✅ Fai fetch a `GET /comuni/:id/operatori`
4. ✅ Renderizza la lista operatori raggruppata per categoria
5. ✅ Aggiungi animazione di slide per la sidebar
6. ✅ Evidenzia il comune cliccato sulla mappa

## 🔗 File Modificati

- `src/db/init.sql` - Aggiunte tabelle categoria e operatori
- `src/db/seed.sql` - Aggiunti dati di test
- `src/modules/comuni/comuni.service.ts` - Metodo `getOperatoriByComune()`
- `src/modules/comuni/comuni.controller.ts` - Endpoint `GET /comuni/:id/operatori`
