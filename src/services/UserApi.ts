import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";
import { User, UserResponse } from "../types/user.types";

interface UserAttendance {
  report: Array<{
    user: string;
    department: string;
    date: string;
    in_times: string[];
    out_times: string[];
    official_in_time: string;
    official_out_time: string;
    break_time: string;
    total_work_time: string;
    status: string;
  }>;
  summary: {
    total_present: number;
    total_late: number;
    total_absent: number;
  };
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, { 
      search?: string; 
      page?: number; 
      page_size?: number;
      organization?: string | number;
    }>({
      query: (params) => ({
        url: API_ENDPOINTS.users.list,
        params,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    createUser: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.users.createEmployee,
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    createAdmin: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.users.adminCreate,
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    updateUser: builder.mutation<User, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: API_ENDPOINTS.users.update(id),
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.users.delete(id),
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    getUserById: builder.query<User, number>({
      query: (id) => ({
        url: API_ENDPOINTS.users.getById(id),
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    getUserAttendance: builder.query<UserAttendance, number>({
      query: (id) => ({
        url: API_ENDPOINTS.users.attendanceReport,
        params: { id },
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    })
  })
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useCreateAdminMutation,
  useGetUserAttendanceQuery
} = userApi; 