import * as React from "react";
import { WebAssemblySingleton } from "../WebAssemblySingleton";

export class Button extends React.Component {
    public render(): JSX.Element {
        return (
            <button onClick={this.sayHey} className="ex">
                click me
            </button>
        );
    }

    private sayHey = (): void => {
        console.log(WebAssemblySingleton.extern.say_hey());
    };
}
