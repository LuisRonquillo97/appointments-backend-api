import { Request, Response, NextFunction } from 'express';
import { ApiResponseFormatter } from '../utils/apiResponse';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Bloquear User-Agents sospechosos
  const suspiciousUserAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'burp'];

  const userAgent = req.get('User-Agent')?.toLowerCase() || '';

  if (suspiciousUserAgents.some((agent) => userAgent.includes(agent))) {
    return ApiResponseFormatter.format(res, 'ERROR_403_FORBIDDEN', {}, ['Forbidden']);
  }

  // Headers de seguridad adicionales
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  next();
};
