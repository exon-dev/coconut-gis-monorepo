import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAdminStore } from "../../store/admin";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
    const { admin } = useAdminStore();

    const localizer = momentLocalizer(moment);

    useEffect(() => {
        setEvents([
            {
                title: "Event 1",
                start: new Date(2024, 11, 20, 10, 0),
                end: new Date(2024, 11, 20, 12, 0),
            },
            {
                title: "Event 2",
                start: new Date(2024, 11, 21, 14, 0),
                end: new Date(2024, 11, 21, 16, 0),
            },
        ]);
    }, []);

    const handleCreateEventClick = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setNewEvent({ title: "", start: "", end: "" });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { title, start, end } = newEvent;

        if (title && start && end) {
            setEvents((prevEvents) => [
                ...prevEvents,
                { title, start: new Date(start), end: new Date(end) },
            ]);
            handleModalClose();
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1>Events</h1>
                {admin.role === "admin" && (
                    <Button
                        variant="primary"
                        onClick={handleCreateEventClick}
                        style={styles.createButton}
                    >
                        Create New Event
                    </Button>
                )}
                <div style={styles.listContainer}>
                    <h3>Event List</h3>
                    <ul>
                        {events.map((event, index) => (
                            <li key={index}>
                                {event.title} -{" "}
                                {moment(event.start).format("LLL")} to{" "}
                                {moment(event.end).format("LLL")}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={styles.calendarContainer}>
                    <h3>Event Calendar</h3>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={styles.calendar}
                    />
                </div>

                {/* Modal for creating new events */}
                <Modal show={showModal} onHide={handleModalClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newEvent.title}
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
                                <Form.Label>Start Date and Time</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={newEvent.start}
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
                                    value={newEvent.end}
                                    onChange={(e) =>
                                        setNewEvent((prev) => ({
                                            ...prev,
                                            end: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                style={styles.submitButton}
                            >
                                Save Event
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
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
    },
    container: {
        padding: "2rem",
    },
    createButton: {
        marginBottom: "1rem",
    },
    listContainer: {
        marginBottom: "2rem",
    },
    calendarContainer: {
        marginTop: "2rem",
    },
    calendar: {
        height: "500px",
    },
    submitButton: {
        marginTop: "1rem",
    },
};

export default Events;
