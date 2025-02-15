import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Holiday interface to match the API response
interface Holiday {
  id: number;
  holiday_dates: string;
  created_by: string;
  created_at: string;
  is_verified: boolean;
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
                url: '/api/holidays/',
                params,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }),
    }),
});

export const { useGetHolidaysQuery } = holidayApi;          
