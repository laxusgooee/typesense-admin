import { useTypesense } from "@/providers/typesenseProvider";
import useTypesenseMutation from "./useTypesenseMutation";

const useUpdateTypesenseColllection = () => {
	const typesense = useTypesense();

	return useTypesenseMutation({
		mutationFn: async ({ name, schema }: { name: string; schema: any }) => {
			return await typesense?.client?.collections(name).update(schema);
		},
	});
};

export default useUpdateTypesenseColllection;
