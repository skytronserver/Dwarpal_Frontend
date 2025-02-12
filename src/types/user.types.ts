export interface User {
  id: string;
  name: string;
  employee_code: string;
  role: 'SUPERUSER' | 'HR';
  organization: string;
  department: string;
  designation: string;
  blood_group: string;
  emergency_contact: string;
  photo?: string;
}

export interface UserResponse {
  results: User[];
  count: number;
} 