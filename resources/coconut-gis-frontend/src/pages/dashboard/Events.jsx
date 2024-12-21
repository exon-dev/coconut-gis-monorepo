import { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAdminStore } from "../../store/admin";
import { FaMapMarkerAlt, FaUserCheck, FaCalendarAlt } from "react-icons/fa";
import { useEventsStore } from "../../store/events";
import build from "../../utils/dev";
import { toast, Toaster } from "sonner";

const Events = () => {
    const { events, fetchEvents } = useEventsStore();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);

    const [newEvent, setNewEvent] = useState({
        title: "",
        start: "",
        end: "",
        description: "",
        location: "",
        eligibility: "",
    });
    const { admin } = useAdminStore();

    const localizer = momentLocalizer(moment);

    const handleCreateEventClick = () => {
        setEventToEdit(null);
        setShowModal(true);
    };

    const handleUpdateEventClick = (event) => {
        setEventToEdit(event);
        setShowModal(true);
    };

    console.log(events);

    const handleModalClose = () => {
        setShowModal(false);
        setNewEvent({
            title: "",
            start: "",
            end: "",
            description: "",
            location: "",
            eligibility: "",
        });
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const { title, start, end, description, location, eligibility } =
            newEvent;

        if (
            !title ||
            !start ||
            !end ||
            !description ||
            !location ||
            !eligibility
        ) {
            toast.error("Please fill out all fields.");
            return;
        }

        if (title && start && end) {
            if (eventToEdit) {
                const updatedEvent = {
                    event_id: eventToEdit.event_id,
                    event_name: title,
                    event_description: description,
                    start_date: start,
                    end_date: end,
                    event_location: location,
                    participant_eligibility: eligibility,
                };

                try {
                    const response = await fetch(build(`event/edit`), {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({
                            ...updatedEvent,
                            admin_id: admin.admin_id,
                        }),
                    });

                    if (!response.ok) {
                        toast.error("An error occurred. Please try again.");
                        return;
                    }

                    toast.success("Event updated successfully.");
                    fetchEvents();
                    setEventToEdit(null);
                    setShowModal(false);
                } catch (err) {
                    toast.error("An error occurred. Please try again.");
                    return new Error(err);
                }
            } else {
                try {
                    const response = await fetch(build("event/create"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({
                            event_name: title,
                            event_description: description,
                            start_date: start,
                            end_date: end,
                            event_location: location,
                            participant_eligibility: eligibility,
                            admin_id: admin.admin_id,
                        }),
                    });

                    if (!response.ok) {
                        toast.error("An error occurred. Please try again.");
                        return;
                    }

                    toast.success("Event created successfully.");
                    fetchEvents();
                    setShowModal(false);
                } catch (err) {
                    toast.error("An error occurred. Please try again.");
                    return new Error(err);
                }
            }
            handleModalClose();
        }
    };

    const handleDeleteEvent = async (event_id) => {
        try {
            const response = await fetch(build(`event/delete/${event_id}`), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                toast.error("An error occurred. Please try again.");
                return;
            }

            toast.success("Event deleted successfully.");
            fetchEvents();
            setShowDeleteModal(false);
        } catch (err) {
            toast.error("An error occurred. Please try again.");
            return new Error(err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return (
        <div style={styles.page}>
            <Toaster richColors position="top-center" />
            <div style={styles.container}>
                <h1 style={styles.pageTitle}>Events</h1>
                {admin.role === "admin" && (
                    <Button
                        variant="primary"
                        className="btn btn-success"
                        onClick={handleCreateEventClick}
                        style={styles.createButton}
                    >
                        Create New Event
                    </Button>
                )}

                <Row style={styles.mainRow}>
                    <Col lg={8} md={12} style={styles.eventList}>
                        <h3 style={styles.sectionTitle}>Event List</h3>
                        <div
                            style={{
                                maxHeight: "500px",
                                overflowY: "auto",
                            }}
                        >
                            {events.length > 0 ? (
                                events.map((event, index) => (
                                    <div key={index} style={styles.eventCard}>
                                        <h4 style={styles.eventTitle}>
                                            {event.event_name}
                                            {admin.role === "admin" &&
                                                admin.admin_id ===
                                                    event.admin_id && (
                                                    <div
                                                        style={
                                                            styles.eventActions
                                                        }
                                                    >
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleUpdateEventClick(
                                                                    event
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() =>
                                                                setShowDeleteModal(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                )}
                                        </h4>
                                        <p style={styles.eventDescription}>
                                            {event.event_description}
                                        </p>
                                        <div style={styles.eventDetails}>
                                            <div style={styles.eventInfo}>
                                                <FaMapMarkerAlt
                                                    size={16}
                                                    style={styles.icon}
                                                />
                                                <span>
                                                    {event.event_location}
                                                </span>
                                            </div>
                                            <div style={styles.eventInfo}>
                                                <FaUserCheck
                                                    size={16}
                                                    style={styles.icon}
                                                />
                                                <span>
                                                    {
                                                        event.participant_eligibility
                                                    }
                                                </span>
                                            </div>
                                            <div style={styles.eventInfo}>
                                                <FaCalendarAlt
                                                    size={16}
                                                    style={styles.icon}
                                                />
                                                <span>
                                                    {moment(
                                                        event.start_date
                                                    ).format("LLL")}{" "}
                                                    -{" "}
                                                    {moment(
                                                        event.end_date
                                                    ).format("LLL")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No events found</p>
                            )}
                        </div>
                    </Col>

                    <Col lg={4} md={12} style={styles.calendarContainer}>
                        <h3 style={styles.sectionTitle}>Event Calendar</h3>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start_date"
                            endAccessor="end_date"
                            style={styles.calendar}
                        />
                    </Col>
                </Row>

                <Modal show={showModal} onHide={handleModalClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {eventToEdit ? "Update Event" : "Create New Event"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newEvent.event_title}
                                    onChange={(e) =>
                                        setNewEvent((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newEvent.event_description}
                                    onChange={(e) =>
                                        setNewEvent((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start Date and Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={newEvent.start_date}
                                    onChange={(e) =>
                                        setNewEvent((prev) => ({
                                            ...prev,
                                            start: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>End Date and Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={newEvent.end_date}
                                    onChange={(e) =>
                                        setNewEvent((prev) => ({
                                            ...prev,
                                            end: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newEvent.event_location}
                                    onChange={(e) =>
                                        setNewEvent((prev) => ({
                                            ...prev,
                                            location: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Eligibility</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newEvent.participant_eligibility}
                                    onChange={(e) =>
                                        setNewEvent((prev) => ({
                                            ...prev,
                                            eligibility: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                className="btn btn-success"
                                style={styles.submitButton}
                            >
                                Save Event
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={showDeleteModal}
                    onHide={handleDeleteModalClose}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Are you sure you want to delete this event? This
                            action cannot be undone.
                        </p>
                        <Button
                            variant="danger"
                            onClick={() => {
                                handleDeleteEvent(eventToEdit.event_id);
                            }}
                            className="btn btn-danger"
                        >
                            Yes, Delete
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleDeleteModalClose}
                            className="btn btn-secondary"
                            style={{ marginLeft: "1rem" }}
                        >
                            Cancel
                        </Button>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

const styles = {
    page: {
        width: "100vw",
        height: "120vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "1rem",
    },
    container: {
        maxWidth: "1400px",
        width: "100%",
        marginTop: "2rem",
        padding: "2rem",
        borderRadius: "8px",
        backgroundColor: "#fff",
    },
    pageTitle: {
        textAlign: "center",
        marginBottom: "2rem",
        color: "#333",
    },
    createButton: {
        marginBottom: "1rem",
    },
    mainRow: {
        display: "flex",
        flexDirection: "row",
        gap: "2rem",
    },
    eventList: {
        flex: 2,
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    sectionTitle: {
        fontSize: "1.5rem",
        marginBottom: "1rem",
        fontWeight: "bold",
    },
    eventCard: {
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    eventTitle: {
        fontSize: "1.25rem",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
    },
    eventActions: {
        display: "flex",
        marginLeft: "1rem",
        gap: "5px",
    },
    eventDescription: {
        color: "#555",
        marginBottom: "1rem",
    },
    eventDetails: {
        display: "flex",
        flexDirection: "column",
    },
    eventInfo: {
        display: "flex",
        alignItems: "center",
        marginBottom: "0.5rem",
    },
    icon: {
        marginRight: "8px",
        color: "#27ae60",
    },
    calendarContainer: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    calendar: {
        height: "500px",
    },
    submitButton: {
        marginTop: "1rem",
    },
};

export default Events;
