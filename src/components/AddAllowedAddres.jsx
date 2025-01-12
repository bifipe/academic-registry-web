import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function AddAllowedAddress({ setStatusMessage }) {
    const [allowedAddress, setAllowedAddress] = useState("");
    const [studentAddress, setStudentAddress] = useState("");

    const addAllowedAddress = async () => {
        if (!allowedAddress || !studentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const tx = await contract.addAllowedAddress(
                allowedAddress,
                studentAddress
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Allowed address added successfully!");

            setAllowedAddress("");
            setStudentAddress("");
        } catch (error) {
            console.error("Error adding allowed address:", error);
            setStatusMessage("Failed to add allowed address. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Add Allowed Address</h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Allowed Address"
                    value={allowedAddress}
                    onChange={(e) => {
                        setAllowedAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <input
                    type="text"
                    placeholder="Student Address"
                    value={studentAddress}
                    onChange={(e) => {
                        setStudentAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={addAllowedAddress}>Submit</button>
            </form>
        </div>
    );
}
