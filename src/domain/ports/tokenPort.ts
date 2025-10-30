/**
 * Port service for token generation and verification.
 */
export interface TokenPort {
  /**
   * Generates a token based on the provided payload.
   * @param payload Data to encode in the token
   * @returns The generated token string
   */
  generateToken(payload: Record<string, any>): string;
  /**
   * Verifies and decodes a token.
   * @param token Token to verify
   * @returns Decoded payload or null if invalid
   */
  verifyToken(token: string): Record<string, any> | null;

  /**
   * Refreshes an expired or near-expired token.
   * @param token Token to refresh
   * @returns New token or null if refresh failed
   */
  refreshToken(token: string): string | null;
}
