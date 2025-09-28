import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { EventCategories } from "@/components/dashboard/eventCategories";

export const metadata = { title: `Event Categories | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<EventCategories />
		</Stack>
	);
}
