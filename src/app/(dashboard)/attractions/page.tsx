import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { Attractions } from "@/components/dashboard/attractions";

export const metadata = { title: `Attractions | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<Attractions />
		</Stack>
	);
}
