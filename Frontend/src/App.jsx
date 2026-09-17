import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import KIndevLogin from "./pages/KindevLoginPage";
import KIndevUserConfig from "./pages/KindevUserConfig";
import KindevUserConfigChurn from "./pages/KindevUserConfigChurn";
import KindevDashboard from "./pages/KindevDashboard";
import OwnershipDashboard from "./subpages/Dashboards/OwnershipDashboard";
import RevenueGPDashboard from "./subpages/Dashboards/RevenueGPDashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* Login WITHOUT sidebar */}
        <Route path="/" element={<KIndevLogin />} />

        {/* All pages WITH sidebar */}
        <Route element={<Layout />}>
          <Route path="/user-config" element={<KindevUserConfigChurn />} />
          <Route path="/dashboard" element={<KindevDashboard/>} />
          <Route path="/ownership-dashboard" element={<OwnershipDashboard/>} />
          <Route path="/revenue-dashoard" element={<RevenueGPDashboard/>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;