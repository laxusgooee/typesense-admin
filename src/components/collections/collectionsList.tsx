"use client";

import useGetTypesenseCollections from "@/hooks/useGetTypesenseCollections";

export default function CollectionsList() {
	const collections = useGetTypesenseCollections();

	return (
		<div>
			{collections?.data?.length ? (
				<ul>
					{collections.data.map((collection) => (
						<li key={collection.name}>{collection.name}</li>
					))}
				</ul>
			) : (
				<div>No collections found</div>
			)}
		</div>
	);
}
