export type LoginTypes = {
    employee_code: string;
    password: string;
}

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'HR' | 'ACCOUNTS' | 'FRONTDESK' | 'HELPDESK' | 'SECURITY' | 'OTHERS';

export interface User {
  id: string;
  employee_code: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface LoginResponseTypes {
  data: {
    token: string;
    user: User;
  };
  message: string;
  status: string;
}
