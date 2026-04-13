import { ApiError } from './api';

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Redirect to login or refresh token
        return 'Please log in to continue';
      case 403:
        return "You don't have permission to perform this action";
      case 404:
        return 'The requested resource was not found';
      case 500:
        return 'Server error. Please try again later';
      default:
        return error.message;
    }
  }

  return 'An unexpected error occurred';
}
