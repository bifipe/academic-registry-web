import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";
import crypto from 'node:crypto';

export function GetGrade({ setStatusMessage }) {
    const [queryStudentAddress, setQueryStudentAddress] = useState("");
    const [queriedStudentGrades, setQueriedStudentGrades] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [institutionInfo, setInstitutionInfo] = useState(null);

    const getGrade = async () => {
        if (!queryStudentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            setStatusMessage("");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();

            const student = await contract.getStudent(queryStudentAddress);

            const userPermission = await contract.getPermission();

            var studentEncryptedInformation = null;

            switch(userPermission) {
                case "student":
                    studentEncryptedInformation = student.selfEncryptedInformation;
                    break;
                case "institution":
                    studentEncryptedInformation = student.institutionEncryptedInformation;
                    break;
                case "viewer":
                    studentEncryptedInformation = await contract.getEncryptedInfoWithRecipientKey(address, queryStudentAddress);
                    break;
                default:
                    setStatusMessage("User does not have a valid permission on the contract!");
                    return;
            }

            const studentHash = student.publicHash;
            const [studentGrades, disciplineDetails] = await contract.getStudentTranscript(queryStudentAddress);
            const studentInstitutionData = await contract.getStudentInstitutionData(queryStudentAddress);


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
                    address
                ],
            });

            const parsedStudentInfo = JSON.parse(studentInformation);
            parsedStudentInfo.hash = studentHash;

            const calculatedHash = crypto.createHash('sha256').update(parsedStudentInfo.name + " - " + parsedStudentInfo.document + " - " + parsedStudentInfo.salt).digest('hex');
            parsedStudentInfo.calculatedHash = calculatedHash;

            setStudentInfo(parsedStudentInfo);

            const gradesWithDetails = studentGrades.map((grade, index) => ({
                disciplineCode: grade.disciplineCode,
                disciplineName: disciplineDetails[index].name,
                workload: disciplineDetails[index].workload,
                creditCount: disciplineDetails[index].creditCount,
                semester: grade.semester,
                year: grade.year,
                grade: grade.grade,
                attendance: grade.attendance,
                status: grade.status,
            }));
            setQueriedStudentGrades(gradesWithDetails);

            if (studentInstitutionData) {
                setInstitutionInfo({
                    institutionName: studentInstitutionData[0].name,
                    courseCode: studentInstitutionData[1].code,
                    courseName: studentInstitutionData[1].name,
                });
            }

        } catch (error) {
            console.error("Error fetching grades:", error);
            setStatusMessage("Failed to fetch grades details.");
            setStudentInfo(null);
            setQueriedStudentGrades(null);
            setInstitutionInfo(null);
        }
    };

    const groupGradesBySemester = (grades) => {
        return grades.reduce((groups, grade) => {
            if (!groups[grade.semester]) {
                groups[grade.semester] = [];
            }
            groups[grade.semester].push(grade);
            return groups;
        }, {});
    };

    return (
        <div>
            <h2>Get Transcript</h2>
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
            {studentInfo?.name && queriedStudentGrades && institutionInfo && (
                <div>
                    <h3>Grades Details</h3>
                    <table>
                        <thead className="institution-info">
                            <tr>
                                <td colSpan={7}>
                                    <strong>{institutionInfo.institutionName}</strong>
                                    <br />
                                    {institutionInfo.courseCode} - {institutionInfo.courseName}
                                </td>
                            </tr>
                        </thead>
                        <thead className="student-info">
                            <tr>
                                <td colSpan={7}>
                                    <strong>Student Name: {studentInfo.name}</strong>
                                    <br />
                                    Student Document: {studentInfo.document}
                                    <br />
                                    Student Hash (from Blockchain): {studentInfo.hash}
                                    <br />
                                    Student Hash (calculated): {studentInfo.calculatedHash}
                                </td>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th>Discipline Code</th>
                                <th>Discipline Name</th>
                                <th className="workload">Workload</th>
                                <th className="creditCount">Credits</th>
                                <th className="grade">Grade</th>
                                <th className="attendance">Attendance</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupGradesBySemester(queriedStudentGrades)).map(
                                ([semester, grades]) => (
                                    <React.Fragment key={semester}>
                                        <tr className="subheader">
                                            <td colSpan={7}>Semester {semester}</td>
                                        </tr>
                                        {grades.map((grade) => (
                                            <tr key={grade.disciplineCode}>
                                                <td>{grade.disciplineCode}</td>
                                                <td>{grade.disciplineName}</td>
                                                <td className="workload">{grade.workload.toString()}</td>
                                                <td className="creditCount">{grade.creditCount.toString()}</td>
                                                <td className="grade">{grade.grade.toString()}</td>
                                                <td className="attendance">{grade.attendance.toString()}</td>
                                                <td>{grade.status.toString() == 'true' ? 'Approved' : 'Failed'}</td>
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
