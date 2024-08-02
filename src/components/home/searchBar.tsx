"use client";

import { Key, useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
	Autocomplete,
	AutocompleteItem,
	Button,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Input,
} from "@nextui-org/react";
import useGetTypesenseCollections from "@/hooks/useGetTypesenseCollections";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";
import { CogIcon } from "@heroicons/react/24/solid";

type SearchBarProps = {
	onChange?: (
		collection: CollectionSchema,
		query: string,
		queryBy: string[]
	) => void;
};

export default function SearchBar({
	onChange = () => {},
}: Readonly<SearchBarProps>) {
	const [query, setQuery] = useState("");
	const [queryBy, setQueryBy] = useState<Set<string>>(new Set([]));
	const [collection, setCollection] = useState<Key | null | undefined>(null);

	const getCollectionsQuery = useGetTypesenseCollections();

	const collections = useMemo(() => {
		return (
			getCollectionsQuery.data?.map((collection) => ({
				label: collection.name,
				value: collection.name,
			})) || []
		);
	}, [getCollectionsQuery?.data]);

	const collectionFields: string[] = useMemo(() => {
		const seletedCollection = getCollectionsQuery.data?.find(
			(e) => e.name === collection
		);
		return (
			seletedCollection?.fields
				?.filter((field) => ["string", "string[]"].includes(field.type))
				.map((field) => field.name) || []
		);
	}, [collection, getCollectionsQuery?.data]);

	useEffect(() => {
		setQueryBy(new Set(collectionFields));
	}, [collectionFields]);

	useEffect(() => {
		const seletedCollection = getCollectionsQuery.data?.find(
			(e) => e.name === collection
		);

		if (onChange && collection && queryBy.size > 0) {
			onChange(seletedCollection!, query, Array.from(queryBy));
		}
	}, [collection, query, queryBy]);

	return (
		<div className="relative bg-white dark:bg-zinc-900 rounded-lg p-4 space-y-2">
			<div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
				<div className="flex-1 flex flex-col gap-2">
					<Input
						isClearable
						placeholder="Search"
						aria-label="Search"
						value={query}
						startContent={
							<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
						}
						onValueChange={setQuery}
					/>
				</div>
				<div>
					<Autocomplete
						isRequired
						placeholder="Collection"
						className="max-w-xs"
						aria-label="Collection"
						isInvalid={!collection}
						defaultItems={collections}
						defaultSelectedKey={collection as any}
						onSelectionChange={setCollection}
						isLoading={getCollectionsQuery.isFetching}
					>
						{(item) => (
							<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
						)}
					</Autocomplete>
				</div>
			</div>

			<div className="flex items-center justify-end gap-2">
				<div className="flex-1">
					<Button
						size="sm"
						variant="light"
						className="capitalize text-gray-400 dark:text-gray-600"
					>
						<CogIcon className="h-5 w-5 text-gray-400" />
						<span>Advance Settings</span>
					</Button>
				</div>
				{collection && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-400">Search by:</span>
						<Dropdown>
							<DropdownTrigger>
								<Button variant="bordered" className="capitalize">
									{Array.from(queryBy).join(", ")}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Collection fields"
								variant="flat"
								closeOnSelect={false}
								disallowEmptySelection
								selectionMode="multiple"
								selectedKeys={queryBy}
								onSelectionChange={setQueryBy as any}
							>
								{collectionFields.map((field) => (
									<DropdownItem key={field}>{field}</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				)}
			</div>
		</div>
	);
}
