"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	useCreateAttractionMutation,
	useDeleteGalleryMutation,
	useLazyGetAttractionQuery,
	useLazyGetGalleryQuery,
	useUpdateAttractionMutation,
	useUploadImagesMutation,
} from "@/store/attractions";
import { useGetCitiesListQuery } from "@/store/cities";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { Autocomplete, Box, Button, Card, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { isEmpty } from "lodash";
import { DropzoneArea } from "mui-file-dropzone";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Translation = {
	name: string;
	description: string;
	about: string;
};

type SocialLink = {
	platform: string;
	url: string;
};

type AttractionFormType = {
	city_id: number;
	category_id: number;
	email: string;
	phone_number: string;
	latitude: number;
	longitude: number;
	en: Translation;
	hy: Translation;
	ru: Translation;
	social_links: SocialLink[];
	image: File[];
	gallery: File[];
};

export function AttractionForm(): React.JSX.Element {
	const route = useRouter();
	const params = useParams();
	const { data: citiesData } = useGetCitiesListQuery({});
	const [createAttraction, { isLoading }] = useCreateAttractionMutation();
	const [updateAttraction, { isLoading: updateIsLoading }] = useUpdateAttractionMutation();
	const [uploadImages, { isLoading: uploadLoading }] = useUploadImagesMutation();
	const [deleteGallery] = useDeleteGalleryMutation();
	const [getAttractionById, { data: attraction }] = useLazyGetAttractionQuery();
	const [getGallery, { data: gallery }] = useLazyGetGalleryQuery();
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<any>({
		defaultValues: {
			city_id: "",
			latitude: "",
			longitude: "",
			en: { name: "", description: "", about: "" },
			hy: { name: "", description: "", about: "" },
			ru: { name: "", description: "", about: "" },
		},
	});

	console.log(gallery, "gallery");

	const onSubmit = async (values: AttractionFormType) => {
		const formData = new FormData();
		formData.append("city_id", String(values.city_id));
		formData.append("latitude", String(values.latitude));
		formData.append("longitude", String(values.longitude));
		formData.append("en", JSON.stringify(values.en));
		formData.append("hy", JSON.stringify(values.hy));
		formData.append("ru", JSON.stringify(values.ru));

		if (values.image?.[0]) {
			formData.append("image", values.image[0]);
		}

		try {
			let placeId = params.id || "";
			if (params.id) {
				await updateAttraction({ data: formData, id: params.id }).unwrap();
			} else {
				const response = await createAttraction(formData).unwrap();
				placeId = response.place.id;
			}

			// upload gallery images if any new ones
			if (values.gallery?.length) {
				const galleryFormData = new FormData();
				values.gallery.forEach((file) => {
					galleryFormData.append("images", file);
				});
				await uploadImages({ images: galleryFormData, id: placeId }).unwrap();
			}

			toast.success(`Attraction successfully ${params.id ? "updated" : "created"}`);
			route.back();
		} catch (err: any) {
			if (typeof err?.data?.message === "object") {
				Object.values(err?.data?.message).forEach((value: any) => toast.error(value as string));
			} else {
				toast.error(err?.data?.message || "Error");
			}
		}
	};

	// load attraction on edit
	useEffect(() => {
		if (params.id) {
			getAttractionById({ id: params.id });
			getGallery({ id: params.id });
		}
	}, []);

	// set form values when loaded
	useEffect(() => {
		if (isEmpty(attraction)) return;
		const hy = attraction.translations.find((e: any) => e.language === "hy");
		const en = attraction.translations.find((e: any) => e.language === "en");
		const ru = attraction.translations.find((e: any) => e.language === "ru");

		reset({
			city_id: attraction.city_id,
			latitude: attraction.latitude,
			longitude: attraction.longitude,
			hy: { name: hy.name, description: hy.description, about: hy.about },
			en: { name: en.name, description: en.description, about: en.about },
			ru: { name: ru.name, description: ru.description, about: ru.about },
		});
	}, [attraction]);

	const handleDeleteGalleryImage = async (id: string) => {
		try {
			await deleteGallery({ id, place_id: params.id }).unwrap();
			toast.success("Image deleted");
			getGallery({ id: params.id });
		} catch {
			toast.error("Failed to delete image");
		}
	};

	return (
		<Card sx={{ p: 1, mx: "auto", boxShadow: 3, borderRadius: 4, mt: 1 }}>
			{/* Back button */}
			<Box display="flex" alignItems="center" mb={2}>
				<Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
					Back
				</Button>
				<Typography variant="h5" sx={{ flex: 1, textAlign: "center" }}>
					{params.id ? "Update attraction" : "Create attraction"}
				</Typography>
			</Box>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3}>
					{/* City */}
					<Grid size={{ xs: 12, md: 6 }}>
						<Controller
							control={control}
							name="city_id"
							rules={{ required: "City is required" }}
							render={({ field }) => (
								<Autocomplete
									options={citiesData as any}
									value={(citiesData || []).find((c: any) => c.id === field.value) || null}
									getOptionLabel={(option: any) => option.name}
									onChange={(_, val) => field.onChange(val?.id ?? "")}
									renderInput={(params) => (
										<TextField
											{...params}
											label="City"
											error={!!errors.city_id}
											helperText={errors.city_id?.message as string}
											required
										/>
									)}
								/>
							)}
						/>
					</Grid>

					{/* Lat/Lng */}
					<Grid size={{ xs: 12, md: 6 }}>
						<Controller
							name="latitude"
							control={control}
							rules={{ required: "latitude is required" }}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Latitude"
									fullWidth
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						<Controller
							name="longitude"
							control={control}
							rules={{ required: "longitude is required" }}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Longitude"
									fullWidth
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					</Grid>

					{/* Translations */}
					{(["en", "hy", "ru"] as const).map((lang) => (
						<Grid key={lang} size={{ xs: 12 }}>
							<Paper sx={{ p: 2, borderRadius: 3, mt: 1 }}>
								<Typography variant="h6" mb={2}>
									{lang.toUpperCase()} Translation
								</Typography>
								<Stack spacing={2}>
									<Controller
										name={`${lang}.name`}
										control={control}
										rules={{ required: "Name is required" }}
										render={({ field, fieldState }) => (
											<TextField
												{...field}
												label="Name"
												fullWidth
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
											/>
										)}
									/>
									<Controller
										name={`${lang}.description`}
										control={control}
										rules={{ required: "Description is required" }}
										render={({ field, fieldState }) => (
											<TextField
												{...field}
												label="Description"
												fullWidth
												multiline
												rows={2}
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
											/>
										)}
									/>
									<Controller
										name={`${lang}.about`}
										control={control}
										rules={{ required: "About is required" }}
										render={({ field, fieldState }) => (
											<TextField
												{...field}
												label="About"
												fullWidth
												multiline
												rows={4}
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
											/>
										)}
									/>
								</Stack>
							</Paper>
						</Grid>
					))}

					{/* Existing main image */}
					{params.id && attraction?.image && (
						<Grid size={{ xs: 12 }}>
							<Typography variant="h6" mt={2}>
								Current Main Image
							</Typography>
							<img src={attraction.image} alt="Main" style={{ width: 200, borderRadius: 8 }} />
						</Grid>
					)}

					{/* New main image */}
					<Grid size={{ xs: 12 }}>
						<Typography variant="h6" mt={2}>
							Upload New Main Image
						</Typography>
						<Controller
							control={control}
							name="image"
							render={({ field }) => (
								<DropzoneArea
									filesLimit={1}
									acceptedFiles={["image/*"]}
									onChange={(files) => field.onChange(files)}
									dropzoneText="Drag & drop or click to upload main image"
								/>
							)}
						/>
					</Grid>

					{/* Existing gallery */}
					{params.id && gallery?.gallery?.length > 0 && (
						<Grid size={{ xs: 12 }}>
							<Typography variant="h6" mt={2}>
								Current Gallery
							</Typography>
							<Stack direction="row" spacing={2} flexWrap="wrap">
								{gallery.gallery.map((g: any) => (
									<Box key={g.id} position="relative">
										<img
											src={g.thumbnail}
											alt=""
											style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }}
										/>
										<IconButton
											size="small"
											color="error"
											onClick={() => handleDeleteGalleryImage(g.id)}
											sx={{ position: "absolute", top: -8, right: -8, bgcolor: "white" }}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</Box>
								))}
							</Stack>
						</Grid>
					)}

					{/* New gallery images */}
					<Grid size={{ xs: 12 }}>
						<Typography variant="h6" mt={2}>
							Upload New Gallery Images (max 10)
						</Typography>
						<Controller
							control={control}
							name="gallery"
							render={({ field }) => (
								<DropzoneArea
									filesLimit={10}
									acceptedFiles={["image/*"]}
									onChange={(files) => field.onChange(files)}
									dropzoneText="Drag & drop or click to upload gallery images"
								/>
							)}
						/>
					</Grid>

					{/* Submit */}
					<Grid size={{ xs: 12 }}>
						<Button
							type="submit"
							variant="contained"
							size="large"
							fullWidth
							disabled={isLoading || uploadLoading || updateIsLoading}
						>
							{params.id ? "Update Attraction" : "Create Attraction"}
						</Button>
					</Grid>
				</Grid>
			</form>
		</Card>
	);
}
