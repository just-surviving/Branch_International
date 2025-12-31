# Branch Messaging Platform: Project Report

## 1. Project Overview

The Branch Messaging Platform is a comprehensive customer support solution designed to facilitate real-time, high-priority communication between customers and support agents. The system prioritizes urgent issues (like fraud) and provides a seamless, reactive interface for agents handling multiple conversations simultaneously.

![Project Dashboard](./screenshots/dashboard_view.png)
*(Place your dashboard screenshot here)*

---

## 2. Approach & Strategy

### Problem Solving Methodology
My approach focused on **User Experience (UX) first**, backed by a robust **Event-Driven Architecture**.

1.  **Real-Time First**: Traditional polling creates latency. By implementing **Socket.io** as the core communication layer, I ensured that messages, typing indicators, and agent presence are synchronized instantaneously across all clients.
2.  **Operational Efficiency**: Support agents are often overwhelmed. I introduced an **Automated Urgency Detection System** that analyzes message content in real-time, tagging and sorting conversations so agents address critical issues (like "fraud") first.
3.  **Separation of Concerns**: The application is split into two distinct portals:
    *   **Customer Portal**: Simplified, unauthenticated (User ID based) entry for low friction.
    *   **Agent Portal**: robust, authenticated dashboard with history, search, and context tools.

### Strategies for Safety & Adaptability

*   **Type Safety**: The entire stack (Frontend, Backend, Database) is written in **TypeScript**. This prevents runtime errors and ensures data integrity as it flows from the UI to the Database.
*   **Data Integrity**: I used **Prisma ORM** with PostgreSQL. This enforces strict schema validation (e.g., ensuring `userId` is unique where required) and manages entity relationships (Customer -> Messages) safely.
*   **Resilience**: The WebSocket layer includes automatic reconnection logic (exponential backoff) and state synchronization. If a connection drops, the client automatically attempts to rejoin, ensuring no messages are missed.
*   **Adaptability**: The "Urgency Keyword" system is designed as a standalone service (`urgencyDetectionService.ts`). It can be easily updated or replaced with an AI/LLM-based classifier in the future without refactoring the core logic.

---

## 3. Trade-offs Considered

During development, several key technical decisions involved trade-offs:

| Decision | Trade-off | Rationale |
| :--- | :--- | :--- |
| **Monolithic server vs. Microservices** | Scalability vs. Development Speed | A monolithic Node.js/Express server was chosen to reduce deployment complexity and latency for this MVP. Scaling can be achieved by running multiple instances behind a load balancer with a Redis Adapter for sockets. |
| **WebSockets vs. Polling** | Server Memory vs. Real-time UX | Sockets consume open connections/memory on the server but provide the "instant" feel critical for chat. Polling is stateless but chatty and laggy. I chose Sockets for the premium UX. |
| **Relational (SQL) vs. NoSQL** | Schema Flexibility vs. Data Consistency | Chat logs are often unstructured, favoring NoSQL. However, the requirement for strict relationships (Customers, Conversations, Agents) made PostgreSQL the safer, more robust choice for data consistency. |

---

## 4. System Architecture

![Architecture Diagram](./screenshots/architecture_diagram.png)
*(Optional: Place architecture diagram here)*

### High-Level Design

The system follows a classic client-server architecture:

*   **Frontend**: React + Vite (Fast, optimized bundle).
*   **Backend**: Node.js + Express (API) + Socket.io (Real-time).
*   **Database**: PostgreSQL.

### Data Flow Logic

1.  **Message Emission**:
    *   Customer sends a message via `message:new`.
    *   Input is sanitized and validated.
2.  **Urgency Analysis**:
    *   Content is passed through `detectUrgency(content)`.
    *   Keywords like "hacked" trigger a `CRITICAL` score (10/10).
3.  **Persistence**:
    *   Prisma wraps the database write operations in a transaction to ensure the Message and Conversation state are updated atomically.
4.  **Broadcast**:
    *   Server emits `message:received` to all connected Agents.
    *   Agent clients update their internal Redux-like state store immediately.

### Key Components

*   **`messageSocket.ts`**: The central nervous system of the backend, handling all event routing.
*   **`useSocket.ts`**: Frontend hook implementing the **Singleton Pattern** for socket connections, preventing memory leaks during navigation.
*   **`MessageThread.tsx`**: Optimized React component that handles optimistic UI updates (showing message immediately) while waiting for server confirmation.

---

## 5. Future Improvements

*   **AI Integration**: Replace Regex urgency detection with OpenAI API for sentiment analysis.
*   **Authentication**: Add JWT-based auth for customers (currently User ID only).
*   **Mobile App**: Port the React frontend to React Native.

---

**© 2025 Branch International**
