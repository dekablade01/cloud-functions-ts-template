import { Request } from "firebase-functions/v2/https";
import { Response } from "express";


export type MiddlewareFunction = (
  request: Request,
  response: Response,
  next: () => void
) => void | Promise<void>;

export interface ResponseBuilder {
  unauthorized: (response: Response, data: any, errors: string[]) => void;
  forbidden: (response: Response, data: any, errors: string[]) => void;
  badRequest: (response: Response, data: any, errors: string[]) => void;
} 