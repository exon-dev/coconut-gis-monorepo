import { useState, useEffect } from "react";
import { FaUserPlus, FaSync } from "react-icons/fa";
import { Modal, Button, Pagination } from "react-bootstrap";
import build from "../../utils/dev";
import { toast, Toaster } from "sonner";

const Profiles = () => {
    const [searchTerm, setSearchTerm] = useState("");
    // eslint-disable-next-line no-unused-vars
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

    const handleDeleteClick = (profile) => {
        setSelectedProfile(profile);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProfile(null);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(
                build(`farmer/delete/${selectedProfile.farmer_id}`),
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

            if (response.ok) {
                toast.success("Profile deleted successfully.");
                fetchProfiles();
            } else {
                toast.error("Failed to delete profile.");
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            toast.error("An error occurred while deleting the profile.");
        } finally {
            handleCloseModal();
        }
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
                        <Button
                            className="btn btn-success"
                            variant="primary"
                            onClick={handleCreateClick}
                        >
                            <FaUserPlus /> Create
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleRefreshClick}
                        >
                            <FaSync /> Refresh
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
                                <th>Number of Lands</th>
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
                                    <td>{profile.lands?.length}</td>
                                    <td>{profile.barangay.barangay_name}</td>
                                    <td>
                                        <button
                                            style={styles.actionButton}
                                            onClick={() =>
                                                handleDeleteClick(profile)
                                            }
                                        >
                                            Delete
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
                        ].map((page) => (
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
                    <Modal.Title>Delete Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProfile ? (
                        <p>
                            Are you sure you want to delete the profile of{" "}
                            <strong>{selectedProfile.name}</strong>?
                        </p>
                    ) : (
                        <p>No profile selected.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Confirm Delete
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
        backgroundColor: "#e74c3c",
        color: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s",
    },
};

export default Profiles;
