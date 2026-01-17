/**
 * Handle API errors and return a user-friendly error message
 * Displays both 'errors' and 'message' fields if they exist
 */
export const handleApiError = (err: any, defaultMessage: string = "Something went wrong!"): string => {
  try {
    const errorMessages: string[] = [];

    // Add specific error details if available
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      if (typeof errors === "string") {
        errorMessages.push(errors);
      } else if (typeof errors === "object") {
        // Handle object-type errors
        Object.values(errors).forEach((error: any) => {
          if (typeof error === "string") {
            errorMessages.push(error);
          } else if (Array.isArray(error)) {
            errorMessages.push(...error.filter((e) => typeof e === "string"));
          }
        });
      }
    }

    // Add main message if different from errors
    if (err.response?.data?.message) {
      const message = err.response.data.message;
      if (!errorMessages.includes(message)) {
        errorMessages.push(message);
      }
    }

    // Return combined error message or default
    return errorMessages.length > 0 ? errorMessages.join(" | ") : defaultMessage;
  } catch {
    return defaultMessage;
  }
};
