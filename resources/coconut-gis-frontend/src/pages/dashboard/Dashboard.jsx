import { useEffect, useState } from "react";
import {
    FaUsers,
    FaMapMarkedAlt,
    FaEye,
    FaUser,
    FaVenusMars,
    FaTree,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useBarangays } from "../../store/barangays";
import { Modal, Button } from "react-bootstrap";
import build from "../../utils/dev";
import { toast, Toaster } from "sonner";
import { useAdminStore } from "../../store/admin";
import { useMarketUpdates } from "../../store/market";
import { useProgramsStore } from "../../store/programs";

const Dashboard = () => {
    const { admin } = useAdminStore();
    const { fetchMarketUpdates } = useMarketUpdates();
    const { fetchPrograms } = useProgramsStore();
    const { fetchBarangays, barangays } = useBarangays();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("barangay_id");
    const [showModal, setShowModal] = useState(false);
    const [selectedBarangay, setSelectedBarangay] = useState(null);
    const [farmers, setFarmers] = useState([]);

    const totalFarmers = barangays.reduce((acc, barangay) => {
        return acc + barangay.farmers_count;
    }, 0);
    const totalBarangays = 10;

    const filteredBarangays = barangays
        .filter((barangay) =>
            barangay.barangay_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOption === "id") return a.barangay_id - b.barangay_id;
            if (sortOption === "name")
                return a.barangay_name.localeCompare(b.barangay_name);
            if (sortOption === "farmers")
                return b.farmers_count - a.farmers_count;
            return 0;
        });

    useEffect(() => {
        fetchBarangays();
    }, [fetchBarangays]);

    useEffect(() => {
        fetchMarketUpdates();
    }, [fetchMarketUpdates]);

    useEffect(() => {
        fetchPrograms();
    }, [fetchPrograms]);

    const handleViewClick = async (barangay) => {
        setSelectedBarangay(barangay);
        setShowModal(true);

        try {
            const response = await fetch(
                build(`barangay/${barangay.barangay_id}/farmers`),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            ).then((res) => {
                return res.json();
            });

            setFarmers(response);
        } catch (error) {
            toast.error("An error occured. Please try again.");
            console.error("Error fetching farmers:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBarangay(null);
        setFarmers([]);
    };

    return (
        <div style={styles.fullWidth}>
            <Toaster richColors position="top-center" />
            <div style={styles.container}>
                <div style={styles.cardContainer}>
                    <motion.div
                        style={{ ...styles.card, ...styles.farmersCard }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaUsers size={40} style={styles.icon} />
                        <h3>Total Farmers</h3>
                        <p>{totalFarmers}</p>
                    </motion.div>
                    <motion.div
                        style={{ ...styles.card, ...styles.barangaysCard }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaMapMarkedAlt size={40} style={styles.icon} />
                        <h3>Total Barangays</h3>
                        <p>{totalBarangays}</p>
                    </motion.div>
                </div>
                <div style={styles.tableContainer}>
                    <div style={styles.tableHeader}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchBar}
                        />
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            style={styles.sortDropdown}
                        >
                            <option value="barangay_id">Sort by ID</option>
                            <option value="name">Sort by Name</option>
                            <option value="farmers">Sort by Farmers</option>
                        </select>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Barangay ID</th>
                                <th>Barangay</th>
                                <th>Number of Farmers</th>
                                <th>Number of Lands</th>
                                <th>Total Coconut Trees Planted</th>
                                {admin?.role === "admin" && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBarangays.map((barangay) => (
                                <tr key={barangay.barangay_id}>
                                    <td>{barangay.barangay_id}</td>
                                    <td>{barangay.barangay_name}</td>
                                    <td>{barangay.farmers_count}</td>
                                    <td>{barangay.lands_count}</td>
                                    <td>{barangay.coconut_trees_planted}</td>
                                    {admin?.role === "admin" && (
                                        <td>
                                            <button
                                                style={styles.actionButton}
                                                onClick={() =>
                                                    handleViewClick(barangay)
                                                }
                                            >
                                                <FaEye
                                                    style={styles.actionIcon}
                                                />{" "}
                                                View
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                {/* Check if the user is an admin */}
                <Modal.Header closeButton>
                    <Modal.Title>
                        Farmers in {selectedBarangay?.barangay_name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Check if farmers exist */}
                    {farmers?.length !== 0 ? (
                        <div style={styles.modalTableContainer}>
                            <table style={styles.modalTable}>
                                <thead>
                                    <tr
                                        style={{
                                            backgroundColor: "#f1f1f1",
                                            textAlign: "center",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            padding: "0.75rem",
                                        }}
                                    >
                                        <th>
                                            <FaUser /> Farmer ID
                                        </th>
                                        <th>
                                            <FaUser /> Name
                                        </th>
                                        <th>
                                            <FaVenusMars /> Gender
                                        </th>
                                        <th>
                                            <FaTree /> Coconut Trees Planted
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Loop through farmers */}
                                    {farmers.map((farmer) => (
                                        <tr key={farmer.id}>
                                            <td>{farmer.farmer_id}</td>
                                            <td>{farmer.name}</td>
                                            <td>{farmer.gender}</td>
                                            <td>
                                                {farmer.number_of_coconut_trees}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No farmers found in this barangay.</p>
                    )}
                </Modal.Body>

                {/* Modal Footer */}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const styles = {
    fullWidth: {
        width: "100vw",
        overflowX: "hidden",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        paddingTop: "6rem",
    },
    cardContainer: {
        display: "flex",
        gap: "2rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    card: {
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        textAlign: "center",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "200px",
        flex: "1 1 200px",
        transition: "transform 0.2s, box-shadow 0.2s",
        border: "1px solid rgba(0,0,0,0.1)",
        background: "linear-gradient(135deg, #27ae60, #2ecc71)",
    },
    farmersCard: {
        background: "linear-gradient(135deg, #27ae60, #2ecc71)",
    },
    barangaysCard: {
        background: "linear-gradient(135deg, #2980b9, #3498db)",
    },
    icon: {
        marginBottom: "0.5rem",
    },
    tableContainer: {
        width: "100%",
        maxWidth: "800px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        padding: "1rem",
        overflowX: "auto",
    },
    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        flexWrap: "wrap",
    },
    searchBar: {
        padding: "0.5rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        flex: "1 1 200px",
        marginBottom: "1rem",
        color: "#333",
        backgroundColor: "#fff",
    },
    sortDropdown: {
        padding: "0.5rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
        flex: "1 1 200px",
        marginBottom: "1rem",
        color: "#333",
        backgroundColor: "#fff",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        borderBottom: "1px solid #ccc",
        padding: "0.75rem",
        textAlign: "left",
        backgroundColor: "#f1f1f1",
        color: "#333",
    },
    td: {
        borderBottom: "1px solid #ccc",
        padding: "0.75rem",
        color: "#333",
    },
    actionButton: {
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#27ae60",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s",
    },
    actionIcon: {
        marginRight: "0.5rem",
    },
    modalTableContainer: {
        overflowX: "auto",
    },
    modalTable: {
        width: "100%",
        borderCollapse: "collapse",
    },
    modalTableHeader: {
        backgroundColor: "#f1f1f1",
    },
    modalTableCell: {
        padding: "0.75rem",
        borderBottom: "1px solid #ccc",
    },
    farmerList: {
        listStyleType: "none",
        padding: 0,
    },
    farmerListItem: {
        padding: "0.5rem 0",
        borderBottom: "1px solid #ccc",
    },
};

export default Dashboard;
