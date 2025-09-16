"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
	useBulkUpdateCategoryOrderMutation,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
} from "@/store/categories";
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
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
	slug: string;
	en: string;
	hy: string;
	ru: string;
	image?: FileList;
};

export function Categories(): React.JSX.Element {
	const { data = [] } = useGetCategoriesQuery({});
	const [createCategory] = useCreateCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
	const [bulkUpdateOrder] = useBulkUpdateCategoryOrderMutation();

	const rows: any[] = data;
	const [open, setOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<any>(null);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const { control, handleSubmit, reset, watch } = useForm<FormValues>({
		defaultValues: {
			slug: "",
			en: "",
			hy: "",
			ru: "",
			image: undefined,
		},
	});

	const watchImage = watch("image");

	useEffect(() => {
		if (watchImage && watchImage.length > 0) {
			const file = watchImage[0];
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(null);
		}
	}, [watchImage]);

	const getTranslation = (arr: any, lang: string) => arr.find((e: any) => e.language === lang)?.name || "";

	const handleOpen = (category?: any) => {
		if (category) {
			setEditingCategory(category);
			reset({
				slug: category.slug,
				en: getTranslation(category.translations, "en"),
				hy: getTranslation(category.translations, "hy"),
				ru: getTranslation(category.translations, "ru"),
			});
			setPreview(category.image || null);
		} else {
			setEditingCategory(null);
			reset({
				slug: "",
				en: "",
				hy: "",
				ru: "",
				image: undefined,
			});
			setPreview(null);
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const onSubmit = async (formData: FormValues) => {
		const formDataObj = new FormData();
		formDataObj.append("slug", formData.slug);
		formDataObj.append(
			"translations",
			JSON.stringify([
				{ language: "en", name: formData.en },
				{ language: "hy", name: formData.hy },
				{ language: "ru", name: formData.ru },
			])
		);
		if (formData.image && formData.image.length > 0) {
			formDataObj.append("image", formData.image[0]);
		}

		try {
			if (editingCategory) {
				await updateCategory({ id: editingCategory.id, body: formDataObj }).unwrap();
				toast.success("Category updated");
			} else {
				await createCategory(formDataObj).unwrap();
				toast.success("Category created");
			}
			handleClose();
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to save category");
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination) return;

		const reordered = Array.from(rows);
		const [moved] = reordered.splice(result.source.index, 1);
		reordered.splice(result.destination.index, 0, moved);

		const payload = reordered.map((item, index) => ({
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
					<Typography variant="h4">Categories</Typography>
				</Stack>
				<Button variant="contained" onClick={() => handleOpen()}>
					Add Category
				</Button>
			</Stack>

			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId="categories">
							{(provided) => (
								<Table {...provided.droppableProps} ref={provided.innerRef}>
									<TableHead>
										<TableRow>
											<TableCell>Order</TableCell>
											<TableCell>Image</TableCell>
											<TableCell>Slug</TableCell>
											<TableCell>EN</TableCell>
											<TableCell>HY</TableCell>
											<TableCell>RU</TableCell>
											<TableCell>Actions</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map((row, index) => (
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
														<TableCell>
															{row.image && (
																<img
																	src={row.image}
																	alt="Category"
																	style={{ width: 25, height: 25, objectFit: "contain", borderRadius: 4 }}
																/>
															)}
														</TableCell>
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
				<DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
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
							<Controller
								name="image"
								control={control}
								render={({ field }) => (
									<>
										<Button variant="outlined" component="label">
											Upload Image
											<input type="file" hidden accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
										</Button>
										{preview && (
											<img src={preview} alt="Preview" style={{ width: 50, marginTop: 8, borderRadius: 4 }} />
										)}
									</>
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
					<Typography>Are you sure you want to delete this category?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteId(null)}>Cancel</Button>
					<Button
						variant="contained"
						color="error"
						disabled={isDeleting}
						onClick={async () => {
							if (deleteId) {
								await deleteCategory(deleteId).unwrap();
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
