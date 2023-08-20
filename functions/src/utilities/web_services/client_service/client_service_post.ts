import { Response } from "firebase-functions/v1";
import { Request } from "firebase-functions/v2/https";
import { WebService } from "../../interfaces/web_service";
import { ClientRepository } from "../../repositories/client_repository";
import { ResponseBuilder } from "../../response_builder/response_builder";

class ClientServicePost implements WebService {
  clientRepository: ClientRepository;
  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  async onRequest(req: Request, res: Response<any>): Promise<void> {
    const client = await this.clientRepository.createClient();
    return ResponseBuilder.json(res, client);
  }
}

export { ClientServicePost };
