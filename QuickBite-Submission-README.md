# QuickBite — Full Stack Developer Assignment

Thank you for reviewing my submission. QuickBite is a MERN-stack food-ordering application with separate customer and restaurant experiences, persistent MongoDB storage, REST APIs, and live order updates through Socket.IO.

## Project links

- **Live application:** https://quick-bite-rho-three.vercel.app/login
- **GitHub repository:** https://github.com/SidxRengen/quick-bite
- **Backend health check:** https://quick-bite-2y79.onrender.com/api/health

## Reviewer access

### Customer application

1. Open the live application.
2. Select **Create an account** and register with any valid test name, email, and password of at least eight characters.
3. Browse the menu, add items to the cart, change quantities, and proceed to checkout.
4. Enter a delivery address and phone number, then place the order.
5. The latest order appears in the expandable tracker at the bottom of the screen and receives status changes in real time.

### Restaurant workspace

1. Open `[LIVE_APPLICATION_URL]/restaurant`.
2. Enter the assessment access key: **[ADD_RESTAURANT_TEST_ACCESS_KEY]**.
3. Newly placed customer orders appear in the restaurant queue.
4. Advance an order through **Order Received → Preparing → Out for Delivery → Delivered**.
5. Open the integrated menu-management section to add, edit, hide, or delete menu items.

The restaurant access key above is intended only for assessment review. It should be changed or removed after the evaluation.

## Main features

- Email/password authentication with hashed passwords and JWT sessions
- Responsive menu cards with images, descriptions, prices, categories, and image fallbacks
- Cart quantity controls and server-validated checkout
- Authenticated order creation with server-calculated totals
- Customer order history and expandable live status tracker
- Restaurant order queue with sequential status management
- Real-time customer and restaurant updates through Socket.IO
- Integrated menu administration for create, edit, availability, and delete operations
- MongoDB/Mongoose persistence, validation, indexes, and order snapshots
- REST health, menu, authentication, order, restaurant, and status APIs
- Snackbar feedback, loading states, error states, empty states, and responsive layouts
- Automated backend API and frontend component tests

## Technology

- **Frontend:** React, Vite, React Router DOM, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, JWT, bcryptjs
- **Database:** MongoDB Atlas with Mongoose
- **Testing:** Vitest, Supertest, MongoDB Memory Server, Testing Library

## Run locally

Requirements: Node.js 20+ and a MongoDB connection.

```bash
git clone https://github.com/SidxRengen/quick-bite.git
cd quick-bite
npm install
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Add a MongoDB URI, JWT secret, and private restaurant key to `server/.env`, then run:

```bash
npm run seed --prefix server
npm run dev
```

- Customer application: `http://localhost:5173`
- Restaurant workspace: `http://localhost:5173/restaurant`
- Backend API: `http://localhost:8008/api`
- Health check: `http://localhost:8008/api/health`

## Tests and production build

```bash
npm test
npm run build --prefix client
```

The automated backend tests use an isolated in-memory MongoDB instance and do not modify the configured development or production database.

## Architecture summary

The React client communicates with an Express REST API using authenticated JWT requests. MongoDB stores users, menu items, and orders. The server calculates order prices from current database records rather than trusting client totals. Socket.IO uses protected customer order rooms and a protected restaurant channel so that order placement and status changes appear immediately in the correct interface.

The codebase separates routes, controllers, services, models, middleware, pages, components, hooks, and API utilities to keep business rules testable and the application easy to extend.

## Notes

- No database credentials, JWT secrets, or deployment secrets are committed to the repository.
- Environment examples document all required variables.
- The complete assessment checklist, API reference, architecture decisions, challenges, AI-usage disclosure, deployment guidance, and walkthrough outline are available in the repository's main `README.md`.

## Submitted by

Siddharth Gautam
