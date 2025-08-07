import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

interface ActivateUserTypes {
    mobile_number: string;
    password: string;
    confirm_password: string;
    id_proof_last4: string;
    token: string;
}

export const activateUserApi = createApi({
    reducerPath: 'activateUserApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
    endpoints: (builder) => ({
        activateUser: builder.mutation<ActivateUserTypes, ActivateUserTypes>({
            query: (data) => ({
                url: API_ENDPOINTS.users.activateUser(data.token),
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useActivateUserMutation } = activateUserApi;
