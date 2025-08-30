import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import { config } from "@/config";
import { EmotionsTable } from "@/components/dashboard/emotions/emotions-table";

export const metadata = { title: `Emotions | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
	return (
		<Stack spacing={3}>
			<EmotionsTable />
		</Stack>
	);
}
