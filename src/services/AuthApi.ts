
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponseTypes } from "../types/auth.types";
import { LoginTypes } from "../types/auth.types";
import { API_ENDPOINTS } from "../config/endpoints";

export const authApiSlice = createApi({
   reducerPath: 'authApi',
   baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
   tagTypes: ['Auth'],

   endpoints: (builder) => ({

      getLogin: builder.mutation<LoginResponseTypes, LoginTypes>({
         query: (data) => ({
            url: API_ENDPOINTS.auth.login,
            body: data,
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            }
         })
      }),
      otpVerification: builder.mutation<LoginResponseTypes, LoginTypes>({
         query: (data) => ({
            url: API_ENDPOINTS.auth.otpVerification,
            body: data,
            method: 'POST',
         })
      }),
      logout: builder.mutation<void, void>({
         query: () => ({
            url: API_ENDPOINTS.auth.logout,
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
            }
         })
      }),
      resendOtp: builder.mutation<LoginResponseTypes, Pick<LoginTypes, 'mobile_number'>>({
         query: (data) => ({
            url: API_ENDPOINTS.auth.resendOtp,
            method: 'POST',
            body: data,
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            }
         })
      })
   })
})

export const { 
   useGetLoginMutation, 
   useLogoutMutation, 
   useOtpVerificationMutation,
   useResendOtpMutation 
} = authApiSlice
