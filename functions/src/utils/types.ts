import { Request as FirebaseRequest } from "firebase-functions/v2/https";
import { Response } from "express";
import { HTTPMethod } from "./http/http-methods";
export * from './auth/types';

export interface AuthOptions {
  requireToken?: boolean;
  requireClient?: boolean;
  requireAdmin?: boolean;
}

export interface AuthData {
  userId?: string;
  clientId?: string;
  clientData?: any;
  tokenData?: any;
}

export interface ServiceHandler {
  handle: (request: FirebaseRequest, response: Response) => Promise<void>;
  authOptions?: AuthOptions;
  method: HTTPMethod;
}

export type MiddlewareFunction = (
  request: FirebaseRequest,
  response: Response,
  next: () => void
) => void | Promise<void>;

export interface AuthRequirement {
  method: HTTPMethod;
  options: AuthOptions;
}