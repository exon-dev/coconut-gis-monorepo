import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import build from "../utils/dev";
import { toast, Toaster } from "sonner";
import logo from "../assets/logo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(build("auth/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }).then((res) => res.json());

            if (rememberMe) {
                localStorage.setItem("email", email);
                localStorage.setItem("password", password);
            }

            if (response.message === "Unauthorized") {
                toast.error("Invalid email or password");
                return;
            }

            localStorage.setItem("token", response.accessToken);
            localStorage.setItem("admin", JSON.stringify(response.admin));
            window.location.href = "/dashboard";
        } catch (err) {
            toast.error("Invalid email or password");
            return new Error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedPassword = localStorage.getItem("password");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
        }
    }, []);

    return (
        <Container fluid className="p-0" style={styles.page}>
            <Toaster richColors position="top-center" />
            <Row className="g-0">
                {/* Left Side: Login Form */}
                <Col
                    md={6}
                    className="d-flex align-items-center justify-content-center bg-white p-5"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-100"
                        style={{ maxWidth: "400px" }}
                    >
                        <div className="d-flex align-items-center justify-content-center mb-4">
                            <img
                                src={logo}
                                alt="logo"
                                style={{ width: "40px", marginRight: "10px" }}
                            />
                            <h2 className="fw-bold text-success">MAO-CIS</h2>
                        </div>
                        <h4 className="mb-3 fw-bold text-success text-center">
                            Log in to your Account
                        </h4>
                        <p className="text-muted mb-4 text-center">
                            Welcome back! Select a method to log in:
                        </p>
                        <div className="d-flex mb-4">
                            <Button
                                variant="outline-secondary"
                                className="me-2 w-100"
                            >
                                <FcGoogle size={20} className="me-2" />
                                Google
                            </Button>
                            <Button variant="outline-primary" className="w-100">
                                <FaFacebook size={20} className="me-2" />
                                Facebook
                            </Button>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                            >
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaEnvelope />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaLock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <div className="d-flex justify-content-between mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Remember me"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                                <Link
                                    to="/forgot-password"
                                    className="text-success"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <Button
                                variant="success"
                                type="submit"
                                className="w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1,
                                            ease: "linear",
                                        }}
                                    >
                                        <FaSpinner />
                                    </motion.div>
                                ) : (
                                    "Log In"
                                )}
                            </Button>
                            <p className="text-center mt-3 text-muted">
                                Don’t have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-success fw-bold"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </Form>
                    </motion.div>
                </Col>

                {/* Right Side: Image and Content */}
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
                            className="img-fluid mb-3"
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

export default Login;
