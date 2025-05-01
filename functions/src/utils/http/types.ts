import { Response } from 'express';
import { Request as FirebaseRequest } from "firebase-functions/v2/https";
import { ServiceHandler } from '../types';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface Request {
  path: string;
  method: HttpMethod;
  parameters?: Record<string, any>;
  headers?: Record<string, string>;
  query?: Record<string, any>;
  body?: any;
}

export interface HTTPHandlerConfig {
  services: ServiceHandler[];
  middleware?: Array<(request: FirebaseRequest, response: Response) => Promise<void>>;
}

export interface RequestManagerConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
} 