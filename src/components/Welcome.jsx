import React from "react";

export function Welcome({ handleUserSelection }) {
    return (
        <div className="welcome-container">
            <h2>rec.dapp</h2>
            <p>Platform for academic records on the blockchain.</p>
            <p>How would you like to access?</p>
            <div className="button-group">
                <button className="user-selection-button" onClick={() => handleUserSelection("institution")}>Institution</button>
                <button className="user-selection-button" onClick={() => handleUserSelection("student")}>Student</button>
                <button className="user-selection-button" onClick={() => handleUserSelection("viewer")}>Viewer</button>
            </div>
        </div>
    );
}
