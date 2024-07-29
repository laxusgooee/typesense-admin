"use client";

import useDeleteTypesenseCollection from "@/hooks/useDeleteTypesenseCollection";
import useGetTypesenseCollection from "@/hooks/useGetTypesenseCollection";
import useUpdateTypesenseColllection from "@/hooks/useUpdateTypesenseColllection";
import { KeyIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	getKeyValue,
	Button,
	Chip,
	Divider,
} from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const columns = [
	{
		key: "name",
		label: "NAME",
	},
	{
		key: "type",
		label: "Type",
	},
	{
		key: "facet",
		label: "Facet",
	},
	{
		key: "actions",
		label: "...",
	},
];

export default function ViewCollection() {
	const router = useRouter();
	const params = useParams<{ name: string }>();

	const deleteMutaion = useDeleteTypesenseCollection();
	const updateMutaion = useUpdateTypesenseColllection();

	const collection = useGetTypesenseCollection(params.name);

	const getKeyCell = (item: any, key: string) => {
		if (key === "name") {
			return (
				<div className="flex gap-2">
					<span>{item.name}</span>
					{item.mame == collection?.data?.default_sorting_field && (
						<KeyIcon className="w-4 h-4" />
					)}
				</div>
			);
		}

		if (key === "actions") {
			return (
				<div className="flex gap-2">
					<Button isIconOnly size="sm" variant="light">
						<PencilIcon className="h-5 w-5" />
					</Button>
					<Button
						isIconOnly
						size="sm"
						color="danger"
						variant="light"
						onClick={() => {
							updateMutaion.mutate({
								name: params.name,
								schema: {
									fields: {},
								},
							});
						}}
					>
						<TrashIcon className="h-5 w-5" />
					</Button>
				</div>
			);
		}

		return getKeyValue(item, key);
	};

	const deleteCollection = async () => {
		if (!(await confirm("Are you sure you want to delete this collection?"))) {
			return;
		}

		deleteMutaion.mutate(params.name, {
			onSuccess: () => {
				router.push("/collections");

				toast.success("Collection deleted successfully");
			},
			onError: (err) => {
				toast.error(err?.message);
			},
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between">
				<h3 className="text-2xl font-semibold capitalize">
					{collection.data?.name}
				</h3>
				<div>
					<Chip>{collection.data?.num_documents} documents</Chip>
				</div>
			</div>

			<Divider />

			<div className="flex gap-2">
				<Table
					selectionMode="multiple"
					aria-label="Collection fields"
					onSelectionChange={(e) => console.log(Array.from(e))}
				>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn key={column.key}>{column.label}</TableColumn>
						)}
					</TableHeader>
					<TableBody items={collection.data?.fields || []}>
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

			<div className="flex gap-2 items-end justify-end">
				<Button color="primary" onClick={deleteCollection}>
					Add field
				</Button>
				<Button
					color="danger"
					isLoading={deleteMutaion.isPending}
					onClick={deleteCollection}
				>
					Delete
				</Button>
			</div>
		</div>
	);
}
