import { Request as FirebaseRequest } from "firebase-functions/v2/https";
import { Response, NextFunction } from "express";
import { MiddlewareFunction } from "../types";

type MiddlewareOrFactory = MiddlewareFunction | ((options: any) => MiddlewareFunction);

export function adaptMiddleware(
  middleware: MiddlewareOrFactory[]
): Array<(request: FirebaseRequest, response: Response) => Promise<void>> {
  return middleware.map(mw => async (request: FirebaseRequest, response: Response) => {
    await new Promise<void>((resolve, reject) => {
      const next: NextFunction = () => resolve();
      
      try {
        // Handle both factory functions and regular middleware
        const middlewareFunction = typeof mw === 'function' && mw.length === 1
          ? (mw as (options: any) => MiddlewareFunction)({ requireToken: true })
          : (mw as MiddlewareFunction);
        
        // Execute the middleware
        const result = middlewareFunction(request, response, next);
        
        // Handle both Promise and non-Promise results
        if (result instanceof Promise) {
          result.catch(reject);
        }
      } catch (error) {
        reject(error);
      }
    });
  });
} 