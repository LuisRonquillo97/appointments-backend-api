import jwt, { SignOptions } from 'jsonwebtoken';
import { TokenPort } from '../../../domain/ports/tokenPort';

export class JwtTokenAdapter implements TokenPort {
  constructor(
    private readonly secretKey: string,
    private readonly expiresIn: string,
  ) {}

  generateToken(payload: Record<string, any>): string {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn as any });
  }

  verifyToken(token: string): Record<string, any> | null {
    try {
      return jwt.verify(token, this.secretKey) as Record<string, any>;
    } catch (error) {
      return null;
    }
  }

  refreshToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, this.secretKey, { ignoreExpiration: true }) as any;

      const now = Math.floor(Date.now() / 1000);
      const maxRefreshTime = 7 * 24 * 60 * 60; // 7 días

      if (now - decoded.exp > maxRefreshTime) {
        return null;
      }

      return this.generateToken({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      });
    } catch (error) {
      return null;
    }
  }
}
