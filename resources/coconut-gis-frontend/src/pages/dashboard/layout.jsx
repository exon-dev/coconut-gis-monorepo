import { useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MdEventNote } from "react-icons/md";
import {
    FaTachometerAlt,
    FaMap,
    FaUser,
    FaShoppingCart,
    FaCalendarAlt,
    FaUserCircle,
} from "react-icons/fa";
import { useAdminStore, useSetAdmin } from "../../store/admin";
import { useBarangays } from "../../store/barangays";
import { toast, Toaster } from "sonner";
import build from "../../utils/dev";
import logo from "../../assets/logo.png";
import { useMarketUpdates } from "../../store/market";

const RootLayout = () => {
    const { fetchMarketUpdates } = useMarketUpdates();
    const { fetchBarangays } = useBarangays();
    useSetAdmin();
    const admin = useAdminStore((state) => state.admin);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const response = await fetch(build("auth/logout"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                toast.error("An error occurred. Please try again.");
                return;
            }
            localStorage.removeItem("admin");
            localStorage.removeItem("token");
            window.location.href = "/";
            toast.success("You have been logged out.", { duration: 5000 });
        } catch (err) {
            toast.error("An error occurred. Please try again.");
            return new Error(err);
        }
    };

    const navItems = [
        { path: "/dashboard", label: "Home", icon: <FaTachometerAlt /> },
        {
            path: "/dashboard/programs",
            label: "Programs",
            icon: <FaCalendarAlt />,
        },
        {
            path: "/dashboard/events",
            label: "Events",
            icon: <MdEventNote />,
        },
        { path: "/dashboard/profiles", label: "Profiles", icon: <FaUser /> },

        {
            path: "/dashboard/market",
            label: "Trade & Market",
            icon: <FaShoppingCart />,
        },
        {
            path: "/dashboard/map",
            label: "Map",
            icon: <FaMap />,
            style: { width: "100%", height: "100vh" },
        },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        } else {
            fetchMarketUpdates();
            fetchBarangays();
        }
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Toaster richColors position="top-center" />
            <Navbar
                bg="light"
                expand="lg"
                fixed="top"
                style={{ width: "100%" }}
            >
                <Container>
                    <Navbar.Brand
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                        as={Link}
                        to="/dashboard"
                    >
                        <img src={logo} alt="logo" style={{ width: "35px" }} />
                        MAO-CIS
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto gap-3">
                            {navItems.map((item) =>
                                admin?.role === "user" &&
                                item.label === "Profiles" ? null : (
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
                                )
                            )}
                        </Nav>
                        <Nav className="d-flex gap-2">
                            <Navbar.Text>Welcome, {admin?.name}</Navbar.Text>
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
                                <NavDropdown.Item>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-primary"
                                    >
                                        Logout
                                    </button>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container>
                <Outlet />
            </Container>
        </div>
    );
};

export default RootLayout;
