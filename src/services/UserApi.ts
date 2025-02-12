import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";
import { User, UserResponse } from "../types/user.types";

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, { search?: string; page?: number; page_size?: number }>({
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
        url: API_ENDPOINTS.users.create,
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    updateUser: builder.mutation<User, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: API_ENDPOINTS.users.update(id),
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: API_ENDPOINTS.users.delete(id),
        method: 'DELETE',
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
  useDeleteUserMutation
} = userApi; 