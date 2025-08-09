import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";


export interface HrFormValues {
    name: string;
    email: string;
    mobile_number: string;
    emergency_contact: string;
    date_of_birth: string;
    blood_group: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    pan_number: string;
    id_proof_number: string;
    valid_upto: string;
    organization?: string | number;
}

interface HrResponse extends HrFormValues {
    message: string;
}

export const hrApi = createApi({
  reducerPath: 'hrApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  endpoints: (builder) => ({
    createHr: builder.mutation<HrResponse, FormData>({
      query: (data) => ({
        url: API_ENDPOINTS.hr.create,
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    }),
    createHrAccounts: builder.mutation<HrResponse, FormData>({
      query: (data) => ({
        url: API_ENDPOINTS.hr.create,
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
        }
      })
    })
  })
})

export const { useCreateHrMutation, useCreateHrAccountsMutation } = hrApi;

