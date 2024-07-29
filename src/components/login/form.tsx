"use client";

import Typesense from "typesense";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useTypesense } from "@/providers/typesenseProvider";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const NodeSchema = z.object({
	host: z
		.string()
		.min(2, { message: "Host is required" })
		.ip({ version: "v4" }),
	port: z.number().min(2, { message: "Port is required" }).int(),
	protocol: z
		.string()
		.min(4, { message: "Protocol is required" })
		.startsWith("http"),
});

const LoginFormSchema = z.object({
	apiKey: z
		.string({ required_error: "API KEY is required" })
		.min(1, { message: "API KEY is required" }),
	nodes: z.array(NodeSchema).min(1, { message: "Node is required" }),
});

type LoginFormInputs = z.infer<typeof LoginFormSchema>;

export function LoginForm() {
	const router = useRouter();
	const typesense = useTypesense();

	const { addNode, setApiKey } = useAuthStore();

	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<LoginFormInputs>({
		resolver: zodResolver(LoginFormSchema),
		mode: "onBlur",
		values: {
			apiKey: "",
			nodes: [
				{
					host: "127.0.0.1",
					port: 8108,
					protocol: "http",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "nodes",
	});

	const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
		try {
			const nodes = data.nodes.map((node) => ({
				host: node.host!,
				port: node.port!,
				protocol: node.protocol!,
			}));

			const client = new Typesense.Client({
				nodes: nodes,
				apiKey: data.apiKey,
				connectionTimeoutSeconds: 2,
			});

			await typesense?.setClient(client);

			nodes.forEach((node) => {
				addNode({
					host: node.host,
					port: node.port,
					protocol: node.protocol,
				});
			});

			setApiKey(data.apiKey);

			router.push("/");
		} catch (error: any) {
			toast.error(error?.message ?? "Something went wrong");
		}
	};

	return (
		<div className="flex flex-1 flex-col justify-center px-5">
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
							<label className="text-sm font-medium leading-6">Nodes:</label>
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
								<div key={field.id} className="grid grid-cols-5 gap-2">
									<div className="col-span-5 md:col-span-3">
										<Input
											placeholder="Enter Host"
											isInvalid={!!errors.nodes?.[index]?.host}
											errorMessage={errors.nodes?.[index]?.host?.message}
											{...register(`nodes.${index}.host`)}
										/>
									</div>
									<div className="flex gap-2 items-center col-span-5 md:col-span-2">
										<Input
											placeholder="Enter Port"
											isInvalid={!!errors.nodes?.[index]?.port}
											errorMessage={errors.nodes?.[index]?.port?.message}
											{...register(`nodes.${index}.port`)}
										/>
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
