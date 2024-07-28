"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
	Modal,
	ModalContent,
	ModalBody,
	useDisclosure,
	ModalHeader,
} from "@nextui-org/react";
import { useParams } from "next/navigation";
import ViewCollection from "@/components/collections/viewCollection";

export default function Home() {
	const params = useParams<{ name: string }>();

	const router = useRouter();
	const { isOpen, onOpenChange } = useDisclosure({
		defaultOpen: true,
		onClose: () => {
			router.back();
		},
	});

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					<ModalHeader className="font-bold">Collection</ModalHeader>
					<ModalBody>
						<ViewCollection name={params.name} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
