import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { ServiceHandler, MiddlewareFunction } from "./types";
import { HTTPMethod } from "./http/http-methods";

export class HTTPHandler {
  private handlers: ServiceHandler[];
  private middleware: MiddlewareFunction[];

  constructor(handlers: ServiceHandler[], middleware: MiddlewareFunction[] = []) {
    this.handlers = handlers;
    this.middleware = middleware;
  }

  private async executeMiddleware(request: Request, response: Response, index: number = 0): Promise<void> {
    if (index >= this.middleware.length) {
      // All middleware passed, execute the service
      const method = request.method as HTTPMethod;
      const handler = this.handlers.find(h => h.method === method);

      if (handler) {
        await handler.handle(request, response);
      } else {
        response.status(405).send("Method not allowed");
      }
      return;
    }

    const currentMiddleware = this.middleware[index];
    await currentMiddleware(request, response, () => {
      this.executeMiddleware(request, response, index + 1);
    });
  }

  public async handle(request: Request, response: Response): Promise<void> {
    await this.executeMiddleware(request, response);
  }
} 