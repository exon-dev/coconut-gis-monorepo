import { create } from "zustand";
import build from "../utils/dev";

export const useBarangays = create((set) => ({
    barangays: [],
    setBarangays: (barangays) => set({ barangays }),
    fetchBarangays: async () => {
        try {
            const response = await fetch(build("barangay/all"), {
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
            set({ barangays: data });
        } catch (err) {
            return new Error(err);
        }
    },
}));
