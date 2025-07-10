import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS } from "../config/endpoints";

export interface SubscriptionFormValues {
    title: string;
    duration: string;
    price: string;
    privileges: string[];
    employee_range: string;
    number_of_door_locks: number;
    number_of_cameras: number;
    guest_pass_limit_per_month: number;
  }

const subscriptionApi = createApi({
    reducerPath: 'subscriptionApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
    endpoints: (builder) => ({
        createSubscription: builder.mutation<SubscriptionFormValues, FormData>({
            query: (data) => ({
                url: API_ENDPOINTS.subscription.create,
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Token ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`
                }
            })
        })
    })
})

export const { useCreateSubscriptionMutation } = subscriptionApi;   