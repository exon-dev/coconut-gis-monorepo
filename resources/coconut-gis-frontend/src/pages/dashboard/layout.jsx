import { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    FaLeaf,
    FaTachometerAlt,
    FaMap,
    FaUser,
    FaUsers,
    FaShoppingCart,
    FaCalendarAlt,
    FaUserCircle,
} from "react-icons/fa";
import { useAdminStore, useSetAdmin } from "../../store/admin";

const RootLayout = () => {
    useSetAdmin();
    const admin = useAdminStore((state) => state.admin);
    const location = useLocation();

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
        { path: "/dashboard/map", label: "Map", icon: <FaMap /> },
        { path: "/dashboard/profiles", label: "Profiles", icon: <FaUser /> },
        { path: "/dashboard/accounts", label: "Accounts", icon: <FaUsers /> },
        {
            path: "/dashboard/market",
            label: "Market",
            icon: <FaShoppingCart />,
        },
        {
            path: "/dashboard/lgu-activities",
            label: "LGU Activities",
            icon: <FaCalendarAlt />,
        },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
    }, []);

    return (
        <div>
            <Navbar
                bg="light"
                expand="lg"
                fixed="top"
                style={{ width: "100%" }}
            >
                <Container>
                    <Navbar.Brand as={Link} to="/dashboard">
                        <FaLeaf
                            style={{
                                fontSize: "2rem",
                                color: "#27ae60",
                                marginRight: "0.5rem",
                            }}
                        />
                        CocoFarm
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto gap-3">
                            {navItems.map((item) => (
                                <Nav.Link
                                    as={Link}
                                    to={item.path}
                                    key={item.path}
                                    className={
                                        location.pathname === item.path
                                            ? "active"
                                            : ""
                                    }
                                    style={
                                        location.pathname === item.path
                                            ? {
                                                  color: "#27ae60",
                                                  fontWeight: "bold",
                                              }
                                            : {}
                                    }
                                >
                                    {item.icon} {item.label}
                                </Nav.Link>
                            ))}
                        </Nav>
                        <Nav>
                            <NavDropdown
                                title={
                                    <FaUserCircle
                                        style={{ fontSize: "1.5rem" }}
                                    />
                                }
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item as={Link} to="/profile">
                                    Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/settings">
                                    Settings
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/logout">
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container style={{ marginTop: "5rem" }}>
                <Outlet />
            </Container>
        </div>
    );
};

export default RootLayout;
