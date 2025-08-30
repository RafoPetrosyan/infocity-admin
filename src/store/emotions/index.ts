import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const emotionsApi = createApi({
	reducerPath: "emotionsApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getEmotions: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/emotions/admin`,
					method: "GET",
				};
			},
		}),

		createEmotion: builder.mutation<any, any>({
			query: (data) => ({
				url: "/emotions",
				method: "POST",
				data,
			}),
		}),

		updateEmotion: builder.mutation<any, { id: number; [key: string]: any }>({
			query: ({ id, ...body }) => ({
				url: `/emotions/${id}`,
				method: "PUT",
				data: body,
			}),
		}),

		deleteEmotion: builder.mutation({
			query: (id: number) => ({
				url: `/emotions/${id}`,
				method: "DELETE",
			}),
		}),

		bulkUpdateEmotionOrder: builder.mutation<any, any>({
			query: (payload) => ({
				url: `/emotions/order`,
				method: "POST",
				data: {
					items: payload,
				},
			}),
		}),
	}),
});

export const {
	useLazyGetEmotionsQuery,
	useUpdateEmotionMutation,
	useCreateEmotionMutation,
	useDeleteEmotionMutation,
	useBulkUpdateEmotionOrderMutation,
} = emotionsApi;
