import { Request, Response } from "firebase-functions/v1";
import { NextFunction } from "express";

interface Validator {
  validate(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export { Validator };
