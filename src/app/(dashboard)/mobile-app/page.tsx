import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { Mobile } from "@/components/dashboard/mobile";

export const metadata = { title: `Mobile app | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<Mobile />
		</Stack>
	);
}
