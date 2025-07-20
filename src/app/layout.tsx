import * as React from "react";
import type { Metadata, Viewport } from "next";
import { ToastContainer } from "react-toastify";

import "@/styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { SessionWrapper } from "@/wrappers/session-wrapper";
import { StoreProvider } from "@/wrappers/store-provider";

import { UserProvider } from "@/contexts/user-context";
import { LocalizationProvider } from "@/components/core/localization-provider";
import { ThemeProvider } from "@/components/core/theme-provider/theme-provider";

export const viewport = { width: "device-width", initialScale: 1 } satisfies Viewport;

export async function generateMetadata(): Promise<Metadata> {
	return {
		robots: {
			index: false,
			follow: false,
		},
		other: {
			"color-scheme": "light",
		},
	};
}

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
	return (
		<html lang="en">
			<body>
				<LocalizationProvider>
					<UserProvider>
						<StoreProvider>
							<SessionWrapper>
								<ThemeProvider>{children}</ThemeProvider>
								<ToastContainer position="top-right" autoClose={3000} />
							</SessionWrapper>
						</StoreProvider>
					</UserProvider>
				</LocalizationProvider>
			</body>
		</html>
	);
}
