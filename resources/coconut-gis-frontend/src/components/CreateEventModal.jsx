import { useState, useEffect, useMemo, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";

// eslint-disable-next-line react/prop-types
const CreateEventModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        cover_image: "",
        program_name: "",
        program_description: "",
        program_location: { x: 0, y: 0 },
        program_category: "",
    });

    const mapRef = useRef(null);
    const mapTargetElement = useRef(null);
    const prosperidadCoords = fromLonLat([125.91532, 8.599884]);

    const mapView = useMemo(
        () =>
            new View({
                center: prosperidadCoords,
                zoom: 15,
            }),
        [prosperidadCoords]
    );

    const mapboxAccessToken =
        "pk.eyJ1Ijoia2FydXJvb29vIiwiYSI6ImNtMnN4cDNoMzAyaXUydm9wdzZ1N3Q4NWoifQ.Oz35yPC6kh4Rpd_eCIGaNQ";
    const mapboxTile = useMemo(
        () =>
            new TileLayer({
                title: "Mapbox Streets",
                type: "base",
                source: new XYZ({
                    url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${mapboxAccessToken}`,
                }),
            }),
        [mapboxAccessToken]
    );

    useEffect(() => {
        if (!isOpen || !mapTargetElement.current) return;

        mapRef.current = new Map({
            target: mapTargetElement.current,
            view: mapView,
            layers: [mapboxTile],
        });

        mapRef.current.on("click", (event) => {
            const [lon, lat] = mapRef.current.getCoordinateFromPixel(
                event.pixel
            );
            setFormData((prev) => ({
                ...prev,
                program_location: { x: lon.toFixed(6), y: lat.toFixed(6) },
            }));
        });

        return () => {
            mapRef.current.setTarget(null);
        };
    }, [isOpen, mapView, mapboxTile]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev,
                    cover_image: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Submitted Data:", formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modalContainer}>
                <button style={styles.closeButton} onClick={onClose}>
                    <FaTimes size={18} />
                </button>
                <h2 style={styles.header}>Create Program</h2>
                <form style={styles.form}>
                    <label style={styles.label}>
                        Cover Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Program Name
                        <input
                            type="text"
                            name="program_name"
                            value={formData.program_name}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Program Description
                        <textarea
                            name="program_description"
                            value={formData.program_description}
                            onChange={handleChange}
                            style={styles.textarea}
                        />
                    </label>
                    <label style={styles.label}>
                        Program Category
                        <input
                            type="text"
                            name="program_category"
                            value={formData.program_category}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.label}>
                        Program Location (click somewhere on the map)
                    </label>
                    <div
                        ref={mapTargetElement}
                        style={styles.mapContainer}
                    ></div>
                    <p style={styles.coordinates}>
                        Coordinates: X: {formData.program_location.x}, Y:{" "}
                        {formData.program_location.y}
                    </p>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={styles.submitButton}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "600px",
        padding: "2rem",
        position: "relative",
        maxHeight: "60vh",
        overflowY: "auto",
    },
    closeButton: {
        position: "absolute",
        top: "1rem",
        right: "1rem",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    header: {
        marginBottom: "1.5rem",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        fontWeight: "bold",
    },
    input: {
        padding: "0.75rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "1rem",
        backgroundColor: "#FFFF",
    },
    textarea: {
        padding: "0.75rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "1rem",
        backgroundColor: "#FFFF",
        minHeight: "80px",
    },
    mapContainer: {
        height: "300px",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "1rem",
    },
    coordinates: {
        textAlign: "center",
        fontSize: "0.9rem",
        color: "#555",
    },
    submitButton: {
        padding: "0.75rem 1.5rem",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#27ae60",
        color: "#fff",
        fontSize: "1rem",
        cursor: "pointer",
    },
};

export default CreateEventModal;
