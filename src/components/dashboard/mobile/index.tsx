"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useLazyGetMobileQuery, useUpdateMobileMutation } from "@/store/mobile";
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
	Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { isEmpty } from "lodash";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FormValues = {
	ios_version: string;
	android_version: string;
	force_update: boolean;
	app_working: boolean;
};

export function Mobile(): React.JSX.Element {
	const [trigger, { data }] = useLazyGetMobileQuery();
	const [updateMobile] = useUpdateMobileMutation();

	const [rows, setRows] = useState<any[]>([]);
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<any>(null);

	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			ios_version: "",
			android_version: "",
			force_update: false,
			app_working: true,
		},
	});

	useEffect(() => {
		trigger({});
	}, []);

	useEffect(() => {
		if (isEmpty(data)) return;
		// assuming API returns single object
		setRows([data]);
	}, [data]);

	const handleOpen = (row: any) => {
		setEditing(row);
		reset({
			ios_version: row.ios_version,
			android_version: row.android_version,
			force_update: row.force_update,
			app_working: row.app_working,
		});
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const onSubmit = async (formData: FormValues) => {
		try {
			const payload = {
				ios_version: formData.ios_version,
				android_version: formData.android_version,
				force_update: formData.force_update,
				app_working: formData.app_working,
			};
			// @ts-ignore
			await updateMobile({ ...payload }).unwrap();
			toast.success("App version updated");
			handleClose();
			trigger({});
		} catch (err: any) {
			toast.error(err?.data?.message || "Failed to update");
		}
	};

	return (
		<>
			<Stack direction="row" sx={{ mb: 2 }}>
				<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Mobile App Versions</Typography>
				</Stack>
			</Stack>

			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>iOS Version</TableCell>
								<TableCell>Android Version</TableCell>
								<TableCell>Force Update</TableCell>
								<TableCell>App Working</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row.ios_version}</TableCell>
									<TableCell>{row.android_version}</TableCell>
									<TableCell>{row.force_update ? "Yes" : "No"}</TableCell>
									<TableCell>{row.app_working ? "Yes" : "No"}</TableCell>
									<TableCell>
										<IconButton onClick={() => handleOpen(row)}>
											<EditIcon />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
				<Divider />
			</Card>

			{/* Update Dialog */}
			<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
				<DialogTitle>Edit Mobile Versions</DialogTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent dividers>
						<Stack spacing={2}>
							<Controller
								name="ios_version"
								control={control}
								rules={{ required: "iOS version is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="iOS Version"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								name="android_version"
								control={control}
								rules={{ required: "Android version is required" }}
								render={({ field, fieldState }) => (
									<TextField
										{...field}
										label="Android Version"
										error={!!fieldState.error}
										helperText={fieldState.error?.message}
									/>
								)}
							/>
							<Controller
								name="force_update"
								control={control}
								render={({ field }) => (
									<FormControlLabel
										control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
										label="Force Update"
									/>
								)}
							/>
							<Controller
								name="app_working"
								control={control}
								render={({ field }) => (
									<FormControlLabel
										control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
										label="App Working"
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
		</>
	);
}
