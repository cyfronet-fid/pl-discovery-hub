export interface UserProfile {
  username: string;
  aai_id: string;
}

export interface UserDataResponse {
  uid?: string;
  roles?: string[];
  providers?: (string | null)[];
  catalogues?: unknown[];
}
