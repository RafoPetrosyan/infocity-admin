"use client";

import * as React from "react";
import { useState } from "react";
import {
	useBulkUpdateCategoryOrderMutation,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
} from "@/store/eventCategories";
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
};

export function EventCategories(): React.JSX.Element {
	const { data = [] } = useGetCategoriesQuery({});
	const [createCategory] = useCreateCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
	const [bulkUpdateOrder] = useBulkUpdateCategoryOrderMutation();

	const rows: any[] = data;
	const [open, setOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<any>(null);
	const [deleteId, setDeleteId] = useState<number | null>(null);

	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			en: "",
			hy: "",
			ru: "",
		},
	});

	const getTranslation = (arr: any, lang: string) => arr.find((e: any) => e.language === lang)?.name || "";

	const handleOpen = (category?: any) => {
		if (category) {
			setEditingCategory(category);
			reset({
				en: getTranslation(category.translations, "en"),
				hy: getTranslation(category.translations, "hy"),
				ru: getTranslation(category.translations, "ru"),
			});
		} else {
			setEditingCategory(null);
			reset({
				en: "",
				hy: "",
				ru: "",
			});
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const onSubmit = async (formData: FormValues) => {
		const body = {
			en: { name: formData.en },
			ru: { name: formData.ru },
			hy: { name: formData.hy },
		};

		try {
			if (editingCategory) {
				await updateCategory({ id: editingCategory.id, body }).unwrap();
				toast.success("Category updated");
			} else {
				await createCategory(body).unwrap();
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
