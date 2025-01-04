import React, { useState } from "react";
import { connectToContract } from "../lib/ethers";

export function AddCourse({ setStatusMessage }) {
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [courseType, setCourseType] = useState("");
    const [numberOfSemesters, setNumberOfSemesters] = useState("");

    const addCourse = async () => {
        if (!institutionAddress || !code || !name || !courseType || !numberOfSemesters) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const contract = await connectToContract();
            const tx = await contract.addCourse(
                institutionAddress,
                code,
                name,
                courseType,
                numberOfSemesters
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Course added successfully!");

            setInstitutionAddress("");
            setCode("");
            setName("");
            setCourseType("");
            setNumberOfSemesters("");
        } catch (error) {
            console.error("Error adding course:", error);
            setStatusMessage("Failed to add course. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Add Course</h2>
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
                    placeholder="Course Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Course Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Course Type"
                    value={courseType}
                    onChange={(e) => setCourseType(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Number of Semesters"
                    value={numberOfSemesters}
                    onChange={(e) => setNumberOfSemesters(e.target.value)}
                />
                <button type="button" onClick={addCourse}>Submit</button>
            </form>
        </div>
    );
}
