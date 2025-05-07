export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export enum Colors {
  RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  CYAN = '\x1b[36m',
  ORANGE = '\x1b[38;5;208m',
  RESET = '\x1b[0m',
}

export class Logger {
  private static readonly COLORS = {
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.INFO]: '\x1b[32m', // Green
    [LogLevel.WARN]: '\x1b[33m', // Yellow
    [LogLevel.ERROR]: '\x1b[31m', // Red
    RESET: '\x1b[0m',
  };

  constructor(private context: string) {}

  private formatMessage(level: LogLevel, message: string): string {
    const color = Logger.COLORS[level];
    return `${color}${level}\t[${this.context}]\x1b[0m ${message}`;
  }

  debug(message: string | Error): void {
    const errorMessage = message instanceof Error ? message.message : message;
    if (process.env.DEBUG === 'true') {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage(LogLevel.DEBUG, errorMessage));
    }
  }

  info(message: string): void {
    // eslint-disable-next-line no-console
    console.info(this.formatMessage(LogLevel.INFO, message));
  }

  warn(message: string): void {
    // eslint-disable-next-line no-console
    console.warn(this.formatMessage(LogLevel.WARN, message));
  }

  error(message: string | Error): void {
    const errorMessage = message instanceof Error ? message.message : message;
    // eslint-disable-next-line no-console
    console.error(this.formatMessage(LogLevel.ERROR, errorMessage));
  }
}

// export colors function
function colors(message: string, color: Colors): string {
  return `${color}${message}${Colors.RESET}`;
}

export const red = (message: string): string => colors(message, Colors.RED);
export const green = (message: string): string => colors(message, Colors.GREEN);
export const yellow = (message: string): string =>
  colors(message, Colors.YELLOW);
export const cyan = (message: string): string => colors(message, Colors.CYAN);
export const orange = (message: string): string =>
  colors(message, Colors.ORANGE);

// Create a default logger instance
export const defaultLogger = new Logger('App');

// Export a factory function to create new loggers
export const createLogger = (context: string): Logger => {
  return new Logger(context);
};
