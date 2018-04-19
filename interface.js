"use strict";

import React from "react";
import ReactDOM from "react-dom";

class App extends React.Compenent
{
    render()
    {
        return (
            <div className="App">
                <p>
                    hey
                </p>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
console.log("hey");