import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
    FaLock,
    FaEnvelope,
    FaUser,
    FaAddressCard,
    FaTransgender,
    FaCalendar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import build from "../utils/dev";
import { toast, Toaster } from "sonner";

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({
        last_name: "",
        first_name: "",
        middle_initial: "",
        age: "",
        gender: "",
        address: "",
        email: "",
        password: "",
        role: "",
    });

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (Object.values(details).some((detail) => detail === "")) {
            toast.error("Please fill out all fields.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(build("auth/signup"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: details.first_name,
                    last_name: details.last_name,
                    middle_initial: details.middle_initial,
                    age: Number(details.age),
                    gender: details.gender,
                    address: details.address,
                    email: details.email,
                    password: details.password,
                    role: details.role,
                }),
            });

            if (!response.ok) {
                toast.error("Error creating account.");
                return;
            } else {
                toast.success("Account created successfully.");
                navigate("/login");
            }
        } catch (err) {
            toast.error("Error creating account:", err);
            throw new Error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) {
            toast.loading("Creating account...");
        }
    }, [loading]);

    return (
        <Container fluid className="p-0" style={styles.page}>
            <Toaster position="top-center" richColors />
            <Row className="g-0 h-100">
                <Col
                    md={6}
                    className="d-flex align-items-center justify-content-center bg-white p-5"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-100"
                        style={{ maxWidth: "500px" }}
                    >
                        <h4 className="mb-2 fw-bold text-success">
                            Register an Account
                        </h4>
                        <p className="text-muted mb-4">
                            Fill out the form to create your account.
                        </p>
                        <Form onSubmit={handleSubmit}>
                            {/* Last Name */}
                            <Form.Group className="mb-2">
                                <Form.Label>Last Name</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaUser />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your last name"
                                        name="last_name"
                                        value={details.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* First Name */}
                            <Form.Group className="mb-2">
                                <Form.Label>First Name</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaUser />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your first name"
                                        name="first_name"
                                        value={details.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* Middle Initial */}
                            <Form.Group className="mb-2">
                                <Form.Label>Middle Initial</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaUser />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="M.I."
                                        name="middle_initial"
                                        value={details.middle_initial}
                                        maxLength="1"
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* Age */}
                            <Form.Group className="mb-2">
                                <Form.Label>Age</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaCalendar />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter your age"
                                        name="age"
                                        value={details.age}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* Sex */}
                            <Form.Group className="mb-2">
                                <Form.Label>Sex</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaTransgender />
                                    </InputGroup.Text>
                                    <Form.Select
                                        name="gender"
                                        value={details.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select your sex
                                        </option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </InputGroup>
                            </Form.Group>

                            {/* Address */}
                            <Form.Group className="mb-2">
                                <Form.Label>Address</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaAddressCard />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your address"
                                        name="address"
                                        value={details.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* Email */}
                            <Form.Group className="mb-2">
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaEnvelope />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={details.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* Password */}
                            <Form.Group className="mb-2">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaLock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        name="password"
                                        value={details.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            <div className="d-flex justify-content-between my-3 w-full">
                                <Button
                                    variant={
                                        details.role === "admin"
                                            ? "success"
                                            : "outline-success"
                                    }
                                    className="d-flex align-items-center w-fit-content"
                                    name="role"
                                    value="admin"
                                    onClick={() =>
                                        setDetails({
                                            ...details,
                                            role: "admin",
                                        })
                                    }
                                >
                                    <FaUser className="me-2" />
                                    Admin
                                </Button>
                                <Button
                                    variant={
                                        details.role === "user"
                                            ? "primary"
                                            : "outline-primary"
                                    }
                                    className="d-flex align-items-center"
                                    name="role"
                                    value="user"
                                    onClick={() =>
                                        setDetails({ ...details, role: "user" })
                                    }
                                >
                                    <FaUser className="me-2" />
                                    User
                                </Button>
                            </div>

                            {/* Submit Button */}
                            <Button
                                variant="success"
                                type="submit"
                                className="w-100"
                            >
                                Register
                            </Button>
                            <p className="text-center mt-3 text-muted">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-success fw-bold"
                                >
                                    Log in
                                </Link>
                            </p>
                        </Form>
                    </motion.div>
                </Col>

                <Col
                    md={6}
                    className="bg-success text-white d-none d-md-flex align-items-center justify-content-center"
                >
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center p-5"
                    >
                        <img
                            src={logo}
                            alt="Dashboard illustration"
                            className="img-fluid mb-2"
                            style={{ maxWidth: "100px" }}
                        />
                        <h3 className="fw-bold">
                            Provide proper management of coconut farms
                        </h3>
                        <p>
                            Everything you need in an easily customizable
                            dashboard.
                        </p>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
};

const styles = {
    page: {
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
    },
};

export default Signup;
