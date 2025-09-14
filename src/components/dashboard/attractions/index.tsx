"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLazyGetAttractionsQuery } from "@/store/attractions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { isEmpty } from "lodash";
import { useDebouncedCallback } from "use-debounce";

export function Attractions(): React.JSX.Element {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");
	const [trigger, { data, isLoading, isError }] = useLazyGetAttractionsQuery();

	const handleChangePage = (_: any, page: number) => {
		setPage(page + 1);
		trigger({ page: page + 1, limit, search });
	};

	const handleChangeRowCount = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const newLimit = +event.target.value;
		if (newLimit === limit) return;

		setLimit(newLimit);
		setPage(1);
		trigger({ page: 1, limit: newLimit, search });
	};

	const handleClearSearch = () => {
		setSearch("");
		setPage(1);
		trigger({ page: 1, limit, search: "" });
	};

	const debouncedSearch = useDebouncedCallback((value: string) => {
		const trimmed = value.trim();
		if (trimmed.length === 0 || trimmed.length >= 3) {
			setPage(1);
			trigger({ page: 1, limit, search: trimmed });
		}
	}, 500);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
		setPage(1);
		debouncedSearch(event.target.value);
	};

	useEffect(() => {
		trigger({ page, limit });
	}, []);

	return (
		<>
			<Stack direction="row" sx={{ mb: 2 }}>
				<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Attractions</Typography>
				</Stack>
				<Link href={"/attractions/form"}>
					<Button variant="contained">Create attraction</Button>
				</Link>
			</Stack>

			{/* Search */}
			<Card sx={{ p: 2, justifyContent: "space-between", flex: "1 1 auto", width: "100%" }}>
				<OutlinedInput
					value={search}
					onChange={handleSearch}
					fullWidth
					placeholder="Search attraction"
					startAdornment={
						<InputAdornment position="start">
							<SearchOutlinedIcon />
						</InputAdornment>
					}
					endAdornment={
						search && (
							<InputAdornment position="end">
								<IconButton onClick={handleClearSearch} edge="end">
									<HighlightOffOutlinedIcon />
								</IconButton>
							</InputAdornment>
						)
					}
					sx={{ maxWidth: "500px" }}
					style={{ height: 45 }}
				/>
			</Card>

			{/* Table */}
			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<Table sx={{ minWidth: "1300px" }}>
						<TableHead>
							<TableRow>
								<TableCell>Image</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>About</TableCell>
								<TableCell>Slug</TableCell>
								<TableCell>Location</TableCell>
								<TableCell
									sx={{
										position: "sticky",
										right: 0,
										backgroundColor: "white",
										zIndex: 2,
									}}
								>
									Actions
								</TableCell>
							</TableRow>
						</TableHead>
						{!isEmpty(data?.data) && (
							<TableBody>
								{data?.data.map((row: any) => (
									<TableRow hover key={row.id}>
										<TableCell>
											<Avatar src={row.image} alt={row.translation?.name || "Attraction"} variant="rounded" />
										</TableCell>
										<TableCell>{row.translation?.name}</TableCell>
										<TableCell>
											{row.translation?.description?.length > 50
												? `${row.translation?.description.substring(0, 100)}...`
												: row.translation?.description}
										</TableCell>
										<TableCell>
											{row.translation?.about?.length > 50
												? `${row.translation?.about.substring(0, 100)}...`
												: row.translation?.about}
										</TableCell>
										<TableCell style={{ minWidth: 200 }}>{row.slug}</TableCell>
										<TableCell style={{ minWidth: 150 }}>
											<a
												href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
												target="_blank"
												rel="noopener noreferrer"
												style={{ color: "#1976d2", textDecoration: "underline" }}
											>
												View Map
											</a>
										</TableCell>
										<TableCell
											style={{ minWidth: 100, display: "flex", height: "100%" }}
											sx={{
												position: "sticky",
												right: 0,
												backgroundColor: "white",
												zIndex: 1,
												borderLeft: "1px solid rgba(224, 224, 224, 1)",
												bottom: 0,
												height: "100%",
											}}
										>
											<IconButton color="primary" onClick={() => console.log("Update attraction", row.id)}>
												<EditIcon />
											</IconButton>
											<IconButton color="error" onClick={() => console.log("Delete attraction", row.id)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						)}
					</Table>
				</Box>
				<Divider />
				<TablePagination
					component="div"
					count={data?.meta.total || 0}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowCount}
					page={page - 1}
					rowsPerPage={+limit}
					rowsPerPageOptions={[5, 10, 25]}
				/>
			</Card>
		</>
	);
}
