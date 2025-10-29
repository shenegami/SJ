export type UserRole = 'Admin' | 'HR' | 'Manager' | 'Employee';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
}
