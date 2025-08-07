import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

export interface ClientFormValues {
    client_name: string;
    email: string;
    contact_number: string;
    address: string;
    district: string;
    state: string;
    pincode: string;
    subscription: string;
    valid_upto: string;
    pan_number: string;
    gst_number: string;
  }

export const clientService = createApi({
    reducerPath: "clientService",
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        createCompany: builder.mutation<{ message: string }, ClientFormValues>({
            query: (data) => ({
                url: API_ENDPOINTS.clients.createCompany,
                method: 'POST',
                body: data, 
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
                }
            }),
        }),
    }),
});

export const { useCreateCompanyMutation } = clientService;
