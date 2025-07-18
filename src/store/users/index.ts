import { UsersResponse } from "@/store/auth/types";
import { axiosBaseQuery } from "@/store/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getUsers: builder.query<UsersResponse, any>({
			query: (params) => ({
				url: `/users`,
				method: "GET",
				params,
			}),
		}),
	}),
});

export const { useLazyGetUsersQuery } = usersApi;
