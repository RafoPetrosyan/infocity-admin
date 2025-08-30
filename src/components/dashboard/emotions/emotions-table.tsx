"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
	useBulkUpdateEmotionOrderMutation,
	useCreateEmotionMutation,
	useDeleteEmotionMutation,
	useLazyGetEmotionsQuery,
	useUpdateEmotionMutation,
} from "@/store/emotions";
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
	icon: string;
	color: string;
	en: string;
	hy: string;
	ru: string;
};

export function EmotionsTable(): React.JSX.Element {
	const [trigger, { data, isFetching }] = useLazyGetEmotionsQuery();
	const [createEmotion] = useCreateEmotionMutation();
	const [updateEmotion] = useUpdateEmotionMutation();
	const [deleteEmotion, { isLoading: isDeleting }] = useDeleteEmotionMutation();
	const [bulkUpdateOrder] = useBulkUpdateEmotionOrderMutation();

	const [rows, setRows] = useState<any[]>([]);
	const [open, setOpen] = useState(false);
	const [editingEmotion, setEditingEmotion] = useState<any>(null);
	const [deleteId, setDeleteId] = useState<number | null>(null);

	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			icon: "",
			color: "",
			en: "",
			hy: "",
			ru: "",
		},
	});

	useEffect(() => {
		trigger({});
	}, []);

	useEffect(() => {
		if (isEmpty(data)) return;

		// @ts-ignore
		setRows(data);
	}, [data]);

	const getTranslation = (arr: any, lang: string) => arr.find((e: any) => e.language === lang)?.name || "";

	const handleOpen = (emotion?: any) => {
		if (emotion) {
			setEditingEmotion(emotion);
			reset({
				icon: emotion.icon,
				color: emotion.color,
				en: getTranslation(emotion.translations, "en"),
				hy: getTranslation(emotion.translations, "hy"),
				ru: getTranslation(emotion.translations, "ru"),
			});
		} else {
			setEditingEmotion(null);
			reset({
				icon: "",
				color: "",
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
			icon: formData.icon,
			color: formData.color,
			translations: [
				{ language: "en", name: formData.en },
				{ language: "hy", name: formData.hy },
				{ language: "ru", name: formData.ru },
			],
		};

		try {
			if (editingEmotion) {
				await updateEmotion({ id: editingEmotion.id, ...payload }).unwrap();
				toast.success("Emotion updated");
			} else {
				await createEmotion(payload).unwrap();
				toast.success("Emotion created");
			}
			handleClose();
			trigger({});
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to save emotion");
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination) return;

		const reordered = Array.from(rows);
		const [moved] = reordered.splice(result.source.index, 1);
		reordered.splice(result.destination.index, 0, moved);
		setRows(reordered);

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
					<Typography variant="h4">Emotions</Typography>
				</Stack>
				<Button variant="contained" onClick={() => handleOpen()}>
					Add Emotion
				</Button>
			</Stack>

			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<DragDropContext onDragEnd={handleDragEnd}>
						<Droppable droppableId="emotions">
							{(provided) => (
								<Table {...provided.droppableProps} ref={provided.innerRef}>
									<TableHead>
										<TableRow>
											<TableCell>Order</TableCell>
											<TableCell>Color</TableCell>
											<TableCell>Icon</TableCell>
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
														<TableCell>{row.color}</TableCell>
														<TableCell>{row.icon}</TableCell>
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
				<DialogTitle>{editingEmotion ? "Edit Emotion" : "Add Emotion"}</DialogTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent dividers>
						<Stack spacing={2}>
							<Controller
								name="icon"
								control={control}
								rules={{ required: "Icon is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Icon"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								name="color"
								control={control}
								rules={{ required: "Color is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Color"
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
					<Typography>Are you sure you want to delete this emotion?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteId(null)}>Cancel</Button>
					<Button
						variant="contained"
						color="error"
						disabled={isDeleting}
						onClick={async () => {
							if (deleteId) {
								await deleteEmotion(deleteId).unwrap();
								setDeleteId(null);
								trigger({});
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
