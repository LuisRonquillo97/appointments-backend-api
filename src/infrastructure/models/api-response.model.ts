export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
  statusCode: number;
}
