import { useTypesense } from "@/providers/typesenseProvider";
import { useState, useEffect } from "react";
import { Client } from "typesense";

interface TypesenseQueryProps<F> {
	queryFn: (client: Client) => Promise<F>;
}

const useTypesenseQuery = <F>({ queryFn }: TypesenseQueryProps<F>) => {
	const typesense = useTypesense();

	const [data, setData] = useState<F | undefined>(undefined);
	const [error, setError] = useState<any | undefined>(undefined);

	const [status, setStatus] = useState<"pending" | "success" | "error">(
		"pending"
	);

	const [fetchStatus, setFetchStatus] = useState<"idle" | "feching" | "paused">(
		"idle"
	);

	const fetch = async () => {
		setFetchStatus("feching");
		try {
			const res = await queryFn(typesense?.client as Client);

			setData(res);
			setStatus("success");
		} catch (error) {
			setError(error);
			setStatus("error");
		} finally {
			setFetchStatus("idle");
		}
	};

	const refetch = async () => {
		fetch();
	};

	useEffect(() => {
		if (!typesense?.client) {
			return;
		}

		fetch();
	}, [typesense]);

	return {
		data,
		error,
		isPending: status === "pending",
		isSuccess: status === "success",
		isError: status === "error",
		isFetching: fetchStatus === "feching",
		refetch: refetch,
	};
};

export default useTypesenseQuery;
