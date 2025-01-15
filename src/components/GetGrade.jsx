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

            const grades = studentGrades.map((grade) => ({
                disciplineCode: grade.disciplineCode,
                period: grade.period,
                media: grade.media,
                attendance: grade.attendance,
                status: grade.status,
            }));

            setQueriedStudentGrades(grades);
        } catch (error) {
            console.error("Error fetching grades:", error);
            setStatusMessage("Failed to fetch grades details.");
        }
    };

    const groupGradesByPeriod = (grades) => {
        return grades.reduce((groups, grade) => {
            if (!groups[grade.period]) {
                groups[grade.period] = [];
            }
            groups[grade.period].push(grade);
            return groups;
        }, {});
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
                <button type="button" onClick={getGrade}>
                    Get Grades
                </button>
            </form>
            {queriedStudentGrades && (
                <div>
                    <h3>Grades Details</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Discipline Code</th>
                                <th className="media">Media</th>
                                <th className="attendance">Attendance</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupGradesByPeriod(queriedStudentGrades)).map(
                                ([period, grades]) => (
                                    <React.Fragment key={period}>
                                        <tr className="subheader">
                                            <td colSpan={4}>Period {period}</td>
                                        </tr>
                                        {grades.map((grade) => (
                                            <tr key={grade.disciplineCode}>
                                                <td>{grade.disciplineCode}</td>
                                                <td className="media">{grade.media.toString()}</td>
                                                <td className="attendance">{grade.attendance.toString()}</td>
                                                <td>{grade.status.toString()}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
