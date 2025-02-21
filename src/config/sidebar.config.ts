import { Building2, LayoutDashboard, Building, Users } from "lucide-react";
import { UserRole } from "../types/auth.types";

interface SidebarGroup {
    id: string;
    title: string;
    type: string;
    children: SidebarItem[];
}

interface SidebarItem {
    id: string;
    title: string;
    type: string;
    path?: string;
    icon?: any;
    allowedRoles?: UserRole[];
    children?: SidebarItem[];
}
const sidebarConfig : SidebarGroup[] = [
    {
        id: 'manage',
        title: 'Manage',
        type: 'group',
        children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            path: '/dashboard',
            icon: LayoutDashboard,
            allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR']
        },
        {
            id: 'organisations',
            title: 'Organisations',
            type: 'item',
            path: '/organisations',
            icon: Building2,
            allowedRoles: ['SUPERADMIN', 'ADMIN']
        },
        {
            id: 'departments',
            title: 'Departments',
            type: 'item',
            path: '/departments',
            icon: Building,
            allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR']
        },
        {
            id: 'users',
            title: 'Users',
            type: 'item',
            path: '/users',
            icon: Users,
            allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR']
        },
        {
            id: 'create',
            title: 'Create',
            type: 'group',
            children: [
                {
                    id: 'organisation',
                    title: 'Organisation',
                    type: 'item',
                    path: '/organisations/new',
                    icon: Building2,
                },
                {
                    id: 'department',
                    title: 'Department',
                    type: 'item',
                    path: '/departments/new',
                    icon: Building2,
                },
                {
                    id: 'user',
                    title: 'User',
                    type: 'item',
                    path: '/users/new',
                    icon: Building2,
                }  
            ]
        }
    ]
}
]

export { sidebarConfig };
