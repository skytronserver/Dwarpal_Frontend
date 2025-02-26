import { User as AuthUser } from './auth.types';

export interface User extends AuthUser {
  organization: { name: string };
  department: { name: string };
  designation: string;
  blood_group: string;
  emergency_contact: string;
}

export interface UserResponse {
  results: User[];
  count: number;
} 