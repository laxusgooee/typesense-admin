"use client";

import useGetTypesenseCollections from "@/hooks/useGetTypesenseCollections";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
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
	  label: "STATUS",
	},
  ];

  const getKeyCell = (item: any, key: string) => {
	if (key === "actions") {
		return (
			<div className="flex items-center gap-2">
				<Link href={`/collections/${item.name}`}>
					View
				</Link>
				<Link href={`/collections/${item.name}/edit`}>
					Edit
				</Link>
			</div>
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
				{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
			</TableHeader>
			<TableBody items={collections?.data ?? []} emptyContent={"No rows to display."}>
				{(item) => (
				<TableRow key={item.name}>
					{(columnKey) => <TableCell>{getKeyCell(item, columnKey as string)}</TableCell>}
				</TableRow>
				)}
			</TableBody>
          </Table>
        </div>
    </div>
  );
}
