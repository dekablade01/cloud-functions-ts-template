import { AuthRequirement, ServiceHandler } from "../types";

export interface WebService {
  path: string;
  handlers: ServiceHandler[];
  authRequirements: AuthRequirement[];
}

export abstract class BaseWebService implements WebService {
  abstract path: string;
  abstract handlers: ServiceHandler[];

  get authRequirements(): AuthRequirement[] {
    return this.handlers.map(handler => ({
      method: handler.method,
      options: handler.authOptions || {}
    }));
  }

  constructor() {
    // Defer validation to after the child class has initialized
    setTimeout(() => {
      const missingProperties: string[] = [];

      // Check required properties
      if (!('path' in this)) {
        missingProperties.push('path');
      }
      if (!('handlers' in this)) {
        missingProperties.push('handlers');
      }

      if (missingProperties.length > 0) {
        throw new Error(
          `${this.constructor.name} is missing required properties: ${missingProperties.join(', ')}`
        );
      }
    }, 0);
  }
} 