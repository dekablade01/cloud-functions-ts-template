import { Request, Response, NextFunction } from "express";
import { HTTPMethod } from "./http";
import { AuthOptions, AuthData } from "./types";
import { WebService } from "./services/web-service";

// Store registered services
const services: WebService[] = [];

// Register a service
export function registerService(service: WebService) {
  services.push(service);
}

// Default auth options for all services
const DEFAULT_AUTH_OPTIONS: AuthOptions = {
  requireClient: true,    // Don't require client ID by default
  requireToken: false,      // Require bearer token by default
  requireAdmin: false      // Don't require admin by default
};

// Extend Express Request type to include authData
declare global {
  namespace Express {
    interface Request {
      authData?: AuthData;
    }
  }
}

export const withAuth = (options: AuthOptions = DEFAULT_AUTH_OPTIONS) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const path = req.path;
      const method = req.method as HTTPMethod;
      
      // Get service and its auth requirements
      const service = services.find(s => s.path === path);
      const methodRequirements = service?.authRequirements.find(req => req.method === method)?.options;
      
      // Use method-specific requirements if they exist, otherwise use default options
      const requirements = {
        ...DEFAULT_AUTH_OPTIONS,  // Start with system defaults
        ...options,              // Override with service-specific defaults if provided
        ...methodRequirements    // Override with method-specific requirements if they exist
      };

      // Check client ID if required
      if (requirements.requireClient) {
        const clientId = req.headers["x-client-id"];

        if (!clientId) {
          res.status(401).json({
            success: false,
            data: null,
            errors: ["Client ID required"]
          });
          return;
        }
      }

      // Check token if required
      if (requirements.requireToken) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          res.status(401).json({
            success: false,
            data: null,
            errors: ["Authorization token required"]
          });
          return;
        }

        // Verify token and get auth data
        const authData = await verifyToken(token);
        if (!authData) {
          res.status(401).json({
            success: false,
            data: null,
            errors: ["Invalid token"]
          });
          return;
        }

        // Check admin role if required
        if (requirements.requireAdmin && authData.tokenData?.role !== 'ADMIN') {
          res.status(403).json({
            success: false,
            data: null,
            errors: ["Admin access required"]
          });
          return;
        }

        // Attach auth data to request
        req.authData = authData;
      }

      next();
      return;
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(500).json({
        success: false,
        data: null,
        errors: ["Internal server error"]
      });
      return;
    }
  };
};

// Mock token verification - replace with actual implementation
async function verifyToken(token: string): Promise<AuthData | null> {
  // TODO: Implement actual token verification
  return {
    userId: "mock-user-id",
    tokenData: { role: "ADMIN" }
  };
}

// Example: Logging middleware
export const logRequest = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toLocaleString()}] ${req.method}: /${process.env.K_SERVICE}`);
  next();
  return;
};

// Example: Response time middleware
export const responseTime = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`Request took ${duration}ms`);
  });
  next();
  return;
}; 