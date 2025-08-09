import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

// Define the Holiday interface to match the API response
interface Holiday {
  id: number;
  holiday_name: string;
  holiday_from_date?: string;
  holiday_to_date?: string;
  holiday_type?: string;
  dates?: (string | { date: string })[];
  is_active: boolean;
  created_by: number;
  is_approved?: boolean;
  approved_by?: number | null;
  approved_at?: string | null;
  is_deleted?: boolean;
  updated_at?: string;
  updated_by?: number;
  created_at?: string;
}

interface HolidayResponse {
  count: number;
  total_pages?: number;
  current_page: number;
  page_size?: number;
  next?: string | null;
  previous?: string | null;
  results: Holiday[];
}

export const holidayApi = createApi({
    reducerPath: 'holidayApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
    tagTypes: ['holidays'],
    endpoints: (builder) => ({
        getHolidays: builder.query<HolidayResponse, {search: string, page_size: number, page?: number}>({
            query: (params) => ({
                url: API_ENDPOINTS.holidays.list,
                params,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            providesTags: ['holidays'],
        }),
        createHoliday: builder.mutation<Holiday, FormData>({
            query: (holiday) => ({
                url: API_ENDPOINTS.holidays.create,
                method: 'POST',
                body: holiday,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }),
        approveHoliday: builder.mutation<Holiday, number>({
            query: (holidayId) => ({
                url: API_ENDPOINTS.holidays.approve(holidayId),
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            invalidatesTags: ['holidays'],
        }),     
        editHoliday: builder.mutation<Holiday, { id: number, data: FormData }>({
            query: ({ id, data }) => ({
                url: API_ENDPOINTS.holidays.update(id),
                method: 'PUT',
                body: data,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            invalidatesTags: ['holidays'],
        }),
        getHolidayById: builder.query<Holiday, number>({
            query: (id) => ({
                url: API_ENDPOINTS.holidays.getById(id),
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }),
    }),
});

export const { useGetHolidaysQuery, useCreateHolidayMutation, useEditHolidayMutation, useGetHolidayByIdQuery, useApproveHolidayMutation } = holidayApi;          
