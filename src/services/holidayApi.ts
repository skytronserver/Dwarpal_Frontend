import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

// Define the Holiday interface to match the API response
interface Holiday {
  id: number;
  holiday_name: string;
  holiday_from_date: string;
  holiday_to_date: string;
  is_active: boolean;
  created_by: number;
}

interface HolidayResponse {
  count: number;
  total_pages: number;
  current_page: number;
  results: Holiday[];
}

export const holidayApi = createApi({
    reducerPath: 'holidayApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
    endpoints: (builder) => ({
        getHolidays: builder.query<HolidayResponse, {search: string, page: number, page_size: number}>({
            query: (params) => ({
                url: API_ENDPOINTS.holidays.list,
                params,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
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
        editHoliday: builder.mutation<Holiday, { id: number, data: FormData }>({
            query: ({ id, data }) => ({
                url: API_ENDPOINTS.holidays.update(id),
                method: 'PUT',
                body: data,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
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

export const { useGetHolidaysQuery, useCreateHolidayMutation, useEditHolidayMutation, useGetHolidayByIdQuery } = holidayApi;          
