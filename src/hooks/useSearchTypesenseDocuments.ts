import useTypesenseQuery from "./useTypesenseQuery";
import { SearchResponse } from "typesense/lib/Typesense/Documents";

const useSearchTypesenseDocuments = (name: string, query: any) => {
	const queryKey = [name, query.q];

	return useTypesenseQuery<SearchResponse<object>>({
		queryKey,
		queryFn: async (client) => {
			return await client?.collections(name).documents().search(query, {
				cacheSearchResultsForSeconds: 60,
			});
		},
		enabled: !!query?.q,
	});
};

export default useSearchTypesenseDocuments;
