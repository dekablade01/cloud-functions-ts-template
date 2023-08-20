import { Response } from "firebase-functions/v1";
import { Request } from "firebase-functions/v2/https";
import { WebService } from "../../interfaces/web_service";
import { ClientRepository } from "../../repositories/client_repository";
import { ResponseBuilder } from "../../response_builder/response_builder";
import { ClientServicePost } from "./client_service_post";

class ClientService implements WebService {
  private post: ClientServicePost;

  constructor(clientRepository: ClientRepository) {
    this.post = new ClientServicePost(clientRepository);
  }
  async onRequest(req: Request, res: Response<any>): Promise<void> {
    switch (req.method) {
      case "POST":
        return this.post.onRequest(req, res);
      default:
        return ResponseBuilder.badRequest(res, null, [
          `${req.method} is not supported by this path`,
        ]);
    }
  }
}

export { ClientService };
