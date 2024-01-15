import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import LoginPage from "./components/LoginPage/LoginPage";
import reportWebVitals from "./reportWebVitals";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import CatalogPage from "./components/CatalogPage/CatalogPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

reportWebVitals();
