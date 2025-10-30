/**
 * Response code interface.
 */
export interface ResponseCode {
  code: string;
  message: string;
  success: boolean;
}

/**
 * Response codes.
 */
export const ResponseCodes: { [key: string]: ResponseCode } = {
  // Códigos de éxito (2xx)
  OK_200_GETUSER: { code: 'OK_200_GETUSER', message: 'User found successfully', success: true },
  OK_200_LISTUSERS: {
    code: 'OK_200_LISTUSERS',
    message: 'Users retrieved successfully',
    success: true,
  },
  OK_201_CREATEUSER: {
    code: 'OK_201_CREATEUSER',
    message: 'User created successfully',
    success: true,
  },
  OK_200_UPDATEUSER: {
    code: 'OK_200_UPDATEUSER',
    message: 'User updated successfully',
    success: true,
  },
  OK_200_DELETEUSER: {
    code: 'OK_200_DELETEUSER',
    message: 'User deleted successfully',
    success: true,
  },
  OK_200_LOGIN: {
    code: 'OK_200_LOGIN',
    message: 'User logged in successfully',
    success: true,
  },
  OK_200_REFRESH: {
    code: 'OK_200_REFRESH',
    message: 'Token refreshed successfully',
    success: true,
  },

  // Códigos de error (4xx)
  ERROR_400_BADREQUEST: { code: 'ERROR_400_BADREQUEST', message: 'Bad request', success: false },
  ERROR_401_UNAUTHORIZED: {
    code: 'ERROR_401_UNAUTHORIZED',
    message: 'Unauthorized',
    success: false,
  },
  ERROR_403_FORBIDDEN: { code: 'ERROR_403_FORBIDDEN', message: 'Forbidden', success: false },
  ERROR_404_NOTFOUND: { code: 'ERROR_404_NOTFOUND', message: 'Resource not found', success: false },
  ERROR_408_TIMEOUT: {
    code: 'ERROR_408_TIMEOUT',
    message: 'Request timeout',
    success: false,
  },
  ERROR_409_CONFLICT: {
    code: 'ERROR_409_CONFLICT',
    message: 'Resource already exists',
    success: false,
  },
  ERROR_429_RATELIMIT: {
    code: 'ERROR_429_RATELIMIT',
    message: 'Too many requests from this IP',
    success: false,
  },

  // Códigos de error del servidor (5xx)
  ERROR_500_INTERNAL: {
    code: 'ERROR_500_INTERNAL',
    message: 'Internal server error',
    success: false,
  },
};
