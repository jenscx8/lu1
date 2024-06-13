import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import ErrorPage from "../pages/ErrorPage.jsx";
import IndexPage, {indexLoader} from "../pages/IndexPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<IndexPage />} loader={indexLoader} />

      <Route path="admin-login" element={<AdminLoginPage />} />

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
