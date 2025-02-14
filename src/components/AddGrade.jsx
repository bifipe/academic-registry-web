import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function AddGrade({ setStatusMessage }) {
    const [studentAddress, setStudentAddress] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [disciplineCode, setDisciplineCode] = useState("");
    const [semester, setSemester] = useState("");
    const [year, setYear] = useState("");
    const [grade, setGrade] = useState("");
    const [attendance, setAttendance] = useState("");
    const [status, setStatus] = useState("");

    const addGrade = async () => {
        if (!studentAddress || !courseCode || !disciplineCode || !semester || !year || !grade || !attendance || !status) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();
            const tx = await contract.addGrade(
                address,
                studentAddress,
                courseCode,
                disciplineCode,
                semester,
                year,
                grade,
                attendance,
                JSON.parse(status)
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Grade added successfully!");

            setStudentAddress("");
            setCourseCode("");
            setDisciplineCode("");
            setSemester("");
            setYear("");
            setGrade("");
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
                    placeholder="Student Address"
                    value={studentAddress}
                    onChange={(e) => {
                        setStudentAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <input
                    type="text"
                    placeholder="Course Code"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Discipline Code"
                    value={disciplineCode}
                    onChange={(e) => setDisciplineCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
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
