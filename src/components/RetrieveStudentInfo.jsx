import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function RetrieveStudentInfo({ setStatusMessage }) {
    const [studentAddress, setStudentAddress] = useState("");

    const retrieveStudentInfo = async () => {

        if (!studentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();
            const tx = await contract.getEncryptedInfoWithRecipientKey(address, studentAddress);

            const studentInformation = await window.ethereum.request({
                "method": "eth_decrypt",
                "params": [
                    tx,
                    address
                ],
            });

            console.log(studentInformation);

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student information access request added successfully!");

        } catch (error) {
            console.error("Error in AddStudentInformation:", error);
            setStatusMessage("Failed to add the student's information.");
        }
    };

    return (
        <div>
            <h2>Retrieve Student Info</h2>
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
                <button type="button" onClick={retrieveStudentInfo}>Retrieve Student Info</button>
            </form>
        </div>
    );
}
