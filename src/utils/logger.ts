type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = __DEV__;

function format(level: LogLevel, scope: string, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const payload = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] [${scope}] ${message}${payload}`;
}

export const logger = {
  debug(scope: string, message: string, meta?: unknown) {
    if (!isDev) return;
    console.log(format('debug', scope, message, meta));
  },
  info(scope: string, message: string, meta?: unknown) {
    if (!isDev) return;
    console.info(format('info', scope, message, meta));
  },
  warn(scope: string, message: string, meta?: unknown) {
    console.warn(format('warn', scope, message, meta));
  },
  error(scope: string, message: string, meta?: unknown) {
    console.error(format('error', scope, message, meta));
  },
};
