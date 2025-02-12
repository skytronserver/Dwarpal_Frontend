import { LayoutDashboard, Building2, Users, Building } from 'lucide-react';
import { lazy } from 'react';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Organisations = lazy(() => import('../pages/organisation/Organisations'));
const ViewOrganisation = lazy(() => import('../pages/organisation/ViewOrganisation'));
const OrganisationForm = lazy(() => import('../pages/organisation/OrganisationForm'));
const ManageDepartments = lazy(() => import('../pages/departments/ManageDepartments'));
const ViewDepartment = lazy(() => import('../pages/departments/ViewDepartments'));
const ManageUsers = lazy(() => import('../pages/user/ManageUsers'));
const UserForm = lazy(() => import('../pages/user/UserForm'));        
const DepartmentForm = lazy(() => import('../pages/departments/DepartmentForm'));

export interface RouteConfig {
    path: string;
    element: React.LazyExoticComponent<React.ComponentType<any>>;
    title: string;
    icon: React.ElementType;
    allowedRoles: string[];
    group?: 'create' | 'manage' | 'dashboard';
}   

const adminRoutes:RouteConfig[] = [
    {
        path: '/dashboard',
        element: Dashboard,
        title: 'Dashboard',
        icon: LayoutDashboard,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'dashboard'
    },
    {
        path: '/organisations',
        element: Organisations,
        title: 'Manage Organisations',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'manage'
    },
    {
        path: '/organisations/new/:id',
        element: OrganisationForm,
        title: 'Create Organisation',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'create'
    },
    {
        path: '/departments',                       
        element: ManageDepartments,     
        title: 'Manage Departments',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'manage'
    },
    {
        path: '/departments/new/:id',
        element: DepartmentForm,
        title: 'Create Department',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'create' 
    },
    {
        path: '/users',
        element: ManageUsers,
        title: 'Manage Users',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'manage'
    },  
    {
        path: '/users/new/:id',
        element: UserForm,
        title: 'Create User',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'create'
    },          
]

const hiddenRoutes:RouteConfig[] = [
    {
        path: '/departments/:id',
        element: ViewDepartment,
        title: 'Department',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'manage'
    },
    {
        path: '/organisations/:id',
        element: ViewOrganisation,
        title: 'Organisation',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'],
        group: 'manage'
    },
];

export { adminRoutes, hiddenRoutes }; 