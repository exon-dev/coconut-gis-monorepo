import { useEffect, useMemo, useRef } from "react";
import { FaBullhorn, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import { useBarangays } from "../../store/barangays";
import { useAdminStore } from "../../store/admin";

const LGUActivities = () => {
    const { barangays } = useBarangays();
    const mapTargetElement = useRef(null);
    const { admin } = useAdminStore();

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
                    url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}?access_token=${mapboxAccessToken}`,
                }),
            }),
        [mapboxAccessToken]
    );

    const vectorSource = useMemo(() => new VectorSource(), []);
    const vectorLayer = useMemo(
        () =>
            new VectorLayer({
                source: vectorSource,
                style: new Style({
                    fill: new Fill({
                        color: "rgba(255, 255, 255, 0.2)",
                    }),
                    stroke: new Stroke({
                        color: "#ffcc33",
                        width: 2,
                    }),
                    image: new CircleStyle({
                        radius: 5,
                        fill: new Fill({
                            color: "#ffcc33",
                        }),
                    }),
                }),
            }),
        [vectorSource]
    );

    useEffect(() => {
        if (!mapTargetElement.current) return;

        const mapInstance = new Map({
            target: mapTargetElement.current,
            view: mapView,
            layers: [mapboxTile, vectorLayer],
        });

        return () => {
            mapInstance.setTarget(null);
        };
    }, [mapView, mapboxTile, vectorLayer]);

    useEffect(() => {
        if (!vectorSource || !barangays) return;

        vectorSource.clear();

        barangays.forEach((barangay) => {
            if (!barangay.coordinate_points) return;

            try {
                let coordinates = JSON.parse(barangay.coordinate_points);

                if (
                    coordinates.length === 1 &&
                    Array.isArray(coordinates[0][0])
                ) {
                    coordinates = coordinates[0];
                }

                const polygon = new Polygon([coordinates]);
                const feature = new Feature({
                    geometry: polygon,
                    name: barangay.barangay_name,
                    farmers_count: barangay.farmers_count,
                    lands_count: barangay.lands_count,
                });
                feature.setStyle(
                    new Style({
                        fill: new Fill({
                            color: "rgba(0, 255, 0, 0.1)",
                        }),
                        stroke: new Stroke({
                            color: "#00ff00",
                            width: 2,
                        }),
                    })
                );
                vectorSource.addFeature(feature);
            } catch (error) {
                console.error("Error parsing coordinates:", error);
            }
        });
    }, [barangays, vectorSource]);

    return (
        <div style={styles.container}>
            <div style={styles.leftContainer}>
                {admin.role === "admin" && (
                    <button style={styles.createEventButton}>
                        Create Event
                    </button>
                )}
                <motion.div
                    style={{ ...styles.card, ...styles.feedCard }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div style={styles.cardHeader}>
                        <FaBullhorn size={24} style={styles.icon} />
                        <h3>Announcements</h3>
                    </div>
                    <div style={styles.feedContent}>
                        {/* Render announcements from the database here */}
                        <p>Announcement 1: Lorem ipsum dolor sit amet.</p>
                        <p>Announcement 2: Consectetur adipiscing elit.</p>
                        <p>
                            Announcement 3: Integer nec odio. Praesent libero.
                        </p>
                    </div>
                </motion.div>
                <motion.div
                    style={{ ...styles.card, ...styles.feedCard }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div style={styles.cardHeader}>
                        <FaChartLine size={24} style={styles.icon} />
                        <h3>Market Updates</h3>
                    </div>
                    <div style={styles.feedContent}>
                        {/* Render market updates from the database here */}
                        <p>Market Update 1: Sed cursus ante dapibus diam.</p>
                        <p>
                            Market Update 2: Sed nisi. Nulla quis sem at nibh.
                        </p>
                        <p>
                            Market Update 3: Elementum imperdiet. Duis sagittis.
                        </p>
                    </div>
                </motion.div>
            </div>
            <div style={styles.mapContainer} ref={mapTargetElement}></div>
        </div>
    );
};

const styles = {
    container: {
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: "2rem",
        padding: "2rem",
        height: "100vh",
        width: "100vw",
        paddingTop: "5rem",
    },
    leftContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        overflowY: "auto",
    },
    card: {
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        textAlign: "left",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
    },
    feedCard: {
        padding: "1rem",
        border: "1px solid #e0e0e0",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: "1rem",
    },
    icon: {
        marginRight: "0.5rem",
        color: "#333",
    },
    feedContent: {
        marginTop: "1rem",
        color: "#333",
    },
    mapContainer: {
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        overflow: "hidden",
        height: "100%",
    },
    createEventButton: {
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#27ae60",
        color: "#fff",
        cursor: "pointer",
        alignSelf: "flex-start",
        marginBottom: "1rem",
        transition: "background-color 0.2s",
    },
    "@media (max-width: 768px)": {
        container: {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto 1fr",
        },
        mapContainer: {
            height: "50vh",
        },
    },
};

export default LGUActivities;
