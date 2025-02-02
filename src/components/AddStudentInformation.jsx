import React, { useState } from "react";
import { ethers } from "ethers";
import { connectToContract } from "../lib/ethers";
import { encryptSafely } from '@metamask/eth-sig-util';

export function AddStudentInformation({ setStatusMessage }) {
    const [name, setName] = useState("");
    const [document, setDocument] = useState("");

    const addStudentInformation = async () => {

        if (!name || !document) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            const personalInformation = {
                name: name,
                document: document
            };

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            const encryptionPublicKey = await window.ethereum.request({
                "method": "eth_getEncryptionPublicKey",
                "params": [
                    address
               ],
            });

            const buf = Buffer.from(
                JSON.stringify(
                    encryptSafely(
                        { publicKey: encryptionPublicKey, data: JSON.stringify(personalInformation), version: 'x25519-xsalsa20-poly1305' },
                    )
                ),
                'utf8'
            )
            const encryptedValue = '0x' + buf.toString('hex');

            const contract = await connectToContract();
            const tx = await contract.addStudentInformation(encryptedValue);

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student information added successfully!");

        } catch (error) {
            console.error("Error in AddStudentInformation:", error);
            setStatusMessage("Failed to add the student's information.");
        }
    };

    return (
        <div>
            <h2>Add Student Personal Information (only usable by the student's account) </h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <input
                    type="text"
                    placeholder="Document"
                    value={document}
                    onChange={(e) => {
                        setDocument(e.target.value);
                        setStatusMessage("");
                    }}
                />
                <button type="button" onClick={addStudentInformation}>Add Information</button>
            </form>
        </div>
    );
}
