"use client";

import { useRef } from "react";
import { AppStore, makeStore } from "@/store/store";
import { Provider } from "react-redux";

import { setHttpClientStore } from "@/lib/httpClient";

export function StoreProvider({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<AppStore>(undefined);

	if (!storeRef.current) {
		storeRef.current = makeStore();
		setHttpClientStore(storeRef.current);
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
