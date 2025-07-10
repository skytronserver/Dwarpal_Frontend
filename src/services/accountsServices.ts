import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_ENDPOINTS } from '../config/endpoints';

interface Organization {
  id: number;
  client_name: string;
}

export interface AccountsFormValues {
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
    gst_number: string;
    organization?: string | number | Organization;
}

export const accountsApi = createApi({
    reducerPath: 'accountsApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
    endpoints: (builder) => ({
        createAccounts: builder.mutation<AccountsFormValues, FormData>({
            query: (data) => ({
                url: API_ENDPOINTS.accounts.create,
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
                }
            })
        })
    })
})

export const { useCreateAccountsMutation } = accountsApi;