// Simple error logging utility (production would use Sentry)
// For now, we'll log to console and could extend to send to error tracking service

export interface ErrorContext {
  userId?: string
  userEmail?: string
  route?: string
  method?: string
  [key: string]: any
}

export function logError(
  error: Error,
  context: ErrorContext = {},
  level: 'error' | 'warning' | 'info' = 'error'
) {
  const timestamp = new Date().toISOString()
  const errorData = {
    timestamp,
    level,
    message: error.message,
    stack: error.stack,
    context
  }
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${level.toUpperCase()}] ${timestamp}`, errorData)
  }
  
  // In production, you would:
  // 1. Send to Sentry: Sentry.captureException(error, { extra: context })
  // 2. Or log to file/database
  // 3. Or send to monitoring service (Datadog, New Relic, etc.)
  
  // TODO: Integrate with actual error tracking service
  // Example: import * as Sentry from '@sentry/nextjs'
  // Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN })
  
  return errorData
}

export function createErrorHandler(operation: string) {
  return (error: Error, context: ErrorContext = {}) => {
    return logError(error, {
      operation,
      ...context
    })
  }
}
