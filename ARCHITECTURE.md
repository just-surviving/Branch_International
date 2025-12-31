# System Architecture: Branch Messaging Platform

## Overview

The Branch Messaging Platform is a real-time customer support system designed to handle high-concurrency messaging between customers and support agents. It utilizes a modern event-driven architecture powered by WebSockets to ensure instant message delivery and state synchronization.

## High-Level Architecture

The system follows a classic client-server architecture with a database layer:

1.  **Client Layer (Frontend)**: Two distinct portals built with React.
    *   **Agent Portal**: A dashboard for support agents to manage conversations, view customer history, and reply to messages.
    *   **Customer Portal**: A simplified interface for customers to submit inquiries and view their message history.
2.  **Application Layer (Backend)**: A Node.js/Express server that handles HTTP requests (REST API) and acts as a WebSocket server (Socket.io) for real-time events.
3.  **Data Layer (Database)**: PostgreSQL database managed via Prisma ORM for type-safe database interactions.

## Data Flow

### 1. Real-Time Messaging Flow

When a customer sends a message:
1.  **Emission**: The `CustomerMessageForm` component connects to the WebSocket server and emits a `message:new` event with the payload `{ userId, content }`.
2.  **Processing**: The Backend socket handler (`messageSocket.ts`) intercepts this event.
    *   It parses the `userId` (converting string to Int) to look up the Customer entity.
    *   It runs the **Urgency Detection Service** to analyze the message content for keywords (e.g., "fraud", "urgent") and assigns a priority score.
    *   It creates a new `Message` record in the database within a transaction.
    *   It updates the `Conversation` timestamp.
3.  **Broadcasting**: If successful, the server emits a `message:received` event to all connected agents.
4.  **Reception**: The `AgentPortal` listens for `message:received` and instantaneously updates the Redux-like state (React Context/Hooks) to display the new message without a page refresh.

### 2. Synchronization Flow

*   **Agent Presence**: When an agent logs in, an `agent:join` event is emitted. The server tracks connected sockets and broadcasts the live `agents:count` to all clients.
*   **Typing Indicators**: `agent:typing` events are broadcast to the specific customer in the conversation to show "Agent is typing..." feedback.

## Key Components

### Frontend (`/frontend`)
*   **`useSocket` Hook**: A singleton interaction layer that manages the WebSocket connection lifecycle, ensuring only one connection exists per client to prevent memory leaks and duplicate events.
*   **`MessageThread` Component**: Handles the rendering of the chat timeline, optimistic UI updates, and scrolling behavior.
*   **Services**:
    *   `api.ts`: Axios-based HTTP client for fetching history, stats, and search results.
    *   `socketService.ts`: Wrapper around `socket.io-client` for type-safe event emission.

### Backend (`/backend`)
*   **`server.ts`**: Entry point. initializes Express, configures CORS (handling ports 3000, 3001, 5173), and attaches the WebSocket server.
*   **`messageSocket.ts`**: The core socket controller. managing all real-time events (`message:new`, `message:reply`, `conversation:resolve`).
*   **`urgencyDetectionService.ts`**: A utility service that regex-matches message content against a weighted keyword dictionary to determine urgency levels.
*   **Prisma Schema (`schema.prisma`)**: Defines the relational data model (Customer <-> Conversation <-> Message).

## Database Schema

*   **Customer**: Stores user profile (`userId` as Int, `email`, `name`).
*   **Agent**: Stores support staff credentials and status (`AVAILABLE`, `OFFLINE`).
*   **Conversation**: Represents a thread of communication. Tracks status (`OPEN`, `RESOLVED`) and urgency.
*   **Message**: Individual text entries. Stores `urgencyScore` and `direction` (`INBOUND`/`OUTBOUND`).

## Scalability Considerations

*   **Stateless REST API**: The HTTP layer is stateless, allowing for horizontal scaling behind a load balancer.
*   **Socket.io Adapter**: For scaling the WebSocket layer across multiple nodes, a Redis Adapter can be integrated to broadcast events across different server instances (not currently implemented in this monolithic demo).
*   **Connection Resilience**: The frontend implements automatic reconnection strategies (exponential backoff) to handle network jitter.

## Security

*   **Input Validation**: All incoming socket payloads are typed and parsed (e.g., `userId` validation).
*   **CORS**: Strict Origin policies ensure only authorized frontend domains can connect to the API and WebSocket server.
