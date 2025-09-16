import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const categoriesApi = createApi({
	reducerPath: "categoriesApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Categories"],
	endpoints: (builder) => ({
		getCategories: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/categories/admin`,
					method: "GET",
				};
			},
			providesTags: ["Categories"],
		}),

		createCategory: builder.mutation<any, any>({
			query: (data) => ({
				url: "/categories",
				method: "POST",
				data,
			}),
			invalidatesTags: ["Categories"],
		}),

		updateCategory: builder.mutation<any, { id: number; [key: string]: any }>({
			query: ({ id, body }) => ({
				url: `/categories/${id}`,
				method: "PUT",
				data: body,
			}),
			invalidatesTags: ["Categories"],
		}),

		deleteCategory: builder.mutation({
			query: (id: number) => ({
				url: `/categories/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Categories"],
		}),

		bulkUpdateCategoryOrder: builder.mutation<any, any>({
			query: (payload) => ({
				url: `/categories/order`,
				method: "POST",
				data: {
					items: payload,
				},
			}),
			invalidatesTags: ["Categories"],
		}),
	}),
});

export const {
	useBulkUpdateCategoryOrderMutation,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
} = categoriesApi;
