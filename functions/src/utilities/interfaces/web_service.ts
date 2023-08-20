import { Response } from "express";
import { Request } from "firebase-functions/v2/https";

export interface WebService {
  onRequest(req: Request, res: Response): Promise<void>;
}
