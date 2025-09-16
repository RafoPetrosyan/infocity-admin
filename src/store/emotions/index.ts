import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const emotionsApi = createApi({
	reducerPath: "emotionsApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Emotions"],
	endpoints: (builder) => ({
		getEmotions: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/emotions/admin`,
					method: "GET",
				};
			},
			providesTags: ["Emotions"],
		}),

		createEmotion: builder.mutation<any, any>({
			query: (data) => ({
				url: "/emotions",
				method: "POST",
				data,
			}),
			invalidatesTags: ["Emotions"],
		}),

		updateEmotion: builder.mutation<any, { id: number; [key: string]: any }>({
			query: ({ id, ...body }) => ({
				url: `/emotions/${id}`,
				method: "PUT",
				data: body,
			}),
			invalidatesTags: ["Emotions"],
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
			invalidatesTags: ["Emotions"],
		}),
	}),
});

export const {
	useGetEmotionsQuery,
	useUpdateEmotionMutation,
	useCreateEmotionMutation,
	useDeleteEmotionMutation,
	useBulkUpdateEmotionOrderMutation,
} = emotionsApi;
