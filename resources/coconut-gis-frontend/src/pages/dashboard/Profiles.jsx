import { useState, useEffect } from "react";
import { FaUserPlus, FaSync, FaSort } from "react-icons/fa";
import { Modal, Button, Pagination } from "react-bootstrap";
import build from "../../utils/dev";
import { toast, Toaster } from "sonner";

const Profiles = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);

    const totalProfiles = 100;
    const profilesPerPage = 5;

    useEffect(() => {
        fetchProfiles();
    }, [currentPage, sortOption]);

    useEffect(() => {
        // Filter profiles based on search term
        if (searchTerm) {
            const filtered = profiles.filter((profile) =>
                profile.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProfiles(filtered);
        } else {
            setFilteredProfiles(profiles);
        }
    }, [searchTerm, profiles]);

    const fetchProfiles = async () => {
        try {
            const response = await fetch(
                build(`farmer/all?page=${currentPage}&sort=${sortOption}`),
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            ).then((res) => res.json());

            if (response.message === "No farmers found") {
                toast.error(response.message);
                return new Error(response.message);
            }
            setProfiles(response);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    };

    const handleCreateClick = () => {
        window.location.href = "/dashboard/map";
    };

    const handleRefreshClick = () => {
        fetchProfiles();
    };

    const handleSortClick = () => {
        setSortOption(sortOption === "name" ? "farmers" : "name");
    };

    const handleViewClick = (profile) => {
        setSelectedProfile(profile);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProfile(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div style={styles.fullWidth}>
            <Toaster richColors position="top-center" />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Profiles</h1>
                    <div style={styles.buttonGroup}>
                        <Button variant="primary" onClick={handleCreateClick}>
                            <FaUserPlus /> Create
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleRefreshClick}
                        >
                            <FaSync /> Refresh
                        </Button>
                        <Button variant="info" onClick={handleSortClick}>
                            <FaSort /> Sort Farmers
                        </Button>
                    </div>
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
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Farmer ID</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Number of Coconut Trees</th>
                                <th>Barangay</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProfiles?.map((profile) => (
                                <tr key={profile.farmer_id}>
                                    <td>{profile.farmer_id}</td>
                                    <td>{profile.name}</td>
                                    <td>{profile.gender}</td>
                                    <td>{profile.number_of_coconut_trees}</td>
                                    <td>{profile.barangay.barangay_name}</td>
                                    <td>
                                        <button
                                            style={styles.actionButton}
                                            onClick={() =>
                                                handleViewClick(profile)
                                            }
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination>
                        {[
                            ...Array(
                                Math.ceil(totalProfiles / profilesPerPage)
                            ).keys(),
                        ]?.map((page) => (
                            <Pagination.Item
                                key={page + 1}
                                active={page + 1 === currentPage}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Profile Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProfile ? (
                        <div>
                            <p>
                                <strong>ID:</strong> {selectedProfile.id}
                            </p>
                            <p>
                                <strong>Name:</strong> {selectedProfile.name}
                            </p>
                            <p>
                                <strong>Number of Farmers:</strong>{" "}
                                {selectedProfile.farmers_count}
                            </p>
                        </div>
                    ) : (
                        <p>No profile selected.</p>
                    )}
                </Modal.Body>
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
        height: "100vh",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        maxWidth: "800px",
        marginBottom: "2rem",
    },
    buttonGroup: {
        display: "flex",
        gap: "1rem",
    },
    tableContainer: {
        width: "100%",
        maxWidth: "1200px",
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
};

export default Profiles;
