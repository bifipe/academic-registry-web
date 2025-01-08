import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function GetGrade({ setStatusMessage }) {
    const [queryStudentAddress, setQueryStudentAddress] = useState("");
    const [queriedStudentGrades, setQueriedStudentGrades] = useState(null);

    const getGrade = async () => {

        if (!queryStudentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const studentGrades = await contract.getGrades(queryStudentAddress);

            let grades = [];

            studentGrades.forEach(grade => {
                const queriedGrade = {
                    disciplineCode: grade.disciplineCode,
                    period: grade.period,
                    media: grade.media,
                    attendance: grade.attendance,
                    status: grade.status
                };
                grades.push(queriedGrade);
            });

            setQueriedStudentGrades(grades);
        } catch (error) {
            console.error("Error fetching grades:", error);
            setStatusMessage("Failed to fetch grades details.");
        }
    };

    return (
        <div>
            <h2>Get Grades</h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Student Address"
                    value={queryStudentAddress}
                    onChange={(e) => {
                        setQueryStudentAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={getGrade}>Get Grades</button>
            </form>
            {queriedStudentGrades && (
                <div>
                    <h3>Grades Details</h3>
                    <div>
                        {queriedStudentGrades.map((grade, index) => (
                            <div key={index}>
                                <p key={"disciplineCode" + index}>Discipline Code: {grade.disciplineCode}</p>
                                <p key={"period" + index}>Period: {grade.period.toString()}</p>
                                <p key={"media" + index}>Media: {grade.media.toString()}</p>
                                <p key={"attendance" + index}>Attendance: {grade.attendance.toString()}</p>
                                <p key={"status" + index}>Status: {grade.status.toString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
