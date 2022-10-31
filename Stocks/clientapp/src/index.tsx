import React from "react";
import ReactDOM from "react-dom/client";
import ReactRouterSetup from "./ReactRouterSetup";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ReactRouterSetup />
  </React.StrictMode>
);
