export const URGENCY_COLORS = {
  CRITICAL: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  HIGH: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  MEDIUM: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  LOW: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
} as const;

export const STATUS_COLORS = {
  UNREAD: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  READ: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
  },
  REPLIED: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  RESOLVED: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
  },
} as const;

export const AGENT_STATUS_COLORS = {
  AVAILABLE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  BUSY: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
  },
  OFFLINE: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    dot: 'bg-gray-400',
  },
} as const;

export const CONVERSATION_STATUS_COLORS = {
  OPEN: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  IN_PROGRESS: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
  },
  RESOLVED: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  CLOSED: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
  },
} as const;

export const API_ENDPOINTS = {
  MESSAGES: '/api/messages',
  CUSTOMERS: '/api/customers',
  AGENTS: '/api/agents',
  CONVERSATIONS: '/api/conversations',
  CANNED_RESPONSES: '/api/canned-responses',
  SEARCH: '/api/search',
  STATS: '/api/stats',
  HEALTH: '/health',
} as const;

export const SOCKET_EVENTS = {
  // Client -> Server
  AGENT_JOIN: 'agent:join',
  MESSAGE_NEW: 'message:new',
  MESSAGE_REPLY: 'message:reply',
  MESSAGE_READ: 'message:read',
  AGENT_TYPING: 'agent:typing',
  AGENT_STOPPED_TYPING: 'agent:stopped-typing',
  CONVERSATION_RESOLVE: 'conversation:resolve',

  // Server -> Client
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_SENT: 'message:sent',
  MESSAGE_STATUS: 'message:status',
  AGENTS_COUNT: 'agents:count',
  AGENTS_LIST: 'agents:list',
  CONVERSATION_RESOLVED: 'conversation:resolved',
} as const;
