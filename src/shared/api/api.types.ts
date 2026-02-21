export interface ApiResponse<T> {
  httpStatus?: unknown;
  isSuccess: boolean;
  message: string;
  code: number | string;
  result: T;
}
