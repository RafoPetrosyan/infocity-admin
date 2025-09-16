"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
	useBulkUpdateCityOrderMutation,
	useCreateCityMutation,
	useDeleteCityMutation,
	useGetCitiesQuery,
	useUpdateCityMutation,
} from "@/store/cities";
// 👈 RTK slice must have slug field too
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	Box,
	Button,
	Card,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
	slug: string;
	en: string;
	hy: string;
	ru: string;
};

export function Cities(): React.JSX.Element {
	const { data = [], isFetching } = useGetCitiesQuery({});
	const [createCity] = useCreateCityMutation();
	const [updateCity] = useUpdateCityMutation();
	const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();
	const [bulkUpdateOrder] = useBulkUpdateCityOrderMutation();
	const rows: any = data;

	const [open, setOpen] = useState(false);
	const [editingCity, setEditingCity] = useState<any>(null);
	const [deleteId, setDeleteId] = useState<number | null>(null);

	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			slug: "",
			en: "",
			hy: "",
			ru: "",
		},
	});

	const getTranslation = (arr: any, lang: string) => arr.find((e: any) => e.language === lang)?.name || "";

	const handleOpen = (city?: any) => {
		if (city) {
			setEditingCity(city);
			reset({
				slug: city.slug,
				en: getTranslation(city.translations, "en"),
				hy: getTranslation(city.translations, "hy"),
				ru: getTranslation(city.translations, "ru"),
			});
		} else {
			setEditingCity(null);
			reset({
				slug: "",
				en: "",
				hy: "",
				ru: "",
			});
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const onSubmit = async (formData: FormValues) => {
		const payload = {
			slug: formData.slug,
			translations: [
				{ language: "en", name: formData.en },
				{ language: "hy", name: formData.hy },
				{ language: "ru", name: formData.ru },
			],
		};

		try {
			if (editingCity) {
				await updateCity({ id: editingCity.id, ...payload }).unwrap();
				toast.success("City updated");
			} else {
				await createCity(payload).unwrap();
				toast.success("City created");
			}
			handleClose();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to save city");
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination) return;

		const reordered = Array.from(rows);
		const [moved] = reordered.splice(result.source.index, 1);
		reordered.splice(result.destination.index, 0, moved);

		const payload = reordered.map((item, index) => ({
			// @ts-ignore
			id: item.id,
			order: index + 1,
		}));

		try {
			await bulkUpdateOrder(payload).unwrap();
			toast.success("Order updated");
		} catch (err) {
			console.error("Bulk update error:", err);
			toast.error("Failed to update order");
		}
	};

	return (
		<>
			<Stack direction="row" sx={{ mb: 2 }}>
				<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Cities</Typography>
				</Stack>
				<Button variant="contained" onClick={() => handleOpen()}>
					Add City
				</Button>
			</Stack>

			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId="cities">
							{(provided) => (
								<Table {...provided.droppableProps} ref={provided.innerRef}>
									<TableHead>
										<TableRow>
											<TableCell>Order</TableCell>
											<TableCell>Slug</TableCell>
											<TableCell>EN</TableCell>
											<TableCell>HY</TableCell>
											<TableCell>RU</TableCell>
											<TableCell>Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows?.map((row: any, index: any) => (
											<Draggable key={row.id} draggableId={row.id.toString()} index={index}>
												{(provided, snapshot) => (
													<TableRow
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														sx={{
															backgroundColor: snapshot.isDragging ? "rgba(0,0,0,0.05)" : "inherit",
														}}
													>
														<TableCell>{index + 1}</TableCell>
														<TableCell>{row.slug}</TableCell>
														<TableCell>{getTranslation(row.translations, "en")}</TableCell>
														<TableCell>{getTranslation(row.translations, "hy")}</TableCell>
														<TableCell>{getTranslation(row.translations, "ru")}</TableCell>
														<TableCell>
															<IconButton onClick={() => handleOpen(row)}>
																<EditIcon />
															</IconButton>
															<IconButton color="error" onClick={() => setDeleteId(row.id)}>
																<DeleteIcon />
															</IconButton>
														</TableCell>
													</TableRow>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</TableBody>
								</Table>
							)}
						</Droppable>
					</DragDropContext>
				</Box>
				<Divider />
			</Card>

			{/* Add/Edit Dialog */}
			<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
				<DialogTitle>{editingCity ? "Edit City" : "Add City"}</DialogTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent dividers>
						<Stack spacing={2}>
							<Controller
								name="slug"
								control={control}
								rules={{ required: "Slug is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Slug"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								name="en"
								control={control}
								rules={{ required: "English name is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="English"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								name="hy"
								control={control}
								rules={{ required: "Armenian name is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Armenian"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								name="ru"
								control={control}
								rules={{ required: "Russian name is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Russian"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button variant="contained" type="submit">
							Save
						</Button>
					</DialogActions>
				</form>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent dividers>
					<Typography>Are you sure you want to delete this city?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteId(null)}>Cancel</Button>
					<Button
						variant="contained"
						color="error"
						disabled={isDeleting}
						onClick={async () => {
							if (deleteId) {
								await deleteCity(deleteId).unwrap();
								setDeleteId(null);
							}
						}}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
