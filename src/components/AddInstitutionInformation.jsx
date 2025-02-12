import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function AddInstitutionInformation({ setStatusMessage }) {
    const [publicKey, setPublicKey] = useState("");

    const addInstitutionInformation = async () => {

        if (!publicKey) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            const encryptionPublicKey = await window.ethereum.request({
                "method": "eth_getEncryptionPublicKey",
                "params": [
                    address
               ],
            });

            const contract = await connectToContract();
            const tx = await contract.addInstitutionPublicKey(address, encryptionPublicKey);

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
                    placeholder="Public Key"
                    value={publicKey}
                    onChange={(e) => {
                        setPublicKey(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={addInstitutionInformation}>Add Information</button>
            </form>
        </div>
    );
}
