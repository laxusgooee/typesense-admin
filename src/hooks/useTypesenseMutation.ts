import { useState } from "react";
import { Client } from "typesense";
import { useTypesense } from "@/providers/typesenseProvider";

interface TypesenseeMutationProps<F, T> {
	mutationFn: (client: Client | null | undefined, variables: T) => Promise<F>;
}

const useTypesenseMutation = <F, T>({
	mutationFn,
}: TypesenseeMutationProps<F, T>) => {
	const typesense = useTypesense();

	const [data, setData] = useState<any | undefined>(undefined);
	const [error, setError] = useState<any | undefined>(undefined);

	const [status, setStatus] = useState<
		"idle" | "pending" | "success" | "error"
	>("idle");

	const reset = () => {
		setData(undefined);
		setError(undefined);
		setStatus("idle");
	};

	const mutate = async (
		variables: T,
		options?: {
			onSuccess?: (data: F, variables?: T) => void;
			onError?: (err: any, variables?: T) => void;
			onSettled?: (data: F, err: any, variables?: T) => void;
		}
	) => {
		setStatus("pending");

		let res: any;
		let err: any;

		try {
			res = await mutationFn(typesense?.client, variables);

			if (options?.onSuccess) {
				options.onSuccess(res, variables);
			}

			setData(res);
			setStatus("success");
		} catch (error) {
			err = error;

			if (options?.onError) {
				options.onError(err, variables);
			}

			setError(err);
			setStatus("error");
		} finally {
			if (options?.onSettled) {
				options.onSettled(data, err, variables);
			}
		}
	};

	return {
		data,
		error,
		mutate: mutate,
		reset: reset,
		isPending: status === "pending",
		isSuccess: status === "success",
		isError: status === "error",
	};
};

export default useTypesenseMutation;
