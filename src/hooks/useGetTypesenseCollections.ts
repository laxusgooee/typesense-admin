import { CollectionSchema } from "typesense/lib/Typesense/Collection";
import useTypesenseQuery from "./useTypesenseQuery";

const useGetTypesenseCollections = () => {
	return useTypesenseQuery<CollectionSchema[]>({
		queryFn: async (client) => {
			return await client?.collections().retrieve();
		},
	});
};

export default useGetTypesenseCollections;
