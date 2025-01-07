import React, { useState } from "react";
import dappIcon from "./assets/dapp-icon.svg"
import { AddInstitution } from "./components/AddInstitution";
import { GetInstitution } from "./components/GetInstitution";
import { AddCourse } from "./components/AddCourse";
import { AddDiscipline } from "./components/AddDiscipline";
import { AddStudent } from "./components/AddStudent";
import { EnrollStudentInDiscipline } from "./components/EnrollStudentInDiscipline";

export function App() {
    const [activeSection, setActiveSection] = useState("");
    const [account, setAccount] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");

    const handleMenuClick = (section) => {
        setActiveSection(section);

        const contentArea = document.querySelector(".content-area");
        if (contentArea) {
            contentArea.scrollTop = 0;
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Metamask is not installed");
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Wallet connected!");
            setAccount(accounts[0]);
            setStatusMessage("Wallet connected!");
        } catch (error) {
            console.error("Error connecting wallet:", error);
            setStatusMessage("Failed to connect wallet.");
        }
    };

    const sections = {
        institution: (
            <section className="content-area">
                <AddInstitution setStatusMessage={setStatusMessage} />
                <GetInstitution setStatusMessage={setStatusMessage} />
            </section>
        ),
        course: (
            <section className="content-area">
                <AddCourse setStatusMessage={setStatusMessage} />
            </section>
        ),
        discipline: (
            <section className="content-area">
                <AddDiscipline setStatusMessage={setStatusMessage} />
            </section>
        ),
        student: (
            <section className="content-area">
                <AddStudent setStatusMessage={setStatusMessage} />
                <EnrollStudentInDiscipline setStatusMessage={setStatusMessage} />
            </section>
        ),
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo">
                    <img src={dappIcon} alt="DApp Icon" />
                    <h1>rec.dapp</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="#" onClick={() => handleMenuClick("institution")}>
                                Institution
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleMenuClick("course")}>
                                Course
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleMenuClick("discipline")}>
                                Discipline
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleMenuClick("student")}>
                                Student
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <header className="top-bar">
                    {statusMessage && <p className="message">{statusMessage}</p>}
                    <div className="button-container">
                        <button className="connect-wallet" onClick={connectWallet}>
                            {account ? `Connected: ${account}` : "Connect Wallet"}
                        </button>
                    </div>
                </header>
                {sections[activeSection]}
            </main>
        </div>
    );
}
