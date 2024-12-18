import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RootLayout from "./pages/dashboard/layout";

import {
    Dashboard,
    Map,
    Profiles,
    Market,
    LGUActivities,
    Events,
} from "./pages/dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<RootLayout />}>
                    <Route path="" element={<Dashboard />} />
                    <Route path="map" element={<Map />} />
                    <Route path="profiles" element={<Profiles />} />
                    <Route path="market" element={<Market />} />
                    <Route path="programs" element={<LGUActivities />} />
                    <Route path="events" element={<Events />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
