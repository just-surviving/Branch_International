Branch Messaging Platform - Code Documentation
Real-time Customer Support & Urgency Detection System

Author: Abhinav Sharma
Email: abhinavsharma.career1@gmail.com
GitHub: https://github.com/just-surviving/Branch_International

Table of Contents
1. Project Overview
2. Tech Stack & Justification
3. System Architecture
4. Key Features
5. Design Decisions & Trade-offs
6. Safety & Adaptability Strategy
7. Project Structure
8. Getting Started
9. AI Tools Usage
10. Future Enhancements

1. Project Overview
Problem Statement
Financial institutions receive thousands of customer queries daily. Critical issues like "fraud" or "account hacking" often get buried under routine inquiries about "balance checks" or "loan status," leading to delayed responses and financial loss.
Organizations need a way to:
- Instantly identify and prioritize high-risk messages.
- Manage concurrent conversations across multiple agents efficiently.
- seamless real-time communication without page refreshes.

Solution
The Branch Messaging Platform is a full-stack real-time support system designed for high-stakes financial environments. The platform handles:
- **Intelligent Triage**: Automatically scans and tags messages (Critical, High, Medium, Low) based on content.
- **Real-time Sync**: Instant bi-directional messaging using WebSockets.
- **Agent Presence**: Live tracking of online agents to prevent collision.
- **Unified History**: Persistent chat history stored in a relational database.

2. Tech Stack & Justification
| Category | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | High-performance rendering, component reusability, and fast build times. |
| **Language** | TypeScript 5.0+ | End-to-end type safety to prevent runtime errors in financial data handling. |
| **Styling** | Tailwind CSS | Utility-first approach for rapid UI development and consistant theming. |
| **Real-time** | Socket.io | Reliable event-based communication with automatic reconnection strategies. |
| **Backend** | Node.js + Express | Non-blocking I/O ideal for handling concurrent WebSocket connections. |
| **Database** | PostgreSQL | ACID-compliant relational database ensuring data integrity for customer records. |
| **ORM** | Prisma | Type-safe database queries and intuitive schema management. |

3. System Architecture
High-Level Architecture
(Note: Monolithic Architecture for MVP Efficiency)

Plaintext
┌─────────────────────────────────────────────────────────────────┐
│                       PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│    React Client (Vite)    │    Tailwind CSS    │   Socket.io    │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Login   │ │Customer  │ │  Agent   │ │ Search   │            │
│  │   Page   │ │ Portal   │ │Dashboard │ │  Bar     │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │ ▲
                    REST API  │ │ WebSocket Events
                              ▼ │
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                   Node.js / Express Server                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │
│  │   API       │ │  Socket     │ │  Urgency    │                │
│  │   Routes    │ │  Manager    │ │  Engine     │                │
│  └─────────────┘ └─────────────┘ └─────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                       Prisma ORM                                │
│      (Transactions, Relations, Schema Validation)               │
├─────────────────────────────────────────────────────────────────┤
│                       PostgreSQL                                │
└─────────────────────────────────────────────────────────────────┘

Component Hierarchy

Plaintext
App
├── Toaster (Global Notifications)
├── Routes
│   ├── Login Page
│   ├── Customer Portal (Public)
│   │   ├── CustomerMessageForm
│   │   └── MessageHistoryList
│   └── Agent Portal (Private)
│       ├── Sidebar (Conversation List)
│       ├── TopBar (Agent Status, Analytics)
│       └── MessageThread (Main Chat Area)
│           ├── MessageBubble
│           └── ReplyInput


4. Key Features
4.1 Intelligent Urgency Detection
- **Mechanism**: Regex-based keyword analysis engine (`urgencyDetectionService.ts`).
- **Scoring**: Assigns 1-10 priority score. Keywords like "fraud", "hacked" trigger CRITICAL status.
- **UI Impact**: Critical messages jump to the top of the queue with visual red badges.

4.2 Real-time Messaging
- **Instant Delivery**: Messages appear immediately via optimistic UI updates while sending in background.
- **Typing Indicators**: Ephemeral events (`agent:typing`) show activity without database writes.
- **Sync**: Multi-tab support ensures agents see the same state across windows.

4.3 Agent Dashboard
- **Queue Management**: Filter conversations by urgency, status (Open/Resolved), or IDs.
- **Customer Context**: Side panel displaying customer details (Name, Credit Score, Account Status).
- **History**: Infinite scroll support for reading past conversation context.

5. Design Decisions & Trade-offs
5.1 WebSockets vs Polling
- **Decision**: Use Socket.io (WebSockets).
- **Trade-offs**:
  ✅ Instantaneous updates (sub-100ms latency).
  ✅ Reduced server load (no constant HTTP polling).
  ❌ Stateful connections require sticky sessions if scaling horizontally.
- **Mitigation**: Architecture allows adding a Redis Adapter for multi-instance scaling.

5.2 SQL (Postgres) vs NoSQL (MongoDB)
- **Decision**: PostgreSQL with Prisma.
- **Trade-offs**:
  ✅ Strict schema ensures message objects always map to valid customers/agents.
  ✅ ACID transactions are critical for financial compliance.
  ❌ Slightly more complex setup than a document store.
- **Mitigation**: Prisma makes relational queries developer-friendly.

5.3 Client-Side vs Server-Side Search
- **Decision**: Server-side Full Text Search.
- **Trade-offs**:
  ✅ Scalable to millions of records.
  ❌ Network latency on keystrokes.
- **Mitigation**: Debounced input on frontend prevents API flooding.

6. Safety & Adaptability Strategy
6.1 Safety Considerations
- **Type Safety**: strict `tsconfig` settings prevent type coercion errors.
- **Input Validation**: Backend parses and validates all `userId` inputs (Int vs String) before DB queries to prevent crashes.
- **Transaction Integrity**: Message creation and Conversation timestamp updates happen in a single Prisma transaction.

6.2 Adaptability Strategy
- **Modular Services**: Urgency detection is a standalone service function. It can be swapped for an OpenAI API call without changing the socket controller.
- **Environment Config**: All ports, database URLs, and frontend origins are strictly controlled via `.env` files for easy deployment across Staging/Prod.

7. Project Structure

Plaintext
branch-messaging-platform/
├── backend/
│   ├── prisma/             # Database Schema
│   ├── src/
│   │   ├── controllers/    # HTTP Route Controllers
│   │   ├── services/       # Business Logic (Urgency, etc)
│   │   ├── sockets/        # WebSocket Event Handlers
│   │   └── server.ts       # Entry Point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── agent/      # Agent-specific UI
│   │   │   ├── customer/   # Customer-specific UI
│   │   │   └── common/     # Reusable UI
│   │   ├── hooks/          # Custom Hooks (useSocket)
│   │   ├── services/       # API & Socket Clients
│   │   └── App.tsx
│   └── package.json
├── docker-compose.yml      # Container Orchestration
└── PROJECT_REPORT.md       # Documentation

8. Getting Started
Prerequisites
- Node.js 18.x or higher
- PostgreSQL (local or Docker)

Installation
1. Clone the repository:
   git clone https://github.com/just-surviving/Branch_International.git
   cd branch-messaging-platform

2. Install dependencies:
   cd backend && npm install
   cd ../frontend && npm install

3. Database Setup:
   cd backend
   # Update .env with your DATABASE_URL
   npx prisma migrate dev
   npm run seed

4. Start Development Servers:
   # Terminal 1 (Backend - Port 3001)
   cd backend && npm run dev
   
   # Terminal 2 (Frontend - Port 5173)
   cd frontend && npm run dev

9. AI Tools Usage
This project utilized advanced AI agents to accelerate robustness and debugging:

| Tool | Usage |
| :--- | :--- |
| **Claude / LLMs** | Architecture planning, generating boilerplate for Prisma schema and React components. |
| **AI Agents** | Debugging complex race conditions in WebSocket connection logic and "userId" type mismatch errors. |
| **GitHub Copilot** | Inline code completion for Tailwind classes and utility functions. |

How AI Enhanced Development
- **Debugging**: Identified a critical bug where `userId` string inputs were crashing integer-based database queries using log analysis.
- **Refactoring**: Assisted in converting the `useSocket` hook to a Singleton pattern to prevent memory leaks.
- **Time Savings**: Reduced debugging time by ~60%.

10. Future Enhancements
Short-term
[ ] Add JWT Authentication for Customers.
[ ] Implement specific "Canned Responses" management UI.
[ ] Export conversation transcripts to PDF.

Medium-term
[ ] Integrate OpenAI API for AI-suggested replies.
[ ] Mobile App (React Native) for agents on the move.
[ ] Role-based access control (Admin vs Agent).

Long-term
[ ] Predictive analytics for support volume.
[ ] Voice-to-text integration for customer messages.

Contact
Abhinav Sharma
GitHub: @just-surviving
Email: abhinavsharma.career1@gmail.com
Built with ❤️ for Branch International
