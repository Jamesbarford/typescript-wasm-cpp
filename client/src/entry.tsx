import * as React from "react";
import { render } from "react-dom";

import { WebAssemblySingleton } from "./WebAssemblySingleton";
import "./style.scss";
import { Button } from "./App/Button";

class App extends React.Component {
    public render(): JSX.Element {
        return <Button />;
    }
}

const root = document.getElementById("root");

if (!root) throw new Error("no valid root for application");

WebAssemblySingleton.create().then(() => {
    render(<App />, root);
});
