export const validateFile = (file: File): string | null => {
  if (!file) return "File is required!";

  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  const maxSize = 2 * 1024 * 1024; // 2MB


  if (!allowedTypes.includes(file.type)) {
    return "Only PNG, JPG, and JPEG files are allowed!";
  }


  if (file.size > maxSize) {
    return "File size must be less than 2MB!";
  }

  return null; 
};
