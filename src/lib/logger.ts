/**
 * Safe logger for server-side operations
 * strips sensitive fields before logging
 */

export const logger = {
    error: (message: string, error: unknown, context?: Record<string, any>) => {
        // Basic redaction of PII
        const safeContext = context ? JSON.parse(JSON.stringify(context, (key, value) => {
            if (['email', 'password', 'token', 'key', 'secret'].includes(key.toLowerCase())) {
                return '[REDACTED]';
            }
            return value;
        })) : undefined;

        console.error(JSON.stringify({
            level: 'error',
            message,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            ...safeContext
        }));
    },

    info: (message: string, context?: Record<string, any>) => {
        const safeContext = context ? JSON.parse(JSON.stringify(context, (key, value) => {
            if (['email', 'password', 'token', 'key', 'secret'].includes(key.toLowerCase())) {
                return '[REDACTED]';
            }
            return value;
        })) : undefined;

        console.log(JSON.stringify({
            level: 'info',
            message,
            ...safeContext
        }));
    }
};
