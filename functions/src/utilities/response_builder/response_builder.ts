import { Response } from "express";

export class ResponseBuilder {
  // MARK: - success
  static json(response: Response, data: any) {
    response.status(200).json(data);
  }

  // MARK: - client error

  static badRequest(
    response: Response,
    data: any | undefined,
    error: string[]
  ) {
    response.status(400).json(new Error(data, error));
  }

  static unauthorized(
    response: Response,
    data: any | undefined,
    error: string[]
  ) {
    response.status(401).json(new Error(data, error));
  }
  static paymentRequired(
    response: Response,
    data: any | undefined,
    error: string[]
  ) {
    response.status(401).json(new Error(data, error));
  }
  static forbidden(response: Response, data: any | undefined, error: string[]) {
    response.status(403).json(new Error(data, error));
  }

  static notFound(response: Response, data: any | undefined, error: string[]) {
    response.status(404).json(new Error(data, error));
  }

  // MARK: - server error

  static serverError(
    response: Response,
    data: any | undefined,
    error: string[]
  ) {
    response.status(500).json(new Error(data, error));
  }

  static notImplemented(
    response: Response,
    data: any | undefined,
    error: string[]
  ) {
    response.status(501).json(new Error(data, error));
  }

  static badGateway(
    response: Response,
    data: any | undefined,
    error: string[]
  ) {
    response.status(502).json(new Error(data, error));
  }

  static serviceUnavailable(
    response: Response,
    data: any | undefined,
    error: string[]
  ) {
    response.status(503).json(new Error(data, error));
  }
}

export class Error {
  data: any | undefined;
  error: string[];

  constructor(data: any, error: string[]) {
    this.data = data;
    this.error = error;
  }
}
