import { LayoutDashboard, Building2, Users, Building, Clock, Calendar, DoorClosed as Gate, Plus } from 'lucide-react';
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
const HolidayForm = lazy(() => import('../pages/holidays/HolidaysForm'))
const ViewUser = lazy(() => import('../pages/user/ViewUser'));
const AttendanceDetail = lazy(() => import('../pages/attendance/AttendanceDetail'));
const AttendanceAnalytics = lazy(() => import('../pages/attendance/AttendanceAnalytics'));
const AccountsUserForm = lazy(() => import('../pages/account/AccountUserForm'));
const IndividualUserForm = lazy(() => import('../pages/individualUser/individualUserForm'));
const SubscriptionForm = lazy(() => import('../pages/subscription/SubscriptionForm'));
const ServiceProviderForm = lazy(() => import('../pages/service-provider/ServiceProviderForm'));
const IndividualServiceProviderForm = lazy(() => import('../pages/service-provider/IndividualServiceProviderForm'));

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
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'EMPLOYEE'] as UserRole[],
        group: 'dashboard'
    },
    {
        path: '/client/organisations',
        element: Organisations,
        title: 'Manage Organisations',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/client/organisations/new/:id',
        element: OrganisationForm,
        title: 'Create Organisation',
        icon: Building2,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/org/client/:orgId/departments',                       
        element: ManageDepartments,     
        title: 'Manage Departments',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/org/client/:orgId/departments/new/:id',
        element: DepartmentForm,
        title: 'Create Department',
        icon: Building,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create' 
    },
    {
        path: '/org/client/:orgId/users',
        element: ManageUsers,
        title: 'Manage Users',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR','ACCOUNTS'] as UserRole[],
        group: 'create'
    },  
    {
        path: '/accounts/new/:id',
        element: AccountsUserForm,
        title: 'Create accounts user',
        icon: Users,
        allowedRoles: ['SUPERADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/client/individualForm',
        element: IndividualUserForm,
        title: 'Create Individual User',
        icon: Users,
        allowedRoles: ['SUPERADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/settings/subscriptions/new',
        element: SubscriptionForm,
        title: 'Create Subscription',
        icon: Plus,
        allowedRoles: ['SUPERADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/service-provider/new/:id',
        element: ServiceProviderForm,
        title: 'Create Service Provider',
        icon: Users,
        allowedRoles: ['SUPERADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/service-provider/individual/new/:id',
        element: IndividualServiceProviderForm,
        title: 'Create Individual Service Provider',
        icon: Users,
        allowedRoles: ['SUPERADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/org/client/:orgId/users/new/:id',
        element: UserForm,
        title: 'Create User',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },  
    {
        path: '/users/:id',
        element: ViewUser,
        title: 'View User',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },       
    {
        path: '/shifts',
        element: Shifts,
        title: 'Manage Shifts',
        icon: Clock,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/shifts/new/:id',
        element: ShiftForm,
        title: 'Create Shift',
        icon: Clock,
        allowedRoles: ['ADMIN'] as UserRole[],
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
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'EMPLOYEE'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/holidays/new/:id',
        element: HolidayForm,
        title: 'Create Holiday',
        icon: Calendar,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: '/gate-passes',
        element: GatePasses,
        title: 'Gate Passes',
        icon: Gate,
        allowedRoles: ['ADMIN','EMPLOYEE'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/gate-passes/new/:id',
        element: GatePassForm,
        title: 'Create Gate Pass',
        icon: Gate,
        allowedRoles: ['EMPLOYEE'] as UserRole[],
        group: 'create'
    },
    {
        path: '/gate-passes/:id',
        element: ViewGatePass,
        title: 'View Gate Pass',
        icon: Gate,
        allowedRoles: [ 'EMPLOYEE','ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/attendance',
        element: AttendanceDetail,
        title: 'Attendance',
        icon: Clock,
        allowedRoles: ['ADMIN', 'EMPLOYEE'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/attendance/analytics',
        element: AttendanceAnalytics,
        title: 'Attendance Analytics',
        icon: Clock,
        allowedRoles: [ 'ADMIN', 'EMPLOYEE'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/attendance/:id',
        element: AttendanceDetail,
        title: 'Attendance Detail',
        icon: Clock,
        allowedRoles: [ 'ADMIN', 'EMPLOYEE'] as UserRole[],
        group: 'manage'
    }   
]


export { adminRoutes }; 