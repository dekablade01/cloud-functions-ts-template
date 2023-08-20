import { ClientRepository } from "./client_repository";

class Repository {
  client: ClientRepository;

  constructor(client: ClientRepository) {
    this.client = client;
  }
}

export { Repository };
