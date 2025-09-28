import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const eventCategoriesApi = createApi({
	reducerPath: "eventCategoriesApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["EventCategories"],
	endpoints: (builder) => ({
		getCategories: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/event-categories/admin`,
					method: "GET",
				};
			},
			providesTags: ["EventCategories"],
		}),

		createCategory: builder.mutation<any, any>({
			query: (data) => ({
				url: "/event-categories",
				method: "POST",
				data,
			}),
			invalidatesTags: ["EventCategories"],
		}),

		updateCategory: builder.mutation<any, { id: number; [key: string]: any }>({
			query: ({ id, body }) => ({
				url: `/event-categories/${id}`,
				method: "PUT",
				data: body,
			}),
			invalidatesTags: ["EventCategories"],
		}),

		deleteCategory: builder.mutation({
			query: (id: number) => ({
				url: `/event-categories/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["EventCategories"],
		}),

		bulkUpdateCategoryOrder: builder.mutation<any, any>({
			query: (payload) => ({
				url: `/event-categories/order`,
				method: "POST",
				data: {
					items: payload,
				},
			}),
			invalidatesTags: ["EventCategories"],
		}),
	}),
});

export const {
	useBulkUpdateCategoryOrderMutation,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
} = eventCategoriesApi;
