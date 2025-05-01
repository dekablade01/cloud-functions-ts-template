import { ServiceHandler } from "../../utils/types";
import { BaseWebService } from "../../utils/services/web-service";
import { getClient } from "./methods/getClient";
import { postClient } from "./methods/postClient";
import { putClient } from "./methods/putClient";
import { deleteClient } from "./methods/deleteClient";

export class ClientService extends BaseWebService {
  readonly path = "/client";

  readonly handlers: ServiceHandler[] = [
    getClient,
    postClient,
    putClient,
    deleteClient
  ];
}

// Export an instance of the service
export default new ClientService();