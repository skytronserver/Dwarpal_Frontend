import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

interface EmployeeDistribution {
    department: string;
    count: number;
    percentage: number;
}

interface RecentActivity {
    type: string;
    description: string;
}

interface OrganizationGrowth {
    month: string;
    organizations_created: number;
}

interface ClientStatistics {
    company_clients: number;
    individual_clients: number;
    service_providers: number;
}

interface AttendanceSummary {
    present_days: number;
    late_days: number;
    absent_days: number;
    total_work_days: number;
    present_percent: number;
    late_percent: number;
    absent_percent: number;
}

interface HolidayStats {
    total_holidays: number;
    total_holiday_days: number;
}

interface DailyAttendanceSummary {
    date: string;
    details: any[];
}

interface EmployeeDashboardResponse {
    month: string;
    organization: string;
    department: string;
    attendance_summary: AttendanceSummary;
    holiday_stats: HolidayStats;
    daily_attendance_summary: DailyAttendanceSummary;
}

interface SuperAdminDashboardResponse {
    total_organizations: number;
    total_departments: number;
    total_admin_users: number;
    total_service_providers: number;
    total_company_clients: number;
    total_individual_clients: number;
    client_statistics: ClientStatistics;
    organization_growth_trend: OrganizationGrowth[];
}

interface HRDashboardResponse {
    total_employees: number;
    active_shifts: number;
    upcoming_holidays: string[];
    guest_passes_today: number;
    present_today: number;
    employee_distribution: EmployeeDistribution[];
    gate_pass_trend: Record<string, any>;
    recent_employee_activity: RecentActivity[];
}

const dashboardServices = createApi({
    reducerPath: "dashboardServices",
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        superAdminDashboard: builder.query<SuperAdminDashboardResponse, void>({
            query: () => ({
                url: API_ENDPOINTS.dashboard.superAdmin,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            })
        }),
        adminDashboard: builder.query<{ message: string }, void>({
            query: () => ({
                url: API_ENDPOINTS.dashboard.admin,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            })
        }),
        hrDashboard: builder.query<HRDashboardResponse, void>({
            query: () => ({
                url: API_ENDPOINTS.dashboard.hr,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            })
        }),
        employeeDashboard: builder.query<EmployeeDashboardResponse, void>({
            query: () => ({
                url: API_ENDPOINTS.dashboard.employee,
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            })
        })
    })
});

export const { useSuperAdminDashboardQuery, useAdminDashboardQuery, useHrDashboardQuery, useEmployeeDashboardQuery } = dashboardServices;
export default dashboardServices;