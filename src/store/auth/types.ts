export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: 'user' | 'auth';
  avatar: string;
  latitude: string;
  longitude: string;
  updated_at: string;
}

export interface UsersResponse {
  data: User[];
  count: number;
}

