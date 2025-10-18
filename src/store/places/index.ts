import { UsersResponse } from "@/store/auth/types";
import { axiosBaseQuery } from "@/store/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const placesApi = createApi({
	reducerPath: "placesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getPlaces: builder.query<UsersResponse, any>({
			query: (params) => {
				const payload = { ...params };
				if (payload.hasOwnProperty("search") && payload?.search?.length < 3) {
					delete payload?.search;
				}
				return {
					url: `/places/admin`,
					method: "GET",
					params: payload,
				};
			},
		}),

		updatePlace: builder.mutation<any, any>({
			query: (data) => ({
				url: `/places/${data.id}`,
				method: "PUT",
				data: data.data,
			}),
		}),

		getPlace: builder.query<any, any>({
			query: (params) => {
				return {
					url: `/places/${params.id}/detail`,
					method: "GET",
				};
			},
		}),

		getGallery: builder.query<any, any>({
			query: (params) => {
				return {
					url: `/places/${params.id}/gallery`,
					method: "GET",
				};
			},
		}),

		uploadImages: builder.mutation<any, any>({
			query: (data) => ({
				url: `/places/${data.id}/gallery`,
				method: "POST",
				data: data.images,
			}),
		}),

		deleteGallery: builder.mutation<any, any>({
			query: (data) => ({
				url: `/places/${data.place_id}/gallery/${data.id}`,
				method: "DELETE",
			}),
		}),

		deletePlace: builder.mutation<any, any>({
			query: (data) => ({
				url: `/places/${data.id}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useLazyGetPlaceQuery,
	useLazyGetPlacesQuery,
	useLazyGetGalleryQuery,
	useUploadImagesMutation,
	useDeleteGalleryMutation,
	useUpdatePlaceMutation,
	useDeletePlaceMutation,
} = placesApi;
