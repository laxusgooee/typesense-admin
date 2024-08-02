"use client";

import { useState } from "react";
import {
	ClipboardDocumentIcon,
	ClockIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Select, SelectItem } from "@nextui-org/react";
import useSearchTypesenseDocuments from "@/hooks/useSearchTypesenseDocuments";
import SearchBar from "@/components/home/searchBar";
import Documents from "@/components/home/documents";

export default function Home() {
	const [query, setQuery] = useState({
		collection: "",
		query: {
			q: "",
			query_by: "",
		},
	});

	const documents = useSearchTypesenseDocuments(query.collection, query.query);

	return (
		<div className="flex flex-col gap-5">
			<SearchBar
				onChange={(collection, query, queryBy) => {
					setQuery({
						collection: collection.name,
						query: {
							q: query,
							query_by: queryBy.join(","),
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
							{documents.data?.found ?? 0}
						</h1>
					</div>

					<div className="flex flex-col gap-2 items-center">
						<span className="flex gap-2 items-center">
							<ClipboardDocumentIcon className="h-5 w-5 text-gray-400" />
							Total
						</span>
						<h1 className="text-2xl font-bold text-primary">
							{documents.data?.out_of ?? 0}
						</h1>
					</div>

					<div className="flex flex-col gap-2 items-center">
						<span className="flex gap-2 items-center">
							<ClockIcon className="h-5 w-5 text-gray-400" />
							Time spent
						</span>
						<h1 className="text-2xl font-bold text-primary">
							{documents.data?.search_time_ms ?? 0}
							<span className="text-sm">ms</span>
						</h1>
					</div>
				</div>

				<div>
					<Select
						label="Select an animal"
						labelPlacement="outside"
						className="max-w-xs w-48"
						defaultSelectedKeys={[""]}
					>
						{[].map((animal: any) => (
							<SelectItem key={animal.value}>{animal.label}</SelectItem>
						))}
					</Select>
				</div>
			</div>

			<Documents
				documents={documents?.data}
				isLoading={documents?.isFetching}
			/>
		</div>
	);
}
