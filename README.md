# Academia Baile App 💃🩰

Aplicación fullstack para gestionar alumnas, horarios e inscripciones de una academia de baile.

## Tech Stack

- **Backend:** Node.js + Express
- **BBDD:** SQLite (`academia.db`)
- **Frontend:** React + Vite + CSS Modules

## Funcionalidades

### Alumnas

- Alta de alumna
- Edición de datos
- Inscripción en uno o varios horarios (por clase)
- Desactivar / reactivar alumna (borrado lógico)
- Filtro: activas / inactivas / todas

### Pagos

- Ver estado (Pagado / Pendiente) por alumna (mes actual)
- Marcar pagado / pendiente

### Horarios e inscripciones

- Horarios agrupados por clase
- Al guardar alumna, se actualizan sus inscripciones con `replace`

## Estructura del proyecto

/backend-> API REST + SQLite
/frontend -> React(vite)

## Cómo arrancar (local)

### 1) Backend

````bash
cd backend
npm install
npm run dev

Backend en http://localhost:3000


## Cómo arrancar (local)
### 1) Backend
```bash
cd backend
npm install
npm run dev
Frontend en http://localhost:5173

## Endpoints principales (backend)

GET /api/alumnas?activa=1|0|all

POST /api/alumnas

PUT /api/alumnas/:id

PATCH /api/alumnas/:id/activa body: { "activa": 0|1 }

GET /api/horarios

POST /api/inscripciones/replace body: { "alumna_id": 1, "horario_ids": [1,2,3] }

GET /api/pagos?mes=YYYY-MM

POST /api/pagos

PUT /api/pagos/:id

Notas

El sistema usa desactivación (no borrado) para no perder histórico.

Los colores de marca están definidos en :root (lila de la academia).


---
````
