import { attractionsApi } from "@/store/attractions";
import { authApi } from "@/store/auth";
import { categoriesApi } from "@/store/categories";
import { citiesApi } from "@/store/cities";
import { emotionsApi } from "@/store/emotions";
import { eventCategoriesApi } from "@/store/eventCategories";
import { mobileApi } from "@/store/mobile";
import { usersApi } from "@/store/users";
import { placesApi } from "@/store/places";
import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth/reducer";

export const makeStore = () => {
	return configureStore({
		reducer: {
			auth,
			[authApi.reducerPath]: authApi.reducer,
			[usersApi.reducerPath]: usersApi.reducer,
			[emotionsApi.reducerPath]: emotionsApi.reducer,
			[citiesApi.reducerPath]: citiesApi.reducer,
			[categoriesApi.reducerPath]: categoriesApi.reducer,
			[mobileApi.reducerPath]: mobileApi.reducer,
			[attractionsApi.reducerPath]: attractionsApi.reducer,
			[eventCategoriesApi.reducerPath]: eventCategoriesApi.reducer,
			[placesApi.reducerPath]: placesApi.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
				authApi.middleware,
				usersApi.middleware,
				emotionsApi.middleware,
				citiesApi.middleware,
				categoriesApi.middleware,
				mobileApi.middleware,
				attractionsApi.middleware,
				eventCategoriesApi.middleware,
				placesApi.middleware
			),
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
