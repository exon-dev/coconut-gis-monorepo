import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import {
    FaLeaf,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
} from "react-icons/fa";
import build from "../utils/dev";
import { motion } from "framer-motion";

import { toast, Toaster } from "sonner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        setLoading(true);
        try {
            const response = await fetch(build("auth/login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
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

            window.location.href = "/dashboard/map";
        } catch (err) {
            toast.error("Invalid email or password");
            throw new Error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const email = localStorage.getItem("email");
        const password = localStorage.getItem("password");

        if (email && password) {
            setEmail(email);
            setPassword(password);
        }
    }, []);

    return (
        <div className="">
            <Toaster richColors position="top-center" />
            <div style={styles.page}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={4}>
                            <div style={styles.card}>
                                <Link to="/" style={styles.logo}>
                                    <FaLeaf style={styles.logoIcon} />
                                    <h2 style={styles.title}>CocoFarm</h2>
                                </Link>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label style={styles.label}>
                                            Email address
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaEnvelope />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                                style={styles.input}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label style={styles.label}>
                                            Password
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FaLock />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                required
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                style={styles.input}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                style={styles.togglePasswordBtn}
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check
                                            type="checkbox"
                                            label="Remember me"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(e.target.checked)
                                            }
                                            style={styles.checkbox}
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="success"
                                        type="submit"
                                        style={styles.button}
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
                                            "Log in"
                                        )}
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
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
    card: {
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
    },
    logo: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.5rem",
        textDecoration: "none",
        cursor: "pointer",
    },
    logoIcon: {
        fontSize: "2.5rem",
        color: "#27ae60",
        marginRight: "0.5rem",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#2c3e50",
    },
    label: {
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#2c3e50",
        textAlign: "left", // Align labels to the left
        width: "100%",
    },
    input: {
        borderRadius: "5px",
        border: "1px solid #ced4da",
        padding: "0.5rem",
        fontSize: "1rem",
    },
    inputGroup: {
        marginBottom: "1rem",
    },
    checkbox: {
        fontSize: "1rem",
        color: "#2c3e50",
        marginTop: "1rem",
        marginBottom: "1rem",
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        fontSize: "1rem",
        borderRadius: "5px",
        backgroundColor: "#27ae60",
        borderColor: "#27ae60",
    },
    togglePasswordBtn: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
    },
    footer: {
        backgroundColor: "#343a40",
        color: "#fff",
        padding: "2rem 0",
        position: "relative",
        bottom: 0,
        width: "100%",
        marginTop: "auto",
    },
    footerHeader: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1rem",
    },
    footerText: {
        margin: 0,
        fontSize: "1rem",
    },
};

export default Login;
