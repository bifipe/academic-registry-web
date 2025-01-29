import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function GetGrade({ setStatusMessage }) {
    const [queryStudentAddress, setQueryStudentAddress] = useState("");
    const [queriedStudentGrades, setQueriedStudentGrades] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);

    const getGrade = async () => {
        if (!queryStudentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            setStatusMessage("");
            
            const contract = await connectToContract();
            const studentEncryptedInformation = await contract.retrieveStudentInformation(queryStudentAddress);
            const studentGrades = await contract.getGrades(queryStudentAddress);

            console.log(studentEncryptedInformation);

            if (!studentEncryptedInformation || studentGrades.length === 0) {
                setStudentInfo(null);
                setQueriedStudentGrades(null);
                setStatusMessage("No grades found for this student.");
                return;
            }

            const studentInformation = await window.ethereum.request({
                "method": "eth_decrypt",
                "params": [
                    studentEncryptedInformation,
                    queryStudentAddress
                ],
            });
            setStudentInfo(JSON.parse(studentInformation));

            console.log(studentInformation);

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
            setStudentInfo(null);
            setQueriedStudentGrades(null);
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
            {studentInfo?.name && queriedStudentGrades && (
                <div>
                    <h3>Grades Details</h3>
                    <p>
                        {studentInfo.name} - {studentInfo.document}
                    </p>
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
