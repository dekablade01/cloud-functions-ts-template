import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { success, serverError } from "../../../utils/response-builder";
import { HTTPMethod } from "../../../utils/http/http-methods";
import { ServiceHandler } from "../../../utils/types";
import { ClientRepository, Client } from "../../../repositories/client-repository";
import { firestore } from "../../../utils/firebase";

const clientRepository = new ClientRepository(firestore);



export const putClient: ServiceHandler = {
  method: HTTPMethod.PUT,
  authOptions: { 
    requireToken: true, 
    requireClient: true, 
    requireAdmin: false 
  },
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      const { id } = request.query;
      const updateData: Partial<Client> = request.body;

      // Validate ID
      if (!id) {
        response.status(400).json({
          success: false,
          data: null,
          errors: ['Client ID is required']
        });
        return;
      }

      // Check if client exists
      const existingClient = await clientRepository.findById(id as string);
      if (!existingClient) {
        response.status(404).json({
          success: false,
          data: null,
          errors: ['Client not found']
        });
        return;
      }

      // Update client
      const updatedClient = await clientRepository.update(id as string, updateData);
      success(response, updatedClient);
    } catch (error) {
      console.error('Error in putClient:', error);
      serverError(response, 
        error instanceof Error ? error : 'Unknown error occurred'
      );
    }
  }
}; 