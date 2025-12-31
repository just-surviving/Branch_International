# Branch Messaging Platform - Demo Video Script

**Target Duration**: 5-8 Minutes
**Goal**: Demonstrate the real-time capabilities, urgency detection, and smooth workflow of the Agent and Customer portals.

---

### **Part 1: Introduction (0:00 - 1:00)**
*   **Scene**: Show the **Architecture Diagram** (or just the project open in VS Code).
*   **Voiceover**: "Hi, I'm [Your Name]. This is the Branch Messaging Platform, a full-stack real-time customer support system. It features instant two-way messaging, intelligent urgency detection, and a seamless agent interface."
*   **Action**: Briefly show the `ARCHITECTURE.md` file you just created to explain the high-level design (Frontend, Backend, WebSocket layer).

### **Part 2: Setup & Launch (1:00 - 2:00)**
*   **Scene**: Split screen or two terminal windows.
*   **Action**: 
    1.  Show the backend running on port **3001** (`npm run dev` in backend folder).
    2.  Show the frontend running on port **5173** (`npm run dev` in frontend folder).
    3.  Open two browser windows:
        *   Window 1: `http://localhost:5173` (Agent Portal)
        *   Window 2: `http://localhost:5173/customer` (Customer Portal)

### **Part 3: The "Wow" Moment - Real-Time Messaging (2:00 - 4:00)**
*   **Action**:
    1.  **Login as Agent**: In Window 1, log in using `sarah.johnson@branch.com`. Point out the "Welcome back, Sarah!" toast notification.
    2.  **Customer Message**: Switch to Window 2 (Customer). Enter a User ID (e.g., `3112`) and type a generic message: "Hi, I have a question about my loan."
    3.  **Real-Time Sync**: Hit Send. **Immediately** show Window 1 (Agent). The message should appear instantly at the top of the conversation list *without refreshing*.
    4.  **Agent Reply**: Click the conversation in Agent Portal. Type a reply: "Hello! I'd be happy to help. What seems to be the issue?"
    5.  **Customer Receipt**: Switch back to Window 2. show the Agent's reply appearing instantly.

### **Part 4: Feature Showcase - Urgency Detection (4:00 - 6:00)**
*   **Voiceover**: "Now, let's look at the intelligent urgency detection system."
*   **Action**:
    1.  **Critical Message**: In Customer Portal (Window 2), send a new message with high-priority keywords: "Help! My account is **hacked** and I see **fraud**!"
    2.  **Agent View**: Switch to Agent Portal. Point out that this conversation has jumped to the top and is tagged with a **CRITICAL** (Red) badge.
    3.  **Filter**: Use the "Urgency" filter dropdown to show only "Critical" messages.
    4.  **Resolve**: Click "Resolve Conversation" and show it moving to the "Resolved" tab.

### **Part 5: Code Walkthrough (6:00 - 8:00)**
*   **Scene**: VS Code.
*   **Action**:
    1.  **Backend (`messageSocket.ts`)**: Show how the `message:new` event is handled. Highlight the line where you parse the `userId` (the fix for the bug) and where `detectUrgency` is called.
    2.  **Frontend (`useSocket.ts`)**: Briefly explain the hook that manages the singleton socket connection to prevent duplicates.
    3.  **Persistence**: Explain that all messages are stored in PostgreSQL via Prisma, ensuring data isn't lost on refresh.

### **Part 6: Conclusion (8:00 - End)**
*   **Voiceover**: "The Branch Messaging Platform demonstrates a robust, scalable architecture for handling real-time customer support at scale. Thank you for watching."

---

**Preparation Checklist:**
- [ ] Ensure Backend is running on Port 3001.
- [ ] Ensure Frontend is rebuilt (`npm run build`) or running in dev mode.
- [ ] Clear database (optional) or use a fresh conversation for the clean demo.
