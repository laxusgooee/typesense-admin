"use client";

import { Client } from "typesense";
import React, { createContext, useContext, useMemo, useState } from "react";

interface ITypesenseContext {
	client: Client | null;
	setClient: (client: Client) => Promise<void>; // React.Dispatch<React.SetStateAction<Client | null>>;
}

const TypesenseContext = createContext<ITypesenseContext | null>(null);

export const useTypesense = () => useContext(TypesenseContext);

export const TypesenseProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [client, setClient] = useState<Client | null>(null);

	const checkClientBeforeSet = async (client: Client) => {
		const res = await client.health.retrieve();

		if (!res?.ok) {
			throw new Error("Typesense client is not healthy");
		}

		setClient(client);
	};

	const obj = useMemo(
		() => ({
			client: client,
			setClient: checkClientBeforeSet,
		}),
		[client]
	);

	return (
		<TypesenseContext.Provider value={obj}>
			{children}
		</TypesenseContext.Provider>
	);
};
