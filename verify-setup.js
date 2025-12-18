#!/usr/bin/env node

/**
 * Branch Messaging Platform - Setup Verification Script
 * Checks that all required files and dependencies are in place
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`)
};

const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    log.success(description);
    return true;
  } else {
    log.error(`${description} - File not found: ${filePath}`);
    return false;
  }
};

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  Branch Messaging Platform - Setup Verification           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

let allGood = true;

// Check root files
log.info('Checking root configuration...');
allGood &= checkFile('docker-compose.yml', 'Docker Compose configuration');
allGood &= checkFile('GeneralistRails_Project_MessageData.csv', 'CSV data file (100 messages)');
allGood &= checkFile('.gitignore', 'Git ignore file');
allGood &= checkFile('README.md', 'README documentation');

console.log('');

// Check backend structure
log.info('Checking backend files...');
allGood &= checkFile('backend/package.json', 'Backend package.json');
allGood &= checkFile('backend/tsconfig.json', 'Backend TypeScript config');
allGood &= checkFile('backend/Dockerfile', 'Backend Dockerfile');
allGood &= checkFile('backend/.env', 'Backend environment variables');
allGood &= checkFile('backend/prisma/schema.prisma', 'Prisma schema');
allGood &= checkFile('backend/prisma/seed.ts', 'Database seed script');
allGood &= checkFile('backend/src/server.ts', 'Express server');
allGood &= checkFile('backend/src/config/database.ts', 'Database configuration');

// Backend controllers
allGood &= checkFile('backend/src/controllers/messageController.ts', 'Message controller');
allGood &= checkFile('backend/src/controllers/customerController.ts', 'Customer controller');
allGood &= checkFile('backend/src/controllers/agentController.ts', 'Agent controller');
allGood &= checkFile('backend/src/controllers/cannedResponseController.ts', 'Canned response controller');

// Backend services
allGood &= checkFile('backend/src/services/messageService.ts', 'Message service');
allGood &= checkFile('backend/src/services/searchService.ts', 'Search service');
allGood &= checkFile('backend/src/services/csvImportService.ts', 'CSV import service');
allGood &= checkFile('backend/src/services/urgencyDetectionService.ts', 'Urgency detection service');

// Backend sockets
allGood &= checkFile('backend/src/sockets/messageSocket.ts', 'WebSocket handler');

console.log('');

// Check frontend structure
log.info('Checking frontend files...');
allGood &= checkFile('frontend/package.json', 'Frontend package.json');
allGood &= checkFile('frontend/tsconfig.json', 'Frontend TypeScript config');
allGood &= checkFile('frontend/vite.config.ts', 'Vite configuration');
allGood &= checkFile('frontend/tailwind.config.js', 'Tailwind configuration');
allGood &= checkFile('frontend/Dockerfile', 'Frontend Dockerfile');
allGood &= checkFile('frontend/index.html', 'HTML entry point');
allGood &= checkFile('frontend/.env', 'Frontend environment variables');

// Frontend entry points
allGood &= checkFile('frontend/src/main.tsx', 'React entry point');
allGood &= checkFile('frontend/src/App.tsx', 'App component with routing');

// Frontend pages
allGood &= checkFile('frontend/src/pages/Login.tsx', 'Login page');
allGood &= checkFile('frontend/src/pages/AgentPortal.tsx', 'Agent portal page');
allGood &= checkFile('frontend/src/pages/CustomerPage.tsx', 'Customer page');

// Frontend services
allGood &= checkFile('frontend/src/services/api.ts', 'API service');
allGood &= checkFile('frontend/src/services/socketService.ts', 'Socket service');
allGood &= checkFile('frontend/src/services/authService.ts', 'Auth service');

// Frontend hooks
allGood &= checkFile('frontend/src/hooks/useSocket.ts', 'useSocket hook');
allGood &= checkFile('frontend/src/hooks/useMessages.ts', 'useMessages hook');
allGood &= checkFile('frontend/src/hooks/useSearch.ts', 'useSearch hook');

// Frontend components - Agent
allGood &= checkFile('frontend/src/components/agent/AgentDashboard.tsx', 'Agent dashboard');
allGood &= checkFile('frontend/src/components/agent/ConversationList.tsx', 'Conversation list');
allGood &= checkFile('frontend/src/components/agent/MessageThread.tsx', 'Message thread');
allGood &= checkFile('frontend/src/components/agent/MessageInput.tsx', 'Message input');
allGood &= checkFile('frontend/src/components/agent/SearchBar.tsx', 'Search bar');
allGood &= checkFile('frontend/src/components/agent/CustomerInfoPanel.tsx', 'Customer info panel');
allGood &= checkFile('frontend/src/components/agent/CannedResponseSelector.tsx', 'Canned response selector');

// Frontend components - Common
allGood &= checkFile('frontend/src/components/common/LoadingSpinner.tsx', 'Loading spinner');
allGood &= checkFile('frontend/src/components/common/EmptyState.tsx', 'Empty state');
allGood &= checkFile('frontend/src/components/common/UrgencyBadge.tsx', 'Urgency badge');
allGood &= checkFile('frontend/src/components/common/MessageBubble.tsx', 'Message bubble');

// Frontend components - Layout
allGood &= checkFile('frontend/src/components/layout/Header.tsx', 'Header layout');
allGood &= checkFile('frontend/src/components/layout/Sidebar.tsx', 'Sidebar layout');

// Frontend components - Customer
allGood &= checkFile('frontend/src/components/customer/CustomerMessageForm.tsx', 'Customer message form');

console.log('');

// Final summary
console.log('═══════════════════════════════════════════════════════════');
if (allGood) {
  console.log(`${COLORS.green}✓ All checks passed! Your project is ready to run.${COLORS.reset}`);
  console.log('');
  log.info('Next steps:');
  console.log('  1. Run: docker-compose up --build');
  console.log('  2. Open: http://localhost:5173');
  console.log('  3. Login with: sarah.johnson@branch.com');
  console.log('');
} else {
  console.log(`${COLORS.red}✗ Some files are missing. Please check the errors above.${COLORS.reset}`);
  console.log('');
}
console.log('═══════════════════════════════════════════════════════════\n');
