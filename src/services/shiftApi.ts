import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";
import { ShiftFormValues } from "../pages/workShifts/AssignShiftForm";
export interface ShiftQuery {
  shift_name: string;
  shift_start_time: string;
  shift_end_time: string;   
}
export interface Shift { 
    id: number;
    shift_name: string;
    shift_start_time: string;
    shift_end_time: string;
    total_work_time: number;
    created_by: number;
}
export interface ShiftResponse {
    count: number;
    total_pages: number;
    current_page: number;
    results: Shift[];       
}
export const shiftApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ['shifts'],
  endpoints: (builder) => ({
    getShifts: builder.query<ShiftResponse, {search?: string, page?: number, page_size?: number}>({
      query: (params) => ({
        url: API_ENDPOINTS.shifts.list,
        params,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
      providesTags: [{ type: 'shifts' }],
    }),
    createShift: builder.mutation<Shift, FormData>({
      query: (shift) => ({
        url: API_ENDPOINTS.shifts.create,
        method: 'POST',
        body: shift,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
    }),
    deleteShift: builder.mutation<Shift, number>({
      query: (shiftId) => ({
        url: API_ENDPOINTS.shifts.delete(shiftId),
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
      invalidatesTags: [{ type: 'shifts' }],
    }),
    editShift: builder.mutation<Shift, { id: number, data: FormData }>({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.shifts.update(id),
        method: 'PUT',
        body: data,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
    }),
    assignShift: builder.mutation<Shift, { id: number, data: ShiftFormValues }>({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.shifts.assign(id),
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
    }),
    getShiftById: builder.query<Shift, number>({
      query: (id) => ({
        url: API_ENDPOINTS.shifts.getById(id),
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
    }),
  }),
});

export const { useGetShiftsQuery, useCreateShiftMutation, useDeleteShiftMutation, useEditShiftMutation, useAssignShiftMutation, useGetShiftByIdQuery   } = shiftApi;
