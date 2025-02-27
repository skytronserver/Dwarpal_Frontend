import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

export interface Organisation {
  id?: number;
  name: string;
  type?: number;
  access_control: boolean;
  address: string;
  gst_no: string;
  no_of_employees: string;
}

interface OrganisationListResponse {
  results: Organisation[];
  count: number;
  total_pages: number;
  current_page: number;
}

interface OrganisationDetailResponse {
  data: Organisation;
}

export const organisationApi = createApi({
  reducerPath: 'organisationApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  tagTypes: ['Organisations'],
  endpoints: (builder) => ({
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
    getOrganisationById: builder.query<OrganisationDetailResponse, number>({
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
