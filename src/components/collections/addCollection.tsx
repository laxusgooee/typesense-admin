"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	Button,
	useDisclosure,
	Input,
	Switch,
	Divider,
	Select,
	SelectItem,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import useCreateTypesenseCollection from "@/hooks/useCreateTypesenseCollection";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";

const FIELDS_TYPES = [
	"string",
	"int32",
	"int64",
	"float",
	"auto",
	"bool",
	"image",
];

const NodeSchema = z.object({
	name: z.string().min(2, { message: "Field name is required" }),
	type: z.string().min(2, { message: "Field type is required" }),
	facet: z.boolean(),
	optional: z.boolean().optional(),
	index: z.boolean().optional(),
});

const CreateCategoryFormSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	fields: z.array(NodeSchema).min(1, { message: "Field is required" }),
	default_sorting_field: z.string().optional(),
});

type CreateCategoryFormInputs = z.infer<typeof CreateCategoryFormSchema>;

function Form({ onSubmit }: { onSubmit: (e?: any) => void }) {
	const {
		register,
		control,
		getValues,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<CreateCategoryFormInputs>({
		resolver: zodResolver(CreateCategoryFormSchema),
		mode: "onBlur",
		values: {
			name: "",
			fields: [
				{
					name: ".*",
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

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="pb-3">
			<div className="space-y-6">
				<div>
					<Input
						autoFocus
						label="Name"
						labelPlacement="outside"
						isInvalid={!!errors.name}
						errorMessage={errors.name?.message}
						placeholder="Enter Collection name"
						{...register("name")}
					/>
				</div>

				<Divider />

				<div className="space-y-1">
					<div className="text-sm font-bold flex justify-between items-center">
						Fields
						<Button
							size="sm"
							variant="light"
							onClick={() => {
								append({
									name: ".*",
									type: "auto",
									facet: false,
								});
							}}
						>
							<PlusIcon className="h-5 w-5" />
						</Button>
					</div>
					<div className="space-y-5">
						{fields.map((field, index) => (
							<div key={field.id} className="flex gap-2">
								<div className="flex-1 space-y-1.5">
									<div>
										<Input
											label="Name"
											isInvalid={!!errors.fields?.[index]?.name}
											errorMessage={errors.fields?.[index]?.name?.message}
											{...register(`fields.${index}.name`)}
										/>
									</div>
									<div>
										<Select label="Type" {...register(`fields.${index}.type`)}>
											{FIELDS_TYPES.map((type) => (
												<SelectItem key={type} value={type}>
													{type}
												</SelectItem>
											))}
										</Select>
									</div>
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
								</div>

								<Button
									size="sm"
									onClick={() => {
										remove(index);
									}}
								>
									<TrashIcon className="h-5 w-5" />
								</Button>
							</div>
						))}
					</div>
				</div>

				<span className="text-sm text-danger-300">
					{errors.fields?.message}
				</span>
			</div>

			<div className="flex justify-end">
				<Button
					type="submit"
					color="primary"
					disabled={isSubmitting || !isDirty}
					className="rounded bg-primary py-2 px-4 text-sm text-white data-[hover]:bg-primary-dark"
				>
					Save changes
				</Button>
			</div>
		</form>
	);
}

export function AddCollection({
	onCollectionCreated,
}: {
	onCollectionCreated?: (collection: CollectionSchema) => void;
}) {
	const createCollectionMutation = useCreateTypesenseCollection();
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const onSubmit: SubmitHandler<CreateCategoryFormInputs> = async (data) => {
		createCollectionMutation.mutate(data, {
			onSuccess: (collection) => {
				toast.success("Collection created successfully");

				if (onCollectionCreated) {
					onCollectionCreated(collection);
				}

				onClose();
			},
			onError: (err) => {
				toast.error(err?.message);
			},
		});
	};

	return (
		<>
			<Button className="flex gap-2" onClick={onOpen}>
				<PlusIcon className="h-5 w-5" />
				<span>Create collection</span>
			</Button>
			<Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					<ModalHeader className="font-bold">Create collection</ModalHeader>
					<ModalBody>
						<Form onSubmit={onSubmit} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
