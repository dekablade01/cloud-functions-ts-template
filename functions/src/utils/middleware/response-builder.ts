import { Response } from "express";
import { ResponseBuilder } from "../types/response";

export const responseBuilder: ResponseBuilder = {
  unauthorized: (response: Response, data: any, errors: string[]) => {
    response.status(401).json({ data, errors });
  },
  forbidden: (response: Response, data: any, errors: string[]) => {
    response.status(403).json({ data, errors });
  },
  badRequest: (response: Response, data: any, errors: string[]) => {
    response.status(400).json({ data, errors });
  }
}; 