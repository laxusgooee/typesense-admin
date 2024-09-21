"use client";

import Typesense from "typesense";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
	Modal,
	ModalContent,
	ModalBody,
	useDisclosure,
	ModalHeader,
	Spinner,
} from "@nextui-org/react";
import { useTypesense } from "@/providers/typesenseProvider";
import { Node, useAuthStore } from "@/store/auth";

import { LoginForm } from "@/components/_common/login";
import { Sidebar } from "@/components/_common/sidebar";

export function AuthenticatedLayout({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const typesense = useTypesense();

	const { _hydrated, apiKey, nodes, nodeType, setApiKey } = useAuthStore(
		(state) => state
	);

	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);

	const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure({});

	async function setTypesenseClient() {
		try {
			const client = new Typesense.Client({
				nodes: nodes.map(node => {
					if (nodeType === "url") {
						return ({url: `${node.protocol}://${node.host}`}) as Node;
					}
	
					return node;
				}),
				apiKey: apiKey!,
				connectionTimeoutSeconds: 2,
			});

			await typesense!.setClient(client);

			onClose();

			setAuthenticated(true);
		} catch (error: any) {
			setApiKey(null);
			setAuthenticated(false);

			toast.error(error?.message ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!_hydrated) {
			return;
		}

		if (!apiKey) {
			setAuthenticated(false);
			setLoading(false);

			onOpen();
			return;
		}

		setTypesenseClient();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_hydrated, apiKey]);

	return (
		<Sidebar>
			{loading && (
				<div className="flex min-h-screen items-center justify-center">
					<Spinner />
				</div>
			)}

			{authenticated && children}

			<Modal
				size="xl"
				isOpen={isOpen}
				hideCloseButton
				isDismissable={false}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					<ModalHeader className="font-bold">
						Sign in to your instance
					</ModalHeader>
					<ModalBody className="pb-5">
						<LoginForm />
					</ModalBody>
				</ModalContent>
			</Modal>
		</Sidebar>
	);
}
