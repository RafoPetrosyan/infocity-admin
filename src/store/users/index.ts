import { UsersResponse } from "@/store/auth/types";
import { axiosBaseQuery } from "@/store/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getUsers: builder.query<UsersResponse, any>({
			query: (params) => {
				const payload = { ...params };
				if (payload.hasOwnProperty("search") && payload?.search?.length < 3) {
					delete payload?.search;
				}
				return {
					url: `/users`,
					method: "GET",
					params: payload,
				};
			},
		}),
	}),
});

export const { useLazyGetUsersQuery } = usersApi;
