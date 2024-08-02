import { useTypesense } from "@/providers/typesenseProvider";
import { useState, useEffect, useRef } from "react";
import { Client } from "typesense";

interface TypesenseQueryProps<F, _E = undefined> {
	queryFn: (client: Client) => Promise<F>;
	enabled?: boolean;
	queryKey?: string[];
}

const useTypesenseQuery = <F, E = undefined>({
	queryFn,
	enabled = true,
	queryKey = [],
}: TypesenseQueryProps<F, E>) => {
	const typesense = useTypesense();

	const ref = useRef<string[] | undefined>(undefined);

	const [data, setData] = useState<F | undefined>(undefined);
	const [error, setError] = useState<E | undefined>(undefined);

	const [status, setStatus] = useState<"pending" | "success" | "error">(
		"pending"
	);

	const [fetchStatus, setFetchStatus] = useState<
		"idle" | "fetching" | "paused"
	>("idle");

	const fetch = async () => {
		ref.current = queryKey;

		setFetchStatus("fetching");
		try {
			const res = await queryFn(typesense?.client as Client);

			setData(res);
			setStatus("success");
		} catch (error) {
			setError(error as E);
			setStatus("error");
		} finally {
			setFetchStatus("idle");
		}
	};

	const refetch = async () => {
		fetch();
	};

	useEffect(() => {
		if (!typesense?.client || !enabled) {
			return;
		}

		const keyChanged = queryKey?.toString() !== ref.current?.toString();

		if (keyChanged) {
			console.log("REFRESH", ref.current);

			fetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [typesense, enabled, queryKey]);

	return {
		data,
		error,
		status,
		fetchStatus,
		isPending: status === "pending",
		isSuccess: status === "success",
		isError: status === "error",
		isFetching: fetchStatus === "fetching",
		refetch: refetch,
	};
};

export default useTypesenseQuery;
