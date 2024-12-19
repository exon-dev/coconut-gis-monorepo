import { create } from "zustand";
import build from "../utils/dev";

export const useProgramsStore = create((set) => ({
    programs: [],
    adminPrograms: [],
    setAdminPrograms: (adminPrograms) => set({ adminPrograms }),
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

            set({ programs: parsedData });
        } catch (err) {
            return new Error(err);
        }
    },

    fetchAdminPrograms: async (admin_id) => {
        try {
            const response = await fetch(
                build(`program/specific_program/${admin_id}`),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            if (!response.ok) {
                return;
            }
            const data = await response.json();

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

            set({ adminPrograms: parsedData });
        } catch (err) {
            return new Error(err);
        }
    },
}));
