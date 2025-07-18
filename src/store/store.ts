import { authApi } from "@/store/auth";
import { usersApi } from "@/store/users";
import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth/reducer";

export const makeStore = () => {
	return configureStore({
		reducer: {
			auth,
			[authApi.reducerPath]: authApi.reducer,
			[usersApi.reducerPath]: usersApi.reducer,
		},
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware),
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
