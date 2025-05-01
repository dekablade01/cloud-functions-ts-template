// HTTP Method enum
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

// Request interface
export interface Request {
  path: string;
  method: HttpMethod;
  parameters?: Record<string, any>;
  headers?: Record<string, string>;
}

// Request configuration interface
interface RequestManagerConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class RequestManager {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: RequestManagerConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 5000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  // Main request method that handles all HTTP methods
  async request<T = any>(request: Request): Promise<T> {
    const { path, method, parameters: requestParameters, headers } = request;
    
    // Prepare request config
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Handle parameters based on method
    let url = this.baseURL + path;
    let body: string | undefined;

    if (method === HttpMethod.GET) {
      // For GET requests, parameters become query parameters
      url = this.buildUrl(url, requestParameters);
    } else if (requestParameters) {
      // For other methods, parameters go in the request body
      body = JSON.stringify(requestParameters);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        console.error('Request failed:', error.message);
      }
      throw error;
    }
  }

  // Helper method to build URL with query parameters
  private buildUrl(path: string, parameters?: Record<string, any>): string {
    if (!parameters) return path;
    
    const queryString = Object.entries(parameters)
      .map(([key, value]) => {
        // Handle arrays and objects
        if (Array.isArray(value)) {
          return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
    
    return queryString ? `${path}?${queryString}` : path;
  }

  // Convenience methods for each HTTP method
  async get<T = any>(path: string, parameters?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ path, method: HttpMethod.GET, parameters, headers });
  }

  async post<T = any>(path: string, parameters?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ path, method: HttpMethod.POST, parameters, headers });
  }

  async put<T = any>(path: string, parameters?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ path, method: HttpMethod.PUT, parameters, headers });
  }

  async delete<T = any>(path: string, parameters?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ path, method: HttpMethod.DELETE, parameters, headers });
  }

  async patch<T = any>(path: string, parameters?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({ path, method: HttpMethod.PATCH, parameters, headers });
  }

  // Helper method to add authentication headers
  setAuthHeader(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Helper method to add custom headers
  setHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };
  }
}

// Create a default instance
export const requestManager = new RequestManager(); 