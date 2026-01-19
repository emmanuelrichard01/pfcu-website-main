/**
 * Logger service that provides environment-aware logging.
 * 
 * In development: Logs are visible in the console
 * In production: Error logs are shown, others are suppressed
 * 
 * Can be extended to send errors to external services like Sentry
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
    /** Minimum log level to display */
    minLevel: LogLevel;
    /** Whether to include timestamps */
    timestamps: boolean;
    /** Prefix for all log messages */
    prefix: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const isDevelopment = import.meta.env.DEV;

const defaultConfig: LoggerConfig = {
    minLevel: isDevelopment ? 'debug' : 'error',
    timestamps: isDevelopment,
    prefix: '[PFCU]',
};

class Logger {
    private config: LoggerConfig;

    constructor(config: Partial<LoggerConfig> = {}) {
        this.config = { ...defaultConfig, ...config };
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
    }

    private formatMessage(level: LogLevel, message: string): string {
        const parts: string[] = [];

        if (this.config.timestamps) {
            parts.push(`[${new Date().toISOString()}]`);
        }

        parts.push(this.config.prefix);
        parts.push(`[${level.toUpperCase()}]`);
        parts.push(message);

        return parts.join(' ');
    }

    /**
     * Debug level logging - only visible in development
     */
    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('debug', message), ...args);
        }
    }

    /**
     * Info level logging - general information
     */
    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message), ...args);
        }
    }

    /**
     * Warning level logging - potential issues
     */
    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message), ...args);
        }
    }

    /**
     * Error level logging - always visible, can be sent to error tracking
     */
    error(message: string, error?: Error, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message), error, ...args);

            // In production, could send to error tracking service
            // if (!isDevelopment && error) {
            //   sendToErrorTrackingService(error, { message, ...args });
            // }
        }
    }

    /**
     * Create a child logger with a specific prefix
     */
    child(prefix: string): Logger {
        return new Logger({
            ...this.config,
            prefix: `${this.config.prefix}[${prefix}]`,
        });
    }
}

// Export singleton instance
export const logger = new Logger();

// Export for creating child loggers
export const createLogger = (prefix: string) => new Logger({ prefix: `[PFCU][${prefix}]` });

// Convenience exports
export const { debug, info, warn, error } = {
    debug: logger.debug.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger),
};
