/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { HTTPHandler } from "./utils/http";
import { logRequest, responseTime, withAuth, registerService } from "./utils/middleware";
import { adaptMiddleware } from './utils/http/adapters';
import { requestManager, RequestManager } from './utils/http/request-manager';
import * as fs from 'fs';
import * as path from 'path';

// Configure request manager
requestManager.setHeaders({
  "Content-Type": "application/json"
});

// If you have an API base URL in environment variables
if (process.env.API_BASE_URL) {
  const config = {
    baseURL: process.env.API_BASE_URL,
    timeout: 5000, // 5 seconds timeout
    headers: {
      "Content-Type": "application/json"
    }
  };
  new RequestManager(config);
}

// Dynamically import all path services
const pathsDir = path.join(__dirname, 'paths');

// Read all directories in the paths folder
const pathDirs = fs.readdirSync(pathsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Import each path's services and create handlers
for (const pathName of pathDirs) {
  const service = require(`./paths/${pathName}`).default;
  registerService(service);

  // Create middleware chain
  const middleware = [
    logRequest,
    responseTime,
    withAuth()  // Use system defaults
  ];

  const handler = new HTTPHandler({
    services: service.handlers,
    middleware: adaptMiddleware(middleware)
  });
  
  // Create and export the function
  exports[pathName] = onRequest(async (request, response) => {
    try {
      await handler.handle(request, response);
    } catch (error) {
      // Only handle unexpected errors that weren't caught by handlers
      console.error(`Unexpected error in ${pathName}:`, error);
      if (!response.headersSent) {
        response.status(500).json({
          success: false,
          data: null,
          errors: [error instanceof Error ? error.message : 'Unknown error']
        });
      }
    }
  });
}