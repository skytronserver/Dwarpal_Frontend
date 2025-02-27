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

export const gatePassApi = createApi({
    reducerPath: 'gatePassApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    tagTypes: ['guestPasses'] as const,
    endpoints: (builder) => ({
        getGuestPasses: builder.query<GuestPassResponse, void>({
            query: () => ({
                url: '/api/guest-passes/all/',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            providesTags: [{ type: 'guestPasses', id: 'LIST' }],
        }),
        createGuestPass: builder.mutation<GuestPass, GuestPass>({
            query: (guestPass) => ({
                url: '/api/guest-passes/create/',
                method: 'POST',
                body: guestPass,
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
        getGuestPassById: builder.query<GuestPass, number>({
            query: (guestPassId) => ({
                url: `/api/guest-passes/view/${guestPassId}/`,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            providesTags: [{ type: 'guestPasses', id: 'LIST' }],
        }),
    })
});

export const {
    useGetGuestPassesQuery,
    useCreateGuestPassMutation,
    useApproveGuestPassMutation,
    useGetGuestPassByIdQuery
} = gatePassApi;


