/**
 * Handle API errors and return a user-friendly error message
 * Shows the first available error from 'errors' field, falls back to 'message'
 */
export const handleApiError = (err: any, defaultMessage: string = "Something went wrong!"): string => {
  try {
    // Check for errors field first
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      if (typeof errors === "string") {
        return errors;
      } else if (typeof errors === "object") {
        // Handle object-type errors - return the first one
        const firstError = Object.values(errors).find((error: any) => {
          if (typeof error === "string") return true;
          if (Array.isArray(error) && error.length > 0 && typeof error[0] === "string") return true;
          return false;
        });

        if (firstError) {
          if (typeof firstError === "string") {
            return firstError;
          } else if (Array.isArray(firstError)) {
            return firstError[0];
          }
        }
      }
    }

    // Fall back to message field
    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    return defaultMessage;
  } catch {
    return defaultMessage;
  }
};
