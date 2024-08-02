import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Node = {
	host: string;
	port: number;
	protocol: string;
	path?: string;
	url?: string;
};

export interface AuthState {
	apiKey: string | null;
	nodes: Node[];
	_hydrated?: boolean;
}

interface AuthActions {
	addNode: (node: Node) => void;
	removeNode: (node: Node) => void;
	setApiKey: (apiKey: string | null) => void;
	deactivate: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
	devtools(
		persist(
			(set) => ({
				nodes: [],
				apiKey: null,
				setApiKey: (apiKey: string | null) => set(() => ({ apiKey })),
				addNode: (node: Node) =>
					set((prevState) => {
						const index = prevState.nodes.findIndex(
							(n) => n.host === node.host && n.port === node.port
						);

						if (index !== -1) {
							return { nodes: prevState.nodes };
						}

						return { nodes: [...prevState.nodes, node] };
					}),
				removeNode: (node: Node) =>
					set((prevState) => {
						const index = prevState.nodes.findIndex(
							(n) => n.host === node.host && n.port === node.port
						);

						prevState.nodes.splice(index, 1);
						return { nodes: prevState.nodes };
					}),
				deactivate: () => set({ apiKey: null, nodes: [] }),
				_hydrated: false,
			}),
			{
				name: "auth-storage",
				partialize: (state) =>
					Object.fromEntries(
						Object.entries(state).filter(
							([key]) => !["_hydrated"].includes(key)
						)
					),
				onRehydrateStorage: (_state) => {
					console.log("hydration starts");
					return (state, error) => {
						if (error) {
							console.log("an error happened during hydration", error);
						} else {
							if (state) {
								state._hydrated = true;
							}

							console.log("hydration finished");
						}
					};
				},
			}
		)
	)
);
