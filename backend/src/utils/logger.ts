const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function getTimestamp(): string {
  return new Date().toISOString();
}

export function info(message: string, ...args: any[]) {
  console.log(`${colors.blue}[INFO]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${message}`, ...args);
}

export function success(message: string, ...args: any[]) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${message}`, ...args);
}

export function warn(message: string, ...args: any[]) {
  console.log(`${colors.yellow}[WARN]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${message}`, ...args);
}

export function error(message: string, ...args: any[]) {
  console.log(`${colors.red}[ERROR]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${message}`, ...args);
}

export function debug(message: string, ...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${colors.magenta}[DEBUG]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${message}`, ...args);
  }
}

export function socket(message: string, ...args: any[]) {
  console.log(`${colors.cyan}[SOCKET]${colors.reset} ${colors.gray}${getTimestamp()}${colors.reset} ${message}`, ...args);
}

export default {
  info,
  success,
  warn,
  error,
  debug,
  socket
};
