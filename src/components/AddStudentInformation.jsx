import React, { useState } from "react";
import { encryptMessage } from "../service/EncryptionService";
import { ethers } from "ethers";
import { recoverPublicKey } from "@ethersproject/signing-key";
import { connectToContract } from "../lib/ethers";

export function AddStudentInformation({ setStatusMessage }) {
    const [name, setName] = useState("");
    const [document, setDocument] = useState("");

    const addStudentInformation = async () => {

        if (!name || !document) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const personalInformation = {
                name: name,
                document: document
            };

            const message = "Do you allow the system to store your personal information?\n(It will be encrypted with your public key)";

            const messageHash = ethers.hashMessage(message);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(message);
            
            const publicKey = recoverPublicKey(messageHash, signature);

            const encryptedData = await encryptMessage(publicKey.slice(2), JSON.stringify(personalInformation));

            console.log(JSON.stringify(encryptedData));

            const contract = await connectToContract();
            const tx = await contract.addStudentInformation(publicKey, JSON.stringify(encryptedData));

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student information added successfully!");

        } catch (error) {
            console.error("Error in AddStudentInformation:", error);
            setStatusMessage("Failed to add the student's information.");
        }
    };

    return (
        <div>
            <h2>Add Student Personal Information (only usable by the student's account) </h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <input
                    type="text"
                    placeholder="Document"
                    value={document}
                    onChange={(e) => {
                        setDocument(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={addStudentInformation}>Add Information</button>
            </form>
        </div>
    );
}
