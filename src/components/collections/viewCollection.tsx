"use client";

import { COLLECTIONS_FIELDS_TYPES } from "@/constants";
import useDeleteTypesenseCollection from "@/hooks/useDeleteTypesenseCollection";
import useGetTypesenseCollection from "@/hooks/useGetTypesenseCollection";
import useUpdateTypesenseColllection from "@/hooks/useUpdateTypesenseColllection";
import {
	CheckIcon,
	KeyIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
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
	Input,
	Select,
	SelectItem,
	Switch,
} from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
	CollectionDropFieldSchema,
	CollectionFieldSchema,
} from "typesense/lib/Typesense/Collection";
import { z } from "zod";

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
		key: "optional",
		label: "Optional",
	},
	{
		key: "actions",
		label: "...",
	},
];

const NodeSchema = z.object({
	name: z.string().min(2, { message: "Field name is required" }),
	type: z.string().min(2, { message: "Field type is required" }),
	facet: z.boolean(),
	optional: z.boolean().optional(),
	index: z.boolean().optional(),
});

const CreateCategoryFormSchema = z.object({
	fields: z.array(NodeSchema).min(1, { message: "Field is required" }),
});

type CreateCategoryFormInputs = z.infer<typeof CreateCategoryFormSchema>;

export default function ViewCollection() {
	const router = useRouter();

	const params = useParams<{ name: string }>();

	const deleteMutaion = useDeleteTypesenseCollection();
	const updateMutaion = useUpdateTypesenseColllection();

	const collection = useGetTypesenseCollection(params.name);

	const {
		register,
		control,
		getValues,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CreateCategoryFormInputs>({
		resolver: zodResolver(CreateCategoryFormSchema),
		mode: "onBlur",
		values: {
			fields: [
				{
					name: "",
					type: "auto",
					facet: false,
				},
			],
		},
	});

	const { fields, append, update, remove } = useFieldArray({
		control,
		name: "fields",
	});

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

		if (key === "facet") {
			return item.facet ? (
				<CheckIcon className="w-4 h-4" />
			) : (
				<XMarkIcon className="w-4 h-4" />
			);
		}

		if (key === "optional") {
			return item.optional ? (
				<CheckIcon className="w-4 h-4" />
			) : (
				<XMarkIcon className="w-4 h-4" />
			);
		}

		if (key === "actions") {
			return (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						color="danger"
						variant="light"
						onClick={() => {
							updateCollection({
								fields: [
									{
										name: item.name,
										drop: true,
									},
								],
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

	const updateCollection = (data: { fields: any[] }) => {
		const fieldsToDrop: CollectionFieldSchema[] = [];

		data.fields.forEach((field) => {
			if (
				!field.drop &&
				(collection.data?.fields ?? []).find((f) => f.name === field.name)
			) {
				fieldsToDrop.push(field);
			}
		});

		const fields = fieldsToDrop
			.map(
				(field) =>
					({
						name: field.name,
						drop: true,
					}) as unknown
			)
			.concat(data.fields);

		updateMutaion.mutate(
			{
				name: params.name,
				schema: {
					fields,
				},
			},
			{
				onSuccess: () => {
					toast.success("Collection updated successfully");

					collection.refetch();

					reset();
				},
				onError: (err) => {
					toast.error(err?.message);
				},
			}
		);
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
		<form onSubmit={handleSubmit(updateCollection)} className="space-y-4">
			<div className="flex justify-between">
				<h3 className="text-2xl font-semibold capitalize flex gap-2 items-center">
					{collection.data?.name}
					<Chip>{collection.data?.num_documents} documents</Chip>
				</h3>
				<div></div>
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

			<div className="bg-white p-4 space-y-3 divide-y">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="pt-3 flex gap-2 items-center justify-between"
					>
						<div>
							<Input
								label="Name"
								labelPlacement="outside"
								isInvalid={!!errors.fields?.[index]?.name}
								errorMessage={errors.fields?.[index]?.name?.message}
								{...register(`fields.${index}.name`)}
							/>
						</div>
						<div>
							<Select
								label="Type"
								labelPlacement="outside"
								{...register(`fields.${index}.type`)}
								className="min-w-32"
							>
								{COLLECTIONS_FIELDS_TYPES.map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
							</Select>
						</div>
						<div className="space-y-2">
							<span>Options</span>
							<div className="flex gap-2">
								<Switch
									isSelected={getValues(`fields.${index}.facet`)}
									onValueChange={(value) => {
										update(index, {
											...getValues(`fields.${index}`),
											facet: value,
										});
									}}
								>
									Facet
								</Switch>
								<Switch
									isSelected={getValues(`fields.${index}.optional`)}
									onValueChange={(value) => {
										update(index, {
											...getValues(`fields.${index}`),
											optional: value,
										});
									}}
								>
									Optional
								</Switch>
							</div>
						</div>

						<Button
							size="sm"
							isIconOnly
							onClick={() => {
								remove(index);
							}}
						>
							<TrashIcon className="h-5 w-5" />
						</Button>
					</div>
				))}
			</div>

			<div className="flex gap-2 items-center justify-between">
				<div className="flex gap-2">
					<Button type="submit" color="primary" isDisabled={isSubmitting}>
						Save
					</Button>
					<Button
						color="primary"
						onClick={() => {
							append({
								name: "",
								type: "auto",
								facet: false,
							});
						}}
					>
						Add field
					</Button>
				</div>
				<Button
					color="danger"
					isLoading={deleteMutaion.isPending}
					onClick={deleteCollection}
				>
					Delete Collection
				</Button>
			</div>
		</form>
	);
}
