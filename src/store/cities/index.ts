import { axiosBaseQuery } from "@/store/customBaseQuery";
import { Emotion } from "@/store/emotions/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const citiesApi = createApi({
	reducerPath: "citiesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getCities: builder.query<Emotion[], any>({
			query: () => {
				return {
					url: `/cities/admin`,
					method: "GET",
				};
			},
		}),

		createCity: builder.mutation<any, any>({
			query: (data) => ({
				url: "/cities",
				method: "POST",
				data,
			}),
		}),

		updateCity: builder.mutation<any, { id: number; [key: string]: any }>({
			query: ({ id, ...body }) => ({
				url: `/cities/${id}`,
				method: "PUT",
				data: body,
			}),
		}),

		deleteCity: builder.mutation({
			query: (id: number) => ({
				url: `/cities/${id}`,
				method: "DELETE",
			}),
		}),

		bulkUpdateCityOrder: builder.mutation<any, any>({
			query: (payload) => ({
				url: `/cities/order`,
				method: "POST",
				data: {
					items: payload,
				},
			}),
		}),
	}),
});

export const {
	useBulkUpdateCityOrderMutation,
	useCreateCityMutation,
	useDeleteCityMutation,
	useLazyGetCitiesQuery,
	useUpdateCityMutation,
} = citiesApi;
