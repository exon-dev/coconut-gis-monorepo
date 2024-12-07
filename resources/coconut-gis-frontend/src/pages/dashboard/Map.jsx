import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// OpenLayers imports
import "ol/ol.css";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import Map from "ol/Map";
import View from "ol/View";
import ImageWMS from "ol/source/ImageWMS";
import ImageLayer from "ol/layer/Image";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import { ScaleLine } from "ol/control";
import { fromLonLat } from "ol/proj";
import LayerSwitcher from "ol-layerswitcher";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Draw from "ol/interaction/Draw";
import CircleStyle from "ol/style/Circle";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Group as LayerGroup } from "ol/layer";

const App = () => {
    //creds

    // Refs
    const mapTargetElement = useRef(null);

    // Map state
    const [map, setMap] = useState(null);
    const [mapVal, setMapVal] = useState(null);

    // Toggle states
    const [toggleFullScreen, setToggleFullScreen] = useState(false);
    const [toggleFeatureInfo, setToggleFeatureInfo] = useState(false);
    const [toggleQuery, setToggleQuery] = useState(false);

    // Measurement states
    const [lengthFlag, setLengthFlag] = useState(false);
    const [areaFlag, setAreaFlag] = useState(false);
    const [draw, setDraw] = useState(null);

    // Query states
    const [currentQryLayer, setCurrentQryLayer] = useState(null);
    const [propsValue, setPropsValue] = useState([]);

    // Coordinates
    const prosperidadCoords = fromLonLat([125.5, 8.9333]); // Prosperidad, Agusan Del Sur

    const mapView = useMemo(
        () =>
            new View({
                center: prosperidadCoords,
                zoom: 12,
            }),
        [prosperidadCoords]
    );

    const osmTile = useMemo(
        () =>
            new TileLayer({
                title: "OpenStreetMap",
                type: "base",
                source: new XYZ({
                    url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                }),
            }),
        []
    );

    const geoapifyTile = useMemo(
        () =>
            new TileLayer({
                title: "Geoapify",
                type: "base",
                source: new XYZ({
                    url: "https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=ccade4e35c8a498ca6134fb4c4f7c9f4",
                }),
            }),
        []
    );

    const baseLayers = useMemo(
        () =>
            new LayerGroup({
                layers: [osmTile, geoapifyTile],
            }),
        [osmTile, geoapifyTile]
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
                        radius: 7,
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
            controls: [new ScaleLine()],
            view: mapView,
            layers: [baseLayers, vectorLayer],
        });
        setMap(mapInstance);

        return () => {
            mapInstance.setTarget(null);
        };
    }, []);

    const toggleFullScreenMode = () => {
        if (toggleFullScreen) {
            document.exitFullscreen();
        } else {
            mapTargetElement.current.requestFullscreen();
        }
        setToggleFullScreen(!toggleFullScreen);
    };

    const handleToggleFeatureInfo = () => {
        setToggleFeatureInfo(!toggleFeatureInfo);
        setLengthFlag(false);
        setAreaFlag(false);
        setPropsValue([]);
    };

    const toggleLengthMeasure = () => {
        if (lengthFlag) {
            setLengthFlag(false);
            if (draw) {
                map.removeInteraction(draw);
                setDraw(null);
            }
        } else {
            setLengthFlag(true);
            setAreaFlag(false);
            addInteraction("LineString");
        }
    };

    const toggleAreaMeasure = () => {
        if (areaFlag) {
            setAreaFlag(false);
            if (draw) {
                map.removeInteraction(draw);
                setDraw(null);
            }
        } else {
            setAreaFlag(true);
            setLengthFlag(false);
            addInteraction("Polygon");
        }
    };

    const addInteraction = (geometryType) => {
        const newDraw = new Draw({
            source: vectorSource,
            type: geometryType,
            style: new Style({
                fill: new Fill({
                    color: "rgba(200, 200, 200, 0.6)",
                }),
                stroke: new Stroke({
                    color: "#ffcc33",
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: "rgba(0, 0, 0, 0.7)",
                    }),
                    fill: new Fill({
                        color: "#ffcc33",
                    }),
                }),
            }),
        });
        setDraw(newDraw);
        map.addInteraction(newDraw);
    };

    return (
        <div
            id="map"
            className="py-5 vh-100 w-100 d-flex flex-column justify-content-around align-items-center text-dark"
            ref={mapTargetElement}
        >
            <div className="mb-3 text-center text-white">
                <h1 className="h3 md-display-4 font-weight-bold mb-3">
                    The Map
                </h1>
                <p className="text-white text-justify px-md-5 text-sm">
                    Different colors represent different types of land cover.
                </p>
            </div>
            <div className="w-100 h-100 overflow-hidden position-relative rounded shadow-lg border border-danger p-2">
                <div className="d-flex flex-column position-absolute z-index-50 mt-3 ms-2 gap-2">
                    <button
                        onClick={toggleFullScreenMode}
                        className="bg-primary font-weight-bold h-100 w-100 rounded border-0 d-flex justify-content-center align-items-center hover:bg-success"
                    >
                        <p>Test</p>
                    </button>
                    <button
                        onClick={handleToggleFeatureInfo}
                        className={`${
                            toggleFeatureInfo ? "bg-success" : "bg-primary"
                        } font-weight-bold h-100 w-100 rounded border-0 d-flex justify-content-center align-items-center hover:bg-success`}
                    >
                        <h1>Test 2</h1>
                    </button>
                    <button
                        onClick={toggleLengthMeasure}
                        className={`${
                            lengthFlag ? "bg-success" : "bg-primary"
                        } font-weight-bold h-100 w-100 rounded border-0 d-flex justify-content-center align-items-center hover:bg-success`}
                    >
                        <h1>Test 3</h1>
                    </button>
                    <button
                        onClick={toggleAreaMeasure}
                        className={`${
                            areaFlag ? "bg-success" : "bg-primary"
                        } font-weight-bold h-100 w-100 rounded border-0 d-flex justify-content-center align-items-center hover:bg-success`}
                    >
                        <h1>Test 4</h1>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
