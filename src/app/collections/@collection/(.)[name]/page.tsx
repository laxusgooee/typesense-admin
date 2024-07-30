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
import ViewCollection from "@/components/collections/viewCollection";

export default function Home() {
	const router = useRouter();
	const { isOpen, onOpenChange } = useDisclosure({
		defaultOpen: true,
		onClose: () => {
			router.back();
		},
	});

	return (
		<Modal
			size="4xl"
			scrollBehavior="outside"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				<ModalHeader className="font-bold">Collection</ModalHeader>
				<ModalBody>
					<ViewCollection />
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
