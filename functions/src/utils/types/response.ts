import { Response } from "express";

export interface ResponseBuilder {
  unauthorized: (response: Response, data: any, errors: string[]) => void;
  forbidden: (response: Response, data: any, errors: string[]) => void;
  badRequest: (response: Response, data: any, errors: string[]) => void;
} 