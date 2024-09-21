"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { NodeType, useAuthStore } from "@/store/auth";
import { Input } from "@nextui-org/input";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const NodeSchema = z.object({
	host: z.union([
		z.string().min(2, { message: "Host is required" }),
		z.string().url(),
	]),
	port: z.number({ coerce: true }),
	path: z.string().optional(),
	protocol: z
		.string()
		.min(4, { message: "Protocol is required" })
		.startsWith("http"),
});

const LoginFormSchema = z.object({
	apiKey: z
		.string({ required_error: "API KEY is required" })
		.min(1, { message: "API KEY is required" }),
	type: z.enum(["host", "url"]),
	nodes: z.array(NodeSchema).min(1, { message: "Node is required" }),
});

type LoginFormInputs = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
	const {
		apiKey,
		addNode,
		setApiKey,
		setNodeType,
		deactivate,
		nodeType = "host",
		nodes: nodesState = [
			{
				host: "127.0.0.1",
				port: 8108,
				protocol: "http",
			},
		],
	} = useAuthStore();

	const {
		control,
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<LoginFormInputs>({
		resolver: zodResolver(LoginFormSchema),
		mode: "onBlur",
		values: {
			apiKey: apiKey ?? "",
			type: nodeType,
			nodes: nodesState,
		},
	});

	watch('type');

	const { fields, append, remove } = useFieldArray({
		control,
		name: "nodes",
	});

	const showNodePort = getValues('type') === "host";

	const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
		try {
			deactivate();

			data.nodes.forEach((node) => {
				addNode({
					host: node.host,
					port: node.port,
					protocol: node.protocol,
				});
			});

			setNodeType(data.type);

			setApiKey(data.apiKey);
		} catch (error: any) {
			toast.error(error?.message ?? "Something went wrong");
		}
	};

	return (
		<div className="flex flex-1 flex-col justify-center">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-6">
					<div>
						<Input
							label="API Key"
							labelPlacement="outside"
							placeholder="Enter API Key"
							isRequired
							isInvalid={!!errors.apiKey}
							errorMessage={errors.apiKey?.message}
							{...register("apiKey")}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between gap-2">
							<div className="flex items-center">
								<span className="text-sm font-medium leading-6">Nodes:</span>
								<Dropdown>
									<DropdownTrigger>
										<Button
											variant="light"
											color="primary"
											className="px-1 py-1"
										>
											{showNodePort ? "With Hostname" : "With Url"}
										</Button>
									</DropdownTrigger>
									<DropdownMenu
										aria-label="select node mode"
										variant="light"
										selectionMode="single"
										disallowEmptySelection
										selectedKeys={[getValues('type')]}
										onSelectionChange={(keys) => setValue('type', keys.anchorKey as NodeType)}
									>
										<DropdownItem key="host">With Hostname</DropdownItem>
										<DropdownItem key="url">With Url</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
							<Button
								type="button"
								isIconOnly
								variant="light"
								onClick={() =>
									append({
										host: "",
										port: 8108,
										protocol: "http",
									})
								}
							>
								<PlusIcon className="h-5 w-5" />
							</Button>
						</div>

						<div className="space-y-3">
							{fields.map((field, index) => (
								<div key={field.id} className="grid grid-cols-5 gap-2 items-start">
									<div className="col-span-5 md:col-span-3">
										<Input
											placeholder="Enter Host"
											isInvalid={!!errors.nodes?.[index]?.host}
											errorMessage={errors.nodes?.[index]?.host?.message}
											{...register(`nodes.${index}.host`)}
										/>
									</div>
									<div className="flex gap-2 items-center col-span-5 md:col-span-2">
										{showNodePort && (
											<Input
												placeholder="Enter Port"
												isInvalid={!!errors.nodes?.[index]?.port}
												errorMessage={errors.nodes?.[index]?.port?.message}
												{...register(`nodes.${index}.port`)}
											/>
										)}
										<Input
											placeholder="Enter Protocol"
											isInvalid={!!errors.nodes?.[index]?.protocol}
											errorMessage={errors.nodes?.[index]?.protocol?.message}
											{...register(`nodes.${index}.protocol`)}
										/>
										<Button
											isIconOnly
											type="button"
											variant="light"
											className="pt-2 text-red-500 hover:text-red-700"
											onClick={() => remove(index)}
										>
											<TrashIcon aria-hidden="true" className="h-5 w-5" />
										</Button>
									</div>
								</div>
							))}
						</div>
						<span className="text-red-500">{errors.nodes?.message}</span>
					</div>
				</div>

				<div>
					<Button
						type="submit"
						color="primary"
						disabled={isSubmitting || !isDirty}
						className="w-full"
						isLoading={isSubmitting}
					>
						Login
					</Button>
				</div>
			</form>
		</div>
	);
}