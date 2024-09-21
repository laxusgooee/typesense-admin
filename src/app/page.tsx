"use client";

import { useState } from "react";
import {
	ClipboardDocumentIcon,
	ClockIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import useSearchTypesenseDocuments from "@/hooks/useSearchTypesenseDocuments";
import SearchBar from "@/components/home/searchBar";
import Documents from "@/components/home/documents";
import useDeleteTypesenseDocuments from "@/hooks/useDeleteTypesenseDocuments";
import Actions from "@/components/home/actions";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";

export default function Home() {
	const deleteDocumentsMutation = useDeleteTypesenseDocuments();

	const [query, setQuery] = useState<{
		collection?: CollectionSchema;
		query: {
			q: string;
			query_by: string;
			sort_by: string;
		};
	}>({
		collection: undefined,
		query: {
			q: "",
			query_by: "",
			sort_by: "",
		},
	});

	const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

	const getDocumentsQuery = useSearchTypesenseDocuments(
		query.collection?.name ?? '',
		query.query
	);

	const deleteDocuments = async () => {
		try {
			await deleteDocumentsMutation.mutate({
				collection: query.collection!.name,
				ids: selectedDocuments,
			});

			getDocumentsQuery.refetch();

			toast.success(
				"Documents deleted successfully, it may take a few seconds to reflect"
			);
		} catch (error: any) {
			toast.error(error.message);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<SearchBar
				onChange={(collection, query, queryBy) => {
					setQuery({
						collection: collection,
						query: {
							q: query,
							query_by: queryBy.join(","),
							sort_by: "",
						},
					});
				}}
			/>

			<div className="md:flex gap-4 justify-between hidden">
				<div className="flex gap-12">
					<div className="flex flex-col gap-2 items-center">
						<span className="flex gap-2 items-center">
							<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
							Hits
						</span>
						<h1 className="text-2xl font-bold text-primary">
							{getDocumentsQuery.data?.found ?? 0}
						</h1>
					</div>

					<div className="flex flex-col gap-2 items-center">
						<span className="flex gap-2 items-center">
							<ClipboardDocumentIcon className="h-5 w-5 text-gray-400" />
							Total
						</span>
						<h1 className="text-2xl font-bold text-primary">
							{getDocumentsQuery.data?.out_of ?? 0}
						</h1>
					</div>

					<div className="flex flex-col gap-2 items-center">
						<span className="flex gap-2 items-center">
							<ClockIcon className="h-5 w-5 text-gray-400" />
							Time spent
						</span>
						<h1 className="text-2xl font-bold text-primary">
							{getDocumentsQuery.data?.search_time_ms ?? 0}
							<span className="text-sm">ms</span>
						</h1>
					</div>
				</div>

				<Actions documents={selectedDocuments} onDelete={deleteDocuments} />
			</div>

			<Documents
				collection={query.collection}
				documents={getDocumentsQuery?.data}
				isLoading={getDocumentsQuery?.isFetching}
				onSelectionChange={setSelectedDocuments}
				onSortChange={(sortDescriptor) => {
					setQuery({
						collection: query.collection,
						query: {
							...query.query,
							sort_by: `${sortDescriptor.column}:${sortDescriptor.direction === "ascending" ? "asc" : "desc"}`,
						},
					});
				}}
			/>
		</div>
	);
}
