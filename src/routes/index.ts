import { LayoutDashboard, Building2, Users, Building, Clock, Calendar, DoorClosed as Gate } from 'lucide-react';
import { lazy } from 'react';
import { UserRole } from '../types/auth.types';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Organisations = lazy(() => import('../pages/organisation/Organisations'));
const ViewOrganisation = lazy(() => import('../pages/organisation/ViewOrganisation'));
const OrganisationForm = lazy(() => import('../pages/organisation/OrganisationForm'));
const ManageDepartments = lazy(() => import('../pages/departments/ManageDepartments'));
const ViewDepartment = lazy(() => import('../pages/departments/ViewDepartments'));
const ManageUsers = lazy(() => import('../pages/user/ManageUsers'));
const UserForm = lazy(() => import('../pages/user/UserForm'));        
const DepartmentForm = lazy(() => import('../pages/departments/DepartmentForm'));
const Shifts = lazy(() => import('../pages/workShifts/Shifts'));
const ShiftForm = lazy(() => import('../pages/workShifts/ShiftForm'));
const ViewShift = lazy(() => import('../pages/workShifts/ViewShift'));
const AssignShiftForm = lazy(() => import('../pages/workShifts/AssignShiftForm'));
const Holidays = lazy(() => import('../pages/holidays/Holidays'));
const GatePasses = lazy(() => import('../pages/gatepass/GatePasses'));
const GatePassForm = lazy(() => import('../pages/gatepass/GatePassForm'));
const ViewGatePass = lazy(() => import('../pages/gatepass/ViewGatePass'));
export interface RouteConfig {
    path: string;
    element: React.LazyExoticComponent<React.ComponentType<any>>;
    title: string;
    icon: React.ElementType;
    allowedRoles: UserRole[];
    group?: 'create' | 'manage' | 'dashboard';
}   

const adminRoutes:RouteConfig[] = [
    {
        path: '/dashboard',
        element: Dashboard,
        title: 'Dashboard',
        icon: LayoutDashboard,
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR'] as UserRole[],
        group: 'dashboard'
    },
    {
        path: '/organisations',
        element: Organisations,
        title: 'Manage Organisations',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/organisations/new/:id',
        element: OrganisationForm,
        title: 'Create Organisation',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/departments',                       
        element: ManageDepartments,     
        title: 'Manage Departments',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/departments/new/:id',
        element: DepartmentForm,
        title: 'Create Department',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create' 
    },
    {
        path: '/users',
        element: ManageUsers,
        title: 'Manage Users',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR','ACCOUNTS'] as UserRole[],
        group: 'manage'
    },  
    {
        path: '/users/new/:id',
        element: UserForm,
        title: 'Create User',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR'] as UserRole[],
        group: 'create'
    },       
    {
        path: '/shifts',
        element: Shifts,
        title: 'Manage Shifts',
        icon: Clock,
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/shifts/new/:id',
        element: ShiftForm,
        title: 'Create Shift',
        icon: Clock,
        allowedRoles: ['HR'] as UserRole[],
        group: 'create'
    },
    {
        path: '/departments/:id',
        element: ViewDepartment,
        title: 'Department',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/shifts/:id',
        element: ViewShift,
        title: 'Shift',
        icon: Clock,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/organisations/:id',
        element: ViewOrganisation,
        title: 'Organisation',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/shifts/assign/:id',
        element: AssignShiftForm,
        title: 'Assign Shift',
        icon: Clock,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/holidays',
        element: Holidays,
        title: 'Holidays',
        icon: Calendar,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/gate-passes',
        element: GatePasses,
        title: 'Gate Passes',
        icon: Gate,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/gate-passes/new/:id',
        element: GatePassForm,
        title: 'Create Gate Pass',
        icon: Gate,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/gate-passes/:id',
        element: ViewGatePass,
        title: 'View Gate Pass',
        icon: Gate,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    }   
]


export { adminRoutes }; 