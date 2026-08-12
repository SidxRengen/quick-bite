# QuickBite - MERN Order Management

QuickBite is a production-minded food ordering assessment project. Customers browse a seeded menu, manage quantities, enter delivery details, place an order, and watch its status progress live through Socket.IO.

## Assessment checklist

| Requirement / evaluation point | Implementation |
|---|---|
| Menu name, description, price, image | Responsive cards in `client/src/components/MenuCard.jsx`; persisted `MenuItem` model and seed data |
| Cart and quantity controls | Reusable `useCart` hook and accessible increment/decrement controls; zero removes, maximum 99 |
| Checkout: name, address, phone | Name comes from the authenticated account; the modal asks only for address and phone, with authoritative server validation |
| Place an order | `POST /api/orders`; server looks up current menu prices, calculates total, stores snapshot and history |
| Display order status | Expandable bottom order drawer with Order Received, Preparing, Out for Delivery, Delivered, and cancelled states |
| Real-time restaurant workflow | Restaurant receives new orders instantly and explicitly advances sequential statuses through REST + Socket.IO |
| Menu REST API | `GET /api/menu` returns available items |
| Restaurant menu management | The protected `/restaurant` workspace includes create, edit, availability toggle, and delete controls; legacy `/admin` redirects there |
| Order CRUD | Create/list/read, status update, and safe deletion of cancelled orders |
| Status update API | Restaurant-only `PATCH /api/restaurant/orders/:id/status`, sequential transitions, and terminal-state protection |
| MongoDB persistence | Mongoose schemas, validation, timestamps, reference IDs, order snapshots and indexes |
| Basic authentication | Email/password registration and login, bcrypt password hashing, expiring JWTs, session restore, sign-out, and owner-scoped orders/WebSockets |
| Robust validation / edge cases | Invalid IDs, empty carts, malformed customers, missing/unavailable items, duplicate item aggregation, quantity bounds, server-owned prices, terminal orders, 404s and safe errors |
| Clean scalable structure | Client components/hooks/API boundary; server routes/controllers/services/models/config/middleware |
| Security / API quality | Hashed passwords, customer JWTs, separate restaurant access-key JWT, order ownership, authenticated sockets, Helmet, allow-listed CORS, JSON size limit, rate limiting, REST status codes, and server-owned totals |
| Responsive UX | Loading, empty, failure, retry, submitting, confirmation and live states; mobile layout and accessible labels |
| Snackbar notifications | Reusable accessible snackbar stack for authentication, order placement, live status changes, restaurant events, menu actions and errors |
| Tests / TDD evidence | Vitest + Supertest + in-memory MongoDB API tests; Testing Library component tests |
| Documentation and delivery | This README includes setup, architecture, design decisions, AI usage, challenges, deployment, and walkthrough |

## Stack

- Frontend: React 19, Vite, Socket.IO client, plain responsive CSS
- Routing: React Router DOM with separate customer, login and restaurant workspaces, a protected customer route, legacy admin redirect, and not-found route
- Backend: Node.js, Express, Socket.IO, bcryptjs, JSON Web Tokens
- Persistence: MongoDB with Mongoose
- Tests: Vitest, Supertest, MongoDB Memory Server, Testing Library

## Local setup

Requirements: Node.js 20+ and MongoDB 7+ (local or Atlas).

```bash
npm install
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
# Set MONGODB_URI and a long random JWT_SECRET in server/.env
npm run seed --prefix server
npm run dev
```

Open `http://localhost:5173` for the customer app. The access-key-protected restaurant workspace is at `/restaurant` and contains both the live order board and menu management. The old `/admin` URL redirects to `/restaurant`. The backend runs on port `8008`; API health is at `http://localhost:8008/api/health`.

### Frontend structure

```text
src/App.jsx                  Route definitions only
src/context/AuthContext.jsx Session, login and logout state
src/routes/                 Route guards
src/pages/                  Customer, login, restaurant and not-found pages
src/components/             Reusable UI components
src/hooks/                  Menu, cart and real-time order behavior
src/api.js                  Backend request boundary
```

The included `client/public/_redirects` file provides the SPA fallback required for direct React Router URLs on Netlify-compatible hosting.

### Test and build

```bash
npm test
npm run build --prefix client
```

The tests use an ephemeral MongoDB and do not modify the development database.

## API reference

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/menu` | Available menu |
| GET | `/api/menu/admin` | List all menu items, including hidden ones (restaurant JWT) |
| POST | `/api/menu` | Create a menu item (restaurant JWT) |
| PATCH | `/api/menu/:id` | Edit item fields or availability (restaurant JWT) |
| DELETE | `/api/menu/:id` | Delete a menu item (restaurant JWT) |
| POST | `/api/restaurant/login` | Exchange the private access key for a 12-hour restaurant JWT |
| GET | `/api/restaurant/orders` | Restaurant queue with customer and item details |
| PATCH | `/api/restaurant/orders/:id/status` | Advance to the next restaurant status |
| POST | `/api/auth/register` | Create an account and receive a JWT |
| POST | `/api/auth/login` | Sign in and receive a JWT |
| GET | `/api/auth/me` | Read the authenticated user |
| GET | `/api/orders` | List the authenticated user's orders |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Read one order |
| PATCH | `/api/orders/:id/status` | Customer cancellation before preparation begins |
| DELETE | `/api/orders/:id` | Delete a cancelled order |

Order routes require `Authorization: Bearer YOUR_JWT`. Register with `{ "name": "Ada", "email": "ada@example.com", "password": "securepass123" }` or log in with email and password.

Restaurant order and menu-management routes require the restaurant JWT returned by `/api/restaurant/login`. The seed command inserts only missing sample items by name and never deletes or overwrites items created through the restaurant menu manager.

Create order payload:

```json
{
  "customer": { "address": "12 Computing Lane", "phone": "+91 9876543210" },
  "items": [{ "menuItemId": "MONGODB_OBJECT_ID", "quantity": 2 }]
}
```

New orders start at `Order Received`. Restaurant transitions must occur in order: `Preparing` → `Out for Delivery` → `Delivered`. Skipping or reversing a step returns `409`.

The API ignores any client-supplied customer name and snapshots the name from the authenticated user account when the order is created.

Customer sockets send the customer JWT as `auth.token`, then subscribe to their order room. Restaurant sockets send the restaurant JWT and join the protected kitchen feed. New orders and every restaurant status update are delivered instantly to the correct views.

## Architecture and design notes

```text
Customer UI -> customer JWT -> order API/service -> MongoDB
     ^                                |
     | Socket.IO order room           | Socket.IO kitchen feed
     |                                v
Bottom status drawer        Restaurant workspace -> restaurant JWT APIs
```

- Prices and item names are copied from the database at checkout. Historical orders stay accurate if menu data later changes, and malicious client prices are ignored.
- Business rules live in `orderService`, separate from HTTP and Socket.IO, so other delivery mechanisms can reuse them.
- An order records every status change. Terminal states cannot transition, preventing accidental regression after delivery/cancellation.
- At scale, use the Socket.IO Redis adapter, paginate restaurant history, and replace the shared restaurant access key with individual staff accounts and roles.
- Currency is stored as a number for assessment readability. A production payment system should store integer minor units (paise) or Decimal128.

## Challenges and solutions

- **Trust boundary:** cart totals can be manipulated in a browser. The API accepts only item IDs/quantities and recalculates from MongoDB.
- **Changing menu data:** order lines snapshot the purchased name and price while keeping a menu reference.
- **Real-time isolation:** global broadcasts can leak unrelated activity. Each tracker joins its own order room.
- **Authentication:** passwords are one-way hashed, JWTs expire, and REST/Socket.IO access checks order ownership.
- **Two-sided consistency:** the restaurant API saves the status first, then broadcasts the saved order to both the kitchen and the owning customer.
- **Invalid transitions:** delivered/cancelled orders are terminal; deleting active/history-bearing orders is rejected.
- **Test isolation:** API tests run against MongoDB Memory Server and clear collections after every test.

## AI usage notes

AI was used as a development assistant to translate the assessment into a traceable checklist, propose project structure, draft implementation/tests, and review edge cases and documentation. Human review remains necessary for product decisions, security policy, branding, live accessibility testing, deployment secrets, and production load testing. No hosted, GitHub, or Loom URL is claimed by this repository.

## Deployment guidance

### Database (MongoDB Atlas)

1. Create a cluster and least-privilege database user.
2. Configure network access for the backend host only where possible.
3. Set backend `MONGODB_URI` to the Atlas connection string; never commit it.
4. Run the seed once with the production URI from a controlled environment.

### Backend (Render, Railway, Fly.io, or a VM)

1. Deploy the `server` directory with `npm install` and `npm start`.
2. Set `PORT`, `MONGODB_URI`, `CLIENT_ORIGIN`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and a private `RESTAURANT_ACCESS_KEY`.
3. Ensure WebSocket upgrades are enabled and expose `/api/health` for health checks.
4. For multiple instances, configure the Socket.IO Redis adapter so customer and restaurant events cross instances.

### Frontend (Vercel, Netlify, or static hosting)

1. Use `client` as the root, build with `npm run build`, and publish `dist`.
2. Set `VITE_API_URL=https://YOUR_API_HOST/api` and `VITE_SOCKET_URL=https://YOUR_API_HOST` before building.
3. Add HTTPS, a suitable CSP, and the deployed frontend origin to backend CORS.

## 12-15 minute Loom walkthrough outline

1. **0:00-1:00 - Problem and checklist:** introduce the food-ordering flow and point to the assessment matrix.
2. **1:00-2:30 - Architecture:** show client/server boundaries, MongoDB models, and Socket.IO order rooms.
3. **2:30-5:30 - Customer demo:** register/login, browse menu, change quantities, validate checkout, and place an order.
4. **5:30-7:00 - Live tracking:** place an order, expand the bottom drawer, then update it from the restaurant dashboard.
5. **7:00-9:30 - Restaurant workspace and API:** demonstrate restaurant login, the integrated menu manager, queue retrieval, sequential status updates, customer ownership, status codes, and invalid transitions.
6. **9:30-11:30 - Code quality:** explain service/controller separation, server-calculated price, snapshots, history and terminal states.
7. **11:30-13:00 - Tests:** run the suite and highlight CRUD, validation, status and UI component coverage.
8. **13:00-14:00 - Scale/security/deployment:** discuss JWT/ownership, admin roles, queues, Redis, secrets, CORS and hosting.
9. **14:00-15:00 - AI/challenges/close:** explain transparent AI assistance, human verification, trade-offs and next steps.

## Deliberate production follow-ups

Before a public launch, add email verification, password reset, refresh-token rotation or secure cookie sessions, individual restaurant staff accounts/roles, granular menu-management permissions, request monitoring, idempotency keys, payments, and end-to-end browser tests.
