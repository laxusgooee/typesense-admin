"use client";

import useDeleteTypesenseCollection from "@/hooks/useDeleteTypesenseCollection";
import useGetTypesenseCollection from "@/hooks/useGetTypesenseCollection";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ViewCollection({ name }: { name: string }) {
	const router = useRouter();

	const collection = useGetTypesenseCollection(name);
	const deleteMutaion = useDeleteTypesenseCollection();

	function deletCollection() {
		deleteMutaion.mutate(name, {
			onSuccess: () => {
				toast.success("Collection deleted successfully");

				router.push("/collections");
			},
			onError: (err) => {
				toast.error(err?.message);
			},
		});
	}

	return (
		<div className="space-y-4">
			<div className="flex">
				<span className="text-sm">Name:</span>
				<span className="text-sm">{collection.data?.name}</span>
			</div>

			<div className="flex gap-2">
				<Button
					color="danger"
					isLoading={deleteMutaion.isPending}
					onClick={deletCollection}
				>
					Delete
				</Button>
			</div>
		</div>
	);
}
