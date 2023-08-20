import * as admin from "firebase-admin";
import * as functions from "firebase-functions/v2/https";
import { Response } from "express";
import { Database } from "./utilities/database/database";
import { ClientRepository } from "./utilities/repositories/client_repository";
import { Repository } from "./utilities/repositories/repository";
import { WebService } from "./utilities/interfaces/web_service";
import { ClientValidator } from "./utilities/validators/client_validator";
import { Validator } from "./utilities/interfaces/valitator";
import { AuthorizationValidator } from "./utilities/validators/authorization_validator";
import { ClientService } from "./utilities/web_services/client_service/client_service";
import { ResponseBuilder } from "./utilities/response_builder/response_builder";

admin.initializeApp();
const database = new Database(admin.firestore());

// -- Dependencies
const repositories = new Repository(new ClientRepository(database));

// NOTE: don't use hashmap here to avoid creating unnecessary services.
let supportedServices: string[] = ["client"];

supportedServices.forEach((name) => {
  exports[name] = functions.onRequest((req, res) => {
    runValidators(validatorsFor(name).slice(), req, res).then(() => {
      const service = webService(name);
      if (service == undefined) {
        return ResponseBuilder.serviceUnavailable(res, null, [
          `service is not registered for :/${name}`,
        ]);
      }

      webService(name)?.onRequest(req, res);
    });
  });
});

function webService(serviceName: string): WebService | undefined {
  switch (serviceName) {
    case "client":
      return new ClientService(repositories.client);
    default:
      return undefined;
  }
}

function runValidators(
  validators: Validator[],
  req: functions.Request,
  res: Response
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const validationPromises = validators.map((validator) => {
      return new Promise<void>((resolve, reject) => {
        validator.validate(req, res, (error?: any) => {
          if (error) {
            reject(error); // Reject the promise if validation fails
          } else {
            resolve(); // Resolve the promise if validation succeeds
          }
        });
      });
    });

    validationPromises
      .reduce(
        (chain, validationPromise) => chain.then(() => validationPromise),
        Promise.resolve()
      )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        // Handle the validation error
        res.json({ error: "Validation failed" });
        reject(error);
      });
  });
}

function validatorsFor(serviceName: string): Validator[] {
  switch (serviceName) {
    case "client":
      return [];
    default:
      return [
        new ClientValidator(repositories.client),
        new AuthorizationValidator(),
      ];
  }
}
