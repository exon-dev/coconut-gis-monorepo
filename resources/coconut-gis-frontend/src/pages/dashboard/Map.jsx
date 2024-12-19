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
import { useAdminStore } from "../../store/admin";
import { Row, Col, Badge } from "react-bootstrap";

const MapComponent = () => {
    const admin = useAdminStore((state) => state.admin);
    const { barangays, fetchBarangays } = useBarangays();
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
    const [detailsOfSelectedBarangay, setDetailsOfSelectedBarangay] = useState(
        {}
    );
    const [isConfigMinimized, setIsConfigMinimized] = useState(false);
    const [affectedPlots, setAffectedPlots] = useState([]);
    const [unaffectedPlots, setUnaffectedPlots] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [farmers, setFarmers] = useState([]);
    const [filteredFarmers, setFilteredFarmers] = useState([]);
    const [selectedAffected, setSelectedAffected] = useState([]);
    const [selectedUnaffected, setSelectedUnaffected] = useState([]);
    const [
        selectedAffectedLandsPerBarangay,
        setSelectedAffectedLandsPerBarangay,
    ] = useState([]);
    const [
        selectedUnaffectedLandsPerBarangay,
        setSelectedUnaffectedLandsPerBarangay,
    ] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
            const featureOne = new Feature({
                geometry: polygon,
            });
            featureOne.setStyle(
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
            vectorSource.addFeature(featureOne);
        });

        affectedPlots.forEach((plot) => {
            const polygon = new Polygon(plot);
            const featureTwo = new Feature({
                geometry: polygon,
            });
            featureTwo.setStyle(
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
            vectorSource.addFeature(featureTwo);
        });
    }, [unaffectedPlots, affectedPlots, vectorSource]);

    const handleBarangayChange = (e) => {
        const selectedName = e.target.value;
        setSelectedBarangay(selectedName);

        const selectedBarangay = barangays.find(
            (barangay) => barangay.barangay_name === selectedName
        );

        const selectedBarangayIndex = barangays.findIndex(
            (barangay) => barangay.barangay_name === selectedName
        );

        if (selectedBarangayIndex === -1) return;

        setDetails({
            ...details,
            barangay_id: barangays[selectedBarangayIndex].barangay_id,
        });

        setDetailsOfSelectedBarangay(barangays[selectedBarangayIndex]);

        console.log("details", detailsOfSelectedBarangay);

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

            console.log(barangays);

            if (selectedBarangay.lands.length > 0) {
                const affected = selectedBarangay.lands.filter(
                    (land) => land.is_affected
                );
                const unaffected = selectedBarangay.lands.filter(
                    (land) => !land.is_affected
                );

                // Parse land_location for affected and unaffected lands
                const affectedLocations = affected.map((land) =>
                    JSON.parse(land.land_location)
                );
                const unaffectedLocations = unaffected.map((land) =>
                    JSON.parse(land.land_location)
                );
                setSelectedAffectedLandsPerBarangay(affectedLocations);
                setSelectedUnaffectedLandsPerBarangay(unaffectedLocations);

                console.log(affectedLocations, unaffectedLocations);
            }
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

        setIsLoading(true);

        if (isLoading) toast.loading("Saving new farmer, Please wait");

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

                const responseAffected = await fetch(build("land/create"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        is_affected: true,
                        land_location: JSON.stringify(affectedPlots),
                        farmer_id: data.farmer_id,
                        barangay_id: details.barangay_id,
                    }),
                });

                if (!responseAffected.ok) {
                    throw new Error("Error saving affected land.");
                }

                const responseUnaffected = await fetch(build("land/create"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        is_affected: false,
                        land_location: JSON.stringify(unaffectedPlots),
                        farmer_id: data.farmer_id,
                        barangay_id: details.barangay_id,
                    }),
                });

                if (!responseUnaffected.ok) {
                    throw new Error("Error saving unaffected land.");
                }

                toast.success("Farmer successfully saved!");
                fetchFarmers("");
                fetchBarangays();
            } else {
                const text = await response.text();
                console.error("Response is not JSON:", text);
                toast.error("Error saving new farmer. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error saving new farmer. Please try again.");
            return new Error(err);
        } finally {
            setIsLoading(false);
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

    const fetchFarmers = async (query) => {
        try {
            const response = await fetch(build(`farmer/all?search=${query}`), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setFarmers(data);
            setFilteredFarmers(data);
        } catch (error) {
            console.error("Error fetching farmers:", error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);

        const filtered = farmers.filter((farmer) =>
            farmer.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredFarmers(filtered);

        setShowDropdown(query !== "" && filtered.length > 0);
    };

    const handleFarmerSelect = (farmer) => {
        setSearchTerm(farmer.name);
        setShowDropdown(false);

        if (selectedAffected.length > 0 || selectedUnaffected.length > 0) {
            setSelectedAffected([]);
            setSelectedUnaffected([]);
        }

        setDetails({
            name: farmer.name,
            gender: farmer.gender,
            barangay_id: farmer.barangay.barangay_id,
            number_of_coconut_trees: farmer.number_of_coconut_trees,
        });

        setSelectedBarangay(farmer.barangay.barangay_name);

        const coords = fromLonLat([
            parseFloat(farmer.barangay.x_coordinate),
            parseFloat(farmer.barangay.y_coordinate),
        ]);

        map.getView().animate({
            center: coords,
            duration: 1000,
            zoom: 17,
        });

        farmer.lands.forEach((land) => {
            if (land.is_affected) {
                setSelectedAffected(JSON.parse(land.land_location));
            } else {
                setSelectedUnaffected(JSON.parse(land.land_location));
            }
        });
    };

    useEffect(() => {
        vectorSource.clear();

        selectedUnaffected.forEach((plot) => {
            const polygon = new Polygon(plot);
            const featureTwo = new Feature({
                geometry: polygon,
            });

            featureTwo.setStyle(
                new Style({
                    fill: new Fill({
                        color: "rgba(0, 255, 0, 0.3)",
                    }),
                    stroke: new Stroke({
                        color: "#00ff00",
                        width: 2,
                    }),
                })
            );
            vectorSource.addFeature(featureTwo);
        });

        selectedAffected.forEach((plot) => {
            const polygon = new Polygon(plot);
            const featureOne = new Feature({
                geometry: polygon,
            });

            featureOne.setStyle(
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
            vectorSource.addFeature(featureOne);
        });
    }, [selectedAffected, selectedUnaffected, vectorSource]);

    useEffect(() => {
        vectorSource.clear();

        selectedUnaffectedLandsPerBarangay.forEach((unaffected) => {
            unaffected.forEach((plot) => {
                const polygon = new Polygon(plot);
                const featureOne = new Feature({
                    geometry: polygon,
                });

                featureOne.setStyle(
                    new Style({
                        fill: new Fill({
                            color: "rgba(0, 255, 0, 0.3)",
                        }),
                        stroke: new Stroke({
                            color: "#00ff00",
                            width: 2,
                        }),
                    })
                );
                vectorSource.addFeature(featureOne);
            });
        });

        selectedAffectedLandsPerBarangay.forEach((affected) => {
            affected.forEach((plot) => {
                const polygon = new Polygon(plot);
                const featureTwo = new Feature({
                    geometry: polygon,
                });

                featureTwo.setStyle(
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
                vectorSource.addFeature(featureTwo);
            });
        });
    }, [
        selectedAffectedLandsPerBarangay,
        selectedUnaffectedLandsPerBarangay,
        vectorSource,
    ]);

    useEffect(() => {
        fetchFarmers();
    }, []);

    return (
        <div
            id="map"
            style={{
                height: "100vh",
                width: "100vw",
                position: "relative",
                marginTop: "4rem",
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
                        <div className="input-group mb-3 ">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Farmer"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => {
                                    setShowDropdown(true);
                                }}
                            />
                            {/* Dropdown */}
                            {showDropdown && filteredFarmers.length > 0 && (
                                <ul
                                    className="dropdown-menu show"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        zIndex: 1000,
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {filteredFarmers.map((farmer) => (
                                        <li
                                            key={farmer.id}
                                            className="dropdown-item"
                                            onClick={() =>
                                                handleFarmerSelect(farmer)
                                            }
                                        >
                                            {farmer.name}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Message when no results found */}
                            {showDropdown && filteredFarmers.length === 0 && (
                                <div
                                    className="dropdown-menu show"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                    }}
                                >
                                    <p className="dropdown-item text-muted">
                                        No farmers found
                                    </p>
                                </div>
                            )}
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
                                <Col className="gap-3 my-4 border-top border-bottom py-3">
                                    <Col
                                        sm={6}
                                        md={4}
                                        className="d-flex align-items-center justify-items-center"
                                    >
                                        <div className="d-flex flex-row gap-4 justify-items-center">
                                            <p className="mb-1 text-muted text-truncate">
                                                Total Farmers
                                            </p>
                                            <div className="d-flex align-items-center">
                                                <Badge
                                                    bg="primary"
                                                    className="me-2"
                                                >
                                                    {
                                                        detailsOfSelectedBarangay.farmers_count
                                                    }
                                                </Badge>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col
                                        sm={6}
                                        md={4}
                                        className="d-flex align-items-center"
                                    >
                                        <div className="d-flex flex-row gap-4 justify-items-center">
                                            <p className="mb-1 text-muted text-truncate">
                                                Total Coconut Trees Planted
                                            </p>
                                            <div className="d-flex align-items-center">
                                                <Badge
                                                    bg="success"
                                                    className="me-2"
                                                >
                                                    {
                                                        detailsOfSelectedBarangay.coconut_trees_planted
                                                    }
                                                </Badge>
                                            </div>
                                        </div>
                                    </Col>
                                </Col>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Full name (First Name, Last Name)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={details.name ?? ""}
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
                                        value={details.gender ?? ""}
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
                                        placeholder={
                                            details.number_of_coconut_trees ?? 0
                                        }
                                        onChange={(e) => {
                                            setDetails({
                                                ...details,
                                                number_of_coconut_trees:
                                                    e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                {admin.role === "admin" ? (
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Plot Areas that has been un/affected
                                            by Pest Infestation
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
                                ) : (
                                    <div className="mt-2">
                                        <p className="text-center">
                                            Land areas affected by Pest
                                            Infestation
                                        </p>
                                        <Row className="gap-2">
                                            <Col className="d-flex align-items-center">
                                                <div
                                                    style={{
                                                        width: "1rem",
                                                        height: "1rem",
                                                        backgroundColor: "red",
                                                        borderRadius: "50%",
                                                    }}
                                                ></div>
                                                <p className="mb-0 ms-2">
                                                    Affected
                                                </p>
                                            </Col>
                                            <Col className="d-flex align-items-center">
                                                <div
                                                    style={{
                                                        width: "1rem",
                                                        height: "1rem",
                                                        backgroundColor:
                                                            "green",
                                                        borderRadius: "50%",
                                                    }}
                                                ></div>
                                                <p className="mb-0 ms-2">
                                                    Unaffected
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
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
