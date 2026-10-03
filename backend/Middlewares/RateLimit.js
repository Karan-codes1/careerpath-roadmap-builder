import rateLimit from "express-rate-limit";

// Counters are kept in this server's memory: nothing to set up or pay for.
// They reset when the server restarts and are not shared between servers,
// which is fine while the API runs as a single instance.

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// All the numbers in one place so they are easy to tune.
const LIMITS = {
  general: { windowMs: 15 * MINUTE, limit: 300 }, // every request, per IP
  login: { windowMs: 15 * MINUTE, limit: 5 }, // FAILED logins, per IP
  signup: { windowMs: HOUR, limit: 10 }, // new accounts, per IP
  aiHourly: { windowMs: HOUR, limit: 20 }, // AI calls, per user
  aiDaily: { windowMs: 24 * HOUR, limit: 50 }, // AI calls, per user
};

const createLimiter = ({ windowMs, limit }, message, extra = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7", // tells the client how many requests are left
    legacyHeaders: false,
    // Same { message } shape every other error in this API uses
    message: { message },
    ...extra,
  });

// Safety net for the whole API (scraping, floods). Counted per IP address.
export const generalLimiter = createLimiter(
  LIMITS.general,
  "Too many requests. Please try again in a few minutes."
);

// Password guessing. Only failed attempts count, so people who log in
// correctly (even many of them behind one Wi-Fi) are never locked out.
export const loginLimiter = createLimiter(
  LIMITS.login,
  "Too many failed login attempts. Please try again in 15 minutes.",
  { skipSuccessfulRequests: true }
);

// Mass account creation. Every attempt counts.
export const signupLimiter = createLimiter(
  LIMITS.signup,
  "Too many accounts created from this network. Please try again later."
);

// The AI routes cost money per call, so they are counted per ACCOUNT, not per
// IP — switching networks does not reset the count. These must run after
// ensureAuthenticated, which is what puts the user on the request.
const byUser = (req) => req.user._id.toString();

export const aiHourlyLimiter = createLimiter(
  LIMITS.aiHourly,
  "You've reached the hourly limit for AI features. Please try again later.",
  { keyGenerator: byUser }
);

export const aiDailyLimiter = createLimiter(
  LIMITS.aiDaily,
  "You've reached today's limit for AI features. Please try again tomorrow.",
  { keyGenerator: byUser }
);
