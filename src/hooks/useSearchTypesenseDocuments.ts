import useTypesenseQuery from "./useTypesenseQuery";
import { SearchResponse } from "typesense/lib/Typesense/Documents";

const useSearchTypesenseDocuments = (collection: string, query: any) => {
	const queryKey = [collection, query.q, query.sort_by];

	return useTypesenseQuery<SearchResponse<object>>({
		queryKey,
		queryFn: async (client) => {
			return await client?.collections(collection).documents().search(query, {
				cacheSearchResultsForSeconds: 60,
			});
		},
		enabled: !!query?.q,
	});
};

export default useSearchTypesenseDocuments;
