import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { PlacesForm } from "@/components/dashboard/places/form";

export const metadata = { title: `Update place | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<PlacesForm />
		</Stack>
	);
}
