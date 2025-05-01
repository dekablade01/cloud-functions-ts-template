import { Request } from "firebase-functions/v2/https";
import { Response } from "express";
import { AuthData } from "../../../utils/auth";
import { success, serverError } from "../../../utils/response-builder";
import { HTTPMethod } from "../../../utils/http/http-methods";
import { ServiceHandler } from "../../../utils/types";

export const getUser: ServiceHandler = {
  method: HTTPMethod.GET,
  authOptions: { 
    requireToken: true, 
    requireClient: false, 
    requireAdmin: false 
  },
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      const authData = (request as any).authData as AuthData;
      success(response, {
        userId: authData.userId,
        data: authData.tokenData
      })
    } catch (error) {
      console.error('Error in getUser:', error);
      serverError(response, 
        error instanceof Error ? error : 'Unknown error occurred'
      );
    }
  }
}; 