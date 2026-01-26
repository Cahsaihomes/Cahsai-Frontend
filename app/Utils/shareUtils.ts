/**
 * Utility functions for generating social media share URLs
 */

export interface ShareUrlParams {
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Generate Facebook share URL
 */
export const generateFacebookShareUrl = (params: ShareUrlParams): string => {
  const fbUrl = new URL("https://www.facebook.com/sharer/sharer.php");
  fbUrl.searchParams.set("u", params.url);
  fbUrl.searchParams.set("quote", params.title || "Check this out on Cahsai!");
  return fbUrl.toString();
};

/**
 * Generate Twitter/X share URL
 */
export const generateTwitterShareUrl = (params: ShareUrlParams): string => {
  const twitterUrl = new URL("https://twitter.com/intent/tweet");
  twitterUrl.searchParams.set("url", params.url);
  twitterUrl.searchParams.set("text", params.title || "Check this out on Cahsai!");
  return twitterUrl.toString();
};

/**
 * Generate WhatsApp share URL
 */
export const generateWhatsAppShareUrl = (params: ShareUrlParams): string => {
  const message = `${params.title || "Check this out on Cahsai!"}\n${params.url}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?text=${encodedMessage}`;
};

/**
 * Generate Instagram share URL (note: Instagram doesn't support direct sharing via URL scheme in web)
 * This will open Instagram with a message to manually paste
 */
export const generateInstagramShareMessage = (params: ShareUrlParams): string => {
  return `${params.title || "Check this out on Cahsai!"}\n${params.url}`;
};

/**
 * Generate LinkedIn share URL
 */
export const generateLinkedInShareUrl = (params: ShareUrlParams): string => {
  const linkedinUrl = new URL("https://www.linkedin.com/sharing/share-offsite/");
  linkedinUrl.searchParams.set("url", params.url);
  return linkedinUrl.toString();
};

/**
 * Copy text to clipboard with fallback support
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

/**
 * Open share URL in a new window
 */
export const openShareWindow = (url: string, title: string = "Share"): void => {
  const width = 600;
  const height = 400;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  
  window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
};

/**
 * Get the current page/post URL - can be customized as needed
 * SECURITY NOTE: For production, consider using:
 * - URL slugs (e.g., /post/beautiful-beachfront-property)
 * - Encrypted/hashed IDs instead of raw database IDs
 * - Unique identifiers instead of sequential IDs
 */
export const getShareUrl = (postId?: number | string): string => {
  const baseUrl = window.location.origin;
  if (postId) {
    // Current format uses simple numeric ID
    // TODO: Replace with slug or encrypted ID for production
    return `${baseUrl}/post/${postId}`;
  }
  return window.location.href;
};
