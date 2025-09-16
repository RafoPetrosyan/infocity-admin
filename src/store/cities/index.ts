import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const citiesApi = createApi({
	reducerPath: "citiesApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Cities"],
	endpoints: (builder) => ({
		getCities: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/cities/admin`,
					method: "GET",
				};
			},
			providesTags: ["Cities"],
		}),

		createCity: builder.mutation<any, any>({
			query: (data) => ({
				url: "/cities",
				method: "POST",
				data,
			}),
			invalidatesTags: ["Cities"],
		}),

		updateCity: builder.mutation<any, { id: number; [key: string]: any }>({
			query: ({ id, ...body }) => ({
				url: `/cities/${id}`,
				method: "PUT",
				data: body,
			}),
			invalidatesTags: ["Cities"],
		}),

		deleteCity: builder.mutation({
			query: (id: number) => ({
				url: `/cities/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Cities"],
		}),

		bulkUpdateCityOrder: builder.mutation<any, any>({
			query: (payload) => ({
				url: `/cities/order`,
				method: "POST",
				data: {
					items: payload,
				},
			}),
			invalidatesTags: ["Cities"],
		}),
	}),
});

export const {
	useBulkUpdateCityOrderMutation,
	useCreateCityMutation,
	useDeleteCityMutation,
	useGetCitiesQuery,
	useUpdateCityMutation,
} = citiesApi;
