import { FirestoreRepository } from '../utils/repositories/base-repository';

export enum ClientType { 
  CONSUMER = 'consumer',
  BUSINESS = 'business',
  ADMIN = 'admin'
}

export interface Client {
  id: string;
  secret: string;
  name: string;
  is_enabled: boolean;
  type: ClientType;
  created_at: string;
  updated_at: string;
}

export class ClientRepository extends FirestoreRepository<Client> {
  protected collectionName = 'CLIENTS';

} 