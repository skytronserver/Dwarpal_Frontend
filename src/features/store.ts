import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "../services/AuthApi";
import { organisationApi } from "../services/OrganisationApi";
import modalReducer from "./slices/modalSlice";
import { departmentApi } from "../services/DepartmentApi";
import { userApi } from "../services/UserApi";

const store = configureStore({
    reducer: {
        modal: modalReducer,
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [organisationApi.reducerPath]: organisationApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApiSlice.middleware, organisationApi.middleware, departmentApi.middleware, userApi.middleware),
    devTools: true,
})

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;