'use client';

import Typesense from "typesense";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useTypesense } from "@/providers/typesenseProvider";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Input } from "./input";
import { NodesInput } from "./nodesInput";

const NodeSchema = z.object({
    host: z.string().min(2, { message: "Host is required" }).ip({ version: 'v4' }),
    port: z.number().min(2, { message: "Port is required" }).int(),
    protocol: z.string().min(4, { message: "Protocol is required" }).startsWith('http'),
});

const LoginFormSchema = z.object({
    apiKey: z
      .string({ required_error: "API KEY is required" })
      .min(1, { message: "API KEY is required" }),
    nodes: z.array(NodeSchema).min(1, { message: "Node is required" }),
});

type LoginFormInputs = z.infer<typeof LoginFormSchema>;

export function Login() {
    const router = useRouter();
    const typesense = useTypesense();

    const { addNode, setApiKey }  = useAuthStore();

    const {
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty, isValid },
      } = useForm<LoginFormInputs>({
        resolver: zodResolver(LoginFormSchema),
        mode: "onBlur",
        values: {
            apiKey: '',
            nodes: [{
                host: '185.205.246.174',
                port: 8108,
                protocol: 'http'
            }]
        }
      });

      const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
            const nodes = data.nodes.map((node) => ({
                'host': node.host!,
                'port': node.port!,
                'protocol': node.protocol!}));

            const client = new Typesense.Client({
                'nodes': nodes,
                'apiKey': data.apiKey,
                'connectionTimeoutSeconds': 2
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

            router.push('/');
        } catch (error) {
            console.error(error);
        }
      };

    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="text-center text-2xl font-black">ADMIN</h1>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-6">
                        <div>
                            <label
                            htmlFor="apiKey"
                            className="block text-sm font-medium leading-6 text-gray-900"
                            >
                            API Key
                            </label>
                            <Input
                                id="apiKey"
                                name="apiKey"
                                placeholder="Enter API Key" 
                                control={control}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <label>Nodes:</label>
                                <button
                                    type="button"
                                    className=""
                                    onClick={() => setValue('nodes', [...getValues('nodes'), { host: '', port: 8108, protocol: 'http' }])}
                                    >
                                    Add Node
                                </button>
                            </div>

                            <NodesInput
                                control={control}
                                onRemoveNode={(index: number) => {
                                    const nodes = [...getValues('nodes')];
                                    
                                    nodes.splice(index, 1);
                                    
                                    setValue('nodes', nodes);
                                }}
                            />
                            <span className="text-red-500">{errors.nodes?.message}</span>
                        </div>
                    </div>

                    <div>
                        <button
                        type="submit"
                        disabled={isSubmitting || !isDirty || !isValid}
                        className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm disabled:bg-gray-400 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}