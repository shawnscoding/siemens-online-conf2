import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { AuthProvider } from "./store/auth/AuthContext";
import { LobbyProvider } from "./store/lobby/LobbyContext";
// import { ConferenceAlertProvider } from "./store/lobby/AlertContext";

ReactDOM.render(
  <Router>
    <AuthProvider>
      <LobbyProvider>
        {/* <ConferenceAlertProvider> */}
        <App />
        {/* </ConferenceAlertProvider> */}
      </LobbyProvider>
    </AuthProvider>
  </Router>,
  document.getElementById("root")
);

serviceWorker.unregister();
