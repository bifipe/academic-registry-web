import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function AddStudent({ setStatusMessage }) {
    const [studentAddress, setStudentAddress] = useState("");

    const addStudent = async () => {
        if (!studentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();
            const tx = await contract.addStudent(
                address,
                studentAddress
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student added successfully!");

            setStudentAddress("");
        } catch (error) {
            console.error("Error adding student:", error);
            setStatusMessage("Failed to add student. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Add Student</h2>
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
                <button type="button" onClick={addStudent}>Submit</button>
            </form>
        </div>
    );
}
