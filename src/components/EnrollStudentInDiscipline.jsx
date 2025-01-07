import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function EnrollStudentInDiscipline({ setStatusMessage }) {
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [studentAddress, setStudentAddress] = useState("");
    const [disciplineCode, setDisciplineCode] = useState("");
    const [courseCode, setCourseCode] = useState("");

    const enrollStudentInDiscipline = async () => {
        if (!institutionAddress || !studentAddress || !disciplineCode || !courseCode) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const tx = await contract.enrollStudentInDiscipline(
                institutionAddress,
                studentAddress,
                disciplineCode,
                courseCode
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student enrolled in discipline successfully!");

            setInstitutionAddress("");
            setStudentAddress("");
            setDisciplineCode("");
            setCourseCode("");
        } catch (error) {
            console.error("Error enrolling student in discipline:", error);
            setStatusMessage("Failed to enroll student in discipline. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Enroll Student in Discipline</h2>
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
                    placeholder="Course Code"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                />
                <button type="button" onClick={enrollStudentInDiscipline}>Submit</button>
            </form>
        </div>
    );
}
