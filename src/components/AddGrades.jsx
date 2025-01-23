import React, { useState, useRef } from "react";
import { connectToContract } from "../lib/ethers";

export function AddGrades({ setStatusMessage }) {
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [studentAddress, setStudentAddress] = useState("");
    const [gradesFile, setGradesFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setGradesFile(file);
        setStatusMessage("");
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const addGrades = async () => {
        if (!institutionAddress || !studentAddress || !gradesFile) {
            setStatusMessage("Please fill in all fields and upload a JSON file.");
            return;
        }

        try {
            // Read and parse the JSON file
            const fileContent = await gradesFile.text();
            const gradesData = JSON.parse(fileContent);

            // Validate gradesData
            if (!Array.isArray(gradesData)) {
                setStatusMessage("Invalid file format. Expected an array of grades.");
                return;
            }

            // Connect to the contract and call addGrades
            const contract = await connectToContract();
            const tx = await contract.addGrades(
                institutionAddress,
                studentAddress,
                gradesData
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Grades added successfully!");

            setInstitutionAddress("");
            setStudentAddress("");
            setGradesFile(null);
        } catch (error) {
            console.error("Error adding grades:", error);
            setStatusMessage("Failed to add grades. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Add Grades</h2>
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
                <button
                    type="button"
                    onClick={handleButtonClick}
                >
                    {gradesFile ? "File Selected: " + gradesFile.name : "Choose File"}
                </button>
                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                />
                <button type="button" onClick={addGrades}>Submit</button>
            </form>
        </div>
    );
}
