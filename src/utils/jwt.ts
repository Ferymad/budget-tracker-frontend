/**
 * JWT utility functions for token handling
 */

export interface DecodedToken {
  exp: number;
  iat: number;
  user_id: string;
  email: string;
}

/**
 * Decode JWT token payload (without verification)
 * Only for reading token data, not for validation
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // Split token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url decode)
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as DecodedToken;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return true;
  }

  // Check if token expires within next 5 minutes (buffer time)
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  return expirationTime < (currentTime + bufferTime);
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  return new Date(decoded.exp * 1000);
};

/**
 * Get user ID from token
 */
export const getUserIdFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.user_id || null;
};

/**
 * Get user email from token
 */
export const getUserEmailFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded?.email || null;
};

export const jwtUtils = {
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
  getUserIdFromToken,
  getUserEmailFromToken,
};