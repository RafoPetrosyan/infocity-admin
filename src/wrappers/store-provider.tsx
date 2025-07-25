"use client";

import { useRef } from "react";
import { AppStore, makeStore } from "@/store/store";
import { Provider } from "react-redux";

export function StoreProvider({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<AppStore>(undefined);

	if (!storeRef.current) storeRef.current = makeStore();

	return <Provider store={storeRef.current}>{children}</Provider>;
}
