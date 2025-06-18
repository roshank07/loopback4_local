// src/services/client-service.ts
import {JWT} from '../config/config.json';
export interface Client {
  clientId: string;
  clientSecret: string;
  source: string;
}

export class ClientService {
  private clients: Client[] = JWT.client;

  async validate(clientId: string, clientSecret: string): Promise<Client | null> {
    const client = this.clients.find(c => c.clientId === clientId && c.clientSecret === clientSecret);
    return client || null;
  }
}
