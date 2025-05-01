import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { AuthData } from "./auth";

export type ServiceFunction = (request: Request, response: Response, authData?: AuthData) => void | Promise<void>;
export type MiddlewareFunction = (request: Request, response: Response, next: () => void) => void | Promise<void>;

export interface ServiceHandlers {
  [key: string]: ServiceFunction;
} 