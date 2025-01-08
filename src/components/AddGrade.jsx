import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function AddGrade({ setStatusMessage }) {
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [studentAddress, setStudentAddress] = useState("");
    const [disciplineCode, setDisciplineCode] = useState("");
    const [period, setPeriod] = useState("");
    const [media, setMedia] = useState("");
    const [attendance, setAttendance] = useState("");
    const [status, setStatus] = useState("");

    const addGrade = async () => {
        if (!institutionAddress || !studentAddress || !disciplineCode || !period || !media || !attendance || !status) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const tx = await contract.addGrade(
                institutionAddress,
                studentAddress,
                disciplineCode,
                period,
                media,
                attendance,
                JSON.parse(status)
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Grade added successfully!");

            setInstitutionAddress("");
            setStudentAddress("");
            setDisciplineCode("");
            setPeriod("");
            setMedia("");
            setAttendance("");
            setStatus("");
        } catch (error) {
            console.error("Error adding grade:", error);
            setStatusMessage("Failed to add grade. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Add Grade</h2>
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
                <input
                    type="text"
                    placeholder="Discipline Code"
                    value={disciplineCode}
                    onChange={(e) => setDisciplineCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Media"
                    value={media}
                    onChange={(e) => setMedia(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Attendance"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
                <button type="button" onClick={addGrade}>Submit</button>
            </form>
        </div>
    );
}
