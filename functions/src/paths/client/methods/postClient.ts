import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { success, serverError } from "../../../utils/response-builder";
import { HTTPMethod } from "../../../utils/http/http-methods";
import { ServiceHandler } from "../../../utils/types";
import { ClientRepository, Client } from "../../../repositories/client-repository";
import { firestore } from "../../../utils/firebase";
import * as crypto from 'crypto';

const clientRepository = new ClientRepository(firestore);

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
/**
 * Example POST body:
 * {
 *   "name": "My Client App",
 *   "type": "consumer"
 * }
 * 
 * Valid types:
 * - "consumer"
 * - "business"
 * - "admin"
 * 
 * The server will automatically generate:
 * - id (UUID)
 * - secret (hashed UUID)
 * - is_enabled (true)
 * - created_at (current timestamp)
 * - updated_at (current timestamp)
 */


export const postClient: ServiceHandler = {
  method: HTTPMethod.POST,
  authOptions: { 
    requireToken: true, 
    requireClient: true, 
    requireAdmin: false 
  },
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      const clientData: Partial<Client> = request.body;

      // Validate required fields
      const missingFields = [];
      if (!clientData.name) missingFields.push('name');
      if (!clientData.type) missingFields.push('type');

      if (missingFields.length > 0) {
        response.status(400).json({
          success: false,
          data: null,
          errors: [`Missing required fields: ${missingFields.join(', ')}`]
        });
        return;
      }

      // Create new client
      const now = (new Date()).toISOString();
      const newClient = await clientRepository.create({ 
        id: crypto.randomUUID(),
        name: clientData.name,
        secret: sha256(crypto.randomUUID()),
        is_enabled: true,
        type: clientData.type,
        created_at: now,
        updated_at: now        
      });
      
      response.status(201);
      success(response, newClient);
    } catch (error) {
      console.error('Error in postClient:', error);
      serverError(response, 
        error instanceof Error ? error : 'Unknown error occurred'
      );
    }
  }
};
