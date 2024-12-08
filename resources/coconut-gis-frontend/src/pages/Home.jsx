// Home.jsx
import { Container, Navbar, Nav, Button, Row, Col } from "react-bootstrap";
import {
    FaLeaf,
    FaReact,
    FaLaravel,
    FaFacebook,
    FaTwitter,
    FaInstagram,
} from "react-icons/fa";
import { SiPostgresql, SiOpenlayers } from "react-icons/si";
import { motion } from "framer-motion";
import bg from "../assets/background.jpg";

const Home = () => {
    const handleRedirectLogin = () => {
        window.location.href = "/login";
    };

    return (
        <div style={styles.page}>
            <Navbar bg="dark" variant="dark" expand="lg" style={styles.navbar}>
                <Container>
                    <Navbar.Brand href="#home" style={styles.logo}>
                        <FaLeaf style={styles.logoIcon} /> MAO CIS
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Link href="#about">About</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#techstack">Tech Stack</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Button
                                onClick={handleRedirectLogin}
                                variant="outline-light"
                            >
                                Login
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="jumbotron text-center" style={styles.jumbotron}>
                <div style={styles.overlay}>
                    <Container>
                        <motion.h1
                            style={styles.header}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            MAO Coconut Information Systems
                        </motion.h1>
                        <motion.p
                            style={styles.subParagraph}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        >
                            Web-based GIS Mapping and Information System of
                            Agusan Del Sur for Coconut Farms
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                        >
                            <Button variant="dark" size="lg">
                                Get Started
                            </Button>
                        </motion.div>
                    </Container>
                </div>
            </div>

            <Container>
                {/* About Section */}
                <Row id="about" className="my-5 justify-content-center">
                    <Col md={8}>
                        <motion.div
                            style={styles.sectionWrapper}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 style={styles.sectionHeader}>About</h2>
                            <div style={styles.cardContainer}>
                                <p style={styles.text}>
                                    MAO CIS is a web-based GIS mapping system
                                    designed to help farmers in Agusan Del Sur
                                    manage and monitor their coconut farms
                                    efficiently. Our platform integrates modern
                                    technology with traditional farming
                                    practices to create a sustainable and
                                    productive farming ecosystem.
                                </p>
                            </div>
                        </motion.div>
                    </Col>
                </Row>

                {/* Objectives Section */}
                <Row id="features" className="my-5 justify-content-center">
                    <Col md={10}>
                        <motion.div
                            style={styles.sectionWrapper}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 style={styles.sectionHeader}>
                                Objectives of the Study
                            </h2>
                            <div style={styles.objectivesContainer}>
                                <div style={styles.objectiveCard}>
                                    <h3 style={styles.objectiveHeader}>
                                        General Objective
                                    </h3>
                                    <p style={styles.objectiveText}>
                                        To develop and implement a web-based
                                        tool that integrates Information System
                                        (IS) and Geographic Information System
                                        (GIS) technology, tailored specifically
                                        for coconut farmers in Agusan del Sur,
                                        Philippines.
                                    </p>
                                </div>
                                <div style={styles.specificObjectivesWrapper}>
                                    <h3 style={styles.objectiveHeader}>
                                        Specific Objectives
                                    </h3>
                                    <div style={styles.objectivesGrid}>
                                        {[
                                            "Develop an IS tool with GIS integration for coconut farmers",
                                            "Provide mapping visualization functionalities for spatial understanding",
                                            "Provide real-time access to market information and best practices",
                                            "Provide information about governmental and NGO activities",
                                        ].map((objective, index) => (
                                            <div
                                                key={index}
                                                style={styles.objectiveItem}
                                            >
                                                <FaLeaf
                                                    style={styles.objectiveIcon}
                                                />
                                                <p>{objective}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Col>
                </Row>

                {/* Tech Stack Section */}
                <Row id="techstack" className="my-5 justify-content-center">
                    <Col md={10}>
                        <motion.div
                            style={styles.sectionWrapper}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 style={styles.sectionHeader}>Tech Stack</h2>
                            <div style={styles.techStackGrid}>
                                {[
                                    {
                                        icon: <FaReact />,
                                        name: "React",
                                        desc: "Frontend Framework",
                                    },
                                    {
                                        icon: <FaReact />,
                                        name: "React-Bootstrap",
                                        desc: "UI Components",
                                    },
                                    {
                                        icon: <SiOpenlayers />,
                                        name: "OpenLayers",
                                        desc: "Mapping Library",
                                    },
                                    {
                                        icon: <FaLaravel />,
                                        name: "Laravel",
                                        desc: "Backend Framework",
                                    },
                                    {
                                        icon: <SiPostgresql />,
                                        name: "PostgreSQL",
                                        desc: "Database",
                                    },
                                ].map((tech, index) => (
                                    <motion.div
                                        key={index}
                                        style={styles.techCard}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div style={styles.techIcon}>
                                            {tech.icon}
                                        </div>
                                        <h3 style={styles.techName}>
                                            {tech.name}
                                        </h3>
                                        <p style={styles.techDesc}>
                                            {tech.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>

            {/* Footer */}
            <footer style={styles.footer}>
                <Container>
                    <Row>
                        <Col md={4} className="text-center text-md-left">
                            <h5 style={styles.footerHeader}>MAO CIS</h5>
                            <p style={styles.footerText}>
                                Empowering coconut farmers with modern
                                technology.
                            </p>
                        </Col>
                        <Col md={4} className="text-center">
                            <h5 style={styles.footerHeader}>Follow Us</h5>
                            <div style={styles.socialIcons}>
                                <FaFacebook style={styles.socialIcon} />
                                <FaTwitter style={styles.socialIcon} />
                                <FaInstagram style={styles.socialIcon} />
                            </div>
                        </Col>
                        <Col md={4} className="text-center text-md-right">
                            <h5 style={styles.footerHeader}>Contact Us</h5>
                            <p style={styles.footerText}>
                                Email: info@maocis.com
                            </p>
                            <p style={styles.footerText}>
                                Phone: +63 123 456 7890
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center py-3">
                            <p style={styles.footerText}>
                                © 2024 MAO CIS. All rights reserved.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </div>
    );
};

const styles = {
    page: {
        width: "100%",
        backgroundColor: "#f8f9fa",
        overflowX: "hidden",
    },
    navbar: {
        padding: "0 2rem",
    },
    logo: {
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "1.5rem",
        color: "#fff",
    },
    logoIcon: {
        marginRight: "0.5rem",
    },
    jumbotron: {
        position: "relative",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        padding: "10rem 1rem",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
            "linear-gradient(to bottom right, rgba(34, 139, 34, 0.7), rgba(0, 100, 0, 0.7))",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        fontSize: "4rem",
        fontWeight: "bold",
        color: "#fff",
        zIndex: 2,
    },
    subParagraph: {
        fontSize: "1.5rem",
        color: "#fff",
        marginBottom: "2rem",
        zIndex: 2,
    },
    sectionWrapper: {
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    sectionHeader: {
        color: "#27ae60",
        fontSize: "2.5rem",
        marginBottom: "1rem",
        fontWeight: "bold",
        textAlign: "center",
    },
    text: {
        color: "#2c3e50",
        fontSize: "1.2rem",
        textAlign: "center",
    },
    cardContainer: {
        padding: "1rem",
        background: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    objectivesContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
    },
    objectiveCard: {
        padding: "2rem",
        background: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
        borderRadius: "15px",
        color: "white",
    },
    objectiveHeader: {
        fontSize: "1.8rem",
        fontWeight: "bold",
        marginBottom: "1rem",
        color: "#27ae60",
    },
    objectivesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginTop: "1rem",
    },
    objectiveItem: {
        padding: "1.5rem",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
    },
    objectiveIcon: {
        color: "#27ae60",
        fontSize: "1.5rem",
        flexShrink: 0,
    },
    techStackGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "2rem",
        padding: "1rem",
    },
    techCard: {
        padding: "2rem",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        textAlign: "center",
        cursor: "pointer",
    },
    techIcon: {
        fontSize: "3rem",
        color: "#27ae60",
        marginBottom: "1rem",
    },
    techName: {
        fontSize: "1.4rem",
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: "0.5rem",
    },
    techDesc: {
        color: "#666",
        fontSize: "1rem",
    },
    footer: {
        backgroundColor: "#343a40",
        color: "#fff",
        padding: "2rem 0",
        position: "relative",
        bottom: 0,
        width: "100%",
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
    socialIcons: {
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
    },
    socialIcon: {
        fontSize: "1.5rem",
        color: "#fff",
        cursor: "pointer",
    },
};

export default Home;
