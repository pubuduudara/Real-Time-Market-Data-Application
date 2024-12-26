import { Request, Response, NextFunction } from "express";

// Load valid API keys from environment variables
const validApiKeys: string[] = (process.env.VALID_API_KEYS || "")
  .split(",")
  .map((key) => key.trim());

/**
 * Middleware to enforce API key authentication.
 * Ensures that a valid API key is provided in the `x-api-key` header.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function authenticateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Skip authentication for Swagger-related routes
  if (req.path.startsWith("/api-docs")) {
    return next();
  }
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    res.status(401).json({ error: "Unauthorized: API key is missing" });
    return;
  }

  if (!validApiKeys.includes(apiKey)) {
    res.status(403).json({ error: "Forbidden: Invalid API key" });
    return;
  }

  next();
}
