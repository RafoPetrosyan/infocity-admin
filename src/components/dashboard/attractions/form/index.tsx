"use client";

import React from "react";
// import { useCreateAttractionMutation } from "@/store/attractions";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Autocomplete,
	Box,
	Button,
	Card,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DropzoneArea } from "mui-file-dropzone";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type Translation = {
	name: string;
	description: string;
	about: string;
};

type SocialLink = {
	platform: string;
	url: string;
};

type AttractionForm = {
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

// Example city list (replace with real data from your API)
const cities = [
	{ id: 1, name: "Yerevan" },
	{ id: 2, name: "Gyumri" },
	{ id: 3, name: "Vanadzor" },
];

// Social platform options
const platforms = ["facebook", "instagram", "tiktok", "website"];

export function AttractionForm(): React.JSX.Element {
	const {
		control,
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<AttractionForm>({
		// defaultValues: {
		// 	social_links: [{ platform: "", url: "" }],
		// },
	});

	console.log(errors?.email);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "social_links",
	});

	// const [createAttraction, { isLoading }] = useCreateAttractionMutation();

	const onSubmit = async (values: AttractionForm) => {
		const formData = new FormData();

		formData.append("city_id", String(values.city_id));
		formData.append("latitude", String(values.latitude));
		formData.append("longitude", String(values.longitude));

		formData.append("en", JSON.stringify(values.en));
		formData.append("hy", JSON.stringify(values.hy));
		formData.append("ru", JSON.stringify(values.ru));

		// formData.append("social_links", JSON.stringify(values.social_links));

		if (values.image?.[0]) {
			formData.append("image", values.image[0]);
		}

		if (values.gallery?.length) {
			values.gallery.forEach((file) => {
				formData.append("gallery", file);
			});
		}

		// await createAttraction(formData);
	};

	return (
		<Card
			sx={{
				p: 1,
				mx: "auto",
				boxShadow: 3,
				borderRadius: 4,
				mt: 1,
			}}
		>
			{/* Back button */}
			<Box display="flex" alignItems="center" mb={2}>
				<Button startIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
					Back
				</Button>
				<Typography variant="h5" sx={{ flex: 1, textAlign: "center" }}>
					Create Attraction
				</Typography>
			</Box>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3}>
					{/* City Autocomplete */}
					<Grid size={{ xs: 12, md: 6 }}>
						<Controller
							control={control}
							name="city_id"
							rules={{ required: "City is required" }}
							render={({ field }) => (
								<Autocomplete
									options={cities}
									getOptionLabel={(option) => option.name}
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
						<TextField
							label="Latitude"
							type="number"
							fullWidth
							error={!!errors.latitude}
							helperText={errors.latitude?.message}
							{...register("latitude", { required: "latitude is required" })}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<TextField
							label="Longitude"
							type="number"
							fullWidth
							error={!!errors.longitude}
							helperText={errors.longitude?.message}
							{...register("longitude", { required: "longitude is required" })}
						/>
					</Grid>

					{/* Translations */}
					{(["en", "hy", "ru"] as const).map((lang) => {
						return (
							<Grid key={lang} size={{ xs: 12 }}>
								<Paper sx={{ p: 2, borderRadius: 3, mt: 1 }}>
									<Typography variant="h6" mb={2}>
										{lang.toUpperCase()} Translation
									</Typography>
									<Stack spacing={2}>
										<TextField
											label="Name"
											fullWidth
											error={!!errors?.[lang]?.name}
											helperText={errors?.[lang]?.name?.message as string}
											{...register(`${lang}.name`, { required: "name is required" })}
										/>
										<TextField
											label="Description"
											multiline
											rows={2}
											fullWidth
											error={!!errors?.[lang]?.description}
											helperText={errors?.[lang]?.description?.message as string}
											{...register(`${lang}.description`, { required: "description is required" })}
										/>
										<TextField
											label="About"
											multiline
											rows={4}
											fullWidth
											error={!!errors?.[lang]?.about}
											helperText={errors?.[lang]?.about?.message as string}
											{...register(`${lang}.about`, { required: "about is required" })}
										/>
									</Stack>
								</Paper>
							</Grid>
						);
					})}

					{/*/!* Social Links *!/*/}
					{/*<Grid size={{ xs: 12 }}>*/}
					{/*	<Typography variant="h6" mt={2}>*/}
					{/*		Social Links*/}
					{/*	</Typography>*/}
					{/*	{fields.map((field, index) => (*/}
					{/*		<Stack key={field.id} direction="row" spacing={2} mt={1}>*/}
					{/*			<Controller*/}
					{/*				control={control}*/}
					{/*				name={`social_links.${index}.platform`}*/}
					{/*				render={({ field }) => (*/}
					{/*					<Select {...field} displayEmpty sx={{ minWidth: 140 }}>*/}
					{/*						<MenuItem value="">*/}
					{/*							<em>Select platform</em>*/}
					{/*						</MenuItem>*/}
					{/*						{platforms.map((p) => (*/}
					{/*							<MenuItem key={p} value={p}>*/}
					{/*								{p.charAt(0).toUpperCase() + p.slice(1)}*/}
					{/*							</MenuItem>*/}
					{/*						))}*/}
					{/*					</Select>*/}
					{/*				)}*/}
					{/*			/>*/}
					{/*			<TextField*/}
					{/*				label="URL"*/}
					{/*				fullWidth*/}
					{/*				error={!!errors.social_links?.[index]?.url}*/}
					{/*				helperText={errors.social_links?.[index]?.url?.message}*/}
					{/*				{...register(`social_links.${index}.url`, { required: "URL is required" })}*/}
					{/*			/>*/}
					{/*			<IconButton onClick={() => remove(index)}>*/}
					{/*				<DeleteIcon />*/}
					{/*			</IconButton>*/}
					{/*		</Stack>*/}
					{/*	))}*/}
					{/*	<Button startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={() => append({ platform: "", url: "" })}>*/}
					{/*		Add Link*/}
					{/*	</Button>*/}
					{/*</Grid>*/}

					{/* Main Image */}
					<Grid size={{ xs: 12 }}>
						<Typography variant="h6" mt={2}>
							Main Image
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

					{/* Gallery */}
					<Grid size={{ xs: 12 }}>
						<Typography variant="h6" mt={2}>
							Gallery (max 10)
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
						<Button type="submit" variant="contained" size="large" fullWidth>
							Create Attraction
							{/*{isLoading ? "Saving..." : "Create Attraction"}*/}
						</Button>
					</Grid>
				</Grid>
			</form>
		</Card>
	);
}
