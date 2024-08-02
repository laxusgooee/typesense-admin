import React from "react";

export default function Layout({
	collection,
	children,
}: Readonly<{
	collection: React.ReactNode;
	children: React.ReactNode;
}>) {
	return (
		<>
			{collection}
			{children}
		</>
	);
}
