import { useTypesense } from "@/providers/typesenseProvider";
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import useTypesenseMutation from "./useTypesenseMutation";

const useCreateTypesenseCollection = () => {
	const typesense = useTypesense();

	return useTypesenseMutation({
		mutationFn: async (data: CollectionCreateSchema) => {
			return await typesense?.client?.collections().create(data);
		},
	});
};

export default useCreateTypesenseCollection;
