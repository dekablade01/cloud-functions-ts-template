import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { success, serverError } from "../../../utils/response-builder";
import { HTTPMethod } from "../../../utils/http/http-methods";
import { ServiceHandler } from "../../../utils/types";
import { ClientRepository } from "../../../repositories/client-repository";
import { firestore } from "../../../utils/firebase";

const clientRepository = new ClientRepository(firestore);

export const deleteClient: ServiceHandler = {
  method: HTTPMethod.DELETE,
  authOptions: { 
    requireToken: true, 
    requireClient: true, 
    requireAdmin: true  // Require admin for deletion
  },
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      const { id } = request.query;

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

      // Delete client
      await clientRepository.delete(id as string);
      success(response, { id, deleted: true });
    } catch (error) {
      console.error('Error in deleteClient:', error);
      serverError(response, 
        error instanceof Error ? error : 'Unknown error occurred'
      );
    }
  }
}; 