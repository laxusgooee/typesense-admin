import { AuthenticatedLayout } from "@/components/_common/authenticatedLayout";
import { AddCollection } from "@/components/collections/addCollection";
import CollectionsList from "@/components/collections/collectionsList";

export default function Home() {
	return (
		<AuthenticatedLayout>
			<div className="grid grid-cols-12 gap-2">
				<div className="col-span-12 flex items-center justify-between gap-2 pb-8">
					<div className="">
						<h2 className="text-3xl font-semibold mb-1">Collections</h2>
						<span className="text-sm text-gray-500">
							Manage your collections
						</span>
					</div>

					<AddCollection />
				</div>

				<div className="col-span-12 rounded shadow p-4 bg-white dark:bg-[#1E293B]">
					<CollectionsList />
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
