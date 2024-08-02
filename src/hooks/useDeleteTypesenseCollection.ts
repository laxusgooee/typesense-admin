import useTypesenseMutation from "./useTypesenseMutation";

const useDeleteTypesenseCollection = () => {

	return useTypesenseMutation({
		mutationFn: async (client,data: string) => {
			return await client?.collections(data).delete();
		},
	});
};

export default useDeleteTypesenseCollection;
