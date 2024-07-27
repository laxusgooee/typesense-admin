"use client";

import Typesense from "typesense";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTypesense } from "@/providers/typesenseProvider";
import { AuthState, useAuthStore } from "@/store/auth";

import { Sidebar } from "../sidebar";

export function AuthenticatedLayout({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const router = useRouter();
	const typesense = useTypesense();
	const { _hydrated, apiKey, nodes } = useAuthStore(
		(state) => state as AuthState
	);

	const [loading, setLoading] = useState(true);

	const checkClient = useCallback(async () => {
		const res = await typesense?.client?.health.retrieve();
		if (res?.ok) {
			return setLoading(false);
		}

		const client = new Typesense.Client({
			nodes: nodes,
			apiKey: apiKey as string,
			connectionTimeoutSeconds: 2,
		});

		typesense?.setClient(client);

		// todo: check health

		return setLoading(false);
	}, [apiKey, nodes, typesense]);

	useEffect(() => {
		setLoading(true);

		if (!_hydrated) {
			return;
		}

		if (!apiKey) {
			router.push("/login");

			return setLoading(false);
		}

		checkClient();
	}, [_hydrated, apiKey, router, checkClient]);

	return (
		<Sidebar>
			{loading && (
				<div className="flex min-h-screen items-center justify-center">
					<p>Loading...</p>
				</div>
			)}
			{_hydrated && children}
		</Sidebar>
	);
}
