import { useTypesense } from "@/providers/typesenseProvider";
import { useState } from "react";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";

const useDeleteTypesenseCollection = () => {
	const typesense = useTypesense();

	const [data, setData] = useState<CollectionSchema | undefined>(undefined);
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
		name: string,
		options?: {
			onSuccess?: (data: CollectionSchema | undefined) => void;
			onError?: (err: any) => void;
			onSettled?: (data: any, err: any) => void;
		}
	) => {
		setStatus("pending");

		let res: CollectionSchema | undefined;
		let err: any;

		try {
			res = await typesense?.client?.collections(name).delete();

			if (options?.onSuccess) {
				options.onSuccess(res);
			}

			setData(res);
			setStatus("success");
		} catch (error) {
			err = error;

			if (options?.onError) {
				options.onError(err);
			}

			setError(err);
			setStatus("error");
		} finally {
			if (options?.onSettled) {
				options.onSettled(data, err);
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

export default useDeleteTypesenseCollection;
