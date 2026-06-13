export interface RegisterUserPayload {
  email: string;
  password: string;
  role: string;
  name: string;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}

export interface UserListItem {
  id: string;
  email: string;
  name?: string;
  role: string;
  created_at?: string;
  user_metadata?: {
    name?: string;
    role?: string;
    [key: string]: unknown;
  };
}
