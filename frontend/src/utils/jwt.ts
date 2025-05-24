/**
 * Utility functions for handling JWT tokens
 */

/**
 * Parses a JWT token and returns the decoded payload
 * @param token JWT token string
 * @returns Decoded JWT payload as an object
 */
export const parseJwt = (token: string): any => {
  try {
    // Get the payload part of the JWT (second part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token JWT token string
 * @returns boolean indicating if the token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};
