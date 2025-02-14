import React, { useState } from "react";
import { ethers, hashMessage, uuidV4 } from "ethers";
import { connectToContract } from "../lib/ethers";
import { encrypt } from '@metamask/eth-sig-util';
import crypto from 'node:crypto';

export function AddStudentInformation({ setStatusMessage }) {
    const [institutionAddress, setInstitutionAddress] = useState("");
    const [name, setName] = useState("");
    const [document, setDocument] = useState("");

    const addStudentInformation = async () => {

        if (!institutionAddress || !name || !document) {
            setStatusMessage("Please fill in all fields.");
            return;
        }

        try {

            var salt = crypto.randomBytes(16).toString('hex');

            const personalInformation = {
                name: name,
                document: document,
                salt: salt
            };

            const hash = crypto.createHash('sha256').update(name + " - " + document + " - " + salt).digest('hex');

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            
            const encryptionPublicKey = await window.ethereum.request({
                "method": "eth_getEncryptionPublicKey",
                "params": [
                    address
               ],
            });

            const contract = await connectToContract();
            const institution = await contract.getInstitution(institutionAddress);

            // Encrypt the info using the institution's public key.
            const buf = Buffer.from(
                JSON.stringify(
                    encrypt(
                        { publicKey: institution.publicKey, data: JSON.stringify(personalInformation), version: 'x25519-xsalsa20-poly1305' },
                    )
                ),
                'utf8'
            );

            const encryptedValue = '0x' + buf.toString('hex');
            
            const tx = await contract.addStudentInformation(encryptedValue, encryptionPublicKey, hash);

            setStatusMessage("Transaction submitted, waiting for confirmation...");
            await tx.wait(); // Espera a transação ser confirmada
            setStatusMessage("Student information added successfully!");

            setInstitutionAddress("");
            setName("");
            setDocument("");

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
                    placeholder="Institution Address"
                    value={institutionAddress}
                    onChange={(e) => {
                        setInstitutionAddress(e.target.value);
                        setStatusMessage("");
                    }}
                />
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
