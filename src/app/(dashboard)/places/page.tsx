import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { Places } from "@/components/dashboard/places";

export const metadata = { title: `Places | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<Places />
		</Stack>
	);
}
