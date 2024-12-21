import { create } from "zustand";
import build from "../utils/dev";

const parseEventDate = (dateString) => {
    return new Date(dateString.replace(" ", "T"));
};

const formatEvents = (events) => {
    return events.map((event) => ({
        ...event,
        start_date: parseEventDate(event.start_date),
        end_date: parseEventDate(event.end_date),
    }));
};

export const useEventsStore = create((set) => ({
    events: [],
    setEvents: (events) => set({ events }),
    fetchEvents: async () => {
        try {
            const response = await fetch(build("event/all"), {
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

            const formattedEvents = formatEvents(data);
            console.log(formattedEvents);

            set({ events: formattedEvents });
        } catch (err) {
            return new Error(err);
        }
    },
}));
