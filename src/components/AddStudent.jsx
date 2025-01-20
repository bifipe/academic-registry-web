import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function AddStudent({ setStatusMessage }) {
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [studentAddress, setStudentAddress] = useState("");

    const addStudent = async () => {
        if (!institutionAddress || !studentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const tx = await contract.addStudent(
                institutionAddress,
                studentAddress
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student added successfully!");

            setInstitutionAddress("");
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
                    placeholder="Institution Address"
                    value={institutionAddress}
                    onChange={(e) => {
                        setInstitutionAddress(e.target.value);
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
                <button type="button" onClick={addStudent}>Submit</button>
            </form>
        </div>
    );
}
