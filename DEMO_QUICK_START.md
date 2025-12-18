# 🎬 Real-Time Demo - Quick Start

## Prerequisites
- Backend server running on http://localhost:3000
- Frontend running on http://localhost:5173
- PostgreSQL database running

## 🚀 Running the Automated Demo

### Step 1: Open Agent Portal
```
1. Open browser: http://localhost:5173/login
2. Login as: Michael Chen (michael.chen@branch.com)
3. Password: (not required for demo)
```

### Step 2: Run Demo Script

Open a new terminal and run:

```powershell
cd c:\Users\sharm\OneDrive\Desktop\Branch_International\branch-messaging-platform
node demo-script.js staggered
```

**Demo Modes:**
- `sequential` - One scenario at a time (slower, easy to follow)
- `parallel` - All scenarios at once (fast, shows high volume)
- `staggered` - Scenarios start 2 seconds apart (realistic, recommended)

### What You'll See:

**In Terminal:**
```
╔════════════════════════════════════════════════════════════╗
║     Branch Messaging Platform - Real-Time Demo Script     ║
╚════════════════════════════════════════════════════════════╝

📧 Scenario 1: James Anderson
────────────────────────────────────────────────────────────
✓ Created new customer: James Anderson
  → Sent: "My loan payment is overdue..."
  ⏳ Waiting 15s...
  → Sent: "I tried calling but was on hold..."
```

**In Agent Portal (Real-Time):**
- 🔴 New conversations appear instantly
- 🏷️ Urgency badges (CRITICAL, HIGH, MEDIUM, LOW)
- 📊 Auto-sorting by priority
- 💬 Messages delivered in real-time
- 🔔 Unread counts update live

## 📊 Demo Scenarios Included

1. **James Anderson** - Urgent loan payment issue (CRITICAL)
2. **Maria Garcia** - Card declined emergency (CRITICAL)
3. **David Thompson** - General loan inquiry (LOW)
4. **Lisa Wong** - Application status check (MEDIUM)
5. **Robert Chen** - Credit limit increase (LOW)
6. **Sarah Johnson** - Fraud alert (CRITICAL)

**Total:** 6 customers, 12+ messages over ~40 seconds

## 🎥 Recording a Demo Video

### Setup for Recording:
1. Arrange windows side-by-side:
   - Left: Agent Portal (Chrome)
   - Right: Terminal with demo script
2. Start screen recording (Win + G on Windows)
3. Run demo script
4. Show conversations appearing in real-time
5. Click on conversations to show details
6. Demonstrate features (search, filters, dark mode)

### Video Structure (10 minutes):
- **0:00-1:00**: Intro - Show login and dashboard
- **1:00-3:00**: Run demo script - Show real-time messages
- **3:00-5:00**: Handle conversations - Respond to customers
- **5:00-7:00**: Show features - Search, filters, urgency
- **7:00-9:00**: Advanced - Dark mode, resize, canned responses
- **9:00-10:00**: Wrap up - Summary of capabilities

## 🛠️ Manual Demo (Without Script)

If you prefer manual control:

1. Open customer portal: http://localhost:5173/customer
2. Fill in customer details and send messages
3. Watch them appear instantly in agent portal
4. Repeat with multiple browser tabs for concurrent customers

## 🐛 Troubleshooting

**Script fails with connection error:**
```powershell
# Check backend is running
curl http://localhost:3000/api/agents

# If not, start it:
cd branch-messaging-platform\backend
npm run dev
```

**Messages not appearing in real-time:**
- Check WebSocket connection (green dot in header)
- Refresh agent portal
- Check browser console for errors

**Theme toggle not working:**
- Open browser console (F12)
- Click theme toggle
- Check for console logs showing theme changes
- Verify dark class is added to <html> element

## 📝 Demo Talking Points

While recording, mention:

✅ **Real-Time**: "Watch how messages appear instantly as they're sent"
✅ **Smart Urgency**: "System automatically detects critical keywords"
✅ **Auto-Sorting**: "Urgent conversations jump to the top"
✅ **Efficient**: "Agents handle multiple conversations seamlessly"
✅ **Search**: "Powerful full-text search across all messages"
✅ **Responsive**: "Works on desktop, tablet, and mobile"
✅ **Modern**: "Built with React, Node.js, WebSocket technology"

## 🎯 Success Criteria

After demo, viewers should see:
- ✅ Real-time message delivery (< 100ms)
- ✅ Intelligent urgency detection
- ✅ Smooth user experience
- ✅ Scalable architecture
- ✅ Production-ready features

---

**Ready to record! 🎬** Run the script and show off the platform's real-time capabilities!
