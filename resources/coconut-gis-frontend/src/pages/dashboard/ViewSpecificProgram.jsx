import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaLink, FaCheckCircle } from "react-icons/fa";
import { useProgramsStore } from "../../store/programs";
import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";
import slugger from "../../utils/slugger";

const ViewSpecificProgram = () => {
    const { programs, fetchPrograms } = useProgramsStore();
    const [selectedProgram, setSelectedProgram] = useState(null);
    const location = useLocation();
    const { program_id } = location.state || {};

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    useEffect(() => {
        const program = programs.find(
            (p) => p.program_id === parseInt(program_id)
        );
        setSelectedProgram(program);
    }, [program_id, programs]);

    if (!selectedProgram) {
        return <h1>Program not found...</h1>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.mainContent}>
                <Row>
                    <Col lg={8} md={12}>
                        <motion.div
                            style={styles.featuredProgram}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img
                                src={selectedProgram.cover_image}
                                alt={selectedProgram.program_name}
                                style={styles.featuredImage}
                            />
                            <div style={styles.featuredContent}>
                                <h1 style={styles.featuredTitle}>
                                    {selectedProgram.program_name}
                                </h1>
                                <div className="d-flex">
                                    <FaUser size={18} style={styles.icon} />
                                    <p>Author: {selectedProgram.admin?.name}</p>
                                </div>
                                <p style={styles.featuredDate}>
                                    <FaCalendarAlt
                                        size={16}
                                        style={styles.icon}
                                    />
                                    {new Date(
                                        selectedProgram.created_at
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "2-digit",
                                    })}
                                </p>
                                <p style={styles.featuredDescription}>
                                    {selectedProgram.program_description}
                                </p>

                                <h1 style={styles.featuredTitle}>Objectives</h1>
                                <ul style={styles.objectivesList}>
                                    {selectedProgram.program_objectives?.map(
                                        (objective, idx) => (
                                            <li
                                                key={idx}
                                                style={styles.objectiveItem}
                                            >
                                                <FaCheckCircle
                                                    style={styles.icon}
                                                />
                                                {objective.objective}
                                            </li>
                                        )
                                    )}
                                </ul>

                                <h1 style={styles.featuredTitle}>Timeline</h1>
                                <table style={styles.timelineTable}>
                                    <thead>
                                        <tr>
                                            <th style={styles.timelineHeader}>
                                                Event
                                            </th>
                                            <th style={styles.timelineHeader}>
                                                Date & Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProgram.program_timeline?.map(
                                            (timeline, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        {timeline.event_name}
                                                    </td>
                                                    <td>
                                                        {new Date(
                                                            timeline.date_time
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "2-digit",
                                                                hour: "numeric",
                                                                minute: "numeric",
                                                            }
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                <h1 style={styles.featuredTitle}>
                                    Eligibility Criteria
                                </h1>
                                <p style={styles.featuredDescription}>
                                    {selectedProgram.program_eligibility}
                                </p>
                            </div>
                        </motion.div>
                    </Col>

                    <Col lg={4} md={12}>
                        <div style={styles.sidebar}>
                            <h3 style={styles.sidebarHeader}>Other Programs</h3>
                            {programs
                                .filter(
                                    (program) =>
                                        program.program_id !==
                                        parseInt(program_id)
                                )
                                .map((program, idx) => (
                                    <motion.div
                                        key={idx}
                                        style={styles.sidebarCard}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <img
                                            src={program.cover_image}
                                            alt={program.program_name}
                                            style={styles.cardImage}
                                        />
                                        <div style={styles.cardContent}>
                                            <h4 style={styles.cardTitle}>
                                                {program.program_name}
                                            </h4>
                                            <div style={styles.cardAuthorInfo}>
                                                <FaUser
                                                    size={16}
                                                    style={styles.icon}
                                                />
                                                <p>{program.admin?.name}</p>
                                            </div>
                                            <p style={styles.cardDate}>
                                                {program.date}
                                            </p>
                                            <p style={styles.cardDescription}>
                                                {program.program_description?.slice(
                                                    0,
                                                    100
                                                )}
                                                ...
                                            </p>
                                            <Link
                                                to={`/dashboard/programs/${slugger(
                                                    program.program_name
                                                )}`}
                                                state={{
                                                    program_id:
                                                        program.program_id,
                                                }}
                                                style={styles.cardLink}
                                            >
                                                <FaLink
                                                    size={16}
                                                    style={styles.icon}
                                                />
                                                View Program
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "5rem",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
    },
    mainContent: {
        display: "flex",
        width: "100%",
        gap: "2rem",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    featuredProgram: {
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        width: "100%",
        maxWidth: "1200px",
    },
    featuredImage: {
        width: "100%",
        height: "400px",
        objectFit: "cover",
    },
    featuredContent: {
        padding: "2rem",
    },
    featuredTitle: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#2c3e50",
        marginTop: "1rem",
        display: "flex",
        alignItems: "center",
    },
    featuredDate: {
        fontSize: "1rem",
        color: "#7f8c8d",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
    },
    featuredDescription: {
        fontSize: "1.1rem",
        color: "#34495e",
        lineHeight: "1.6",
        marginBottom: "1.5rem",
    },
    objectivesList: {
        listStyleType: "none",
        paddingLeft: "1rem",
    },
    objectiveItem: {
        fontSize: "1.1rem",
        marginBottom: "0.8rem",
        display: "flex",
        alignItems: "center",
        color: "#34495e",
    },
    timelineTable: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "1rem",
    },
    timelineHeader: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        backgroundColor: "#ecf0f1",
        padding: "0.8rem",
        textAlign: "left",
    },
    sidebar: {
        width: "100%",
        maxHeight: "140vh",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem",
        marginTop: "2rem",
    },
    sidebarHeader: {
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#34495e",
        marginBottom: "1.5rem",
        textAlign: "center",
    },
    sidebarCard: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        backgroundColor: "#fdfdfd",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.2s ease",
        marginBottom: "1.5rem",
        cursor: "pointer",
    },
    cardImage: {
        width: "100%",
        height: "150px",
        objectFit: "cover",
        borderRadius: "8px",
    },
    cardContent: {
        flex: 1,
        padding: "0.5rem",
    },
    cardTitle: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: "0.5rem",
    },
    cardDate: {
        fontSize: "0.9rem",
        color: "#7f8c8d",
    },
    cardDescription: {
        fontSize: "1rem",
        color: "#34495e",
        marginTop: "0.5rem",
    },
    cardAuthorInfo: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "0.5rem",
    },
    cardLink: {
        marginTop: "0.5rem",
        display: "flex",
        alignItems: "center",
        color: "#007BFF",
        textDecoration: "none",
        fontSize: "1rem",
    },
    icon: {
        marginRight: "0.5rem",
    },
};

export default ViewSpecificProgram;
