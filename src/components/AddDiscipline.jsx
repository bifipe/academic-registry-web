import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function AddDiscipline({ setStatusMessage }) {
    const [courseCode, setCourseCode] = useState("");
    const [disciplineCode, setDisciplineCode] = useState("");
    const [disciplineName, setDisciplineName] = useState("");
    const [ementa, setEmenta] = useState("");
    const [workload, setWorkload] = useState("");
    const [creditCount, setCreditCount] = useState("");

    const addDiscipline = async () => {
        if (!courseCode || !disciplineCode || !disciplineName || !ementa || !workload || !creditCount) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();
            const tx = await contract.addDisciplineToCourse(
                address,
                courseCode,
                disciplineCode,
                disciplineName,
                ementa,
                workload,
                creditCount
            );

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Discipline added successfully!");

            setCourseCode("");
            setDisciplineCode("");
            setDisciplineName("");
            setEmenta("");
            setWorkload("");
            setCreditCount("");
        } catch (error) {
            console.error("Error adding course:", error);
            setStatusMessage("Failed to add discipline. Check the console for more details.");
        }
    };

    return (
        <div>
            <h2>Add Discipline</h2>
            <form className="form">
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
                    placeholder="Discipline Name"
                    value={disciplineName}
                    onChange={(e) => setDisciplineName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Ementa"
                    value={ementa}
                    onChange={(e) => setEmenta(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Workload"
                    value={workload}
                    onChange={(e) => setWorkload(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Credit Count"
                    value={creditCount}
                    onChange={(e) => setCreditCount(e.target.value)}
                />
                <button type="button" onClick={addDiscipline}>Submit</button>
            </form>
        </div>
    );
}
