import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import { useAdminStore } from "../store/admin";
import build from "../utils/dev";

// eslint-disable-next-line react/prop-types
const CreateProgramModal = ({ isOpen, onClose }) => {
    const { admin } = useAdminStore();
    const [formData, setFormData] = useState({
        cover_image: "",
        program_name: "",
        program_description: "",
        program_objectives: [],
        program_timeline: [],
        program_eligibility: "",
        admin_id: admin?.admin_id || 1,
    });

    const [currentObjective, setCurrentObjective] = useState("");
    const [currentTimelineEvent, setCurrentTimelineEvent] = useState({
        event_name: "",
        date_time: "",
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev,
                    cover_image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const addObjective = () => {
        if (currentObjective.trim() !== "") {
            setFormData((prev) => ({
                ...prev,
                program_objectives: [
                    ...prev.program_objectives,
                    { objective: currentObjective },
                ],
            }));
            setCurrentObjective("");
        }
    };

    const removeObjective = (index) => {
        setFormData((prev) => ({
            ...prev,
            program_objectives: prev.program_objectives.filter(
                (_, idx) => idx !== index
            ),
        }));
    };

    const addTimelineEvent = () => {
        if (currentTimelineEvent.event_name && currentTimelineEvent.date_time) {
            setFormData((prev) => ({
                ...prev,
                program_timeline: [
                    ...prev.program_timeline,
                    currentTimelineEvent,
                ],
            }));
            setCurrentTimelineEvent({ event_name: "", date_time: "" });
        }
    };

    const removeTimelineEvent = (index) => {
        setFormData((prev) => ({
            ...prev,
            program_timeline: prev.program_timeline.filter(
                (_, idx) => idx !== index
            ),
        }));
    };

    const handleTimelineChange = (e) => {
        const { name, value } = e.target;
        setCurrentTimelineEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const key in formData) {
            if (formData[key] === null || formData[key] === "") {
                toast.error("Please fill up all fields");
                return;
            }
        }

        try {
            const response = await fetch(build("program/create"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                toast.error("An error occurred while creating the program");
                return;
            }

            toast.success("Program created successfully");
            setFormData({
                cover_image: "",
                program_name: "",
                program_description: "",
                program_objectives: [],
                program_timeline: [],
                program_eligibility: "",
                admin_id: admin?.admin_id || 1,
            });
            onClose();
        } catch (err) {
            toast.error("An error occurred while creating the program");
            return new Error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <Toaster position="top-center" richColors />
            <div style={styles.modalContainer}>
                <button style={styles.closeButton} onClick={onClose}>
                    <FaTimes size={50} />
                </button>
                <h2 style={styles.header}>Create Program</h2>
                <form style={styles.form}>
                    <label style={styles.label}>
                        Cover Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Program Name
                        <input
                            type="text"
                            name="program_name"
                            value={formData.program_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Program Description
                        <textarea
                            name="program_description"
                            value={formData.program_description}
                            onChange={handleChange}
                            style={styles.textarea}
                        />
                    </label>
                    <label style={styles.label}>
                        Program Objectives
                        <div style={styles.dynamicContainer}>
                            <input
                                type="text"
                                value={currentObjective}
                                onChange={(e) =>
                                    setCurrentObjective(e.target.value)
                                }
                                style={styles.input}
                                placeholder="Add an objective"
                            />
                            <button
                                type="button"
                                onClick={addObjective}
                                style={styles.addButton}
                            >
                                Add Objective
                            </button>
                        </div>
                        <ul style={styles.list}>
                            {formData.program_objectives.map((obj, idx) => (
                                <li key={idx} style={styles.listItem}>
                                    {obj.objective}
                                    <button
                                        type="button"
                                        onClick={() => removeObjective(idx)}
                                        style={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </label>
                    <label style={styles.label}>
                        Program Timeline
                        <div style={styles.dynamicContainer}>
                            <input
                                type="text"
                                name="event_name"
                                value={currentTimelineEvent.event_name}
                                onChange={handleTimelineChange}
                                style={styles.input}
                                placeholder="Event Name"
                            />
                            <input
                                type="datetime-local"
                                name="date_time"
                                value={currentTimelineEvent.date_time}
                                onChange={handleTimelineChange}
                                style={styles.input}
                            />
                            <button
                                type="button"
                                onClick={addTimelineEvent}
                                style={styles.addButton}
                            >
                                Add Event
                            </button>
                        </div>
                        <ul style={styles.list}>
                            {formData.program_timeline.map((event, idx) => (
                                <li key={idx} style={styles.listItem}>
                                    {event.event_name} - {event.date_time}
                                    <button
                                        type="button"
                                        onClick={() => removeTimelineEvent(idx)}
                                        style={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </label>
                    <label style={styles.label}>
                        Program Eligibility
                        <textarea
                            name="program_eligibility"
                            value={formData.program_eligibility}
                            onChange={handleChange}
                            style={styles.textarea}
                            placeholder="Describe eligibility requirements"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={styles.submitButton}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "600px",
        padding: "2rem",
        position: "relative",
        maxHeight: "80vh",
        overflowY: "auto",
    },
    closeButton: {
        position: "absolute",
        top: "1rem",
        right: "1rem",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    header: {
        marginBottom: "1.5rem",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        fontWeight: "bold",
    },
    input: {
        padding: "0.75rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "1rem",
        backgroundColor: "#FFFF",
        color: "#000000",
    },
    textarea: {
        padding: "0.75rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "1rem",
        backgroundColor: "#FFFF",
        minHeight: "80px",
        color: "#000000",
    },
    dynamicContainer: {
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
    },
    list: {
        marginTop: "0.5rem",
        listStyle: "none",
        paddingLeft: 0,
    },
    listItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 0",
        borderBottom: "1px solid #ccc",
    },
    addButton: {
        padding: "0.5rem 1rem",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    removeButton: {
        padding: "0.25rem 0.5rem",
        backgroundColor: "#FF4136",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "0.8rem",
    },
    submitButton: {
        padding: "0.75rem 1.5rem",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#27ae60",
        color: "#fff",
        fontSize: "1rem",
        cursor: "pointer",
    },
};

export default CreateProgramModal;
