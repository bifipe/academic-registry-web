import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function RequestAccess({ setStatusMessage }) {
    const [studentAddress, setStudentAddress] = useState("");

    const requestAccess = async () => {

        if (!studentAddress) {
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
            const tx = await contract.requestAccess(studentAddress, encryptionPublicKey);

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student information access request added successfully!");

        } catch (error) {
            console.error("Error in RequestAccess:", error);
            setStatusMessage("Failed to request the student's information.");
        }
    };

    return (
        <div>
            <h2>Request access to Student Information </h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Student Address"
                    value={studentAddress}
                    onChange={(e) => {
                        setStudentAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={requestAccess}>Request Access</button>
            </form>
        </div>
    );
}
