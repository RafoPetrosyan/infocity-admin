import * as React from "react";
import { useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import { signOut } from "next-auth/react";

export interface UserPopoverProps {
	anchorEl: Element | null;
	onClose: () => void;
	open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
	const { currentUser } = useAppSelector((state) => state.auth);

	const handleSignOut = useCallback(async (): Promise<void> => {
		await signOut();
		localStorage.removeItem("accessToken");
	}, []);

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
			onClose={onClose}
			open={open}
			slotProps={{ paper: { sx: { width: "240px" } } }}
		>
			<Box sx={{ p: "16px 20px " }}>
				<Typography variant="subtitle1">{`${currentUser?.first_name} ${currentUser?.last_name}`}</Typography>
				<Typography color="text.secondary" variant="body2">
					{currentUser?.email}
				</Typography>
			</Box>
			<Divider />
			<MenuList disablePadding sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}>
				{/*<MenuItem component={RouterLink} href={paths.dashboard.settings} onClick={onClose}>*/}
				{/*	<ListItemIcon>*/}
				{/*		<GearSixIcon fontSize="var(--icon-fontSize-md)" />*/}
				{/*	</ListItemIcon>*/}
				{/*	Settings*/}
				{/*</MenuItem>*/}
				{/*<MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>*/}
				{/*	<ListItemIcon>*/}
				{/*		<UserIcon fontSize="var(--icon-fontSize-md)" />*/}
				{/*	</ListItemIcon>*/}
				{/*	Profile*/}
				{/*</MenuItem>*/}
				<MenuItem onClick={handleSignOut}>
					<ListItemIcon>
						<SignOutIcon fontSize="var(--icon-fontSize-md)" />
					</ListItemIcon>
					Sign out
				</MenuItem>
			</MenuList>
		</Popover>
	);
}
