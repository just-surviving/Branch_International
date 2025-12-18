# 🚀 Branch Messaging Platform - Getting Started Guide

## ✅ Pre-Flight Checklist

Run the verification script:
```bash
node verify-setup.js
```

You should see "✓ All checks passed! Your project is ready to run."

---

## 🎯 Three Ways to Start the Application

### Option 1: Docker Compose (Recommended - Easiest) 🐳

**One command to rule them all:**

```bash
docker-compose up --build
```

This single command will:
- ✅ Start PostgreSQL database
- ✅ Run database migrations
- ✅ Seed database with 4 agents, 12 canned responses, and 100 CSV messages
- ✅ Start backend API on port 3000
- ✅ Start frontend on port 5173

**Wait for these messages:**
```
backend   | ✓ Database connected
backend   | ✓ CSV import complete: 100 messages imported
backend   | ✓ Server started on port 3000
frontend  | ➜  Local:   http://localhost:5173/
```

**Access the application:**
- Agent Portal: http://localhost:5173
- Customer Form: http://localhost:5173/customer
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/health

---

### Option 2: Local Development (Full Control) 💻

**Terminal 1 - Start PostgreSQL:**
```bash
docker run --name postgres-branch `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=branch_messaging `
  -p 5432:5432 -d postgres:14
```

**Terminal 2 - Start Backend:**
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Wait for: `✓ Server started on port 3000`

**Terminal 3 - Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Wait for: `➜  Local:   http://localhost:5173/`

**Open browser:** http://localhost:5173

---

### Option 3: Production Build (Testing Production) 🏭

```bash
# Build backend
cd backend
npm install
npm run build
npm start

# Build frontend (in new terminal)
cd frontend
npm install
npm run build
npm run preview
```

---

## 🎭 Demo Accounts

Navigate to http://localhost:5173 and click any of these quick login buttons:

| Name | Email |
|------|-------|
| Sarah Johnson | sarah.johnson@branch.com |
| Michael Chen | michael.chen@branch.com |
| Emily Rodriguez | emily.rodriguez@branch.com |
| David Kim | david.kim@branch.com |

**Password:** Any value (demo mode doesn't validate passwords)

---

## 📱 Application Tour

### Agent Dashboard (Main Interface)

After login, you'll see a 3-panel layout:

#### Left Panel - Conversations
- List of all customer conversations
- Sorted by urgency (CRITICAL → LOW)
- Color-coded urgency badges
- Filter buttons (All, Open, In Progress, Resolved)
- Real-time updates when new messages arrive

#### Center Panel - Message Thread
- Selected conversation messages
- Chat bubbles (gray = customer, blue = agent)
- Grouped by date with dividers
- Typing indicators
- Message input at bottom
- 😊 button for canned responses
- Resolve button in header

#### Right Panel - Customer Info
- Customer name, ID, contact details
- Credit score with rating (Excellent/Good/Fair/Poor)
- Account status (Active/Suspended/Closed)
- Loan status (Approved/Pending/Rejected/None)
- Account age in months
- Conversation metadata

### Top Navigation
- Branch logo
- Connection status indicator (green = connected, red = disconnected)
- Online agents count
- Agent profile with logout

### Search Bar
- Click search box or press `/`
- Type to search across messages, customers, conversations
- Results grouped by category
- Click result to navigate

---

## 🧪 Testing the Application

### Test 1: View Imported Messages
1. Login as any agent
2. You should see ~25-30 conversations in left panel
3. Click any conversation
4. Messages will load in center panel
5. Customer info appears in right panel

### Test 2: Send a Reply
1. Select a conversation
2. Click message input at bottom
3. Type a message
4. Press Enter (or click Send)
5. Message appears in blue bubble (outbound)
6. Conversation status changes to "IN_PROGRESS"

### Test 3: Use Canned Response
1. In message input area, click 😊 icon
2. Browse categories (Greetings, Loan Questions, etc.)
3. Click a response template
4. Template content fills input box
5. Modify if needed, then send

### Test 4: Search Functionality
1. Click search bar at top
2. Type "loan" or "payment"
3. See results dropdown with matching messages/customers
4. Click a result to open that conversation

### Test 5: Resolve Conversation
1. Open any conversation
2. Send a reply
3. Click "Resolve" button in conversation header
4. Conversation moves to "RESOLVED" status
5. Message input becomes disabled
6. Conversation moves down in priority

### Test 6: Customer Submission
1. Open new incognito browser window
2. Navigate to http://localhost:5173/customer
3. Enter a User ID (e.g., "user_test_123")
4. Type a message
5. Click "Send Message"
6. Switch back to agent portal
7. New conversation should appear at top of list
8. Urgency badge shows based on message content

### Test 7: Multi-Agent Real-Time
1. Login as "Sarah Johnson" in Chrome
2. Login as "Michael Chen" in Firefox (or incognito)
3. Both agents see same conversations
4. Sarah sends a message
5. Michael's view updates in real-time
6. Agent count shows "2 online"

### Test 8: Urgency Detection
1. Go to customer form
2. Submit message: "URGENT! My account was hacked!"
3. Check agent dashboard
4. Conversation appears with CRITICAL badge (red)
5. Conversation sorted to top of list

---

## 🔍 Behind the Scenes

### What Happened During Seed?

The database now contains:

**4 Agents:**
- Sarah Johnson (sarah.johnson@branch.com)
- Michael Chen (michael.chen@branch.com)
- Emily Rodriguez (emily.rodriguez@branch.com)
- David Kim (david.kim@branch.com)

**12 Canned Responses:**
- Greetings (2): "Hello! Welcome to Branch", "Good day! How can I assist"
- Loan Questions (2): "Your loan application...", "Loan approval process..."
- Account Help (2): "To access your account...", "Account verification..."
- Support (2): "I understand your concern...", "Let me help you..."
- Closing (2): "Thank you for contacting...", "Have a great day!"
- Payments (1): "Regarding your payment..."
- CRB (1): "CRB status information..."

**~100 Customers + Messages:**
- Imported from `GeneralistRails_Project_MessageData.csv`
- Each customer has random data:
  - Credit score: 600-900
  - Account age: 1-24 months
  - Loan status: NONE/PENDING/APPROVED/REJECTED
  - Account status: ACTIVE/SUSPENDED/CLOSED
- Messages grouped into ~25-30 conversations
- Each message has urgency score (1-10) and level (CRITICAL/HIGH/MEDIUM/LOW)

### Database Schema Created:

```
Customer ──┬─→ Conversation ──→ Message
           │
Agent ─────┘

CannedResponse (standalone)
```

### WebSocket Events Active:

**Server listens for:**
- `agent:join` - Agent comes online
- `message:new` - Customer sends message
- `message:reply` - Agent sends reply
- `agent:typing` - Agent is typing
- `conversation:resolve` - Mark conversation done

**Server broadcasts:**
- `message:received` - New message to all agents
- `message:sent` - Confirmation to sender
- `agent:count` - Online agent count update
- `conversation:resolved` - Conversation marked done

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
npx kill-port 3000
```

### "Port 5173 already in use"
```bash
npx kill-port 5173
```

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Restart if needed
docker-compose restart postgres

# Or start manually
docker start postgres-branch
```

### "CSV import failed"
```bash
# Verify CSV exists
ls GeneralistRails_Project_MessageData.csv

# Re-run seed
cd backend
npm run seed
```

### "No conversations showing up"
```bash
# Check backend logs
docker-compose logs backend

# Verify database has data
cd backend
npx prisma studio
# Open http://localhost:5555 to browse DB
```

### "WebSocket not connecting"
1. Check backend is running: http://localhost:3000/health
2. Check browser console for errors (F12)
3. Verify `VITE_WS_URL=http://localhost:3000` in `frontend/.env`

### "React app shows blank page"
1. Open browser console (F12)
2. Check for errors
3. Verify frontend is running: `npm run dev` in `frontend/`
4. Try clearing cache: Ctrl+Shift+R

---

## 📊 Monitoring & Debugging

### View Backend Logs
```bash
docker-compose logs -f backend
```

### View Frontend Logs
```bash
docker-compose logs -f frontend
```

### View Database Logs
```bash
docker-compose logs -f postgres
```

### Open Database GUI
```bash
cd backend
npx prisma studio
# Opens http://localhost:5555
```

### Check API Health
```bash
curl http://localhost:3000/health
```

### Get Statistics
```bash
curl http://localhost:3000/api/stats
```

Should return:
```json
{
  "totalMessages": 100,
  "totalConversations": 30,
  "totalCustomers": 80,
  "urgencyCounts": {
    "CRITICAL": 5,
    "HIGH": 20,
    "MEDIUM": 50,
    "LOW": 25
  }
}
```

---

## 🎓 Next Steps

### Customize the Application

1. **Add more canned responses:**
   - Edit `backend/prisma/seed.ts`
   - Add to `cannedResponses` array
   - Run `npm run seed`

2. **Modify urgency keywords:**
   - Edit `backend/src/services/urgencyDetectionService.ts`
   - Add keywords to `URGENCY_KEYWORDS` object

3. **Change color scheme:**
   - Edit `frontend/tailwind.config.js`
   - Modify `colors.branch` values
   - Edit `frontend/src/utils/constants.ts` for urgency colors

4. **Add new API endpoints:**
   - Create controller in `backend/src/controllers/`
   - Create route in `backend/src/routes/`
   - Register in `backend/src/server.ts`

### Deploy to Production

1. **Set environment variables:**
   ```env
   # Backend
   DATABASE_URL=your-production-db-url
   FRONTEND_URL=https://your-domain.com
   NODE_ENV=production

   # Frontend
   VITE_API_URL=https://api.your-domain.com/api
   VITE_WS_URL=https://api.your-domain.com
   ```

2. **Build for production:**
   ```bash
   cd backend && npm run build
   cd frontend && npm run build
   ```

3. **Deploy options:**
   - **Backend:** Heroku, Railway, Render, AWS ECS
   - **Frontend:** Vercel, Netlify, AWS S3+CloudFront
   - **Database:** AWS RDS, Heroku Postgres, Supabase

---

## 📞 Support

### Common Questions

**Q: Can I use a different database?**  
A: Prisma supports MySQL, SQLite, MongoDB. Update `prisma/schema.prisma` datasource.

**Q: How do I add authentication?**  
A: Implement JWT tokens in backend, add auth middleware, update frontend to store tokens.

**Q: Can I deploy without Docker?**  
A: Yes! Install Node.js, PostgreSQL, then run `npm install` and `npm start` in each directory.

**Q: How to add file attachments?**  
A: Use multer middleware in backend, add file upload to frontend, store in S3 or local filesystem.

---

## ✅ Success Checklist

- [ ] All files verified with `node verify-setup.js`
- [ ] Docker containers running: `docker ps`
- [ ] Backend health check: http://localhost:3000/health
- [ ] Frontend accessible: http://localhost:5173
- [ ] Can login with demo account
- [ ] See conversations in left panel
- [ ] Can send message
- [ ] Can use canned response
- [ ] Search works
- [ ] Customer form works
- [ ] Real-time updates work

---

**🎉 You're all set! Enjoy your Branch Messaging Platform!**

**Need help?** Check logs, verify setup, or review the code comments.

**Built with ❤️ using React, Node.js, PostgreSQL, and Socket.io**
