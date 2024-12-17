import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RootLayout from "./pages/dashboard/layout";

import {
    Dashboard,
    Map,
    Profiles,
    Market,
    LGUActivities,
} from "./pages/dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<RootLayout />}>
                    <Route path="" element={<Dashboard />} />
                    <Route path="map" element={<Map />} />
                    <Route path="profiles" element={<Profiles />} />
                    <Route path="market" element={<Market />} />
                    <Route path="programs" element={<LGUActivities />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
