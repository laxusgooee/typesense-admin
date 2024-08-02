import useTypesenseMutation from "./useTypesenseMutation";

type DeleteDocumentsProps = {
	collection: string;
	ids: string[];
};

const useDeleteTypesenseDocuments = () => {

	return useTypesenseMutation({
		mutationFn: async (client, data: DeleteDocumentsProps) => {
			return await client?.collections(data.collection).documents().delete({
				filter_by: `id:[${data.ids.join(',')}]`,
			});
		},
	});
};

export default useDeleteTypesenseDocuments;
