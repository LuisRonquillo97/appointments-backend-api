/**
 * Dto request to create a user.
 */
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

/**
 * Dto request to update a user.
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * Dto request to login user.
 */
export interface UserLoginDto {
  email: string;
  password: string;
}

/**
 * Dto response from user.
 */

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLoginResponseDto {
  id: string;
  name: string;
  email: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}
