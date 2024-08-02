import { useState, useEffect } from "react";
import { StoreApi, UseBoundStore } from "zustand";

const useHydratedStore = <T, F>(
	store: UseBoundStore<StoreApi<T>>,
	callback: (state: T) => F
) => {
	const result = store(callback) as F;
	const [data, setData] = useState<F>();

	useEffect(() => {
		setData(store?.getState() as unknown as F);
	}, [result, store]);

	return data;
};

export default useHydratedStore;
