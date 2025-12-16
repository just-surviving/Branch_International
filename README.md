# Branch Messaging Platform 🚀

A complete, production-ready customer service messaging platform for Branch International built with React, Node.js, PostgreSQL, and real-time WebSocket communication.

## ✨ Features

- **Real-time Messaging**: Instant bidirectional communication using Socket.io
- **Intelligent Urgency Detection**: Keyword-based algorithm to prioritize customer messages (CRITICAL/HIGH/MEDIUM/LOW)
- **Multi-Agent Support**: Multiple customer service agents can handle conversations simultaneously
- **CSV Data Import**: Automatically imports 100 real customer messages from provided CSV file
- **Advanced Search**: Full-text search across messages, customers, and conversations
- **Canned Responses**: 12 pre-built quick-reply templates across 7 categories
- **Customer Context Panel**: Complete customer information (credit score, loan status, account details)
- **Modern UI/UX**: Built with React 18, TypeScript, Tailwind CSS
- **Agent Dashboard**: Three-panel layout (conversations, messages, customer info)
- **Customer Portal**: Public-facing message submission form
- **🆕 Resizable Sidebar**: WhatsApp-style draggable conversation list (280px - 600px)
- **🆕 Dark/Light Theme**: Toggle between themes with persistent preferences
- **🆕 Smart Auto-Sorting**: Conversations automatically sorted by urgency level

## 🎬 Real-Time Demo

### Quick Demo Setup

1. **Start the application**:
   ```powershell
   # Terminal 1 - PostgreSQL
   docker start postgres-branch
   
   # Terminal 2 - Backend
   cd backend
   npm run dev
   
   # Terminal 3 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Open Agent Portal**: http://localhost:5173/login
   - Login as: `michael.chen@branch.com`

3. **Run automated demo** (in new terminal):
   ```powershell
   node demo-script.js staggered
   ```

4. **Watch real-time magic** ✨
   - 6 customers send messages
   - Conversations appear instantly
   - Auto-sorted by urgency (CRITICAL → LOW)
   - Real-time message delivery

### Demo Modes
- `sequential` - One scenario at a time (easy to follow)
- `parallel` - All at once (high volume simulation)
- `staggered` - 2-second delays (realistic, **recommended**)

📖 **Full demo guide**: See `DEMO_GUIDE.md` for complete scenarios  
🚀 **Quick start**: See `DEMO_QUICK_START.md` for video recording tips

## 🛠️ Technology Stack

**Backend:** Node.js 18+ • Express • TypeScript • Socket.io • PostgreSQL • Prisma ORM  
**Frontend:** React 18 • TypeScript • Vite • Tailwind CSS • Socket.io-client • React Router  
**DevOps:** Docker • Docker Compose

## 🚀 Quick Start with Docker

```bash
# Start all services (recommended)
docker-compose up --build

# Access the application
# Agent Portal: http://localhost:5173
# Customer Form: http://localhost:5173/customer
# Backend API: http://localhost:3000/api
```

## 🎯 Demo Login

Navigate to http://localhost:5173 and use any of these demo accounts:
- `sarah.johnson@branch.com`
- `michael.chen@branch.com`
- `emily.rodriguez@branch.com`
- `david.kim@branch.com`

**Password:** any (demo mode)

## 📁 Full Project Structure

See complete 195-line structure in full README documentation.

## 🔍 Key API Endpoints

- `GET /api/messages` - List messages with filters
- `POST /api/messages/:id/reply` - Send agent reply
- `GET /api/conversations` - List conversations (sorted by urgency)
- `GET /api/search?q=query` - Global search
- `GET /api/stats` - Dashboard statistics
- `GET /api/canned-responses` - Quick reply templates

## 🌐 WebSocket Events

**Agent:** `agent:join`, `agent:typing`, `message:reply`  
**Customer:** `message:new`  
**System:** `message:received`, `message:sent`, `conversation:resolved`

## 🎨 Urgency Detection

Messages auto-scored 1-10:
- **CRITICAL (10)**: fraud, hack, locked out, emergency
- **HIGH (8)**: rejected, denied, payment failed
- **MEDIUM (5)**: help, question, how to
- **LOW (3)**: thanks, received, ok

## 📦 Local Development

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🐛 Troubleshooting

**Database connection issues:**
```bash
docker-compose restart postgres
```

**Port conflicts:**
```bash
npx kill-port 3000  # Backend
npx kill-port 5173  # Frontend
```

**Re-seed database:**
```bash
cd backend
npm run seed
```

## 📝 CSV Format

Required columns:
- `User ID` - Customer identifier
- `Timestamp (UTC)` - Message timestamp  
- `Message Body` - Customer message

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📊 Database Schema

**5 Models:** Customer, Message, Conversation, Agent, CannedResponse  
**5 Enums:** Direction, UrgencyLevel, MessageStatus, AgentStatus, ConversationStatus

## 🛠️ Development Scripts

**Backend:**
- `npm run dev` - Start with hot-reload
- `npm run build` - Compile TypeScript
- `npm run prisma:studio` - Open DB GUI

**Frontend:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview build

## 📄 License

Proprietary © 2024 Branch International

---

**Built with ❤️ using React • Node.js • PostgreSQL • Socket.io**
