# Branch Messaging Platform - Real-Time Demo Guide

## 🎬 Demo Overview
This guide will help you demonstrate the Branch Messaging Platform with realistic real-time scenarios.

## 🚀 Quick Start Demo

### Step 1: Start All Services
```powershell
# Terminal 1 - Start PostgreSQL (if not running)
docker start postgres-branch

# Terminal 2 - Start Backend Server
cd branch-messaging-platform\backend
npm run dev

# Terminal 3 - Start Frontend
cd branch-messaging-platform\frontend
npm run dev
```

### Step 2: Access the Application
- **Agent Portal**: http://localhost:5173/login
- **Customer Portal**: http://localhost:5173/customer

## 🎭 Real-Time Demo Scenarios

### Scenario 1: Agent Handling Urgent Customer Issues (5 minutes)

**Setup:**
1. Open **Agent Portal** in Chrome: http://localhost:5173/login
2. Login as **Michael Chen** (michael.chen@branch.com)
3. Open **Customer Portal** in Firefox/Edge: http://localhost:5173/customer

**Demo Flow:**

**PART 1: Customer Sends Urgent Message (Customer Window)**
1. Enter Customer Name: "James Anderson"
2. Phone: "+1-555-0198"
3. Message: "My loan payment is overdue and I'm getting charged extra fees. I need immediate help!"
4. Click "Send Message"
5. ✅ **Show**: Message appears instantly in conversation list

**PART 2: Agent Receives & Responds (Agent Window)**
1. ✅ **Show**: New conversation appears in real-time with RED urgent badge
2. ✅ **Show**: Conversation auto-sorted to top (highest urgency first)
3. Click on the conversation
4. ✅ **Show**: Customer info panel shows on right with details
5. ✅ **Show**: Full message history displayed
6. Click "Canned Responses" dropdown
7. Select "I understand your concern..."
8. Customize the response: "I understand your concern about the late fees. Let me look into your account right away."
9. Click Send
10. ✅ **Show**: Message appears instantly in both windows

**PART 3: Real-Time Back-and-Forth (Both Windows)**
11. **Customer**: "Thank you! My account number is BR-12345. Can you waive the fees?"
12. ✅ **Show**: Message appears in agent window immediately
13. ✅ **Show**: Urgency level updates if needed
14. **Agent**: Uses canned response "We can help with that" + customizes
15. ✅ **Show**: Instant delivery to customer

### Scenario 2: Multiple Conversations & Urgency Management (7 minutes)

**Setup:**
1. Keep Agent window (Michael Chen) open
2. Open 3 additional Customer Portal tabs

**Demo Flow:**

**PART 1: Simulate High Volume (Customer Tabs 1-3)**

*Customer Tab 1 - Critical Issue:*
- Name: "Maria Garcia"
- Phone: "+1-555-0199"
- Message: "URGENT! My card was declined at the store and I have no other payment method!"

*Customer Tab 2 - General Query:*
- Name: "David Thompson"  
- Phone: "+1-555-0200"
- Message: "I'd like to know more about your loan products and interest rates."

*Customer Tab 3 - Medium Priority:*
- Name: "Lisa Wong"
- Phone: "+1-555-0201"
- Message: "I submitted my application 3 days ago but haven't heard back. What's the status?"

**PART 2: Agent Dashboard Updates (Agent Window)**
1. ✅ **Show**: All 3 new conversations appear in real-time
2. ✅ **Show**: Conversations auto-sorted by urgency:
   - Maria Garcia (CRITICAL - RED) at top
   - Lisa Wong (MEDIUM - YELLOW) 
   - David Thompson (LOW - GREEN)
3. ✅ **Show**: Unread count badges (blue numbers)
4. ✅ **Show**: Filter buttons work (All, Unread, Urgent)

**PART 3: Smart Prioritization**
1. Click "Urgent" filter
2. ✅ **Show**: Only critical/high urgency conversations shown
3. Handle Maria Garcia first (critical)
4. Use canned response + personalize
5. ✅ **Show**: Real-time reply delivery
6. Click "All" filter to see all conversations
7. Switch to Lisa Wong (medium priority)
8. ✅ **Show**: Customer info panel updates immediately

### Scenario 3: Search & Quick Navigation (3 minutes)

**Setup:**
1. Ensure you have multiple conversations from previous scenarios

**Demo Flow:**
1. In search bar, type "loan"
2. ✅ **Show**: Real-time search results as you type
3. ✅ **Show**: Matching messages highlighted
4. Click on a search result
5. ✅ **Show**: Conversation loads instantly
6. Search by customer name: "Maria"
7. ✅ **Show**: Customer conversations filtered
8. Clear search
9. ✅ **Show**: Full conversation list returns

### Scenario 4: Resizable Sidebar & Theme Toggle (2 minutes)

**Demo Flow:**

**PART 1: Resizable Sidebar**
1. Hover over the right edge of conversation list
2. ✅ **Show**: Cursor changes to resize indicator
3. Click and drag left to make sidebar narrower
4. ✅ **Show**: Smooth resize (minimum 280px)
5. Drag right to make it wider
6. ✅ **Show**: Maximum width 600px
7. Refresh page
8. ✅ **Show**: Width preference persisted

**PART 2: Dark/Light Theme**
1. Click moon icon in top-right header
2. ✅ **Show**: Entire app switches to dark mode instantly
3. ✅ **Show**: All elements properly themed (sidebar, messages, header)
4. Click sun icon to switch back
5. ✅ **Show**: Light mode restored
6. ✅ **Show**: Theme preference saved (check localStorage)

### Scenario 5: Canned Responses & Quick Replies (4 minutes)

**Setup:**
1. Have an active conversation open

**Demo Flow:**
1. Click "Canned Responses" dropdown
2. ✅ **Show**: List of pre-defined responses with categories
3. Select "Greeting - Welcome message"
4. ✅ **Show**: Text auto-fills in message input
5. Edit and personalize the message
6. Send message
7. Select different canned response
8. ✅ **Show**: Can combine multiple responses
9. Use keyboard shortcut suggestions if implemented

## 📊 Key Features to Highlight

### Real-Time Capabilities
✅ Instant message delivery (WebSocket)
✅ Live conversation updates
✅ Real-time urgency detection
✅ Auto-sorting by priority
✅ Live typing indicators (if implemented)

### Smart Features
✅ AI-powered urgency detection (CRITICAL/HIGH/MEDIUM/LOW)
✅ Intelligent conversation sorting
✅ Full-text search across all messages
✅ Customer information sidebar
✅ Canned response library

### User Experience
✅ Resizable sidebar (WhatsApp-style)
✅ Dark/Light theme toggle
✅ Persistent preferences (localStorage)
✅ Mobile-responsive design
✅ Smooth animations & transitions

### Agent Productivity
✅ Filter by urgency/status
✅ Unread message counts
✅ Quick search navigation
✅ Multi-conversation management
✅ Customer history at a glance

## 🎥 Video Recording Tips

### Recommended Setup
1. **Screen Resolution**: 1920x1080 for best quality
2. **Browser Zoom**: 100% (no zoom)
3. **Close Unnecessary Tabs**: Keep demo clean
4. **Prepare Script**: Follow scenarios above

### Recording Structure (Suggested 10-minute video)

**0:00 - 1:00**: Introduction & Overview
- Show login screen
- Explain agent vs customer portals
- Login as agent

**1:00 - 3:00**: Scenario 1 - Basic Real-Time Messaging
- Customer sends message
- Agent receives instantly
- Back-and-forth conversation
- Show urgency badges

**3:00 - 6:00**: Scenario 2 - Multiple Conversations
- Simulate 3-4 customers messaging
- Show auto-sorting by urgency
- Demonstrate filtering
- Handle multiple conversations

**6:00 - 8:00**: Scenario 3 - Advanced Features
- Search functionality
- Resizable sidebar demo
- Dark/Light theme toggle
- Canned responses

**8:00 - 10:00**: Scenario 4 - Real-World Use Case
- Complete customer journey
- Problem → Agent Response → Resolution
- Show all features working together
- Conclusion

### Recording Tools
- **Windows**: OBS Studio (free) or ScreenToGif
- **Screen Capture**: Win + G (Xbox Game Bar)
- **Professional**: Camtasia or ScreenFlow

## 🔧 Troubleshooting Demo Issues

### Backend Not Responding
```powershell
# Check if backend is running
curl http://localhost:3000/api/agents

# Restart backend
cd backend
npm run dev
```

### Frontend Not Loading
```powershell
# Check Vite dev server
# Should be running on http://localhost:5173

# Restart if needed
cd frontend
npm run dev
```

### Database Connection Issues
```powershell
# Check PostgreSQL container
docker ps | Select-String postgres

# Restart if needed
docker start postgres-branch
```

### Messages Not Appearing Real-Time
1. Check browser console for WebSocket errors
2. Verify backend WebSocket server is running
3. Check if Socket.IO connection established (green dot in header)

## 📝 Demo Script Template

```
"Welcome to the Branch Messaging Platform demo. This is a real-time customer
service messaging system built with React, Node.js, and WebSocket technology.

[Show Login Screen]
Let me log in as an agent. I'll use Michael Chen's account.

[Login]
Here's the agent dashboard. On the left, we have the conversation list,
showing all customer interactions.

[Open Customer Portal]
Now let me simulate a customer sending a message. I'll open the customer portal
in another window.

[Customer Sends Message]
The customer, James Anderson, has a critical loan payment issue. Let's send 
this urgent message.

[Show Agent Window]
Watch what happens in the agent dashboard - the message appears instantly!
Notice the RED badge indicating this is a critical urgency conversation.
The system automatically detected keywords like 'urgent', 'overdue', and 
'immediate help' to prioritize this message.

[Continue with demo scenarios...]

The platform also supports dark mode [toggle theme], has a resizable sidebar
[demonstrate], and includes powerful search capabilities [search demo].

All of these features work together to help agents efficiently manage customer
conversations in real-time."
```

## 🎯 Key Demo Talking Points

1. **Real-Time**: "Messages appear instantly with zero lag thanks to WebSocket technology"
2. **Smart Urgency**: "AI automatically detects urgent keywords and prioritizes critical issues"
3. **Efficient**: "Agents can handle multiple conversations with smart filtering and search"
4. **User-Friendly**: "Dark mode, resizable layout, and canned responses improve productivity"
5. **Scalable**: "Built with modern tech stack (React, Node.js, PostgreSQL, Prisma)"

## 📧 Live Demo Deployment (Optional)

For a live public demo, consider deploying to:
- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or Heroku
- **Database**: Supabase or Railway PostgreSQL

This allows stakeholders to test the system remotely without local setup.

---

**Ready to impress! 🚀** Follow these scenarios for a compelling real-time demo.
