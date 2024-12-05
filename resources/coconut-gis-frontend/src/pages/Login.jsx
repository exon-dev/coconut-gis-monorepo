import { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaLeaf, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log({ email, password, rememberMe });
    };

    return (
        <div className="">
            <div style={styles.page}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={6}>
                            <div style={styles.card}>
                                <div style={styles.logo}>
                                    <FaLeaf style={styles.logoIcon} />
                                    <h2 style={styles.title}>CocoFarm</h2>
                                </div>
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
                                    >
                                        Login
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
