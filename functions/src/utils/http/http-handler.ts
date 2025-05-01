import { Request as FirebaseRequest } from "firebase-functions/v2/https";
import { Response } from 'express';
import { HTTPHandlerConfig } from './types';
import { ServiceHandler } from '../types';
import { HTTPMethod } from './http-methods';

export class HTTPHandler {
  private services: ServiceHandler[];
  private middleware: Array<(request: FirebaseRequest, response: Response) => Promise<void>>;

  constructor(config: HTTPHandlerConfig) {
    this.services = config.services;
    this.middleware = config.middleware || [];
  }

  async handle(request: FirebaseRequest, response: Response): Promise<void> {
    // Apply middleware
    for (const middleware of this.middleware) {
      await middleware(request, response);
    }

    const service = this.services.find(s => s.method === request.method as HTTPMethod);
    if (!service) {
      throw new Error(`No service found for method: ${request.method}`);
    }

    await service.handle(request, response);
  }
}