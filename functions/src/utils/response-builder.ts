import { Response } from "express";

function sendErrorResponse(res: Response, errors: string[], status: number = 500): void {
  res.status(status).json({
    success: false,
    data: null,
    errors
  });
}

export function success<T>(res: Response, data: T, status: number = 200): void {
  res.status(status).json({
    success: true,
    data,
    errors: []
  });
}

export function badRequest(res: Response, errors: string[]): void {
  sendErrorResponse(res, errors, 400);
}

export function unauthorized(res: Response, errors: string[]): void {
  sendErrorResponse(res, errors, 401);
}

export function forbidden(res: Response, errors: string[]): void {
  sendErrorResponse(res, errors, 403);
}

export function notFound(res: Response, errors: string[]): void {
  sendErrorResponse(res, errors, 404);
}

export function serverError(res: Response, error: Error | string): void {
  const errorMessage = error instanceof Error ? error.message : error;
  sendErrorResponse(res, [errorMessage], 500);
} 