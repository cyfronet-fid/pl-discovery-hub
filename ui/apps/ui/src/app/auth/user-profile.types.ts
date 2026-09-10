export interface UserProfile {
  username: string;
  aai_id: string;
}

export interface UserRolesResponse {
  uid?: string;
  roles?: string[];
  providers?: (string | null)[];
  catalogues?: unknown[];
}
