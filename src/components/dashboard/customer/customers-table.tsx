"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useLazyGetUsersQuery } from "@/store/users";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
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
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { useDebouncedCallback } from "use-debounce";

export function CustomersTable(): React.JSX.Element {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");
	const [trigger, { data, isLoading, isError }] = useLazyGetUsersQuery();

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
			<Stack direction="row">
				<Stack spacing={1} sx={{ flex: "1 1 auto" }}>
					<Typography variant="h4">Customers</Typography>
				</Stack>
			</Stack>

			<Card sx={{ p: 2 }}>
				<OutlinedInput
					value={search}
					onChange={handleSearch}
					fullWidth
					placeholder="Search customer"
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
				/>
			</Card>

			<Card>
				<Box sx={{ overflowX: "auto" }}>
					<Table sx={{ minWidth: "1300px" }}>
						<TableHead>
							<TableRow>
								<TableCell>Avatar</TableCell>
								<TableCell>First Name</TableCell>
								<TableCell>Last Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell>Locale</TableCell>
								<TableCell>Email Verified</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Signed Up</TableCell>
							</TableRow>
						</TableHead>
						{!isEmpty(data?.data) && (
							<TableBody>
								{data?.data.map((row) => (
									<TableRow hover key={row.id}>
										<TableCell>
											<Avatar src={row.avatar} alt={`${row.first_name} ${row.last_name}`} />
										</TableCell>
										<TableCell>{row.first_name}</TableCell>
										<TableCell>{row.last_name}</TableCell>
										<TableCell>{row.email}</TableCell>
										<TableCell>{row.phone_number || "-"}</TableCell>
										<TableCell>{row.locale || "-"}</TableCell>
										<TableCell>
											{row.email_verified ? (
												<Typography color="success.main">Yes</Typography>
											) : (
												<Typography color="error.main">No</Typography>
											)}
										</TableCell>
										<TableCell>{row.role}</TableCell>
										<TableCell>{dayjs(row.createdAt).format("MMM D, YYYY")}</TableCell>
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
