// src/application/dtos/userDto.ts
export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
