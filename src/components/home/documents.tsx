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
import { SearchResponse } from "typesense/lib/Typesense/Documents";

const columns = [
	{ key: "name", label: "Name" },
	{ key: "position", label: "Position", allowSorting: true },
	{ key: "parent", label: "Parent" },
];

export default function Documents({
	documents,
	isLoading,
	onSortChange,
	onSelectionChange,
}: {
	documents?: SearchResponse<any>;
	isLoading?: boolean;
	onSelectionChange?: (selectedDocuments: string[]) => void;
	onSortChange?: (sortDescriptor: SortDescriptor) => void;
}) {
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
    const [selectedDocuments, setSelectedDocuments] = useState<Set<any> | 'all'>(new Set([]));

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
            if (selectedDocuments === 'all') {
                onSelectionChange(data.map((hit) => hit.document?.id));
            } else {
                onSelectionChange(Array.from(selectedDocuments));
            }
        }
	}, [selectedDocuments]);

	useEffect(() => {
		if (onSortChange) onSortChange(sortDescriptor);
	}, [sortDescriptor]);

	return (
		<div className="bg-white dark:bg-zinc-900 p-4 rounded-xl">
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
							{column.label}
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
						<TableRow key={(item.document as any).id}>
							{(columnKey) => (
								<TableCell>{getKeyValue(item.document, columnKey)}</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
