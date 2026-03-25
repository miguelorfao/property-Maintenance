/**
 * Security configuration for the application
 * These settings should be implemented on the server hosting the application
 */

// Security headers that should be added to HTTP responses
export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  "X-Frame-Options": "SAMEORIGIN",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection (browser built-in)
  "X-XSS-Protection": "1; mode=block",

  // Referrer Policy - control what referrer info is shared
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Content Security Policy - prevent XSS and injection attacks
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.firebaseapp.com https://*.firebase.googleapis.com; frame-ancestors 'self';",

  // Permissions Policy - limit browser features
  "Permissions-Policy":
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
};

// Rate limiting configuration
export const RATE_LIMITING = {
  // Max requests per window
  maxRequests: 100,
  // Time window in milliseconds (10 minutes)
  windowMs: 10 * 60 * 1000,
  // Message when limit exceeded
  message: "Too many requests from this IP, please try again later.",
};

// Input sanitization rules
export const INPUT_LIMITS = {
  maxNameLength: 100,
  minNameLength: 2,
  maxAddressLength: 200,
  minAddressLength: 5,
  maxDescriptionLength: 500,
  minDescriptionLength: 5,
  maxFieldLength: 1000,
};

// Allowed characters in various fields
export const ALLOWED_PATTERNS = {
  propertyName: /^[a-zA-Z0-9\s\-'&.,()]+$/,
  address: /^[a-zA-Z0-9\s\-'&.,()#/]+$/,
  description: /^[a-zA-Z0-9\s\-'&.,()!?:;]+$/,
  accountNumber: /^[0-9]{8}$/,
  sortCode: /^[0-9]{2}-[0-9]{2}-[0-9]{2}$/,
};

// CORS configuration
export const CORS_CONFIG = {
  origin: process.env.VITE_ALLOWED_ORIGINS || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Firebase security best practices notes
export const FIREBASE_SECURITY_NOTES = `
IMPORTANT: Firebase Security Rules

For production, ensure your Firestore rules are properly configured:

1. DISABLE public read/write access
2. Implement authentication (Firebase Auth, Google Sign-In, etc.)
3. Use custom claims for role-based access control
4. Validate data at write time
5. Implement rate limiting at the database level
6. Use security rules to validate input constraints

Example Firestore rules structure:
- Only authenticated users can read/write
- Users can only access their own data
- Validation rules for data integrity
- Rate limiting for writes per user
`;

export default {
  SECURITY_HEADERS,
  RATE_LIMITING,
  INPUT_LIMITS,
  ALLOWED_PATTERNS,
  CORS_CONFIG,
  FIREBASE_SECURITY_NOTES,
};
