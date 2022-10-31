import React from "react";
import Login from "./containers/LoginView/Login";
import Main from "./containers/MainView/Main";
import Error from "./components/ErrorView/Error";
import Registration from "./containers/RegistrationView/Registration";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function ReactRouterSetup(): JSX.Element {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Registration" element={<Registration />} />
          <Route path="/Error" element={<Error />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default ReactRouterSetup;
