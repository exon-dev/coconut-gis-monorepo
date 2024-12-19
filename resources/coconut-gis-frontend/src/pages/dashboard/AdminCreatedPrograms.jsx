import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTree, FaWater, FaUserGraduate } from "react-icons/fa";

const AdminCreatedPrograms = () => {
    // Dummy data for demonstration
    const programs = [
        {
            cover_image: "https://via.placeholder.com/300x200",
            program_name: "Community Tree Planting",
            program_description:
                "A program to encourage tree planting in local communities.",
            objectives: [
                "Increase greenery",
                "Promote awareness of deforestation",
                "Engage the youth in environmental activities",
            ],
            icon: <FaTree size={24} color="#27ae60" />,
        },
        {
            cover_image: "https://via.placeholder.com/300x200",
            program_name: "Clean Water Initiative",
            program_description:
                "Providing clean and safe water to underserved communities.",
            objectives: [
                "Install water filters",
                "Educate on water sanitation",
                "Reduce waterborne diseases",
            ],
            icon: <FaWater size={24} color="#3498db" />,
        },
        {
            cover_image: "https://via.placeholder.com/300x200",
            program_name: "Youth Skills Development",
            program_description:
                "Training programs for skill development among the youth.",
            objectives: [
                "Provide vocational training",
                "Support job placements",
                "Boost self-confidence among youth",
            ],
            icon: <FaUserGraduate size={24} color="#e67e22" />,
        },
        {
            cover_image: "https://via.placeholder.com/300x200",
            program_name: "Health Awareness Campaign",
            program_description:
                "Promoting health awareness and preventive measures in communities.",
            objectives: [
                "Conduct health check-ups",
                "Distribute health kits",
                "Provide health education",
            ],
            icon: <FaTree size={24} color="#e74c3c" />,
        },
    ];

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Created Programs</h2>
            <div style={styles.grid}>
                {programs.map((program, idx) => (
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
                                {program.program_description}
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
                            <Link to={`/dashboard/programs/${program.id}`}>
                                View Program
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
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
};

export default AdminCreatedPrograms;
