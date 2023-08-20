import { Response } from "express";
import { Request } from "firebase-functions/v2/https";
import { ResponseBuilder } from "../response_builder/response_builder";

class WebService {
  async onRequest(req: Request, res: Response<any>): Promise<void> {
    switch (req.method) {
      case "GET":
        return this.get(req, res);
      case "POST":
        return this.post(req, res);
      case "PUT":
        return this.put(req, res);
      case "PATCH":
        return this.patch(req, res);
      case "DELETE":
        return this.delete(req, res);
      case "OPTIONS":
        return this.options(req, res);
      case "HEAD":
        return this.head(req, res);
    }
  }

  async get(req: Request, res: Response<any>): Promise<void> {
    this.default(req, res);
  }

  async post(req: Request, res: Response<any>): Promise<void> {
    this.default(req, res);
  }

  async put(req: Request, res: Response<any>): Promise<void> {
    this.default(req, res);
  }

  async patch(req: Request, res: Response<any>): Promise<void> {
    this.default(req, res);
  }

  async delete(req: Request, res: Response<any>): Promise<void> {
    this.default(req, res);
  }

  async options(req: Request, res: Response<any>): Promise<void> {
    this.default(req, res);
  }

  async head(req: Request, res: Response<any>): Promise<void> {
    this.default(req, res);
  }

  async default(req: Request, res: Response<any>): Promise<void> {
    ResponseBuilder.notFound(res, null, [`METHOD: ${req.method} not found`]);
  }
}

export { WebService };
