import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { AttractionForm } from "@/components/dashboard/attractions/form";

export const metadata = { title: `Update attraction | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<AttractionForm />
		</Stack>
	);
}
