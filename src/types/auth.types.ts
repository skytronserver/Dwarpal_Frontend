export type LoginTypes = {
    employee_code: string;
    password: string;
}

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'HR' | 'EMPLOYEE';

export interface User {
  id: string;
  user_id: number;
  employee_code: string;
  user_name: string;
  email: string;
  role: UserRole;
  organization?: { name: string };
  department?: { name: string };
  assigned_permissions?: string[];
}

export interface LoginResponseTypes {
  data: {
    token: string;
    user: User;
  };
  message: string;
  status: string;
}
