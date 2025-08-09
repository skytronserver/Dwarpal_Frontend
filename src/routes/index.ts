import { LayoutDashboard, Building2, Users, Building, Clock, Calendar, DoorClosed as Gate, Plus } from 'lucide-react';
import { lazy } from 'react';
import { UserRole } from '../types/auth.types';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const ComingSoon = lazy(() => import('../pages/ComingSoon'));
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
const HRForm = lazy(() => import('../pages/hr/HRForm'));
const CompanyAccountsUserForm = lazy(()=>import('../pages/account/CompanyAccountsUser'))
const HRUserForm = lazy(()=>import('../pages/hr/HRUser'))
const GuestPassSettings = lazy(() => import('../pages/gatepass/GuestPassSettings'));
const ViewGuestPassSettings = lazy(() => import('../components/gatePass/ViewGuestPassSettings'));
const EmployeeForm = lazy(() => import('../pages/user/EmployeeForm'));
const UserAttendence = lazy(() => import('../pages/attendance/UserAttendence'));
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
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'EMPLOYEE','HR'] as UserRole[],
        group: 'dashboard'
    },
    {
        path: '/coming-soon',
        element: ComingSoon,
        title: 'Coming Soon',
        icon: Clock,
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'EMPLOYEE', 'HR', 'ACCOUNTS'] as UserRole[],
        group: 'manage'
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
        path: 'corporate-users/:id/users/new/:id',
        element: ManageUsers,
        title: 'Manage Users',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN', 'HR','ACCOUNTS'] as UserRole[],
        group: 'create'
    }, 
    {
        path: 'org/client/:orgId/users',
        element: ManageUsers,
        title: 'Manage Users',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    }, 
    {
        path: 'company/employee/new/:id',
        element: EmployeeForm,
        title: 'Create Employee',
        icon: Users,
        allowedRoles: ['HR']as UserRole[],
        group: 'create'
    }, 
    {
        path: 'company/sub-admin/new/:id',
        element: HRUserForm,
        title: 'Create HR',
        icon: Users,
        allowedRoles: ['SUPERADMIN', 'ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: 'company/accounts/new/:id',
        element: AccountsUserForm,
        title: 'Create accounts user',
        icon: Users,
        allowedRoles: ['ADMIN'] as UserRole[],
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
        allowedRoles: ['SUPERADMIN', 'ADMIN','HR'] as UserRole[],
        group: 'manage'
    },       
    {
        path: 'reports/shifts',
        element: Shifts,
        title: 'Manage Shifts',
        icon: Clock,
        allowedRoles: ['SUPERADMIN', 'ADMIN','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: 'company/shifts/new/:id',
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
        allowedRoles: ['SUPERADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/shifts/:id',
        element: ViewShift,
        title: 'Shift',
        icon: Clock,
        allowedRoles: ['ADMIN','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/organisations/:id',
        element: ViewOrganisation,
        title: 'Organisation',
        icon: Building2,
        allowedRoles: ['SUPERADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/shifts/assign/:id',
        element: AssignShiftForm,
        title: 'Assign Shift',
        icon: Clock,
        allowedRoles: ['ADMIN','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/reports/users',
        element: ManageUsers,
        title: 'Manage Users',
        icon: Users,
        allowedRoles: ['HR','ADMIN'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/reports/holidays',
        element: Holidays,
        title: 'Holidays',
        icon: Calendar,
        allowedRoles: ['ADMIN', 'EMPLOYEE','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: 'company/holidays/new/:id',
        element: HolidayForm,
        title: 'Create Holiday',
        icon: Calendar,
        allowedRoles: ['HR'] as UserRole[],
        group: 'create'
    },
    {
        path: '/reports/gate-passes',
        element: GatePasses,
        title: 'Gate Passes',
        icon: Gate,
        allowedRoles: ['ADMIN','EMPLOYEE','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/gate-passes/new/:id',
        element: GatePassForm,
        title: 'Create Gate Pass',
        icon: Gate,
        allowedRoles: ['EMPLOYEE', 'ADMIN','HR'] as UserRole[],
        group: 'create'
    },
    {
        path: '/reports/gate-passes/:id',
        element: ViewGatePass,
        title: 'View Gate Pass',
        icon: Gate,
        allowedRoles: [ 'EMPLOYEE','ADMIN','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/settings/guest-pass',
        element: GuestPassSettings,
        title: 'Guest Pass Settings',
        icon: Gate,
        allowedRoles: ['HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: 'reports/guest-pass',
        element: ViewGuestPassSettings,
        title: 'View Guest Pass Settings',
        icon: Gate,
        allowedRoles: ['ADMIN','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/attendance',
        element: AttendanceDetail,
        title: 'Attendance',
        icon: Clock,
        allowedRoles: ['ADMIN', 'EMPLOYEE','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: 'reports/attendance/analytics',
        element: AttendanceAnalytics,
        title: 'Attendance Analytics',
        icon: Clock,
        allowedRoles: [ 'ADMIN', 'EMPLOYEE','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: '/attendance/:id',
        element: AttendanceDetail,
        title: 'Attendance Detail',
        icon: Clock,
        allowedRoles: [ 'ADMIN', 'EMPLOYEE','HR'] as UserRole[],
        group: 'manage'
    },
    {
        path: 'company/hr/new/:id',
        element: HRForm,
        title: 'Create HR',
        icon: Users,
        allowedRoles: ['ADMIN'] as UserRole[],
        group: 'create'
    },
    {
        path: 'reports/attendance',
        element: UserAttendence,
        title: 'Attendance',
        icon: Clock,
        allowedRoles: ['EMPLOYEE','HR'] as UserRole[],
        group: 'manage'
    }
]

export { adminRoutes }; 