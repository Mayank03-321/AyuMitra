import { Request, Response, NextFunction } from 'express';

// In-memory rate limiting map for API defense
const requestCounts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 1000; // 1000 requests/minute per IP for API endpoints

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // Only apply rate limiting to API endpoints, never block Vite frontend assets or static files
  if (!req.path.startsWith('/api')) {
    return next();
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests. Please try again in a moment.'
    });
  }

  entry.count += 1;
  next();
}

/**
 * Global Error Handler - Prevents leaking stack traces, credentials, or DB internals to client
 */
export function secureErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Internal Server Error]:', err.message || err);

  // Mask database / API internal messages
  res.status(err.status || 500).json({
    error: 'An internal server error occurred. Please contact hospital support if this persists.',
    timestamp: new Date().toISOString(),
  });
}
