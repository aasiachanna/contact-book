const errorHandler = (error) => {
  if (!error) return 'An unexpected error occurred';

  // API errors
  if (error.response) {
    const { status, data } = error.response;
    
    if (data && data.message) {
      return data.message;
    }

    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Authentication failed. Please try again.';
      case 403:
        return 'Access denied. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return `Error ${status}: ${error.message}`;
    }
  }

  // Network errors
  if (error.request) {
    return 'Network error. Please check your internet connection.';
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return Object.values(error.errors)
      .map(err => err.message)
      .join('\n');
  }

  // Form validation errors
  if (error.name === 'FormError') {
    return error.message;
  }

  // Default error
  return error.message || 'An unexpected error occurred';
};

export { errorHandler };