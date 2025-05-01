import { RequestManager } from './request-manager';
import { HTTPHandler } from './http-handler';
import { HttpMethod, Request, HTTPHandlerConfig, RequestManagerConfig } from './types';

export * from './http-methods';
export { RequestManager, HTTPHandler };
export { HttpMethod, Request, HTTPHandlerConfig, RequestManagerConfig };

// Export default instance
export const requestManager = new RequestManager(); 