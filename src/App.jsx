import React, { useState } from "react";
import dappIcon from "./assets/dapp-icon.svg"
import { AddInstitution } from "./components/AddInstitution";
import { GetInstitution } from "./components/GetInstitution";
import { AddCourse } from "./components/AddCourse";
import { AddDiscipline } from "./components/AddDiscipline";
import { AddStudent } from "./components/AddStudent";
import { EnrollStudentInDiscipline } from "./components/EnrollStudentInDiscipline";
import { AddGrade } from "./components/AddGrade";
import { GetGrade } from "./components/GetGrade";
import { AddAllowedAddress } from "./components/AddAllowedAddress";
import { AddStudentInformation } from "./components/AddStudentInformation";
import { Welcome } from "./components/Welcome";
import { AddGrades } from "./components/AddGrades";
import { connectToContract } from "./lib/ethers";

export function App() {
    const [activeSection, setActiveSection] = useState("welcome");
    const [account, setAccount] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [userType, setUserType] = useState(null);

    const handleMenuClick = (section) => {
        setActiveSection(section);

        setTimeout(() => {
            document.querySelector(".content-area")?.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
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

            const contract = await connectToContract();
            const userPermission = await contract.getPermission();

            setUserType(userPermission);
            
            setActiveSection("welcome");

        } catch (error) {
            console.error("Error connecting wallet:", error);
            setStatusMessage("Failed to connect wallet.");
        }
    };

    const menuOptions = {
        owner: {
            menu: ["institution"],
            components: {
                institution: [<AddInstitution key="add-institution" setStatusMessage={setStatusMessage} />],
            }
        },
        institution: {
            menu: ["institution", "course", "discipline", "student", "grade"],
            components: {
                institution: [<AddInstitution key="add-institution" setStatusMessage={setStatusMessage} />,
                <GetInstitution key="get-institution" setStatusMessage={setStatusMessage} />],
                course: [<AddCourse key="add-course" setStatusMessage={setStatusMessage} />],
                discipline: [<AddDiscipline key="add-discipline" setStatusMessage={setStatusMessage} />],
                student: [<AddStudent key="add-student" setStatusMessage={setStatusMessage} />,
                <EnrollStudentInDiscipline key="enroll-student" setStatusMessage={setStatusMessage} />],
                grade: [<AddGrade key="add-grade" setStatusMessage={setStatusMessage} />,
                <AddGrades key="add-grades" setStatusMessage={setStatusMessage} />,
                <GetGrade key="get-grade" setStatusMessage={setStatusMessage} />],
            }
        },
        student: {
            menu: ["student", "transcript", "permission"],
            components: {
                student: [<AddStudentInformation key="add-student-info" setStatusMessage={setStatusMessage} />],
                transcript: [<GetGrade key="get-grade" setStatusMessage={setStatusMessage} />],
                permission: [<AddAllowedAddress key="add-permission" setStatusMessage={setStatusMessage} />],
            }
        },
        viewer: {
            menu: ["transcript"],
            components: {
                transcript: [<GetGrade key="get-grade" setStatusMessage={setStatusMessage} />],
            }
        }
    };

    const sections = {
        welcome: <Welcome />,
        ...Object.keys(menuOptions[userType]?.components || {}).reduce((acc, section) => {
            acc[section] = <>{menuOptions[userType].components[section]}</>;
            return acc;
        }, {})
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
                        <li className={activeSection === "welcome" ? "active" : ""}>
                            <a href="#" onClick={() => handleMenuClick("welcome")}>Welcome</a>
                        </li>
                        {userType &&
                            menuOptions[userType].menu.map((key) => (
                                <li key={key} className={activeSection === key ? "active" : ""}>
                                    <a href="#" onClick={() => handleMenuClick(key)}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </a>
                                </li>
                            ))}
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

                <section className="content-area">{sections[activeSection]}</section>
            </main>
        </div>
    );
}
