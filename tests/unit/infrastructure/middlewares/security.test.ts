import { Request, Response, NextFunction } from 'express';
import { securityHeaders } from '../../../../src/infrastructure/http/middlewares/security.middleware';
import { ApiResponseFormatter } from '../../../../src/infrastructure/http/utils/apiResponse';

// Mock del ApiResponseFormatter
jest.mock('../../../../src/infrastructure/http/utils/apiResponse', () => ({
  ApiResponseFormatter: {
    format: jest.fn().mockReturnValue('mocked response'),
  },
}));

describe('Security Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      get: jest.fn(),
    };
    mockResponse = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();

    // Limpiar mocks
    jest.clearAllMocks();
  });

  it('should set security headers and call next for normal user agent', () => {
    (mockRequest.get as jest.Mock).mockReturnValue('Mozilla/5.0');

    securityHeaders(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-XSS-Protection', '1; mode=block');
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Referrer-Policy',
      'strict-origin-when-cross-origin',
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should block suspicious user agents', () => {
    (mockRequest.get as jest.Mock).mockReturnValue('sqlmap/1.0');

    securityHeaders(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(ApiResponseFormatter.format).toHaveBeenCalledWith(
      mockResponse,
      'ERROR_403_FORBIDDEN',
      {},
      ['Forbidden'],
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should handle missing user agent', () => {
    (mockRequest.get as jest.Mock).mockReturnValue(undefined);

    securityHeaders(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.setHeader).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should block multiple suspicious user agents', () => {
    const suspiciousAgents = ['nikto', 'nmap', 'burp', 'zap'];

    suspiciousAgents.forEach((agent) => {
      jest.clearAllMocks();
      (mockRequest.get as jest.Mock).mockReturnValue(`${agent}/1.0`);

      securityHeaders(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(ApiResponseFormatter.format).toHaveBeenCalledWith(
        mockResponse,
        'ERROR_403_FORBIDDEN',
        {},
        ['Forbidden'],
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
