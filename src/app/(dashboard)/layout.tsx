"use client";

import * as React from "react";
import { useEffect } from "react";
import { setAccessToken, setCurrentUser } from "@/store/auth/reducer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useSession } from "next-auth/react";

import { MainNav } from "@/components/dashboard/layout/main-nav";
import { SideNav } from "@/components/dashboard/layout/side-nav";

interface LayoutProps {
	children: React.ReactNode;
}

const Loader = () => (
	<Box
		sx={{
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: "100vh",
			bgcolor: "var(--mui-palette-background-default)",
		}}
	>
		<CircularProgress size={60} thickness={4.5} />
	</Box>
);

export default function Layout({ children }: LayoutProps): React.JSX.Element {
	const dispatch = useAppDispatch();
	const { data: session, status, update } = useSession();
	const { accessToken } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (!accessToken) return;

		update({ accessToken });
		dispatch(setAccessToken(""));
	}, [accessToken]);

	useEffect(() => {
		if (!session) return;

		// @ts-ignore
		localStorage.setItem("accessToken", session.user.accessToken);
		// @ts-ignore
		localStorage.setItem("refreshToken", session.user.refreshToken);

		const payload = {
			// @ts-ignore
			...session.user,
		};

		// @ts-ignore
		dispatch(setCurrentUser(payload));
	}, [session]);

	if (status === "loading") {
		return <Loader />;
	}

	return (
		<>
			<GlobalStyles
				styles={{
					body: {
						"--MainNav-height": "56px",
						"--MainNav-zIndex": 1000,
						"--SideNav-width": "280px",
						"--SideNav-zIndex": 1100,
						"--MobileNav-width": "320px",
						"--MobileNav-zIndex": 1100,
					},
				}}
			/>
			<Box
				sx={{
					bgcolor: "var(--mui-palette-background-default)",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					minHeight: "100%",
				}}
			>
				<SideNav />
				<Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column", pl: { lg: "var(--SideNav-width)" } }}>
					<MainNav />
					<main>
						<Container maxWidth="xl" sx={{ py: "64px" }}>
							{children}
						</Container>
					</main>
				</Box>
			</Box>
		</>
	);
}
