import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface GuestPass {
    id?: number;
    name: string;
    photo: string;
    visit_date: string;
    visit_start_time: string;
    visit_end_time: string;
    department_to_visit: number;
    organization_to_visit: number;
    person_to_meet: string;
    assigned_approver: number;
    is_approved: boolean;
    approved_by: number | null;
    approved_at: string | null;
}
interface GuestPassResponse {
    results: GuestPass[];
    count: number;
}

interface GuestPassSettings {
    id: number;
    title: string;
    guest_category: string;
    visitor_hours_start: string;
    visitor_hours_end: string;
    visiting_days: string[];
    restrict_on_holidays: boolean;
    is_approved: boolean;
    approved_by: number | null;
    approved_at: string | null;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
}

export const gatePassApi = createApi({
    reducerPath: 'gatePassApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    tagTypes: ['guestPasses', 'guestPassSettings'] as const,
    endpoints: (builder) => ({
        getGuestPasses: builder.query<GuestPassResponse, { search?: string }>({
            query: (params) => ({
                url: '/api/guest-passes/all/',
                params,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            providesTags: [{ type: 'guestPasses', id: 'LIST' }],
        }),
        createGuestPass: builder.mutation<GuestPass, FormData>({
            query: (formData) => ({
                url: '/api/guest-passes/create/',
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            invalidatesTags: ['guestPasses'],
        }),
        approveGuestPass: builder.mutation<void, number>({
            query: (guestPassId) => ({
                url: `/api/guest-passes/approve/${guestPassId}/`,
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            invalidatesTags: ['guestPasses'],
        }),
        viewGuestPassSettings: builder.query<GuestPassSettings[], void>({
            query: () => ({
                url: '/guest-pass-settings/',
                method: 'GET',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            providesTags: ['guestPassSettings'],
        }),
        getGuestPassById: builder.query<GuestPass, number>({
            query: (guestPassId) => ({
                url: `/api/guest-passes/view/${guestPassId}/`,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            providesTags: [{ type: 'guestPasses', id: 'LIST' }],
        }),
        guestPassSettings: builder.mutation<GuestPassSettings, GuestPassSettings>({
            query: (guestPassSettings) => ({
                url: `/guest-pass-settings/`,
                method: 'POST',
                body: guestPassSettings,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            invalidatesTags: ['guestPassSettings'],
        }),
    })
});

export const {
    useGetGuestPassesQuery,
    useCreateGuestPassMutation,
    useApproveGuestPassMutation,
    useGetGuestPassByIdQuery,
    useViewGuestPassSettingsQuery,
    useGuestPassSettingsMutation
} = gatePassApi;


