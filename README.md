# Turnos y Reservas — Pre-entrega 4 (Routers y Controllers)

API REST con **Node.js**, **Express** y **FileSystem**, reorganizada en tres capas:
**rutas**, **controllers** y **managers**, para separar responsabilidades. Los endpoints
y su comportamiento no cambian respecto de la pre-entrega anterior.

## Arquitectura por capas

- **Routers** (`src/routes/`): solo definen los endpoints y los conectan con su
  controller. No contienen lógica ni acceso a datos.
- **Controllers** (`src/controllers/`): leen `req.params`, `req.query` y `req.body`,
  llaman al manager correspondiente y responden con `res.status().json()`.
- **Managers** (`src/managers/`): manejan la lógica de datos y la persistencia. No usan
  `req` ni `res`.

## Requisitos

- Node.js 18 o superior (usa módulos ESM nativos).

## Instalación

```bash
npm install
```

## Variables de entorno

Creá un archivo `.env` en la raíz del proyecto, tomando como base `.env.example`:

| Variable   | Descripción          | Ejemplo       |
| ---------- | -------------------- | ------------- |
| `PORT`     | Puerto del servidor  | `8080`        |
| `NODE_ENV` | Entorno de ejecución | `development` |

```
PORT=8080
NODE_ENV=development
```

Si falta alguna de estas variables, la aplicación **falla al iniciar** con un mensaje
claro (validación en `src/config/env.config.js`).

## Ejecución

```bash
npm start
```

o en modo desarrollo (reinicio automático):

```bash
npm run dev
```

Por defecto el servidor queda disponible en `http://localhost:8080`.

## Estructura del proyecto

```
src/
  app.js                          # Configura la app Express y monta los routers
  server.js                       # Punto de entrada: levanta el servidor
  config/env.config.js            # Carga y valida las variables de entorno
  controllers/
    services.controller.js        # Reciben req/res y llaman a ServiceManager
    bookings.controller.js        # Reciben req/res y llaman a BookingManager
  managers/
    ServiceManager.js             # Lógica de negocio de los servicios
    BookingManager.js             # Lógica de negocio de las reservas
  routes/
    services.router.js            # Endpoints de services -> controller
    bookings.router.js            # Endpoints de bookings -> controller
  data/
    services.json                 # Persistencia de servicios
    bookings.json                 # Persistencia de reservas
package.json
.env.example
.gitignore
README.md
```

## Recursos y endpoints

### `services`

```json
{
  "id": 1,
  "name": "Consulta general",
  "description": "Consulta médica general de 30 minutos",
  "duration": 30,
  "price": 5000,
  "category": "salud",
  "available": true
}
```

| Método   | Ruta                 | Controller       | Códigos   |
| -------- | -------------------- | ---------------- | --------- |
| `GET`    | `/api/services`      | `getServices`    | 200       |
| `GET`    | `/api/services/:sid` | `getServiceById` | 200 / 404 |
| `POST`   | `/api/services`      | `createService`  | 201 / 400 |
| `PUT`    | `/api/services/:sid` | `updateService`  | 200 / 404 |
| `DELETE` | `/api/services/:sid` | `deleteService`  | 200 / 404 |

`GET /api/services` acepta filtros por query params (`?category=salud`,
`?available=true`).

### `bookings`

```json
{
  "id": 1,
  "clientName": "Ana Pérez",
  "clientEmail": "ana@example.com",
  "date": "2026-05-20",
  "time": "15:30",
  "status": "pending",
  "services": [{ "service": 1, "quantity": 2 }]
}
```

| Método | Ruta                               | Controller           | Códigos   |
| ------ | ---------------------------------- | -------------------- | --------- |
| `POST` | `/api/bookings`                    | `createBooking`      | 201 / 400 |
| `GET`  | `/api/bookings/:bid`               | `getBookingById`     | 200 / 404 |
| `POST` | `/api/bookings/:bid/services/:sid` | `addServiceToBooking`| 200 / 404 |

`addServiceToBooking` valida la existencia del **servicio** vía `ServiceManager` y la de
la **reserva** vía `BookingManager`. Si el servicio ya estaba en la reserva, incrementa
su `quantity`.

## Ejemplos

```bash
curl http://localhost:8080/api/services
curl "http://localhost:8080/api/services?category=salud"

curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Ana Pérez",
    "clientEmail": "ana@example.com",
    "date": "2026-05-20",
    "time": "15:30",
    "status": "pending"
  }'

curl -X POST http://localhost:8080/api/bookings/1/services/1
curl http://localhost:8080/api/bookings/1
```
