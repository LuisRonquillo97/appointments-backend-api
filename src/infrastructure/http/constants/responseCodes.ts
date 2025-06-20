export interface ResponseCode {
  code: string;
  message: string;
  success: boolean;
}

export const ResponseCodes: { [key: string]: ResponseCode } = {
  // Códigos de éxito (2xx)
  OK_200_GETUSER: { code: 'OK-200-GETUSER', message: 'User found successfully', success: true },
  OK_200_LISTUSERS: {
    code: 'OK-200-LISTUSERS',
    message: 'Users retrieved successfully',
    success: true,
  },
  OK_201_CREATEUSER: {
    code: 'OK-201-CREATEUSER',
    message: 'User created successfully',
    success: true,
  },
  OK_200_UPDATEUSER: {
    code: 'OK-200-UPDATEUSER',
    message: 'User updated successfully',
    success: true,
  },
  OK_200_DELETEUSER: {
    code: 'OK_200_DELETEUSER',
    message: 'User deleted successfully',
    success: true,
  },

  // Códigos de error (4xx)
  ERROR_400_BADREQUEST: { code: 'ERROR-400-BADREQUEST', message: 'Bad request', success: false },
  ERROR_401_UNAUTHORIZED: {
    code: 'ERROR-401-UNAUTHORIZED',
    message: 'Unauthorized',
    success: false,
  },
  ERROR_403_FORBIDDEN: { code: 'ERROR-403-FORBIDDEN', message: 'Forbidden', success: false },
  ERROR_404_NOTFOUND: { code: 'ERROR-404-NOTFOUND', message: 'Resource not found', success: false },
  ERROR_409_CONFLICT: {
    code: 'ERROR-409-CONFLICT',
    message: 'Resource already exists',
    success: false,
  },

  // Códigos de error del servidor (5xx)
  ERROR_500_INTERNAL: {
    code: 'ERROR-500-INTERNAL',
    message: 'Internal server error',
    success: false,
  },
};
