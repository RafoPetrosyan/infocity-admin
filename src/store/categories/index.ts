import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
	reducerPath: "categoriesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getCategories: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/categories/admin`,
					method: "GET",
				};
			},
		}),

		createCategory: builder.mutation<any, any>({
			query: (data) => ({
				url: "/categories",
				method: "POST",
				data,
			}),
		}),

		updateCategory: builder.mutation<any, { id: number; [key: string]: any }>({
			query: ({ id, body }) => ({
				url: `/categories/${id}`,
				method: "PUT",
				data: body,
			}),
		}),

		deleteCategory: builder.mutation({
			query: (id: number) => ({
				url: `/categories/${id}`,
				method: "DELETE",
			}),
		}),

		bulkUpdateCategoryOrder: builder.mutation<any, any>({
			query: (payload) => ({
				url: `/categories/order`,
				method: "POST",
				data: {
					items: payload,
				},
			}),
		}),
	}),
});

export const {
	useBulkUpdateCategoryOrderMutation,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useLazyGetCategoriesQuery,
	useUpdateCategoryMutation,
} = categoriesApi;
