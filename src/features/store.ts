import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "../services/AuthApi";
import { organisationApi } from "../services/OrganisationApi";
import modalReducer from "./slices/modalSlice";
import { departmentApi } from "../services/DepartmentApi";
import { userApi } from "../services/UserApi";
import { shiftApi } from "../services/shiftApi";
import { holidayApi } from "../services/holidayApi";
const store = configureStore({
    reducer: {
        modal: modalReducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [organisationApi.reducerPath]: organisationApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [shiftApi.reducerPath]: shiftApi.reducer,
        [holidayApi.reducerPath]: holidayApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApiSlice.middleware, organisationApi.middleware, departmentApi.middleware, userApi.middleware, shiftApi.middleware, holidayApi.middleware),
    devTools: true,
})

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;