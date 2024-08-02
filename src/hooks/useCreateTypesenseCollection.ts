import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import useTypesenseMutation from "./useTypesenseMutation";

const useCreateTypesenseCollection = () => {
	return useTypesenseMutation({
		mutationFn: async (client, data: CollectionCreateSchema) => {
			return await client?.collections().create(data);
		},
	});
};

export default useCreateTypesenseCollection;
