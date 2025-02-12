import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function RetrieveStudentInfo({ setStatusMessage }) {
    const [studentAddress, setStudentAddress] = useState("");

    const retrieveStudentInfo = async () => {

        if (!studentAddress) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            const contract = await connectToContract();
            const studentInfo = await contract.getEncryptedInfoWithRecipientKey(address, studentAddress);

            const studentInformation = await window.ethereum.request({
                "method": "eth_decrypt",
                "params": [
                    studentInfo,
                    address
                ],
            });

            console.log(studentInformation);

            setStatusMessage("Student information access request added successfully!");

        } catch (error) {
            console.error("Error in RetrieveStudentInfo:", error);
            setStatusMessage("Failed to retrieve the student's information. Do you have access to it? If not, request access using the Request access to Student Information form!");
        }
    };

    return (
        <div>
            <h2>Retrieve Student Info</h2>
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
                <button type="button" onClick={retrieveStudentInfo}>Retrieve Student Info</button>
            </form>
        </div>
    );
}
