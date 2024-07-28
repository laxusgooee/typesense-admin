import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";

export interface CollectionsState {
	data: CollectionSchema[];
}

interface CollectionsActions {
	setCollections: (collections: CollectionSchema[]) => void;
	addCollection: (collection: CollectionSchema) => void;
	removeCollection: (collection: CollectionSchema) => void;
}

export const useCollectionsStore = create<
	CollectionsState & CollectionsActions
>()(
	devtools(
		persist(
			(set) => ({
				data: [],
				setCollections: (collections: CollectionSchema[]) =>
					set(() => ({ data: collections })),
				addCollection: (collection: CollectionSchema) =>
					set((prevState) => {
						const index = prevState.data.findIndex(
							(n) => n.name === collection.name
						);

						if (index !== -1) {
							return { data: prevState.data };
						}

						return { data: [...prevState.data, collection] };
					}),
				removeCollection: (collection: CollectionSchema) =>
					set((prevState) => {
						const index = prevState.data.findIndex(
							(n) => n.name === collection.name
						);

						prevState.data.splice(index, 1);
						return { data: prevState.data };
					}),
			}),
			{
				name: "collections-storage",
				partialize: (state) =>
					Object.fromEntries(
						Object.entries(state).filter(([key]) => ![""].includes(key))
					),
			}
		)
	)
);
