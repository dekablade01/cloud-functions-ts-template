import { Request, Response } from "firebase-functions/v1";
import { NextFunction } from "express";
import { ClientRepository } from "../repositories/client_repository";
import { Validator } from "../interfaces/valitator";
import { ResponseBuilder } from "../response_builder/response_builder";

class ClientValidator implements Validator {
  clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    const clientId = req.headers["client_id"] as string;
    if (clientId != undefined) {
      const client = await this.clientRepository.getClient(clientId);
      if (client != undefined) {
        return next();
      } else {
        return ResponseBuilder.unauthorized(res, null, [
          "client_id is not valid",
        ]);
      }
    } else {
      return ResponseBuilder.unauthorized(res, null, [
        "client_id is required in the request header",
      ]);
    }
  }
}

export { ClientValidator };
