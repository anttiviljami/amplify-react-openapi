import React, { useEffect } from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import logo from "./logo.svg";
import OpenAPI from "amplify-openapi-client";
import awsconfig from "./aws-exports";
import "./App.css";

function App() {
  useEffect(() => {
    (async () => {
      const api = new OpenAPI();
      api.configure(awsconfig);
      const client = await api.getClient({ name: "openapi", path: "/api" });
      client.getPet(2);
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);
