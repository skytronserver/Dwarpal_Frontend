export type LoginTypes = {
    employee_code: string;
    password: string;
}

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  employee_code: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  organization?: { name: string };
  department?: { name: string };
  can_create_gatepass?: boolean;
  can_manage_shifts?: boolean;
}

export interface LoginResponseTypes {
  data: {
    token: string;
    user: User;
  };
  message: string;
  status: string;
}
