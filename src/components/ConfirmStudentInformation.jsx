import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";

export function ConfirmStudentInfo({ setStatusMessage }) {
    const [studentAddress, setStudentAddress] = useState("");

    const confirmStudentInfo = async () => {

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

            // Decrypt the info using the institution's account.
            const studentInformation = await window.ethereum.request({
                "method": "eth_decrypt",
                "params": [
                    student.institutionEncryptedInformation,
                    address
                ],
            });

            console.log(studentInformation);

            // Encrypt the info using the student's public key.
            const buf = Buffer.from(
                JSON.stringify(
                    encrypt(
                        { publicKey: student.publicKey, data: JSON.stringify(studentInformation), version: 'x25519-xsalsa20-poly1305' },
                    )
                ),
                'utf8'
            );

            const encryptedValue = '0x' + buf.toString('hex');

            const tx = await contract.confirmStudentInformation(studentAddress, address, encryptedValue);

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student information access request added successfully!");

        } catch (error) {
            console.error("Error in AddStudentInformation:", error);
            setStatusMessage("Failed to add the student's information.");
        }
    };

    return (
        <div>
            <h2>Confirm Student Info</h2>
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
                <button type="button" onClick={confirmStudentInfo}>Confirm Student Info</button>
            </form>
        </div>
    );
}
