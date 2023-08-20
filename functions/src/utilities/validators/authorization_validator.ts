import { NextFunction } from "express";
import { Request, Response } from "firebase-functions/v1";
import { Validator } from "../interfaces/valitator";

import * as admin from "firebase-admin";
import { ResponseBuilder } from "../response_builder/response_builder";

class AuthorizationValidator implements Validator {
  async validate(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return ResponseBuilder.unauthorized(res, null, [
        "Authorization Header is not provided",
      ]);
      return;
    }

    const idToken = authorizationHeader.split("Bearer ")[1];

    try {
      if (await admin.auth().verifyIdToken(idToken)) {
        return next();
      }
      return ResponseBuilder.forbidden(res, null, ["cannot verify token"]);
    } catch (error) {
      return ResponseBuilder.forbidden(res, null, ["token is not valid"]);
    }
  }
}

export { AuthorizationValidator };
