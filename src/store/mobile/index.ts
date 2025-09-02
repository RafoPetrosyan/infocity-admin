import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const mobileApi = createApi({
	reducerPath: "mobileApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getMobile: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/mobile`,
					method: "GET",
				};
			},
		}),

		updateMobile: builder.mutation<any, { id: number; [key: string]: any }>({
			query: (body: any) => ({
				url: `/mobile/1`,
				method: "PUT",
				data: body,
			}),
		}),
	}),
});

export const { useLazyGetMobileQuery, useUpdateMobileMutation } = mobileApi;
