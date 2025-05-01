export interface AuthData {
  userId?: string;
  clientId?: string;
  tokenData?: any;
  clientData?: any;
}

export interface AuthOptions {
  requireToken?: boolean;
  requireClient?: boolean;
  requireAdmin?: boolean;
} 