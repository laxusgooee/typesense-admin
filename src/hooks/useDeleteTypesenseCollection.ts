import { useTypesense } from "@/providers/typesenseProvider";
import useTypesenseMutation from "./useTypesenseMutation";

const useDeleteTypesenseCollection = () => {
	const typesense = useTypesense();

	return useTypesenseMutation({
		mutationFn: async (data: string) => {
			return await typesense?.client?.collections(data).delete();
		},
	});
};

export default useDeleteTypesenseCollection;
