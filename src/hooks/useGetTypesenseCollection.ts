import { CollectionSchema } from "typesense/lib/Typesense/Collection";
import useTypesenseQuery from "./useTypesenseQuery";

const useGetTypesenseCollection = (name: string) => {
	return useTypesenseQuery<CollectionSchema>({
		queryFn: async (client) => {
			return await client?.collections(name).retrieve();
		},
	});
};

export default useGetTypesenseCollection;
