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
}
