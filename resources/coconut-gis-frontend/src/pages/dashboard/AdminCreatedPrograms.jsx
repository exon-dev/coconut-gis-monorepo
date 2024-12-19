import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgramsStore } from "../../store/programs";
import { useAdminStore } from "../../store/admin";
import { FaTimes, FaTrash } from "react-icons/fa";
import { toast, Toaster } from "sonner";
import build from "../../utils/dev";

const AdminCreatedPrograms = () => {
    const { admin } = useAdminStore();
    const { adminPrograms, fetchAdminPrograms } = useProgramsStore();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [programToDelete, setProgramToDelete] = useState(null);

    useEffect(() => {
        fetchAdminPrograms(admin?.admin_id || 0);
    }, [fetchAdminPrograms, admin]);

    const handleDelete = async () => {
        if (programToDelete) {
            try {
                const response = await fetch(
                    build(`program/delete/${programToDelete.program_id}`),
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (!response.ok) {
                    toast.error("Failed to delete program. Please try again");
                    throw new Error("Failed to delete program");
                }

                toast.success("Program deleted successfully");
                fetchAdminPrograms(admin?.admin_id || 0);
                setShowDeleteModal(false);
            } catch (err) {
                toast.error("Failed to delete program");
                throw new Error(err);
            }
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Created Programs</h2>
            <div style={styles.grid}>
                {adminPrograms?.length > 0 ? (
                    adminPrograms.map((program, idx) => (
                        <motion.div
                            key={idx}
                            style={styles.card}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img
                                src={program.cover_image}
                                alt={program.program_name}
                                style={styles.image}
                            />
                            <div style={styles.cardContent}>
                                <div style={styles.iconContainer}>
                                    {program.icon}
                                </div>
                                <h3 style={styles.programName}>
                                    {program.program_name}
                                </h3>
                                <p style={styles.description}>
                                    {program.program_description?.slice(0, 100)}
                                    ...
                                </p>
                                {program.objectives?.length > 0 && (
                                    <ul style={styles.objectivesList}>
                                        {program.objectives.map(
                                            (objective, objIdx) => (
                                                <li
                                                    key={objIdx}
                                                    style={styles.objectiveItem}
                                                >
                                                    {objective}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                                <div style={styles.buttons}>
                                    <Link
                                        to={`/dashboard/programs/${program.program_id}`}
                                        style={styles.viewButton}
                                    >
                                        View Program
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setProgramToDelete(program);
                                            setShowDeleteModal(true);
                                        }}
                                        style={styles.deleteButton}
                                    >
                                        <FaTrash size={25} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <h1>No programs created</h1>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={styles.overlay}>
                    <Toaster position="top-center" richColors />
                    <div style={styles.modalContainer}>
                        <button
                            style={styles.closeButton}
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <FaTimes size={15} />
                        </button>
                        <h2>Are you sure you want to delete this program?</h2>
                        <div style={styles.modalButtons}>
                            <button
                                onClick={handleDelete}
                                style={styles.confirmButton}
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Program Modal */}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        paddingTop: "6rem",
    },
    header: {
        textAlign: "center",
        marginBottom: "2rem",
        fontSize: "2.5rem",
        color: "#2c3e50",
        fontWeight: "bold",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1.5rem",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    image: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
    },
    cardContent: {
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    },
    iconContainer: {
        marginBottom: "0.5rem",
    },
    programName: {
        fontSize: "1.25rem",
        fontWeight: "bold",
        marginBottom: "0.5rem",
        color: "#2c3e50",
    },
    description: {
        fontSize: "1rem",
        marginBottom: "1rem",
        color: "#555",
    },
    objectivesList: {
        listStyleType: "disc",
        paddingLeft: "1.5rem",
        marginBottom: 0,
        color: "#555",
    },
    objectiveItem: {
        marginBottom: "0.5rem",
        fontSize: "0.9rem",
    },
    buttons: {
        display: "flex",
        gap: "1rem",
    },
    viewButton: {
        backgroundColor: "#3498db",
        color: "#fff",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        textDecoration: "none",
    },
    updateButton: {
        backgroundColor: "#f39c12",
        color: "#fff",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
    },
    deleteButton: {
        backgroundColor: "#e74c3c",
        color: "#fff",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
    },
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
        borderRadius: "50%",
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
    confirmButton: {
        padding: "0.5rem 1rem",
        backgroundColor: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "0.5rem 1rem",
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
    modalButtons: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
    },
};

export default AdminCreatedPrograms;
