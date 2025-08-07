import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

export interface Organisation {
    id: number,
    client_name: string,
    email: string,
    contact_number: string,
    address: string,
    district: string,
    state: string,
    pincode: string,
    subscription: string,
    valid_upto: string,
    pan_number: string,
    gst_number: string
}

export interface OrganisationResponse {
  success: boolean;
  message: string;
  status_code: number;
  data: Organisation;
}

interface OrganisationListResponse {
  results: Organisation[];
  count: number;
  total_pages: number;
  current_page: number;
}

export const organisationApi = createApi({
  reducerPath: 'organisationApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  tagTypes: ['Organisations'],
  endpoints: (builder) => ({
    getOrganizationById: builder.query<OrganisationResponse, number>({
      query: (id) => ({
        url: API_ENDPOINTS.organizations.getById(id),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
      providesTags: ['Organisations']
    }),
    getOrganisations: builder.query<OrganisationListResponse, { search?: string; page?: number; page_size?: number }>({
      query: (params) => ({
        url: API_ENDPOINTS.organizations.list,
        params,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
      providesTags: ['Organisations']
    }),
    createOrganisation: builder.mutation<Organisation, FormData>({
      query: (formData) => ({
        url: API_ENDPOINTS.organizations.create,
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })


    }),
    editOrganisation: builder.mutation<Organisation, { id: number; data: Record<string, any> }>({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.organizations.update(id),
        method: 'PUT',
        body: data,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    deleteOrganisation: builder.mutation<Organisation,number  >({
      query: (id) => ({
        url: API_ENDPOINTS.organizations.delete(id),
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
      invalidatesTags: ['Organisations']
    }),
    getOrganisationById: builder.query<OrganisationResponse, number>({
      query: (id) => ({
        url: API_ENDPOINTS.organizations.getById(id),
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      }),
    }),
  })
});


export const {
  useGetOrganisationsQuery,
  useCreateOrganisationMutation,
  useEditOrganisationMutation,
  useDeleteOrganisationMutation,
  useGetOrganisationByIdQuery
} = organisationApi;
