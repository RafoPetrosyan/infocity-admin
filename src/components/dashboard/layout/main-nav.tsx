"use client";

import * as React from "react";
import { useAppSelector } from "@/store/hooks";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List";

import { usePopover } from "@/hooks/use-popover";

import { MobileNav } from "./mobile-nav";
import { UserPopover } from "./user-popover";

export function MainNav(): React.JSX.Element {
	const [openNav, setOpenNav] = React.useState<boolean>(false);
	const { currentUser } = useAppSelector((state) => state.auth);

	const userPopover = usePopover<HTMLDivElement>();

	return (
		<React.Fragment>
			<Box
				component="header"
				sx={{
					borderBottom: "1px solid var(--mui-palette-divider)",
					backgroundColor: "var(--mui-palette-background-paper)",
					position: "sticky",
					top: 0,
					zIndex: "var(--mui-zIndex-appBar)",
				}}
			>
				<Stack
					direction="row"
					spacing={2}
					sx={{ alignItems: "center", justifyContent: "space-between", minHeight: "64px", px: 2 }}
				>
					<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
						<IconButton
							onClick={(): void => {
								setOpenNav(true);
							}}
							sx={{ display: { lg: "none" } }}
						>
							<ListIcon />
						</IconButton>
						{/*<Tooltip title="Search">*/}
						{/*	<IconButton>*/}
						{/*		<MagnifyingGlassIcon />*/}
						{/*	</IconButton>*/}
						{/*</Tooltip>*/}
					</Stack>
					<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
						{/*<Tooltip title="Contacts">*/}
						{/*	<IconButton>*/}
						{/*		<UsersIcon />*/}
						{/*	</IconButton>*/}
						{/*</Tooltip>*/}
						{/*<Tooltip title="Notifications">*/}
						{/*	<Badge badgeContent={4} color="success" variant="dot">*/}
						{/*		<IconButton>*/}
						{/*			<BellIcon />*/}
						{/*		</IconButton>*/}
						{/*	</Badge>*/}
						{/*</Tooltip>*/}
						<Avatar onClick={userPopover.handleOpen} ref={userPopover.anchorRef} sx={{ cursor: "pointer" }}>
							{`${currentUser?.first_name[0]}${currentUser?.last_name[0]}`}
						</Avatar>
					</Stack>
				</Stack>
			</Box>
			<UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
			<MobileNav
				onClose={() => {
					setOpenNav(false);
				}}
				open={openNav}
			/>
		</React.Fragment>
	);
}
