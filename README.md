# QuickBite — MERN Food Ordering Application

QuickBite is a full-stack food-ordering application built for the Full Stack Developer assessment. It provides separate customer and restaurant workflows, persistent MongoDB storage, secure authentication, REST APIs, and real-time order updates with Socket.IO.

## Live project

| Resource | Link |
|---|---|
| Customer application | [quick-bite-rho-three.vercel.app](https://quick-bite-rho-three.vercel.app) |
| Restaurant workspace | [quick-bite-rho-three.vercel.app/restaurant](https://quick-bite-rho-three.vercel.app/restaurant) |
| Backend health check | [quick-bite-2y79.onrender.com/api/health](https://quick-bite-2y79.onrender.com/api/health) |
| GitHub repository | [github.com/SidxRengen/quick-bite](https://github.com/SidxRengen/quick-bite) |

> The restaurant assessment access key is intentionally not committed. It should be shared privately with the reviewer and rotated after the evaluation.

## Reviewer walkthrough

### Customer flow

1. Open the [customer application](https://quick-bite-rho-three.vercel.app).
2. Create an account using a valid name, email address, and password of at least eight characters.
3. Browse the menu and add items to the cart.
4. Increase or decrease quantities and proceed to checkout.
5. Enter the delivery address and phone number. The customer name is taken securely from the authenticated account.
6. Place the order and use the expandable panel at the bottom of the page to follow its live status.

### Restaurant flow

1. Open the [restaurant workspace](https://quick-bite-rho-three.vercel.app/restaurant).
2. Enter the restaurant assessment access key shared with the submission.
3. View newly placed customer orders in the live queue.
4. Advance an order through `Order Received` → `Preparing` → `Out for Delivery` → `Delivered`.
5. Open **Menu management** to create, edit, hide, restore, or delete menu items.

Open the customer and restaurant pages in separate browser windows to demonstrate the Socket.IO updates in real time.

## Main features

- Email/password registration and login with bcrypt password hashing and JWT sessions
- Responsive menu cards with name, description, price, category, image, lazy loading, and image fallbacks
- Cart quantity controls with zero-item removal and a maximum quantity guard
- Checkout using the authenticated customer's name, delivery address, and phone number
- Server-calculated prices and totals that do not trust client-supplied values
- Expandable customer order tracker fixed to the bottom of the page
- Restaurant order queue with protected, sequential status transitions
- Real-time order placement and status notifications through Socket.IO
- Integrated restaurant menu management with CRUD and availability controls
- Accessible snackbar feedback, loading, empty, retry, error, and submitting states
- Responsive customer, restaurant, authentication, menu, cart, and status interfaces
- MongoDB/Mongoose persistence with validation, indexes, timestamps, and order snapshots
- Automated REST API, validation, CRUD, status-transition, and React component tests

## Assessment checklist

| Requirement | Implementation |
|---|---|
| Menu display | Responsive cards show name, description, price, image, and category |
| Cart | Add items and increase, decrease, or remove quantities |
| Checkout | Authenticated name plus validated address and phone number |
| Order placement | `POST /api/orders` validates items and calculates the total on the server |
| Order status | Expandable customer tracker with the complete status timeline |
| Restaurant workflow | Live queue and controlled sequential status updates |
| Real-time updates | Protected Socket.IO customer rooms and restaurant channel |
| Menu APIs | Public retrieval plus restaurant-protected create, update, availability, and delete endpoints |
| Order CRUD | Create, list, read, cancel, status update, and safe deletion behavior |
| Persistence | MongoDB Atlas with Mongoose schemas and indexes |
| Authentication | Customer JWTs and a separate restaurant access-key JWT |
| Validation | Invalid IDs, unavailable items, empty carts, duplicate items, quantity limits, malformed contact data, and terminal states |
| Code quality | Modular routes, controllers, services, models, middleware, hooks, pages, and components |
| Testing | Vitest, Supertest, MongoDB Memory Server, and Testing Library |
| Deployment | Vercel frontend, Render backend, MongoDB Atlas, environment examples, health check, and SPA fallbacks |

## Technology stack

- **Frontend:** React 19, Vite, React Router DOM, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, JWT, bcryptjs
- **Database:** MongoDB Atlas with Mongoose
- **Testing:** Vitest, Supertest, MongoDB Memory Server, Testing Library, jsdom
- **Deployment:** Vercel for the frontend and Render for the backend

## Architecture

```text
Customer React app ── customer JWT ──> Express REST API ──> MongoDB
       ▲                                      │
       │ Socket.IO customer order room        │ Socket.IO restaurant feed
       │                                      ▼
Order status drawer <────────────── Restaurant workspace
                                          │
                                          └── restaurant JWT
```

The frontend communicates through a central API boundary. Express routes delegate to controllers and services, while Mongoose models own persistence rules. The order service reads current menu records, calculates the authoritative total, stores item snapshots, records status history, and emits updates only after a successful database operation.

## Repository structure

```text
quick-bite/
├── client/
│   ├── public/                 Static assets and Netlify SPA fallback
│   ├── src/
│   │   ├── components/         Reusable customer, restaurant, and admin UI
│   │   ├── context/            Authentication and snackbar state
│   │   ├── hooks/              Cart, menu, order, and Socket.IO behavior
│   │   ├── pages/              Route-level screens
│   │   ├── routes/             Protected route handling
│   │   ├── api.js              Central REST request boundary
│   │   └── App.jsx             React Router route definitions
│   └── vercel.json             Vercel SPA fallback for a client-root deployment
├── server/
│   └── src/
│       ├── config/              Environment configuration
│       ├── constants/           Shared domain constants
│       ├── controllers/         HTTP request handlers
│       ├── data/                Seed menu data
│       ├── middleware/          Authentication, validation, and errors
│       ├── models/              Mongoose schemas
│       ├── routes/              REST route definitions
│       ├── scripts/             Database seed command
│       ├── services/            Authentication, menu, and order rules
│       └── server.js            MongoDB and Socket.IO startup
├── vercel.json                 SPA fallback for a repository-root deployment
└── README.md
```

## Local setup

### Requirements

- Node.js 20 or newer
- npm
- MongoDB 7+ locally, or a MongoDB Atlas connection string

### Installation

```bash
git clone https://github.com/SidxRengen/quick-bite.git
cd quick-bite
npm install
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Configure `server/.env`:

```env
PORT=8008
MONGODB_URI=mongodb://127.0.0.1:27017/quickbite
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
RESTAURANT_ACCESS_KEY=replace-with-a-private-restaurant-key
```

Configure `client/.env`:

```env
VITE_API_URL=http://localhost:8008/api
VITE_SOCKET_URL=http://localhost:8008
```

Seed the menu and start both applications:

```bash
npm run seed --prefix server
npm run dev
```

| Local service | URL |
|---|---|
| Customer application | `http://localhost:5173` |
| Restaurant workspace | `http://localhost:5173/restaurant` |
| Backend API | `http://localhost:8008/api` |
| Health check | `http://localhost:8008/api/health` |

The seed command inserts only missing menu items by name. It does not delete or overwrite items created through the restaurant workspace.

## Tests and production build

Run the complete backend and frontend test suites:

```bash
npm test
```

Build the frontend for production:

```bash
npm run build --prefix client
```

Backend tests use MongoDB Memory Server and do not modify the configured development or production database.

## API reference

All API routes use the `/api` prefix.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Application and database health |
| GET | `/menu` | Public | Retrieve available menu items |
| GET | `/menu/admin` | Restaurant | Retrieve all menu items |
| POST | `/menu` | Restaurant | Create a menu item |
| PATCH | `/menu/:id` | Restaurant | Update a menu item or its availability |
| DELETE | `/menu/:id` | Restaurant | Delete a menu item |
| POST | `/auth/register` | Public | Register a customer and issue a JWT |
| POST | `/auth/login` | Public | Authenticate a customer and issue a JWT |
| GET | `/auth/me` | Customer | Restore the authenticated customer |
| GET | `/orders` | Customer | List the customer's orders |
| POST | `/orders` | Customer | Create an order |
| GET | `/orders/:id` | Customer | Retrieve an owned order |
| PATCH | `/orders/:id/status` | Customer | Cancel before preparation begins |
| DELETE | `/orders/:id` | Customer | Delete a cancelled order |
| POST | `/restaurant/login` | Public | Exchange the access key for a restaurant JWT |
| GET | `/restaurant/orders` | Restaurant | Retrieve the restaurant order queue |
| PATCH | `/restaurant/orders/:id/status` | Restaurant | Advance an order to its next status |

Customer-protected endpoints require `Authorization: Bearer <CUSTOMER_JWT>`. Restaurant-protected endpoints require the restaurant JWT returned by `/restaurant/login`.

Example order payload:

```json
{
  "customer": {
    "address": "12 Computing Lane",
    "phone": "+91 9876543210"
  },
  "items": [
    {
      "menuItemId": "MONGODB_OBJECT_ID",
      "quantity": 2
    }
  ]
}
```

The API ignores any client-supplied customer name and uses the authenticated account name. It also ignores client-supplied prices and recalculates each total from MongoDB.

## Design and security decisions

- Passwords are one-way hashed and are never returned by the API.
- Customer and restaurant JWTs have separate authorization checks.
- Customers can only read, cancel, delete, and subscribe to their own orders.
- Restaurant sockets and APIs require restaurant authentication.
- Order item names and prices are snapshotted so historical orders remain accurate after menu changes.
- Status transitions are sequential, and delivered or cancelled orders are terminal.
- Helmet, allow-listed CORS, rate limiting, JSON size limits, validation, and centralized error handling protect the API boundary.
- Secrets are loaded through environment variables and excluded from Git.

## Challenges and solutions

- **Untrusted cart totals:** the server accepts IDs and quantities, then calculates the total from stored menu prices.
- **Changing menu records:** each order keeps an immutable name and price snapshot while retaining its menu reference.
- **Private real-time updates:** customers join owner-checked order rooms instead of receiving global broadcasts.
- **Two-sided consistency:** the database update completes before Socket.IO notifies the restaurant and customer.
- **Invalid status changes:** the service rejects skipped, reversed, and terminal-state transitions.
- **Test isolation:** API tests use an ephemeral MongoDB and clear state between tests.
- **Deployed client routing:** Vercel rewrite configurations serve `index.html` for direct React Router URLs such as `/login` and `/restaurant`.

## Deployment

### Frontend — Vercel

- Root Directory: `client`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://quick-bite-2y79.onrender.com/api`
  - `VITE_SOCKET_URL=https://quick-bite-2y79.onrender.com`

The repository includes Vercel SPA rewrites at both the repository root and `client` root. Direct visits and refreshes on React Router paths therefore load `index.html` instead of returning a Vercel 404.

### Backend — Render

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Required environment variables: `PORT`, `MONGODB_URI`, `CLIENT_ORIGIN`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `RESTAURANT_ACCESS_KEY`

### Database — MongoDB Atlas

- Use a least-privilege database user.
- Keep the connection string only in the backend environment configuration.
- Restrict network access to the backend provider whenever practical.
- Run the seed command once against the intended database.
- Rotate any credential that has been shared outside the deployment platform.

For multiple backend instances, add the Socket.IO Redis adapter so real-time events can cross processes.

## AI usage

AI was used as a development assistant to translate the assessment into a traceable checklist, propose structure, draft implementation and tests, review edge cases, and improve documentation. The implementation, configuration, security choices, deployment secrets, live behavior, and final submission still require human review and verification.

## Author

**Siddharth Gautam**
