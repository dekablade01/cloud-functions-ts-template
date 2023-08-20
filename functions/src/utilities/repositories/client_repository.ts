import { Database } from "../database/database";

class ClientRepository {
  private database: Database;
  constructor(database: Database) {
    this.database = database;
  }

  async getClient(clientName: string): Promise<Client | undefined> {
    const clients = await this.database.readByCondition("CLIENT", (query) => {
      return query.where("client_name", "==", clientName).limit(1);
    });

    if (clients[0] == undefined) {
      return undefined;
    }

    return Client.fromDictionary(clients[0]);
  }

  async createClient(): Promise<Client> {
    const id = await this.database.create("CLIENT", {
      client_id: this.generateAlphaNumericString(64),
      created_date: new Date(),
    });

    return Client.fromDictionary(await this.database.readById("CLIENT", id));
  }

  private generateAlphaNumericString(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
}

class Client {
  clientId: string;
  createdDate: Date;

  constructor(clientId: string, createdDate: Date) {
    this.clientId = clientId;
    this.createdDate = createdDate;
  }

  static fromDictionary(dictionary: { [key: string]: any }): Client {
    const { client_id, created_date } = dictionary;
    return new Client(client_id, created_date.toDate());
  }
}

export { ClientRepository, Client };
