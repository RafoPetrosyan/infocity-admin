import { UsersResponse } from "@/store/auth/types";
import { axiosBaseQuery } from "@/store/customBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const placesApi = createApi({
	reducerPath: "placesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getAttractions: builder.query<UsersResponse, any>({
			query: (params) => {
				const payload = { ...params };
				if (payload.hasOwnProperty("search") && payload?.search?.length < 3) {
					delete payload?.search;
				}
				return {
					url: `/places/attractions`,
					method: "GET",
					params: payload,
				};
			},
		}),

		createAttraction: builder.mutation<any, any>({
			query: (data) => ({
				url: "/places/attraction",
				method: "POST",
				data,
			}),
		}),

		updateAttraction: builder.mutation<any, any>({
			query: (data) => ({
				url: `/places/${data.id}`,
				method: "PUT",
				data: data.data,
			}),
		}),

		getAttraction: builder.query<any, any>({
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

		deleteAttraction: builder.mutation<any, any>({
			query: (data) => ({
				url: `/places/${data.id}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useLazyGetAttractionsQuery,
	useCreateAttractionMutation,
	useLazyGetAttractionQuery,
	useLazyGetGalleryQuery,
	useUploadImagesMutation,
	useDeleteGalleryMutation,
	useUpdateAttractionMutation,
	useDeleteAttractionMutation,
} = placesApi;
