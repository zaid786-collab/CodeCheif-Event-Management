# 🚀 CodeChef Campus Club Platform
### *Code. Compete. Create.*

A production-quality **College Coding Club Event Management & Competitive Programming Website** built for a college **CodeChef Chapter**. Designed with an original, dark developer-first visual identity inspired by modern competitive programming judges, high-stakes hackathon platforms, and developer ecosystems.

---

## 🌟 Key Highlights & Features

- **Developer-Oriented Visual Identity**:
  - Deep obsidian dark mode (`#0B0D13`) accented with CodeChef warm orange (`#F97316`) and crimson red (`#EF4444`).
  - Terminal-style windows with interactive judge verdicts (`AC - 0.04s`), line-by-line syntax styling, and copy buttons.
  - Category badges (`CP-01`, `HACK-04`, `WKP-02`, `AI-03`) with custom color coding.
  - Live ticking countdown HUD to upcoming flagship contests.
  - Dynamic capacity progress bars (e.g. `78 / 100 registered`).

- **Real Database Persistence (MongoDB & Mongoose)**:
  - **No mock/static data** — all events and registrations are stored and dynamically retrieved from MongoDB.
  - Real-time aggregation of seats filled and remaining capacity.
  - Automatic compound indexes on `{ eventId: 1, email: 1 }` strictly preventing duplicate registrations.

- **Student Event Registration & Confirmation Experience**:
  - Validated multi-field registration modal (Name, Email, College, Academic Year, Phone, Branch, Roll Number).
  - Confetti burst animation upon confirmation.
  - Unique verified entry Ticket ID generation (`CC-CP-01-XXXXXX`).
  - Duplicate registration protection returning clean `409 Conflict` feedback.

- **Executive Admin Console (`/admin`)**:
  - Distinct SaaS dashboard interface with responsive sidebar and mobile drawer.
  - **JWT Authentication** with password hashing using `bcryptjs` and session persistence.
  - Real-time analytics: Total Events, Upcoming Contests, Total Registrations, Active Featured Flagship.
  - Breakdown visualizations by category domains and student academic years.
  - Full Event CRUD (Create, Edit, Delete with confirmation modal, Toggle Featured status).
  - Registration Desk with live search, year/event filtering, individual ticket inspection modal, and **CSV Export**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v18) + Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS + Custom CSS Design Tokens & Glassmorphism
- **Iconography**: Lucide React
- **Animations & Effects**: Framer Motion, Canvas Confetti

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) + BcryptJS password hashing
- **Security & Middleware**: CORS, centralized error handling, protected admin routes

---

## 📂 Architecture & Folder Structure

```text
codechef-college/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & reconnect logic
│   │   ├── models/
│   │   │   ├── Event.js              # Event schema, virtuals, and indexes
│   │   │   ├── Registration.js       # Registration schema with unique compound index
│   │   │   └── Admin.js              # Admin schema with bcrypt hashing methods
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT bearer verification middleware
│   │   │   └── errorHandler.js       # Centralized 400/401/404/409/500 handler
│   │   ├── controllers/
│   │   │   ├── eventController.js    # CRUD, search, filter, featured toggle
│   │   │   ├── registrationController.js # Register, list, search, export
│   │   │   └── adminController.js    # Login, profile, dashboard stats
│   │   ├── routes/
│   │   │   ├── eventRoutes.js        # /api/events routes
│   │   │   ├── registrationRoutes.js # /api/registrations routes
│   │   │   └── adminRoutes.js        # /api/admin routes
│   │   ├── utils/
│   │   │   └── seed.js               # Seed script with realistic events & registrations
│   │   └── server.js                 # Express app entrypoint & API bindings
│   ├── .env                          # Local environment variables
│   ├── .env.example                  # Environment template
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # Centralized fetch wrapper & error mapper
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Glassmorphic top navigation & mobile menu
│   │   │   ├── Footer.jsx            # Chapter info, domains, and quick links
│   │   │   ├── EventCard.jsx         # Card with progress bar & category styles
│   │   │   ├── CountdownTimer.jsx    # Live ticking contest countdown HUD
│   │   │   ├── CodeTerminal.jsx      # Interactive code editor & judge simulator
│   │   │   ├── StatCard.jsx          # Metric cards with glow indicators
│   │   │   ├── SkeletonLoader.jsx    # Animated loading placeholders
│   │   │   ├── ConfirmModal.jsx      # Reusable accessible action modal
│   │   │   ├── AdminSidebar.jsx      # Dashboard sidebar with mobile drawer
│   │   │   └── ProtectedRoute.jsx    # Route guard for /admin/* paths
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Admin session & token state
│   │   │   └── ToastContext.jsx      # Animated toast notifications
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Hero, stats, curriculum, featured, terminal
│   │   │   ├── EventsPage.jsx        # Search, category pills, sort, cards grid
│   │   │   ├── EventDetailPage.jsx   # Rules, countdown, registration modal & ticket
│   │   │   ├── AboutPage.jsx         # Mission, vision, 4 pillars, leadership
│   │   │   ├── ContactPage.jsx       # Inquiries form, campus office, FAQs
│   │   │   ├── AdminLoginPage.jsx    # Executive JWT authentication form
│   │   │   ├── AdminDashboardPage.jsx# Metrics, category & year charts, recent regs
│   │   │   ├── AdminEventsPage.jsx   # Add/Edit/Delete/Toggle Featured events
│   │   │   └── AdminRegistrationsPage.jsx # Table, search, filter, CSV export
│   │   ├── styles/
│   │   │   └── index.css             # Tailwind base, utilities, and glass styles
│   │   ├── App.jsx                   # Layouts and Route definitions
│   │   └── main.jsx                  # React DOM root
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                      # Workspace helper scripts
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** running locally on port `27017` (or provide a MongoDB Atlas connection URI)

### 2. Environment Setup

#### Server Configuration (`server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/codechef_club
JWT_SECRET=supersecret_codechef_campus_club_jwt_key_2026_dev
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@codechefclub.com
ADMIN_PASSWORD=CodeChef@123
```

#### Client Configuration (`client/.env`):
```env
VITE_API_URL=/api
```

---

### 3. Install Dependencies & Seed Database

```bash
# 1. Install Server Dependencies
cd server
npm install

# 2. Seed Database with Realistic Contests, Registrations & Admin
npm run seed

# 3. Install Client Dependencies
cd ../client
npm install
```

---

### 4. Running the Application

You can run both concurrently or in separate terminals:

#### Terminal 1 — Backend:
```bash
cd server
npm run dev
# Server starts on http://127.0.0.1:5000
```

#### Terminal 2 — Frontend:
```bash
cd client
npm run dev
# Frontend starts on http://127.0.0.1:5173
```

Now open **`http://localhost:5173`** in your browser!

---

## 🔐 Admin Authentication Credentials

| Role | Email | Password |
|---|---|---|
| **Executive Admin** | `admin@codechefclub.com` | `CodeChef@123` |

Access the portal directly at:
👉 **`http://localhost:5173/admin/login`** (or click **Admin** in the top navigation).

---

## 📡 REST API Reference

### Public Endpoints

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/health` | Healthcheck & server uptime | — |
| `GET` | `/api/events` | List events with registration counts | `category`, `search`, `sort`, `limit` |
| `GET` | `/api/events/featured`| Returns active flagship event | — |
| `GET` | `/api/events/:idOrSlug` | Returns single event details & seats left | — |
| `POST` | `/api/registrations` | Register student for an event | Body: `{ eventId, name, email, college, year, phone, branch, rollNumber }` |

### Admin Endpoints *(Requires `Authorization: Bearer <token>`)*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Authenticate admin & return JWT token |
| `GET` | `/api/admin/me` | Fetch authenticated admin details |
| `GET` | `/api/admin/stats` | Dashboard metrics & domain analytics |
| `POST` | `/api/events` | Create new contest / workshop |
| `PUT` | `/api/events/:id` | Update event information |
| `DELETE` | `/api/events/:id` | Delete event & cascade delete registrations |
| `PATCH` | `/api/events/:id/toggle-featured` | Toggle single featured event flag |
| `GET` | `/api/registrations` | List, search & filter registrations (`search`, `eventId`, `year`) |
| `GET` | `/api/registrations/:id` | View registration ticket details |
| `DELETE` | `/api/registrations/:id` | Cancel student registration |

---

## 🧪 Verification & Automated Testing

The project includes an end-to-end verification script testing:
1. Server health check
2. Events catalog loading
3. Slug & ID resolution
4. Featured event retrieval
5. Dynamic student registration with ticket generation
6. Strict duplicate registration prevention (409 Conflict)
7. Admin JWT authentication & route security
8. Protected dashboard analytics
9. Admin event creation & deletion
10. Toggle featured event flag
11. Registration search & filtering

---

## 🎯 Production Quality Checklist Passed

- [x] Responsive layout across Mobile, Tablet, Laptop, and Desktop.
- [x] Translucent frosted navbar on scroll with mobile drawer.
- [x] Interactive simulated CodeChef judge terminal with execution verdict.
- [x] Dynamic live countdown timers.
- [x] MongoDB database persistence across restarts.
- [x] Strict duplicate prevention on `eventId` + `email`.
- [x] Confirmation dialogs before destructive actions.
- [x] Export to CSV for attendee check-in.
- [x] Zero build warnings or bundle compilation errors.
