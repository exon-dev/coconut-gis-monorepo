import { useState } from "react";
import { useAdminStore } from "../../store/admin";
import { motion } from "framer-motion";
import { useBarangays } from "../../store/barangays";
import { GiCoconuts } from "react-icons/gi";
import {
    FaUsers,
    FaThumbsUp,
    FaWeight,
    FaCrown,
    FaClock,
    FaPlus,
} from "react-icons/fa";
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    ListGroup,
    Button,
    Modal,
    Form,
} from "react-bootstrap";

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

const AdminDashboard = () => {
    const { barangays } = useBarangays((state) => state);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showVolumeModal, setShowVolumeModal] = useState(false);
    const [showTopMarketModal, setShowTopMarketModal] = useState(false);

    const [prices, setPrices] = useState([{ kg: "", price: "" }]);
    const handlePriceChange = (index, field, value) => {
        const updatedPrices = [...prices];
        updatedPrices[index][field] = value;
        setPrices(updatedPrices);
    };
    const handleAddPrice = () => setPrices([...prices, { kg: "", price: "" }]);
    const handleRemovePrice = (index) => {
        const updatedPrices = prices.filter((_, i) => i !== index);
        setPrices(updatedPrices);
    };

    // For Barangay volume modal
    const [barangayVolumes, setBarangayVolumes] = useState(
        barangays.map((barangay) => ({
            barangay: barangay.barangay_name,
            volume: "",
        }))
    );

    const handleBarangayChange = (index, field, value) => {
        const updatedVolumes = [...barangayVolumes];
        updatedVolumes[index][field] = value;
        setBarangayVolumes(updatedVolumes);
    };

    // For Top Market modal
    const [topMarket, setTopMarket] = useState({ name: "", description: "" });
    const handleTopMarketChange = (field, value) => {
        setTopMarket({ ...topMarket, [field]: value });
    };

    return (
        <Container fluid className="p-0">
            <Row>
                <Col md={2} className="bg-white vh-100 shadow-lg p-3">
                    <h4 className="text-success mb-4">
                        MAO Coconut Information Systems
                    </h4>
                    <ul className="list-unstyled">
                        <li className="py-2 text-success fw-bold">
                            Market Update
                        </li>
                    </ul>
                    <ul className="list-unstyled">
                        <button
                            className="btn btn-primary text-white py-2 text-success fw-bold"
                            onClick={() => setShowPriceModal(true)}
                        >
                            Update Price per coconut (kg)
                        </button>
                    </ul>
                    <ul className="list-unstyled">
                        <button
                            className="btn btn-success text-white py-2 text-success fw-bold"
                            onClick={() => setShowVolumeModal(true)}
                        >
                            Update Volume of Coconut per brgy
                        </button>
                    </ul>
                    <ul className="list-unstyled">
                        <button
                            className="btn btn-warning text-white py-2 text-success fw-bold"
                            onClick={() => setShowTopMarketModal(true)}
                        >
                            Update Top Market
                        </button>
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
                                    <FaUsers
                                        size={30}
                                        className="text-success"
                                    />
                                    <h5 className="mt-3 fw-bold">
                                        Total Users
                                    </h5>
                                    <p className="text-success fw-bold fs-4">
                                        1600
                                    </p>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card className="shadow-lg p-3 text-center border-1 bg-white">
                                    <GiCoconuts
                                        size={30}
                                        className="text-success"
                                    />
                                    <h5 className="mt-3 fw-bold">
                                        Total Volume of Coconut
                                    </h5>
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
                                    <p className="text-success fw-bold fs-4">
                                        940
                                    </p>
                                </Card>
                            </motion.div>
                        </Col>
                        <Col md={3}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Card className="shadow-lg p-3 text-center border-1 bg-white">
                                    <FaClock
                                        size={30}
                                        className="text-success"
                                    />
                                    <h5 className="mt-3 fw-bold">
                                        Click Events
                                    </h5>
                                    <p className="text-success fw-bold fs-4">
                                        357
                                    </p>
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

            {/* Modals */}
            <Modal
                show={showPriceModal}
                onHide={() => setShowPriceModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Price per Coconut (kg)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {prices.map((price, index) => (
                        <div key={index} className="mb-3">
                            <Form.Group controlId={`kg-${index}`}>
                                <Form.Label>Coconut kg</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price.kg}
                                    onChange={(e) =>
                                        handlePriceChange(
                                            index,
                                            "kg",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter kg"
                                />
                            </Form.Group>
                            <Form.Group controlId={`price-${index}`}>
                                <Form.Label>Price (₱)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price.price}
                                    onChange={(e) =>
                                        handlePriceChange(
                                            index,
                                            "price",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter price"
                                />
                            </Form.Group>
                            {index > 0 && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleRemovePrice(index)}
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button variant="primary" onClick={handleAddPrice}>
                        <FaPlus /> Add More Prices
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowPriceModal(false)}
                    >
                        Close
                    </Button>
                    <Button variant="primary">Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showVolumeModal}
                onHide={() => setShowVolumeModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Volume of Coconut per Barangay
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {barangayVolumes.map((volume, index) => (
                        <div key={index} className="mb-3">
                            <Form.Group controlId={`barangay-${index}`}>
                                <Form.Label>Barangay {index + 1}</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={volume.barangay}
                                    onChange={(e) =>
                                        handleBarangayChange(
                                            index,
                                            "barangay",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Barangay Name"
                                />
                            </Form.Group>
                            <Form.Group controlId={`volume-${index}`}>
                                <Form.Label>Volume (kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={volume.volume}
                                    onChange={(e) =>
                                        handleBarangayChange(
                                            index,
                                            "volume",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Volume"
                                />
                            </Form.Group>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowVolumeModal(false)}
                    >
                        Close
                    </Button>
                    <Button variant="primary">Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showTopMarketModal}
                onHide={() => setShowTopMarketModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Top Market</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="topMarketName">
                        <Form.Label>Market Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={topMarket.name}
                            onChange={(e) =>
                                handleTopMarketChange("name", e.target.value)
                            }
                            placeholder="Enter Market Name"
                        />
                    </Form.Group>
                    <Form.Group controlId="topMarketDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={topMarket.description}
                            onChange={(e) =>
                                handleTopMarketChange(
                                    "description",
                                    e.target.value
                                )
                            }
                            placeholder="Enter Description"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowTopMarketModal(false)}
                    >
                        Close
                    </Button>
                    <Button variant="primary">Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

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
