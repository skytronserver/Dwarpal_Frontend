import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

export interface AccountUserResponse {
  message: string;
  data: AccountUserFormValues;
}

export interface AccountUserFormValues {
  name: string;
  email: string;
  mobile_number: string;
  address: string;
  pincode: string;
  district: string;
  state: string;
  id_proof_number: string;
  valid_upto: string;
  emergency_contact: string;
  date_of_birth: string;
  organization: string | number;
  department: string;
  role: string;
  photo?: File;
  kyc_document?: File;
  pan_upload?: File;
  id_proof_document?: File;
}

export const accountUserApi = createApi({
  reducerPath: 'accountUserApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  endpoints: (builder) => ({
    createAccountUser: builder.mutation<AccountUserResponse, FormData>({
      query: (data) => ({
        url: API_ENDPOINTS.accountUser.create,
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
        }
      })
    })
  })
})

export const { useCreateAccountUserMutation } = accountUserApi;
