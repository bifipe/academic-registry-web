import React, { useState } from "react";
import { connectToContract } from "./lib/ethers";
import dappIcon from "./assets/dapp-icon.svg"

export function App() {
    const [isInstitutionVisible, setInstitutionVisible] = useState(false);
    const [account, setAccount] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [institutionName, setInstitutionName] = useState("");
    const [institutionDocument, setInstitutionDocument] = useState("");
    const [queryInstitutionAddress, setQueryInstitutionAddress] = useState('');
    const [queriedInstitution, setQueriedInstitution] = useState(null);

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

    const addInstitution = async () => {
        if (!institutionAddress || !institutionName || !institutionDocument) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const tx = await contract.addInstitution(
                institutionAddress,
                institutionName,
                institutionDocument
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Institution added successfully!");

            setInstitutionAddress("");
            setInstitutionName("");
            setInstitutionDocument("");
        } catch (error) {
            console.error("Error adding institution:", error);
            setStatusMessage("Failed to add institution. Check the console for more details.");
        }
    };

    const getInstitution = async () => {
        setQueriedInstitution({
            name: "",
            document: "",
        });

        if (!queryInstitutionAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const institution = await contract.getInstitution(
                queryInstitutionAddress
            );

            setQueriedInstitution({
                name: institution.name,
                document: institution.document,
            });
        } catch (error) {
            console.error("Error fetching institution:", error);
            setStatusMessage("Failed to fetch institution details.");
        }
    };

    const handleMenuClick = (section) => {
        if (section === "institution") {
            setInstitutionVisible(true);
        } else {
            setInstitutionVisible(false);
        }
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
                {isInstitutionVisible && (
                    <section className="content-area">
                        <h2>Add Institution</h2>
                        <form className="form">
                            <input
                                type="text"
                                placeholder="Institution Address"
                                value={institutionAddress}
                                onChange={(e) => {
                                    setInstitutionAddress(e.target.value);
                                    setStatusMessage("");
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Institution Name"
                                value={institutionName}
                                onChange={(e) => setInstitutionName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Institution Document"
                                value={institutionDocument}
                                onChange={(e) => setInstitutionDocument(e.target.value)}
                            />
                            <button type="button" onClick={addInstitution}>Submit</button>
                        </form>
                        <h2>Get Institution</h2>
                        <form className="form">
                            <input
                                type="text"
                                placeholder="Institution Address"
                                value={queryInstitutionAddress}
                                onChange={(e) => {
                                    setQueryInstitutionAddress(e.target.value);
                                    setStatusMessage("");
                                }}
                            />
                            <button type="button" onClick={getInstitution}>Get Institution</button>
                        </form>
                        {queriedInstitution && (
                            <div>
                                <h3>Institution Details</h3>
                                <p>Name: {queriedInstitution.name}</p>
                                <p>Document: {queriedInstitution.document}</p>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
