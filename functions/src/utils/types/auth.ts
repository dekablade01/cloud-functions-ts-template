export interface AuthOptions {
  requireToken?: boolean;
  requireClient?: boolean;
  requireAdmin?: boolean;
}

export interface AuthData {
  clientId?: string;
  userId?: string;
  tokenData?: any;
  clientData?: any;
} 