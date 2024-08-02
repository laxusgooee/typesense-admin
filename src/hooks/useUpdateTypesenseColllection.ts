import useTypesenseMutation from "./useTypesenseMutation";

const useUpdateTypesenseColllection = () => {
	return useTypesenseMutation({
		mutationFn: async (client, { name, schema }: { name: string; schema: any }) => {
			return await client?.collections(name).update(schema);
		},
	});
};

export default useUpdateTypesenseColllection;
