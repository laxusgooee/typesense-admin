"use client";

import { Spinner } from "@nextui-org/react";
import { AddCollection } from "@/components/collections/addCollection";
import CollectionsList from "@/components/collections/collectionsList";
import useGetTypesenseCollections from "@/hooks/useGetTypesenseCollections";

export default function Home() {
	const getCollectionsQuery = useGetTypesenseCollections();

	return (
		<div className="grid grid-cols-12 gap-2">
			<div className="col-span-12 flex items-center justify-between gap-2 pb-5">
				<div className="">
					<h2 className="text-3xl font-semibold mb-1">Collections</h2>
					<span className="text-sm text-gray-500">Manage your collections</span>
				</div>

				<AddCollection
					onCollectionCreated={() => getCollectionsQuery?.refetch()}
				/>
			</div>

			<div className="relative col-span-12">
				<CollectionsList data={getCollectionsQuery?.data} />

				{getCollectionsQuery?.isFetching && (
					<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
						<Spinner />
					</div>
				)}
			</div>
		</div>
	);
}
