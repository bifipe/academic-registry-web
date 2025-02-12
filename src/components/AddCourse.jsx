import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function AddCourse({ setStatusMessage }) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [courseType, setCourseType] = useState("");
    const [numberOfSemesters, setNumberOfSemesters] = useState("");

    const addCourse = async () => {
        if (!code || !name || !courseType || !numberOfSemesters) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();
            const tx = await contract.addCourse(
                address,
                code,
                name,
                courseType,
                numberOfSemesters
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Course added successfully!");

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
