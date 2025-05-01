import { BaseWebService } from "../../utils/services/web-service";
import { ServiceHandler } from "../../utils/types";
import { getUser } from "./methods/getUser";
import { postUser } from "./methods/postUser";
import { putUser } from "./methods/putUser";
import { deleteUser } from "./methods/deleteUser";

export class UserService extends BaseWebService {
  readonly path = "/user";

  readonly handlers: ServiceHandler[] = [
    getUser,
    postUser,
    putUser,
    deleteUser
  ];
}

// Export an instance of the service
export default new UserService(); 