import { useEffect, useMemo, useRef, useState } from "react";

// OpenLayers imports
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Polygon from "ol/geom/Polygon";
import Style from "ol/style/Style";
import Draw from "ol/interaction/Draw";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import CircleStyle from "ol/style/Circle";
import { toast, Toaster } from "sonner";

const MapComponent = () => {
    const mapTargetElement = useRef(null);

    const [map, setMap] = useState(null);
    const [draw, setDraw] = useState(null);

    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [isConfigMinimized, setIsConfigMinimized] = useState(false);
    const [affectedPlots, setAffectedPlots] = useState([]);
    const [unaffectedPlots, setUnaffectedPlots] = useState([]);

    const prosperidadCoords = fromLonLat([125.91532, 8.599884]);

    const barangays = [
        { name: "LUCENA", coords: fromLonLat([125.873077, 8.5666]) },
        { name: "SAN VICENTE", coords: fromLonLat([125.857149, 8.53948]) },
        { name: "SAN PEDRO", coords: fromLonLat([125.885786, 8.551695]) },
        { name: "NAPO", coords: fromLonLat([125.897592, 8.544228]) },
        { name: "LA SUERTE", coords: fromLonLat([125.896321, 8.579757]) },
        { name: "LAS NAVAS", coords: fromLonLat([125.908064, 8.560977]) },
        { name: "MAPAGA", coords: fromLonLat([125.885083, 8.594102]) },
        { name: "AWA", coords: fromLonLat([125.906792, 8.641974]) },
        { name: "AURORA", coords: fromLonLat([125.840243, 8.590985]) },
        { name: "SAN JOAQUIN", coords: fromLonLat([125.891422, 8.635346]) },
    ];

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
        setMap(mapInstance);

        const handleResize = () => {
            mapInstance.updateSize();
        };

        window.addEventListener("resize", handleResize);

        setTimeout(() => {
            mapInstance.updateSize();
        }, 100);

        barangays.forEach((barangay) => {
            const marker = new Feature({
                geometry: new Point(barangay.coords),
                name: barangay.name,
            });
            vectorSource.addFeature(marker);
        });

        return () => {
            mapInstance.setTarget(null);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        vectorSource.clear();

        unaffectedPlots.forEach((plot) => {
            const polygon = new Polygon(plot);
            const feature = new Feature({
                geometry: polygon,
            });
            feature.setStyle(
                new Style({
                    fill: new Fill({
                        color: "rgba(0, 255, 0, 0.5)",
                    }),
                    stroke: new Stroke({
                        color: "#00ff00",
                        width: 2,
                    }),
                })
            );
            vectorSource.addFeature(feature);
        });

        affectedPlots.forEach((plot) => {
            const polygon = new Polygon(plot);
            const feature = new Feature({
                geometry: polygon,
            });
            feature.setStyle(
                new Style({
                    fill: new Fill({
                        color: "rgba(255, 0, 0, 0.5)",
                    }),
                    stroke: new Stroke({
                        color: "#ff0000",
                        width: 2,
                    }),
                })
            );
            vectorSource.addFeature(feature);
        });
    }, [unaffectedPlots, affectedPlots, vectorSource]);

    const handleBarangayChange = (e) => {
        const selectedName = e.target.value;
        setSelectedBarangay(selectedName);

        const selectedBarangay = barangays.find(
            (barangay) => barangay.name === selectedName
        );

        if (selectedBarangay) {
            map.getView().animate({
                center: selectedBarangay.coords,
                duration: 1000,
                zoom: 17,
            });
        }
    };

    const toggleConfigMinimize = () => {
        setIsConfigMinimized(!isConfigMinimized);
    };

    const addInteraction = (color, setPlotState) => {
        if (draw) {
            map.removeInteraction(draw);
        }
        const newDraw = new Draw({
            source: vectorSource,
            type: "Polygon",
            style: new Style({
                fill: new Fill({
                    color: color,
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
        });
        newDraw.on("drawend", (event) => {
            const polygon = event.feature.getGeometry();
            const coordinates = polygon.getCoordinates();
            setPlotState((prevPlots) => [...prevPlots, coordinates]);
            setDraw(null);
        });
        setDraw(newDraw);
        map.addInteraction(newDraw);
    };

    return (
        <div
            id="map"
            style={{
                height: "100vh",
                width: "100vw",
                position: "relative",
                margin: 0,
                padding: 0,
            }}
            ref={mapTargetElement}
        >
            <Toaster position="top-center" richColors />
            <div
                className="controls position-absolute top-0 start-0 mt-4 ms-2 bg-white p-3 shadow"
                style={{
                    width: isConfigMinimized ? "auto" : "300px",
                    zIndex: 1000,
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <div className="mb-2 d-flex gap-4 justify-content-between align-items-center">
                    <h5>Configuration</h5>
                    <button
                        onClick={toggleConfigMinimize}
                        className="btn btn-sm btn-outline-secondary"
                    >
                        {isConfigMinimized ? "+" : "-"}
                    </button>
                </div>
                {!isConfigMinimized && (
                    <>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="barangaySelect"
                                className="form-label"
                            >
                                Select Barangay
                            </label>
                            <select
                                id="barangaySelect"
                                className="form-select"
                                value={selectedBarangay}
                                onChange={handleBarangayChange}
                            >
                                <option value="">Select a barangay</option>
                                {barangays.map((barangay) => (
                                    <option
                                        key={barangay.name}
                                        value={barangay.name}
                                    >
                                        {barangay.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedBarangay && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Full name (Last Name, First Name)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Gender</label>
                                    <select className="form-select">
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Barangay, Municipality
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedBarangay}
                                        readOnly
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Number of coconut trees planted on area
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Plot Areas that has been un/affected by
                                        Pest Infestation
                                    </label>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => {
                                                toast.success(
                                                    "Unaffected Plot Active. Please plot now!"
                                                );
                                                addInteraction(
                                                    "rgba(0, 255, 0, 0.5)",
                                                    setUnaffectedPlots
                                                );
                                            }}
                                            className="btn btn-success"
                                        >
                                            Unaffected
                                        </button>
                                        <button
                                            onClick={() => {
                                                toast.error(
                                                    "Affected Plot Active. Please plot now!"
                                                );
                                                addInteraction(
                                                    "rgba(255, 0, 0, 0.5)",
                                                    setAffectedPlots
                                                );
                                            }}
                                            className="btn btn-danger"
                                        >
                                            Affected
                                        </button>
                                    </div>
                                    <div className="d-flex gap-2 mt-2">
                                        <button
                                            onClick={() => {
                                                setAffectedPlots([]);
                                                setUnaffectedPlots([]);

                                                toast.success(
                                                    "All plots reset"
                                                );
                                            }}
                                            className="btn btn-primary"
                                        >
                                            Reset All Plots
                                        </button>
                                        <button className="btn btn-warning">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MapComponent;
