import { create } from "zustand";
import build from "../utils/dev";

export const useMarketUpdates = create((set) => ({
    updates: [],
    setMarketUpdates: (updates) => set({ updates }),
    fetchMarketUpdates: async () => {
        try {
            const response = await fetch(build("market/all"), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                return;
            }
            const data = await response.json();

            const parsedData = data.map((item) => ({
                ...item,
                price_per_coconut_kg: JSON.parse(item.price_per_coconut_kg),
                volume_of_coconut: JSON.parse(item.volume_of_coconut),
                top_market: JSON.parse(item.top_market),
            }));

            set({ updates: parsedData });
        } catch (err) {
            return new Error(err);
        }
    },
}));
