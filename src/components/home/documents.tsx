"use client";

import {
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
	SortDescriptor,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";
import { SearchResponse } from "typesense/lib/Typesense/Documents";

export default function Documents({
	collection,
	documents,
	isLoading,
	onSortChange,
	onSelectionChange,
}: Readonly<{
	collection?: CollectionSchema;
	documents?: SearchResponse<any>;
	isLoading?: boolean;
	onSelectionChange?: (selectedDocuments: string[]) => void;
	onSortChange?: (sortDescriptor: SortDescriptor) => void;
}>) {
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
	const [selectedDocuments, setSelectedDocuments] = useState<Set<any> | "all">(
		new Set([])
	);

	const columns: any[] = useMemo(
		() =>
			(collection?.fields ?? [])
				.filter((field) => field.type !== "auto")
				.map((field) => {
					return {
						key: field.name,
						label: field.name.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase(),
						allowSorting: field.sort,
					};
				}),
		[collection]
	);

	const data = useMemo(() => {
		return documents?.hits ?? [];
	}, [documents?.hits]);

	const currentPage = useMemo(() => {
		return documents?.page ?? 1;
	}, [documents?.page]);

	const perPage = useMemo(() => {
		return documents?.request_params?.per_page ?? 10;
	}, [documents?.request_params?.per_page]);

	const totalPages = useMemo(() => {
		return Math.ceil((documents?.out_of ?? 1) / perPage);
	}, [documents?.out_of, perPage]);

	useEffect(() => {
		setSelectedDocuments(new Set([]));
	}, [documents?.hits]);

	useEffect(() => {
		if (onSelectionChange) {
			if (selectedDocuments === "all") {
				onSelectionChange(data.map((hit) => hit.document?.id));
			} else {
				onSelectionChange(Array.from(selectedDocuments));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDocuments]);

	useEffect(() => {
		if (onSortChange) onSortChange(sortDescriptor);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortDescriptor]);

	return (
		<div className="bg-white dark:bg-zinc-900 p-4 rounded-xl">
			{collection && (
				<Table
					removeWrapper
					aria-label="documents"
					selectionMode="multiple"
					sortDescriptor={sortDescriptor}
					onSortChange={setSortDescriptor}
					onSelectionChange={setSelectedDocuments as any}
					bottomContent={
						<div className="flex justify-between gap-2">
							<div>
								<Select
									className="w-20"
									aria-label="Select page size"
									defaultSelectedKeys={[perPage.toString()]}
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
								initialPage={currentPage}
							/>
						</div>
					}
				>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn key={column.key} allowsSorting={column.allowSorting}>
								<span className="capitalize">{column.label}</span>
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						isLoading={isLoading}
						emptyContent={"No rows to display."}
						items={data}
						loadingContent={<Spinner />}
					>
						{(item) => (
							<TableRow key={item.document.id}>
								{(columnKey) => (
									<TableCell>{getKeyValue(item.document, columnKey)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
