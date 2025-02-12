// import { lazy } from 'react';
// import { Building2, Users, LayoutDashboard, Building, UserCog } from 'lucide-react';
// import { UserRole } from '../types/auth.types';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import ProtectedRoute from '../utils/ProtectedRoute';
// import RoleRoute from '../components/RoleRoute';
// import Unauthorized from '../pages/Unauthorized';
    
// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const Organizations = lazy(() => import('../pages/organisation/Organisations'));
// const OrganisationForm = lazy(() => import('../pages/organisation/OrganisationForm'));
// const ViewOrganisation = lazy(() => import('../pages/organisation/ViewOrganisation'));
// const ManageDepartments = lazy(() => import('../pages/departments/ManageDepartments'));
// const DepartmentForm = lazy(() => import('../pages/departments/DepartmentForm'));
// const ViewDepartment = lazy(() => import('../pages/departments/ViewDepartments'));
// const ManageUsers = lazy(() => import('../pages/user/ManageUsers'));
// const UserForm = lazy(() => import('../pages/user/UserForm'));
// const Authentication = lazy(() => import('../pages/authentication/Authentication'));


// export interface RouteConfig {
//   path: string;
//   element: React.LazyExoticComponent<any>;
//   title: string;
//   icon?: any;
//   allowedRoles: UserRole[];
//   permission?: string;
//   showInNav?: boolean;
// }

// export const routes: RouteConfig[] = [
//   {
//     path: '/login',
//     element: Authentication,
//     title: 'Login',
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//   },
//   {
//     path: '/dashboard',
//     element: Dashboard,
//     title: 'Dashboard',
//     icon: LayoutDashboard,
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//     showInNav: true
//   },
//   {
//     path: '/organisations',
//     element: Organizations,
//     title: 'Organisations',
//     icon: Building2,
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//     showInNav: true
//   },
//   {
//     path: '/organisations/:id',
//     element: ViewOrganisation,
//     title: 'Organisation',
//     icon: Building,
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//   },
//   {
//     path: '/organisations/new/:id',
//     element: OrganisationForm,
//     title: 'New Organisation',
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//   },
//   {
//     path: '/departments',
//     element: ManageDepartments,
//     title: 'Departments',
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//   },
//   {
//     path: '/departments/:id',
//     element: ViewDepartment,
//     title: 'Department',
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//   },
//   {
//     path: '/departments/new/:id',
//     element: DepartmentForm,
//     title: 'New Department',
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//   },
//   {
//     path: '/users',
//     element: ManageUsers,
//     title: 'Users',
//     icon: Users,
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//     showInNav: true
//   },
//   {
//     path: '/users/new/:id',
//     element: UserForm,
//     title: 'New User',
//     icon: UserCog,
//     allowedRoles: ['SUPERADMIN', 'ADMIN'],
//   },
// ];



// const Router: React.FC = () => {
//   return (
//     <Routes>
//       {routes.map((route, index) => (
//         <Route
//           key={index}
//           path={route.path}
//           element={
//             route.path === '/login' ? (
//               <route.element />
//             ) : (
//               <ProtectedRoute>
//                 <RoleRoute allowedRoles={route.allowedRoles}>
//                   <route.element />
//                 </RoleRoute>
//               </ProtectedRoute>
//             )
//           }
//         />
//       ))}
//       <Route path="/unauthorized" element={<Unauthorized />} />
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// };

// export default Router;
