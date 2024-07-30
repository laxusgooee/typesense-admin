"use client";

import { AuthenticatedLayout } from "@/components/_common/authenticatedLayout";
import useSearchTypesenseDocuments from "@/hooks/useSearchTypesenseDocuments";
import {
	ClipboardDocumentIcon,
	ClockIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
	Autocomplete,
	AutocompleteItem,
	Input,
	Select,
	SelectItem,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
	Pagination,
	Spinner,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

const columns = [
	{ key: "name", label: "Name" },
	{ key: "position", label: "Position", allowSorting: true },
	{ key: "parent", label: "Parent" },
];

const animals = [
	{
		label: "Cat",
		value: "cat",
		description: "The second most popular pet in the world",
	},
	{
		label: "Dog",
		value: "dog",
		description: "The most popular pet in the world",
	},
	{
		label: "Elephant",
		value: "elephant",
		description: "The largest land animal",
	},
	{ label: "Lion", value: "lion", description: "The king of the jungle" },
	{ label: "Tiger", value: "tiger", description: "The largest cat species" },
	{
		label: "Giraffe",
		value: "giraffe",
		description: "The tallest land animal",
	},
	{
		label: "Dolphin",
		value: "dolphin",
		description: "A widely distributed and diverse group of aquatic mammals",
	},
	{
		label: "Penguin",
		value: "penguin",
		description: "A group of aquatic flightless birds",
	},
	{
		label: "Zebra",
		value: "zebra",
		description: "A several species of African equids",
	},
	{
		label: "Shark",
		value: "shark",
		description:
			"A group of elasmobranch fish characterized by a cartilaginous skeleton",
	},
	{
		label: "Whale",
		value: "whale",
		description: "Diverse group of fully aquatic placental marine mammals",
	},
	{
		label: "Otter",
		value: "otter",
		description: "A carnivorous mammal in the subfamily Lutrinae",
	},
	{
		label: "Crocodile",
		value: "crocodile",
		description: "A large semiaquatic reptile",
	},
];

export default function Home() {
	const [query, setQuery] = useState("");

	const documents = useSearchTypesenseDocuments("categories", {
		q: query,
		query_by: "name",
	});

	const totalPages = useMemo(() => {
		return Math.ceil(
			documents.data?.out_of ??
				1 / (documents.data?.request_params?.per_page ?? 10)
		);
	}, [documents.data?.out_of]);

	return (
		<AuthenticatedLayout>
			<div className="flex flex-col gap-5">
				<div className="relative flex bg-white dark:bg-zinc-900 rounded-lg p-4 items-center gap-2 md:gap-4">
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
							onClear={() => console.log("input cleared")}
						/>
					</div>
					<div>
						<Autocomplete
							placeholder="Collection"
							className="max-w-xs"
							aria-label="Collection"
							defaultItems={animals}
						>
							{(item) => (
								<AutocompleteItem key={item.value}>
									{item.label}
								</AutocompleteItem>
							)}
						</Autocomplete>
					</div>
				</div>

				<div className="flex gap-4 justify-between">
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
							defaultSelectedKeys={["dog"]}
						>
							{animals.map((animal) => (
								<SelectItem key={animal.value}>{animal.label}</SelectItem>
							))}
						</Select>
					</div>
				</div>

				<div className="bg-white dark:bg-zinc-900 p-4 rounded-xl">
					<Table
						removeWrapper
						aria-label="documents"
						selectionMode="multiple"
						sortDescriptor={{
							column: "position",
							direction: "descending",
						}}
						onSortChange={(e) => console.log("sort changed", e)}
						bottomContent={
							<div className="flex justify-between gap-2">
								<div>
									<Select
										className="w-20"
										aria-label="Select page size"
										defaultSelectedKeys={[
											(
												documents.data?.request_params?.per_page ?? 10
											).toString(),
										]}
									>
										{["10", "20", "30", "40", "50"].map((pageSize) => (
											<SelectItem key={pageSize}>{pageSize}</SelectItem>
										))}
									</Select>
								</div>
								<Pagination
									isCompact
									showControls
									total={totalPages}
									initialPage={documents.data?.page ?? 1}
								/>
							</div>
						}
					>
						<TableHeader columns={columns}>
							{(column) => (
								<TableColumn
									key={column.key}
									allowsSorting={column.allowSorting}
								>
									{column.label}
								</TableColumn>
							)}
						</TableHeader>
						<TableBody
							isLoading={documents.isFetching}
							emptyContent={"No rows to display."}
							items={documents.data?.hits ?? []}
							loadingContent={<Spinner />}
						>
							{(item) => (
								<TableRow key={item.document.id}>
									{(columnKey) => (
										<TableCell>
											{getKeyValue(item.document, columnKey)}
										</TableCell>
									)}
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
