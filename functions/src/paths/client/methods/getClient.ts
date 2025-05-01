import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { success, serverError } from "../../../utils/response-builder";
import { HTTPMethod } from "../../../utils/http/http-methods";
import { ServiceHandler } from "../../../utils/types";
import { ClientRepository, Client } from "../../../repositories/client-repository";
import { firestore } from "../../../utils/firebase";

const clientRepository = new ClientRepository(firestore);

/**
 * Example GET query params:
 * - id: "123e4567-e89b-12d3-a456-426614174000"
 * - secret: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd52feb64f10bfe40fc"
 * 
**/

export const getClient: ServiceHandler = {
  method: HTTPMethod.GET,
  authOptions: { 
    requireToken: false, 
    requireClient: true, 
    requireAdmin: false 
  },
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      const { id, secret } = request.query;
      
      let result: Client | null;
      
      if (id && secret) {
        // Get client by ID and secret
        result = await clientRepository.findOne({ id: id as string, secret: secret as string });
        if (!result) {
          response.status(404).json({
            success: false,
            data: null,
            errors: ['Client not found']
          });
          return;
        }
      } else {
        response.status(400).json({
          success: false,
          data: null,
          errors: ['Both id and secret are required']
        });
        return;
      }

      success(response, result);
    } catch (error) {
      console.error('Error in getClient:', error);
      serverError(response, 
        error instanceof Error ? error : 'Unknown error occurred'
      );
    }
  }
}; 