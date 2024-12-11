import { useEffect, useMemo, useRef, useState } from "react";

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
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import { click } from "ol/events/condition";
import { toast, Toaster } from "sonner";
import { useBarangays } from "../../store/barangays";
import build from "../../utils/dev";

const MapComponent = () => {
    const { barangays } = useBarangays();
    const mapTargetElement = useRef(null);
    const popoverRef = useRef(null);

    const [details, setDetails] = useState({
        name: "",
        gender: "",
        barangay_id: null,
        number_of_coconut_trees: 0,
    });

    const [map, setMap] = useState(null);
    const [draw, setDraw] = useState(null);
    const [popoverContent, setPopoverContent] = useState(null);

    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [isConfigMinimized, setIsConfigMinimized] = useState(false);
    const [affectedPlots, setAffectedPlots] = useState([]);
    const [unaffectedPlots, setUnaffectedPlots] = useState([]);

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
        setMap(mapInstance);

        const handleResize = () => {
            mapInstance.updateSize();
        };

        window.addEventListener("resize", handleResize);

        setTimeout(() => {
            mapInstance.updateSize();
        }, 100);

        const overlay = new Overlay({
            element: popoverRef.current,
            positioning: "center-center",
            stopEvent: false,
        });
        mapInstance.addOverlay(overlay);

        return () => {
            mapInstance.setTarget(null);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (!map || !barangays) return;

        vectorSource.clear();

        if (!selectedBarangay) {
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

            const select = new Select({
                condition: click,
                layers: [vectorLayer],
            });

            select.on("select", (e) => {
                const selectedFeature = e.selected[0];
                if (selectedFeature) {
                    const coordinates = selectedFeature
                        .getGeometry()
                        .getInteriorPoint()
                        .getCoordinates();
                    const farmersCount = selectedFeature.get("farmers_count");
                    const landsCount = selectedFeature.get("lands_count");
                    setPopoverContent(
                        `Farmers: ${farmersCount}\nLands: ${landsCount}`
                    );
                    popoverRef.current.style.display = "block";
                    map.getOverlayById(popoverRef.current).setPosition(
                        coordinates
                    );
                } else {
                    setPopoverContent(null);
                    popoverRef.current.style.display = "none";
                }
            });

            map.addInteraction(select);

            return () => {
                map.removeInteraction(select);
            };
        }
    }, [barangays, map, vectorSource, vectorLayer, selectedBarangay]);

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
        const selectedBarangayIndex = barangays.findIndex(
            (barangay) => barangay.barangay_name === selectedName
        );

        if (selectedBarangayIndex === -1) return;

        setDetails({
            ...details,
            barangay_id: barangays[selectedBarangayIndex].barangay_id,
        });

        const selectedBarangay = barangays.find(
            (barangay) => barangay.barangay_name === selectedName
        );

        if (selectedBarangay) {
            const coords = fromLonLat([
                parseFloat(selectedBarangay.x_coordinate),
                parseFloat(selectedBarangay.y_coordinate),
            ]);
            map.getView().animate({
                center: coords,
                duration: 1000,
                zoom: 17,
            });
        }
    };

    const handleSaveNewFarmer = async () => {
        if (Object.values(details).some((value) => !value)) {
            toast.error("Please fill out all fields.");
            return;
        }

        if (affectedPlots.length === 0 && unaffectedPlots.length === 0) {
            toast.error("Please select at least one plot.");
            return;
        }

        try {
            const response = await fetch(build("farmer/create"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: details.name,
                    gender: details.gender,
                    number_of_coconut_trees: Number(
                        details.number_of_coconut_trees
                    ),
                    barangay_id: details.barangay_id,
                }),
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();

                //also for this one
                const uniqueAffectedPlots = affectedPlots.filter(
                    (plot) =>
                        !unaffectedPlots.some(
                            (unaffectedPlot) =>
                                JSON.stringify(unaffectedPlot) ===
                                JSON.stringify(plot)
                        )
                );

                //still problem here
                const uniqueUnaffectedPlots = unaffectedPlots.filter(
                    (plot) =>
                        !affectedPlots.some(
                            (affectedPlot) =>
                                JSON.stringify(affectedPlot) ===
                                JSON.stringify(plot)
                        )
                );

                uniqueAffectedPlots.forEach(async (plot) => {
                    const response = await fetch(build("land/create"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({
                            is_affected: true,
                            land_location: JSON.stringify(
                                plot.flatMap(([x, y]) => [y, x])
                            ),
                            farmer_id: data.farmer_id,
                            barangay_id: details.barangay_id,
                        }),
                    }).then((res) => res.json());

                    if (response.status !== 201) {
                        throw new Error("Error saving affected land.");
                    }
                });

                uniqueUnaffectedPlots.forEach(async (plot) => {
                    const response = await fetch(build("land/create"), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                        body: JSON.stringify({
                            is_affected: false,
                            land_location: JSON.stringify(
                                plot.flatMap(([x, y]) => [y, x])
                            ),
                            farmer_id: data.farmer_id,
                            barangay_id: details.barangay_id,
                        }),
                    }).then((res) => res.json());

                    if (response.status !== 201) {
                        throw new Error("Error saving affected land.");
                    }
                });
            } else {
                const text = await response.text();
                console.error("Response is not JSON:", text);
                toast.error("Error saving new farmer. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error saving new farmer. Please try again.");
            return new Error(err);
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
                                {barangays &&
                                    barangays.map((barangay) => (
                                        <option
                                            key={barangay.barangay_id}
                                            value={barangay.barangay_name}
                                        >
                                            {barangay.barangay_name}
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
                                        onChange={(e) => {
                                            setDetails({
                                                ...details,
                                                name: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Gender</label>
                                    <select
                                        className="form-select"
                                        onChange={(e) => {
                                            setDetails({
                                                ...details,
                                                gender: e.target.value,
                                            });
                                        }}
                                    >
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
                                        onChange={(e) => {
                                            setDetails({
                                                ...details,
                                                number_of_coconut_trees:
                                                    e.target.value,
                                            });
                                        }}
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
                                        <button
                                            onClick={handleSaveNewFarmer}
                                            className="btn btn-warning"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            {popoverContent && (
                <div
                    ref={popoverRef}
                    className="popover"
                    style={{
                        position: "absolute",
                        backgroundColor: "white",
                        padding: "10px",
                        borderRadius: "5px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                        zIndex: 1000,
                        display: popoverContent ? "block" : "none",
                    }}
                >
                    {popoverContent}
                </div>
            )}
        </div>
    );
};

export default MapComponent;
