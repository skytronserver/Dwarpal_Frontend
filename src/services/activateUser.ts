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
        // Send multipart/form-data by constructing FormData from the payload
        activateUser: builder.mutation<unknown, ActivateUserTypes>({
            query: (data) => {
                const formData = new FormData();
                formData.append('mobile_number', data.mobile_number);
                formData.append('password', data.password);
                formData.append('confirm_password', data.confirm_password);
                formData.append('id_proof_last4', data.id_proof_last4);
                

                return {
                    url: API_ENDPOINTS.users.activateUser(data.token),
                    method: 'POST',
                    // Do not set Content-Type manually; the browser will set the correct multipart boundary
                    body: formData,
                };
            },
        }),

    }),
});

export const { useActivateUserMutation } = activateUserApi;
