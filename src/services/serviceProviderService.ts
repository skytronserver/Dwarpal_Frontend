import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";


export interface ServiceProviderFirmFormValues {
    id?: string;
    full_name: string;
    email: string;
    phone_number: string;
    service_provider_type: string;
    company_name?: string;
    service_type: string[];
    organization?: string;
    department?: string;
    photo?: File;
    kyc_document?: File;
    gst_no?: string;
    upload_gst_certificate?: File;
    valid_upto?: string;
    [key: string]: any;
  }

  export interface individualServiceProviderFormValues {
    id?: string;
    name: string;
    email: string;
    phone: string;
    service_provider_type: string;
    company_name?: string;
    service_type: string;
    organization?: string;
    department?: string;
    photo?: File;
    kyc_document?: File;
    gst_no?: string;
    upload_gst_certificate?: File;
    valid_upto?: string;
    [key: string]: any;
  }


export const serviceProviderService = createApi({
    reducerPath: "serviceProviderService",
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        createFirm: builder.mutation<{ message: string }, FormData>({
            query: (data) => ({
                url: API_ENDPOINTS.serviceProviders.createFirm,
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }),
        createIndividual: builder.mutation<{ message: string }, FormData>({
            query: (data) => ({
                url: API_ENDPOINTS.serviceProviders.createIndividual,
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }),
    }),
}); 

export const { useCreateFirmMutation, useCreateIndividualMutation } = serviceProviderService;