import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function GetStudent({ setStatusMessage }) {
    const [studentAddress, setStudentAddress] = useState("");

    const getStudent = async () => {

        if (!studentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();

            const student = await contract.getStudent(studentAddress);

            var studentInformation = null;

            if (studentAddress == address) {

                // Decrypt the info using the student's account.
                studentInformation = await window.ethereum.request({
                    "method": "eth_decrypt",
                    "params": [
                        student.selfEncryptedInformation,
                        address
                    ],
                });

            } else {

                // Decrypt the info using the institution's account.
                studentInformation = await window.ethereum.request({
                    "method": "eth_decrypt",
                    "params": [
                        student.institutionEncryptedInformation,
                        address
                    ],
                });

            }
            console.log(student.publicHash);
            console.log(studentInformation);

            setStatusMessage("Student information retrieved successfully!");

            setStudentAddress("");

        } catch (error) {
            console.error("Error in GetStudent:", error);
            setStatusMessage("Failed to get the student's data.");
        }
    };

    return (
        <div>
            <h2>Get Student Data</h2>
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
                <button type="button" onClick={getStudent}>Get Student Data</button>
            </form>
        </div>
    );
}
