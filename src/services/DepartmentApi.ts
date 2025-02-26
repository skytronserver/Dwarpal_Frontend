import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

interface DepartmentResponse {
    count: number;
    total_pages: number;
    current_page: number;
    results: Department[];
}


interface Department {
    id: number;
    name: string;
    organization: string;
    integrate_with_ai_camera: boolean;
}

export const departmentApi = createApi({
    reducerPath: "departmentApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
    tagTypes: ['Department'],
    endpoints: (builder) => ({
        getDepartments: builder.query<DepartmentResponse, { search?: string; page?: number; page_size?: number }>({
            query: (params) => ({
                url: API_ENDPOINTS.departments.list,
                params,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            providesTags: ['Department'],
        }),
        createDepartment: builder.mutation<Department, FormData>({
            query: (formData) => ({
                url: API_ENDPOINTS.departments.create,
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }), 
        updateDepartment: builder.mutation<Department, { id: number; data: FormData }>({
            query: ({ id, data }) => ({
                url: API_ENDPOINTS.departments.update(id),
                method: "PUT",
                body: data,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                },
                formData: true,
            }),
        }),

        deleteDepartment: builder.mutation<Department, number>({
            query: (id) => ({
                url: API_ENDPOINTS.departments.delete(id),
                method: "DELETE",   
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
            invalidatesTags: ['Department'],
        }),
        getDepartmentById: builder.query<Department, number>({
            query: (id) => ({
                url: API_ENDPOINTS.departments.getById(id),
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }),
    }),
});

export const { 
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
    useGetDepartmentByIdQuery
 } = departmentApi;
