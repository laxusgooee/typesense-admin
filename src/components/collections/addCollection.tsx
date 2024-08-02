"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";
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
import { COLLECTIONS_FIELDS_TYPES } from "@/constants";

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

function Form({ onSubmit }: { readonly onSubmit: (e?: any) => void }) {
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
		<form onSubmit={handleSubmit(onSubmit)} className="pb-3 space-y-3">
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

				<div>
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
								<div key={field.id} className="flex flex-col gap-3">
									<div className="flex gap-2 w-full">
										<div className="w-full">
											<Input
												label="Name"
												isInvalid={!!errors.fields?.[index]?.name}
												errorMessage={errors.fields?.[index]?.name?.message}
												{...register(`fields.${index}.name`)}
											/>
										</div>
										<div className="w-full">
											<Select
												label="Type"
												{...register(`fields.${index}.type`)}
											>
												{COLLECTIONS_FIELDS_TYPES.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</Select>
										</div>
									</div>

									<div className="flex gap-2 justify-between items-center">
										<div>
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

										<Button
											size="sm"
											isIconOnly
											variant="light"
											onClick={() => {
												remove(index);
											}}
										>
											<TrashIcon className="h-5 w-5" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>

					<span className="text-sm text-danger-300">
						{errors.fields?.message}
					</span>
				</div>

				<Divider />

				<div className="pt-1">
					<Input
						label="Default sorting field"
						labelPlacement="outside"
						isInvalid={!!errors.default_sorting_field}
						errorMessage={errors.default_sorting_field?.message}
						placeholder="Enter default sorting field"
						{...register("default_sorting_field")}
					/>
				</div>
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
	readonly onCollectionCreated?: (collection: CollectionSchema) => void;
}) {
	const createCollectionMutation = useCreateTypesenseCollection();
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const onSubmit: SubmitHandler<CreateCategoryFormInputs> = (data) => {
		createCollectionMutation.mutate(data as CollectionSchema, {
			onSuccess: (collection) => {
				toast.success("Collection created successfully");

				if (onCollectionCreated) {
					onCollectionCreated(collection as CollectionSchema);
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
			<Modal
				size="xl"
				scrollBehavior="outside"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
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
