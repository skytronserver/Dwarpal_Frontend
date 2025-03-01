import { User as AuthUser } from './auth.types';

export interface User extends AuthUser {
  organization: { name: string };
  department: { name: string };
  designation: string;
  blood_group: string;
  emergency_contact: string;
  message?: string;
}

export interface UserResponse {
  message: string;
  results: User[];
  count: number;
} 