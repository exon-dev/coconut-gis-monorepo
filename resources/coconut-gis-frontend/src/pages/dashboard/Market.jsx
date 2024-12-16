import { useAdminStore } from "../../store/admin";
import { motion } from "framer-motion";
import {
    FaUsers,
    FaThumbsUp,
    FaShoppingCart,
    FaWeight,
    FaCrown,
    FaClock,
} from "react-icons/fa";
import { Container, Row, Col, Card, Table, ListGroup } from "react-bootstrap";

const Market = () => {
    const admin = useAdminStore((state) => state.admin);

    return (
        <Container style={styles.fullWidth}>
            <div style={styles.container}>
                <h1 className="text-center mb-4">Trade & Market</h1>
                {admin.role === "admin" ? (
                    <AdminDashboard />
                ) : (
                    <UserMarketView />
                )}
            </div>
        </Container>
    );
};

const AdminDashboard = () => (
    <Container fluid className="p-0">
        <Row>
            <Col md={2} className="bg-white vh-100 shadow-lg p-3">
                <h4 className="text-success mb-4">
                    MAO Coconut Information Systems
                </h4>
                <ul className="list-unstyled">
                    <li className="py-2 text-success fw-bold">Market Update</li>
                </ul>
            </Col>

            {/* Main Dashboard */}
            <Col md={10} className="p-4">
                <h3 className="mb-4 fw-bold">Admin Dashboard</h3>
                <Row>
                    {/* Cards */}
                    <Col md={3}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card className="shadow-lg p-3 text-center border-1 bg-white">
                                <FaUsers size={30} className="text-success" />
                                <h5 className="mt-3 fw-bold">Users Active</h5>
                                <p className="text-success fw-bold fs-4">
                                    1600
                                </p>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col md={3}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card className="shadow-lg p-3 text-center border-1 bg-white">
                                <FaShoppingCart
                                    size={30}
                                    className="text-success"
                                />
                                <h5 className="mt-3 fw-bold">Purchases</h5>
                                <p className="text-success fw-bold fs-4">
                                    2300
                                </p>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col md={3}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card className="shadow-lg p-3 text-center border-1 bg-white">
                                <FaThumbsUp
                                    size={30}
                                    className="text-success"
                                />
                                <h5 className="mt-3 fw-bold">Likes</h5>
                                <p className="text-success fw-bold fs-4">940</p>
                            </Card>
                        </motion.div>
                    </Col>
                    <Col md={3}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Card className="shadow-lg p-3 text-center border-1 bg-white">
                                <FaClock size={30} className="text-success" />
                                <h5 className="mt-3 fw-bold">Click Events</h5>
                                <p className="text-success fw-bold fs-4">357</p>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>

                {/* Orders Overview */}
                <Row className="mt-5">
                    <Col md={6}>
                        <Card className="shadow-lg border-1 bg-white">
                            <Card.Body>
                                <h5 className="fw-bold mb-3">
                                    Orders Overview
                                </h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2 d-flex justify-content-between">
                                        <span className="text-success fw-bold">
                                            +24% This Month
                                        </span>
                                        <span>Design Changes</span>
                                    </li>
                                    <li className="mb-2 d-flex justify-content-between">
                                        <span>Server Payments</span>
                                        <span>₱4000</span>
                                    </li>
                                    <li className="mb-2 d-flex justify-content-between">
                                        <span>New Orders</span>
                                        <span>₱9500</span>
                                    </li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Projects */}
                    <Col md={6}>
                        <Card className="shadow-lg border-1 bg-white">
                            <Card.Body>
                                <h5 className="fw-bold mb-3">Projects</h5>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Project</th>
                                            <th>Budget</th>
                                            <th>Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-muted">
                                                Fix Errors
                                            </td>
                                            <td>₱4000</td>
                                            <td className="text-success fw-bold">
                                                60%
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">
                                                UI Redesign
                                            </td>
                                            <td>₱5000</td>
                                            <td className="text-success fw-bold">
                                                90%
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
);

const UserMarketView = () => (
    <Container fluid className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <Row>
            {/* Sidebar */}
            <Col md={3} className="bg-white shadow-lg p-3 rounded">
                <h5 className="fw-bold mb-4 text-success">Market Overview</h5>
                <ListGroup variant="flush">
                    <ListGroup.Item className="text-muted">Home</ListGroup.Item>
                    <ListGroup.Item className="text-muted">
                        Reports
                    </ListGroup.Item>
                    <ListGroup.Item className="text-success fw-bold">
                        Price Updates
                    </ListGroup.Item>
                    <ListGroup.Item className="text-muted">
                        Settings
                    </ListGroup.Item>
                    <ListGroup.Item className="text-muted">
                        Logout
                    </ListGroup.Item>
                </ListGroup>
            </Col>

            {/* Feed Section */}
            <Col md={6}>
                <Card className="p-3 mb-4 shadow-lg border-1">
                    <h5 className="fw-bold mb-3">Price of Coconut (per kg)</h5>
                    <div className="text-center">
                        <FaWeight size={50} className="text-success mb-2" />
                        <p className="fs-4 fw-bold text-success">₱45.00</p>
                        <small className="text-muted">Updated: June 2024</small>
                    </div>
                </Card>

                <Card className="p-3 mb-4 shadow-lg border-1">
                    <h5 className="fw-bold mb-3">
                        Volume of Coconut (per Barangay)
                    </h5>
                    <ListGroup>
                        <ListGroup.Item className="d-flex justify-content-between">
                            Barangay 1 <span className="fw-bold">2,500 kg</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            Barangay 2 <span className="fw-bold">3,200 kg</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                            Barangay 3 <span className="fw-bold">1,800 kg</span>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>

            {/* Top in the Market */}
            <Col md={3}>
                <Card className="p-3 shadow-lg border-1 text-center">
                    <FaCrown size={50} className="text-warning mb-3" />
                    <h5 className="fw-bold">Top in the Market</h5>
                    <p className="fs-4 fw-bold text-warning">Coconut King</p>
                    <small className="text-muted">Leading Supplier</small>
                </Card>
            </Col>
        </Row>
    </Container>
);

const styles = {
    fullWidth: {
        width: "100vw",
        overflowX: "hidden",
    },
    fullHeight: {
        height: "100vh",
        overflowY: "auto",
    },
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        paddingTop: "6rem",
    },
};

export default Market;
