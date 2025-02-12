
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginResponseTypes } from "../types/auth.types";
import { LoginTypes } from "../types/auth.types";
import { API_ENDPOINTS } from "../config/endpoints";

export const authApiSlice = createApi({
   reducerPath: 'authApi',
   baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}/api` }),
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
      })
   })

export const { useGetLoginMutation } = authApiSlice
