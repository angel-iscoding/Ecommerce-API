export class ApiResponseDto<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  // path?: string; // Opcional: para debugging
}