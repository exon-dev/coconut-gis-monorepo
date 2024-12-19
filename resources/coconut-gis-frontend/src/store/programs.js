import { create } from "zustand";
import build from "../utils/dev";

export const useProgramsStore = create((set) => ({
    programs: [],
    setPrograms: (programs) => set({ programs }),
    fetchPrograms: async () => {
        try {
            const response = await fetch(build("program/all"), {
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

            console.log("RAW", data);

            const parsedData = data.map((program) => {
                const fixedProgramObjectives = program.program_objectives
                    .replace(/\\n/g, "")
                    .replace(/\\"/g, '"');
                const fixedProgramTimeline = program.program_timeline
                    .replace(/\\n/g, "")
                    .replace(/\\"/g, '"');

                return {
                    ...program,
                    program_objectives: JSON.parse(fixedProgramObjectives),
                    program_timeline: JSON.parse(fixedProgramTimeline),
                };
            });

            console.log(parsedData);

            set({ programs: parsedData });
        } catch (err) {
            return new Error(err);
        }
    },
}));
