import { UsersResponse } from "@/store/auth/types";
import { axiosBaseQuery } from "@/store/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const attractionsApi = createApi({
	reducerPath: "attractionsApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getAttractions: builder.query<UsersResponse, any>({
			query: (params) => {
				const payload = { ...params };
				if (payload.hasOwnProperty("search") && payload?.search?.length < 3) {
					delete payload?.search;
				}
				return {
					url: `/places/attractions`,
					method: "GET",
					params: payload,
				};
			},
		}),
	}),
});

export const { useLazyGetAttractionsQuery } = attractionsApi;
