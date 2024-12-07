import { useEffect } from "react";
import { create } from "zustand";

export const useAdminStore = create((set) => ({
    admin: null,
    setAdmin: (admin) => set({ admin }),
}));

export const useSetAdmin = () => {
    const setAdmin = useAdminStore((state) => state.setAdmin);

    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem("admin"));
        if (admin) {
            setAdmin(admin);
        }
    }, [setAdmin]);
};
