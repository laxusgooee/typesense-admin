"use client";

import useGetTypesenseCollections from "@/hooks/useGetTypesenseCollections";
import { CogIcon } from "@heroicons/react/24/solid";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
	Button,
} from "@nextui-org/react";
import Link from "next/link";

export default function CollectionsList() {
	const collections = useGetTypesenseCollections();

	const columns = [
		{
			key: "name",
			label: "NAME",
		},
		{
			key: "num_documents",
			label: "COLLECTION SIZE",
		},
		{
			key: "created_at",
			label: "CREATED AT",
		},
		{
			key: "actions",
			label: "...",
		},
	];

	const getKeyCell = (item: any, key: string) => {
		if (key === "actions") {
			return (
				<Button
					as={Link}
					size="sm"
					color="default"
					variant="flat"
					href={`/collections/${item.name}`}
				>
					<CogIcon className="h-5 w-5" />
					Settings
				</Button>
			);
		}

		if (key === "created_at") {
			return new Date(item.created_at).toLocaleString();
		}

		return getKeyValue(item, key);
	};

	return (
		<div>
			<div>
				<Table aria-label="Example static collection table">
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn key={column.key}>{column.label}</TableColumn>
						)}
					</TableHeader>
					<TableBody
						items={collections?.data ?? []}
						emptyContent={"No rows to display."}
					>
						{(item) => (
							<TableRow key={item.name}>
								{(columnKey) => (
									<TableCell>{getKeyCell(item, columnKey as string)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
