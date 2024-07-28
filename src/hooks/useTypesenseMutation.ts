import { useState } from "react";

const useTypesenseMutation = ({ mutationFn }: { mutationFn: any }) => {
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
		variables?: any,
		options?: {
			onSuccess?: (data: any, variables?: any) => void;
			onError?: (err: any, variables?: any) => void;
			onSettled?: (data: any, err: any, variables?: any) => void;
		}
	) => {
		setStatus("pending");

		let res: any;
		let err: any;

		try {
			res = await mutationFn(variables);

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
