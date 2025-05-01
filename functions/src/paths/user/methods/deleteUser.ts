import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { AuthData } from "../../../utils/auth";
import { success, serverError } from "../../../utils/response-builder";
import { HTTPMethod } from "../../../utils/http/http-methods";
import { ServiceHandler } from "../../../utils/types";

export const deleteUser: ServiceHandler = {
  method: HTTPMethod.DELETE,
  authOptions: { 
    requireToken: true, 
    requireClient: false, 
    requireAdmin: true 
  },
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      const authData = (request as any).authData as AuthData;
      success(response, {
        userId: authData.userId,
        deletedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error in deleteUser:', error);
      serverError(response, 
        error instanceof Error ? error : 'Unknown error occurred'
      );
    }
  }
}; 