import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function AddInstitution({ setStatusMessage }) {
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [institutionName, setInstitutionName] = useState("");
    const [institutionDocument, setInstitutionDocument] = useState("");

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

    return (
        <div>
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
        </div>
    );
}
