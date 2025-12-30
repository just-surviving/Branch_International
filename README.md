# Branch Messaging Platform

A production-ready customer service messaging platform built with React, Node.js, PostgreSQL, and real-time WebSocket communication.

## Features

- **Real-time Messaging** - Instant bidirectional communication using Socket.io
- **Intelligent Urgency Detection** - Keyword-based prioritization (CRITICAL/HIGH/MEDIUM/LOW)
- **Multi-Agent Support** - Multiple customer service agents can handle conversations simultaneously
- **Advanced Search** - Full-text search across messages, customers, and conversations
- **Canned Responses** - Pre-built quick-reply templates for common inquiries
- **Customer Context Panel** - Complete customer information display for agents
- **Dark/Light Theme** - Toggle between themes with persistent preferences
- **Resizable Sidebar** - Draggable conversation list panel

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript, Socket.io |
| **Database** | PostgreSQL with Prisma ORM |
| **DevOps** | Docker, Docker Compose |

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone & Install

```bash
git clone <repository-url>
cd branch-messaging-platform

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations and seed data
cd backend
npx prisma migrate dev
npm run seed
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access the Application

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Agent Portal |
| http://localhost:5173/customer | Customer Message Form |
| http://localhost:3000/api | Backend API |

### Demo Accounts

Login with any of these emails (password not required for demo):

- `sarah.johnson@branch.com`
- `michael.chen@branch.com`
- `emily.rodriguez@branch.com`
- `david.kim@branch.com`

## Project Structure

```
branch-messaging-platform/
├── backend/
│   ├── prisma/           # Database schema and migrations
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── sockets/      # WebSocket handlers
│   │   └── server.ts     # Express app entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API & Socket services
│   │   └── App.tsx       # Root component
│   └── package.json
├── docker-compose.yml    # Container orchestration
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | List all conversations |
| GET | `/api/conversations/:id` | Get conversation with messages |
| GET | `/api/messages` | List messages with filters |
| POST | `/api/messages/:id/reply` | Send agent reply |
| GET | `/api/search?q=query` | Global search |
| GET | `/api/canned-responses` | Get quick reply templates |
| GET | `/api/stats` | Dashboard statistics |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `agent:join` | Client → Server | Agent connects |
| `message:new` | Client → Server | Customer sends message |
| `message:reply` | Client → Server | Agent sends reply |
| `message:received` | Server → Client | New message broadcast |
| `message:sent` | Server → Client | Reply confirmation |

## Urgency Detection

Messages are automatically scored 1-10 based on content:

| Level | Score | Keywords |
|-------|-------|----------|
| CRITICAL | 10 | fraud, hacked, locked out, emergency |
| HIGH | 8 | rejected, denied, payment failed, loan approval |
| MEDIUM | 5 | help, question, how to |
| LOW | 3 | thanks, information, ok |

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

```env
# backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/branch_messaging"
PORT=3000
FRONTEND_URL="http://localhost:5173"

# frontend/.env
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="http://localhost:3000"
```

## Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d
```

## Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Demo Script

Run the automated demo to simulate real-time customer messages:

```bash
node demo-script.js staggered
```

## License

© 2025 Branch International. All rights reserved.
