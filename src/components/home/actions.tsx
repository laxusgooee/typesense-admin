"use client";

import { useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";

export default function Actions({
	documents,
	onDelete,
}: {
	documents: string[];
	onDelete?: (action: string) => void;
}) {
	const [action, setAction] = useState<string | undefined>("-");

	const handleClick = () => {
		if (onDelete && action === "Delete") {
			onDelete(action);
		}
	};

	return (
		<div className="flex gap-2 items-end">
			<Select
				label="Action"
				labelPlacement="outside"
				className="max-w-xs w-48"
				variant="bordered"
				size="sm"
				isDisabled={documents.length < 1}
				defaultSelectedKeys={["-"]}
				onSelectionChange={(key) => setAction(key.currentKey)}
			>
				{["-", "Delete", "Update"].map((action) => (
					<SelectItem key={action}>{action}</SelectItem>
				))}
			</Select>
			<Button
				size="sm"
				variant="flat"
				className="capitalize"
				onClick={handleClick}
			>
				Go
			</Button>
		</div>
	);
}
